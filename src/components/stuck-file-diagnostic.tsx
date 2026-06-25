'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ScanLine,
  FileWarning,
  Stethoscope,
  UserCog,
  Repeat,
  ClipboardList,
  ShieldAlert,
  FlaskConical,
  Loader2,
  Printer,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

// ---------- The 8-category taxonomy (Lumeval IP) ----------
const CATEGORIES = [
  {
    id: 'imaging-ambiguity',
    label: 'Imaging / report ambiguity',
    icon: ScanLine,
    color: 'text-amber-600',
    verdictApplicable: true,
    avoidableDays: [40, 70],
    description: 'Imaging completed but report is ambiguous on whether findings explain restrictions. No RTW decision made.',
  },
  {
    id: 'diagnostic-ambiguity',
    label: 'Diagnostic ambiguity',
    icon: FileWarning,
    color: 'text-orange-600',
    verdictApplicable: true,
    avoidableDays: [30, 55],
    description: 'Clinical picture unclear — conflicting signs, unclear mechanism, differential unresolved.',
  },
  {
    id: 'wrong-pathway',
    label: 'Wrong / incomplete pathway',
    icon: Repeat,
    color: 'text-rose-600',
    verdictApplicable: false,
    avoidableDays: [25, 45],
    description: 'Case routed through wrong clinical pathway; specialist of wrong type consulted.',
  },
  {
    id: 'specialist-delay',
    label: 'Specialist / escalation delay',
    icon: Stethoscope,
    color: 'text-purple-600',
    verdictApplicable: false,
    avoidableDays: [45, 90],
    description: 'Waiting for specialist consult that is months out in the public queue.',
  },
  {
    id: 'rehab-function',
    label: 'Rehab / function issue',
    icon: UserCog,
    color: 'text-sky-600',
    verdictApplicable: false,
    avoidableDays: [20, 40],
    description: 'Rehab stalled, function not progressing, no functional assessment completed.',
  },
  {
    id: 'admin-handoff',
    label: 'Administrative handoff failure',
    icon: ClipboardList,
    color: 'text-slate-600',
    verdictApplicable: false,
    avoidableDays: [15, 30],
    description: 'Report completed but no RTW decision; lost between case manager, OH, supervisor.',
  },
  {
    id: 'exposure-protocol',
    label: 'Exposure protocol issue',
    icon: ShieldAlert,
    color: 'text-red-700',
    verdictApplicable: false,
    avoidableDays: [20, 35],
    description: 'Exposure incident protocol incomplete; causation window still open administratively.',
  },
  {
    id: 'not-imaging',
    label: 'Not imaging-related',
    icon: FlaskConical,
    color: 'text-muted-foreground',
    verdictApplicable: false,
    avoidableDays: [10, 25],
    description: 'Stuckness driver is non-imaging (psychosocial, systemic, legal-administrative).',
  },
] as const

type CategoryId = (typeof CATEGORIES)[number]['id']

interface CaseRow {
  id: string
  caseRef: string
  bodyPart: string
  caseAge: number
  bottleneck: CategoryId
}

const BODY_PARTS = ['Lumbar spine', 'Cervical spine', 'Shoulder', 'Knee', 'Hip', 'Wrist/hand', 'Ankle/foot', 'Other']

export function StuckFileDiagnostic() {
  const [step, setStep] = React.useState<'intro' | 'cases' | 'result'>('intro')
  const [clientHandle, setClientHandle] = React.useState('')
  const [contactEmail, setContactEmail] = React.useState('')
  const [cases, setCases] = React.useState<CaseRow[]>([
    { id: 'c1', caseRef: 'A-0412', bodyPart: 'Lumbar spine', caseAge: 212, bottleneck: 'imaging-ambiguity' },
  ])
  const [submitting, setSubmitting] = React.useState(false)
  const [result, setResult] = React.useState<null | {
    profile: Record<string, number>
    avoidableLow: number
    avoidableHigh: number
    verdictEligible: number
    exposureLow: number
    exposureHigh: number
    assessmentId: string
  }>(null)

  const addCase = () => {
    setCases((prev) => [
      ...prev,
      {
        id: `c${prev.length + 1}-${Date.now()}`,
        caseRef: '',
        bodyPart: 'Lumbar spine',
        caseAge: 120,
        bottleneck: 'imaging-ambiguity',
      },
    ])
  }

  const removeCase = (id: string) => setCases((prev) => prev.filter((c) => c.id !== id))
  const updateCase = (id: string, patch: Partial<CaseRow>) =>
    setCases((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)))

  const computeProfile = () => {
    const profile: Record<string, number> = {}
    for (const c of CATEGORIES) profile[c.id] = 0
    for (const cs of cases) profile[cs.bottleneck] = (profile[cs.bottleneck] || 0) + 1

    let avoidableLow = 0
    let avoidableHigh = 0
    let verdictEligible = 0
    for (const cs of cases) {
      const cat = CATEGORIES.find((c) => c.id === cs.bottleneck)!
      avoidableLow += cat.avoidableDays[0]
      avoidableHigh += cat.avoidableDays[1]
      if (cat.verdictApplicable) verdictEligible += 1
    }
    // $800/day blended modified-duty + replacement-labour (illustrative, conservative)
    const exposureLow = avoidableLow * 650
    const exposureHigh = avoidableHigh * 1100
    return { profile, avoidableLow, avoidableHigh, verdictEligible, exposureLow, exposureHigh }
  }

  const submit = async () => {
    if (!clientHandle.trim()) {
      toast.error('Enter a de-identified client/site handle to continue.')
      return
    }
    if (cases.length === 0) {
      toast.error('Add at least one case.')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/diagnostic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientHandle,
          reviewerEmail: contactEmail,
          cases: cases.map((c) => ({
            caseRef: c.caseRef || 'unspecified',
            bodyPart: c.bodyPart,
            caseAgeDays: c.caseAge,
            bottleneck: c.bottleneck,
          })),
        }),
      })
      if (!res.ok) throw new Error('Submission failed')
      const data = await res.json()
      const computed = computeProfile()
      setResult({ ...computed, assessmentId: data.assessmentId })
      setStep('result')
      toast.success('Stuckness profile generated.')
    } catch (e) {
      toast.error('Could not submit. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const reset = () => {
    setStep('intro')
    setResult(null)
    setCases([
      { id: 'c1', caseRef: 'A-0412', bodyPart: 'Lumbar spine', caseAge: 212, bottleneck: 'imaging-ambiguity' },
    ])
    setClientHandle('')
    setContactEmail('')
  }

  // ---------- INTRO ----------
  if (step === 'intro') {
    return (
      <Card className="overflow-hidden">
        <CardHeader>
          <Badge variant="secondary" className="w-fit">The Stuck-File Diagnostic</Badge>
          <CardTitle className="mt-2 text-2xl sm:text-3xl">
            8 categories of stuckness. One printable profile.
          </CardTitle>
          <CardDescription className="text-base">
            Every long-aging MSK file has the same shape — a bottleneck nobody in the chain is
            licensed to call. The Diagnostic classifies each open file into one of eight categories,
            estimates avoidable days and operational exposure, and tells you which files a
            physician-signed verdict can actually move.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {CATEGORIES.map((c) => (
              <div key={c.id} className="flex items-start gap-3 rounded-lg border border-border/60 p-3">
                <c.icon className={`mt-0.5 h-5 w-5 shrink-0 ${c.color}`} />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{c.label}</p>
                    {c.verdictApplicable && (
                      <Badge variant="outline" className="text-[10px] py-0">Verdict-eligible</Badge>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{c.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            De-identified intake. No worker names, SINs, or health card numbers. Works on litigated
            files (aggregate visibility only).
          </p>
          <Button size="lg" onClick={() => setStep('cases')} className="w-full sm:w-auto">
            Begin diagnostic <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    )
  }

  // ---------- CASES ----------
  if (step === 'cases') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Enter your open MSK cases</CardTitle>
          <CardDescription>
            De-identified. Use case references only — no worker identifiers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="clientHandle">Client / site handle</Label>
              <Input
                id="clientHandle"
                placeholder="e.g. Site A — open-pit coal"
                value={clientHandle}
                onChange={(e) => setClientHandle(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contactEmail">Reviewer email (optional)</Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="you@operation.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">Open cases ({cases.length})</h4>
              <Button variant="outline" size="sm" onClick={addCase}>+ Add case</Button>
            </div>

            <div className="max-h-96 space-y-3 overflow-y-auto pr-1">
              <AnimatePresence initial={false}>
                {cases.map((c) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="rounded-lg border border-border/60 p-3"
                  >
                    <div className="grid gap-3 sm:grid-cols-12 sm:items-end">
                      <div className="space-y-1.5 sm:col-span-3">
                        <Label className="text-xs">Case ref</Label>
                        <Input
                          value={c.caseRef}
                          onChange={(e) => updateCase(c.id, { caseRef: e.target.value })}
                          placeholder="A-0412"
                        />
                      </div>
                      <div className="space-y-1.5 sm:col-span-3">
                        <Label className="text-xs">Body part</Label>
                        <select
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                          value={c.bodyPart}
                          onChange={(e) => updateCase(c.id, { bodyPart: e.target.value })}
                        >
                          {BODY_PARTS.map((b) => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label className="text-xs">Age (days)</Label>
                        <Input
                          type="number"
                          min={0}
                          value={c.caseAge}
                          onChange={(e) => updateCase(c.id, { caseAge: Number(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-1.5 sm:col-span-3">
                        <Label className="text-xs">Bottleneck</Label>
                        <select
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                          value={c.bottleneck}
                          onChange={(e) => updateCase(c.id, { bottleneck: e.target.value as CategoryId })}
                        >
                          {CATEGORIES.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="sm:col-span-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full text-muted-foreground hover:text-destructive"
                          onClick={() => removeCase(c.id)}
                          aria-label="Remove case"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <Button variant="ghost" onClick={() => setStep('intro')}>Back</Button>
          <Button onClick={submit} disabled={submitting} size="lg" className="w-full sm:w-auto">
            {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Generate stuckness profile
          </Button>
        </CardFooter>
      </Card>
    )
  }

  // ---------- RESULT ----------
  if (step === 'result' && result) {
    const total = cases.length
    const sortedCats = [...CATEGORIES]
      .map((c) => ({ ...c, count: result.profile[c.id] || 0 }))
      .filter((c) => c.count > 0)
      .sort((a, b) => b.count - a.count)
    const maxCount = Math.max(...sortedCats.map((c) => c.count), 1)

    return (
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <Badge variant="secondary" className="w-fit">Stuckness profile</Badge>
              <CardTitle className="mt-2 text-2xl">{clientHandle}</CardTitle>
              <CardDescription>
                {total} open cases classified · Assessment ID {result.assessmentId.slice(-8)}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Printer className="mr-2 h-4 w-4" /> Print
              </Button>
              <Button variant="ghost" size="sm" onClick={reset}>
                <RotateCcw className="mr-2 h-4 w-4" /> Reset
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Headline metrics */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-border/60 bg-secondary/30 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Est. avoidable days</p>
              <p className="mt-1 text-2xl font-bold text-primary">
                {result.avoidableLow}–{result.avoidableHigh}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">across the open book</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-secondary/30 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Est. operational exposure</p>
              <p className="mt-1 text-2xl font-bold text-primary">
                ${Math.round(result.exposureLow / 1000)}k–${Math.round(result.exposureHigh / 1000)}k
              </p>
              <p className="mt-1 text-xs text-muted-foreground">modified duty + replacement labour</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-secondary/30 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Verdict-eligible files</p>
              <p className="mt-1 text-2xl font-bold text-primary">{result.verdictEligible} / {total}</p>
              <p className="mt-1 text-xs text-muted-foreground">a physician signature can move these</p>
            </div>
          </div>

          {/* Category distribution */}
          <div>
            <h4 className="mb-3 text-sm font-semibold">Bottleneck distribution</h4>
            <div className="space-y-2">
              {sortedCats.map((c) => (
                <div key={c.id} className="flex items-center gap-3">
                  <div className="flex w-56 shrink-0 items-center gap-2">
                    <c.icon className={`h-4 w-4 ${c.color}`} />
                    <span className="text-xs">{c.label}</span>
                  </div>
                  <div className="flex-1">
                    <Progress value={(c.count / maxCount) * 100} className="h-3" />
                  </div>
                  <div className="w-16 text-right text-xs font-medium tabular-nums">{c.count} case{c.count !== 1 ? 's' : ''}</div>
                  {c.verdictApplicable && (
                    <Badge variant="outline" className="hidden sm:inline-flex text-[10px]">verdict</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recommended next step */}
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-semibold">Recommended next step</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {result.verdictEligible > 0 ? (
                    <>
                      Run a proof test on your {result.verdictEligible} verdict-eligible file
                      {result.verdictEligible !== 1 ? 's' : ''}. Three signed verdicts in five business days,
                      $1,500 CAD. If they don&apos;t move your thinking, we part friends.
                    </>
                  ) : (
                    <>
                      None of your current files are verdict-eligible. The leverage here is operational —
                      the 30-case backlog review with owner + deadline + escalation mapping is the right
                      engagement, from $20,000.
                    </>
                  )}
                </p>
                <Button asChild size="sm" className="mt-3">
                  <a href="#contact">Book the proof test</a>
                </Button>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Illustrative composite. Estimates blend conservatively at $650–$1,100/day modified-duty +
            replacement-labour cost. As engagements complete, this section will show real,
            client-approved results.
          </p>
        </CardContent>
      </Card>
    )
  }

  return null
}
