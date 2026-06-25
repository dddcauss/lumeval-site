'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield,
  KeyRound,
  FileSignature,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Users,
  Calendar,
  CheckCircle2,
  XCircle,
  Plus,
  Database,
  FlaskConical,
  Cpu,
  Activity,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

interface Verdict {
  id: string
  bodyPart: string
  modality: string
  questionAsked: string
  answer: 'yes' | 'no' | 'partial'
  finding: string
  nextStep: string
  signedBy: string
  signedAt: string
  limitation: string
}

interface Grant {
  id: string
  granteeType: string
  granteeName: string
  scope: string
  expiresAt: string
  revokedAt: string | null
}

type Stage = 'intro' | 'signup' | 'login' | 'vault'

export function PassportDemo() {
  const [stage, setStage] = React.useState<Stage>('intro')
  const [handle, setHandle] = React.useState('')
  const [pass, setPass] = React.useState('')
  const [busy, setBusy] = React.useState(false)
  const [verdicts, setVerdicts] = React.useState<Verdict[]>([])
  const [grants, setGrants] = React.useState<Grant[]>([])
  const [showAddVerdict, setShowAddVerdict] = React.useState(false)
  const [showGrant, setShowGrant] = React.useState(false)

  // Registry consent state
  const [registryConsent, setRegistryConsent] = React.useState(false)
  const [consentScope, setConsentScope] = React.useState<'research' | 'ai-validation' | 'surveillance' | 'all'>('research')
  const [activeConsent, setActiveConsent] = React.useState<{
    granted: boolean
    scope: string | null
    grantedAt: string | null
    revokedAt: string | null
  } | null>(null)

  // New verdict form state
  const [nvBodyPart, setNvBodyPart] = React.useState('Lumbar spine')
  const [nvModality, setNvModality] = React.useState('MRI')
  const [nvQuestion, setNvQuestion] = React.useState('Does the imaging finding explain the current restrictions — yes or no?')
  const [nvAnswer, setNvAnswer] = React.useState<'yes' | 'no' | 'partial'>('no')
  const [nvFinding, setNvFinding] = React.useState('L4-5 disc protrusion with moderate degenerative change — a common, frequently asymptomatic pattern in working-age adults.')
  const [nvNextStep, setNvNextStep] = React.useState('Duty-progression planning meeting between the OH team and supervisor; imaging does not need to be repeated before that conversation.')

  // New grant form state
  const [gType, setGType] = React.useState('Employer')
  const [gName, setGName] = React.useState('')
  const [gDays, setGDays] = React.useState(30)

  const signup = async () => {
    if (!handle.trim() || !pass.trim()) {
      toast.error('Choose a de-identified handle and a passphrase.')
      return
    }
    setBusy(true)
    try {
      const res = await fetch('/api/passport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'signup',
          handle,
          pass,
          registryConsent,
          consentScope,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Signup failed')
      }
      toast.success(
        registryConsent
          ? 'Passport created. Seeded with one sample verdict. Registry consent active.'
          : 'Passport created. Seeded with one sample verdict.'
      )
      await loadVault(handle, pass)
      setStage('vault')
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Signup failed')
    } finally {
      setBusy(false)
    }
  }

  const login = async () => {
    if (!handle.trim() || !pass.trim()) {
      toast.error('Enter your handle and passphrase.')
      return
    }
    setBusy(true)
    try {
      await loadVault(handle, pass)
      setStage('vault')
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  const loadVault = async (h: string, p: string) => {
    const res = await fetch('/api/passport', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', handle: h, pass: p }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Login failed')
    }
    const data = await res.json()
    setVerdicts(data.verdicts)
    setGrants(data.grants)
    setActiveConsent(data.registryConsent || null)
  }

  const grantConsent = async () => {
    setBusy(true)
    try {
      const res = await fetch('/api/passport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'grant-consent', handle, pass, scope: consentScope }),
      })
      if (!res.ok) throw new Error('Could not grant consent')
      const data = await res.json()
      setActiveConsent(data.registryConsent)
      toast.success('Registry consent granted. Future verdicts contribute to the registry.')
    } catch {
      toast.error('Could not grant consent')
    } finally {
      setBusy(false)
    }
  }

  const revokeConsent = async () => {
    setBusy(true)
    try {
      const res = await fetch('/api/passport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'revoke-consent', handle, pass }),
      })
      if (!res.ok) throw new Error('Could not revoke consent')
      const data = await res.json()
      setActiveConsent(data.registryConsent)
      toast.success('Registry consent revoked. Future verdicts will not be added. Past de-identified entries remain.')
    } catch {
      toast.error('Could not revoke consent')
    } finally {
      setBusy(false)
    }
  }

  const addVerdict = async () => {
    setBusy(true)
    try {
      const res = await fetch('/api/passport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add-verdict',
          handle,
          pass,
          verdict: {
            bodyPart: nvBodyPart,
            modality: nvModality,
            questionAsked: nvQuestion,
            answer: nvAnswer,
            finding: nvFinding,
            nextStep: nvNextStep,
          },
        }),
      })
      if (!res.ok) throw new Error('Could not add verdict')
      toast.success('Verdict added to your Passport.')
      setShowAddVerdict(false)
      await loadVault(handle, pass)
    } catch {
      toast.error('Could not add verdict')
    } finally {
      setBusy(false)
    }
  }

  const grantAccess = async () => {
    if (!gName.trim()) {
      toast.error('Enter a grantee name.')
      return
    }
    setBusy(true)
    try {
      const res = await fetch('/api/passport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'grant',
          handle,
          pass,
          grant: {
            granteeType: gType,
            granteeName: gName,
            scope: 'verdicts',
            days: gDays,
          },
        }),
      })
      if (!res.ok) throw new Error('Could not grant access')
      toast.success(`Access granted to ${gName} for ${gDays} days.`)
      setShowGrant(false)
      setGName('')
      await loadVault(handle, pass)
    } catch {
      toast.error('Could not grant access')
    } finally {
      setBusy(false)
    }
  }

  const revokeGrant = async (grantId: string) => {
    setBusy(true)
    try {
      const res = await fetch('/api/passport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'revoke', handle, pass, grantId }),
      })
      if (!res.ok) throw new Error('Could not revoke')
      toast.success('Access revoked.')
      await loadVault(handle, pass)
    } catch {
      toast.error('Could not revoke')
    } finally {
      setBusy(false)
    }
  }

  // ---------- INTRO ----------
  if (stage === 'intro') {
    return (
      <Card className="overflow-hidden">
        <CardHeader>
          <Badge variant="secondary" className="w-fit">The MSK Passport — live demo</Badge>
          <CardTitle className="mt-2 text-2xl sm:text-3xl">
            The worker owns the record. The employer pays for access.
          </CardTitle>
          <CardDescription className="text-base">
            A portable, worker-owned, cryptographically-signed record of baseline imaging, signed
            verdicts, and duty-progression history. Follows the worker across employers, insurers,
            and provinces. Worker consents access; employer/insurer pays per access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { icon: KeyRound, title: 'Worker-owned', body: 'No names, no SINs, no health card numbers. You hold a de-identified handle and a passphrase.' },
              { icon: FileSignature, title: 'Physician-signed', body: 'Every verdict carries a signature line and a standing limitation. AI never signs alone.' },
              { icon: Shield, title: 'Consent-governed', body: 'Employers and insurers see only what you grant, only for as long as you grant it. Revoke anytime.' },
            ].map((f) => (
              <div key={f.title} className="rounded-lg border border-border/60 p-4">
                <f.icon className="h-5 w-5 text-primary" />
                <p className="mt-2 text-sm font-semibold">{f.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" className="w-full sm:w-auto" onClick={() => setStage('signup')}>
            Create a Passport
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto" onClick={() => setStage('login')}>
            I already have one
          </Button>
        </CardFooter>
      </Card>
    )
  }

  // ---------- SIGNUP / LOGIN ----------
  if (stage === 'signup' || stage === 'login') {
    const isSignup = stage === 'signup'
    return (
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>{isSignup ? 'Create your MSK Passport' : 'Open your Passport'}</CardTitle>
          <CardDescription>
            {isSignup
              ? 'Choose a de-identified handle (no names) and a passphrase. We seed your Passport with one sample verdict so you can see the shape.'
              : 'Enter your handle and passphrase.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="handle">De-identified handle</Label>
            <Input
              id="handle"
              placeholder="e.g. red-cedar-04"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">A word, a colour, a number. Anything but your name.</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pass">Passphrase</Label>
            <Input
              id="pass"
              type="password"
              placeholder="••••••••"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>
          <div className="rounded-md border border-primary/30 bg-primary/5 p-3 text-xs text-muted-foreground">
            <Lock className="mr-1.5 inline h-3.5 w-3.5 text-primary" />
            Demo only. No real health data. Stored locally for this prototype.
          </div>

          {isSignup && (
            <div className="space-y-3 rounded-lg border border-border/60 p-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="registryConsent"
                  checked={registryConsent}
                  onCheckedChange={(v) => setRegistryConsent(v === true)}
                  className="mt-0.5"
                />
                <div className="space-y-1">
                  <Label htmlFor="registryConsent" className="text-sm font-medium cursor-pointer">
                    Contribute to the Lumeval Registry (optional)
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Allow a <strong>de-identified</strong> copy of your verdicts to be stored in the
                    Lumeval Registry — used for research, AI validation, and surveillance analytics.
                    No link back to you. Revocable anytime. Past de-identified entries remain.
                  </p>
                </div>
              </div>
              {registryConsent && (
                <div className="space-y-1.5 pl-7">
                  <Label className="text-xs">Consent scope</Label>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    value={consentScope}
                    onChange={(e) => setConsentScope(e.target.value as typeof consentScope)}
                  >
                    <option value="research">Research only</option>
                    <option value="ai-validation">AI validation only</option>
                    <option value="surveillance">Surveillance analytics only</option>
                    <option value="all">All of the above</option>
                  </select>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <Button variant="ghost" onClick={() => setStage('intro')}>Back</Button>
          <Button onClick={isSignup ? signup : login} disabled={busy} className="w-full sm:w-auto">
            {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isSignup ? 'Create Passport' : 'Open'}
          </Button>
        </CardFooter>
      </Card>
    )
  }

  // ---------- VAULT ----------
  const activeGrants = grants.filter((g) => !g.revokedAt && new Date(g.expiresAt) > new Date())
  const revokedGrants = grants.filter((g) => g.revokedAt || new Date(g.expiresAt) <= new Date())

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Passport: {handle}
              </CardTitle>
              <CardDescription>
                {verdicts.length} signed verdict{verdicts.length !== 1 ? 's' : ''} · {activeGrants.length} active access grant{activeGrants.length !== 1 ? 's' : ''}
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setStage('intro')}>
              Switch Passport
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Verdict vault */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileSignature className="h-4 w-4 text-primary" />
                Verdict vault
              </CardTitle>
              <CardDescription>Worker-owned. Every entry physician-signed.</CardDescription>
            </div>
            <Button size="sm" variant="outline" onClick={() => setShowAddVerdict((v) => !v)}>
              <Plus className="mr-1.5 h-4 w-4" /> Add verdict
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <AnimatePresence>
            {showAddVerdict && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-3 rounded-lg border border-dashed border-primary/40 p-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Body part</Label>
                      <Input value={nvBodyPart} onChange={(e) => setNvBodyPart(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Modality</Label>
                      <Input value={nvModality} onChange={(e) => setNvModality(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Question asked</Label>
                    <Input value={nvQuestion} onChange={(e) => setNvQuestion(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Answer</Label>
                    <div className="flex gap-2">
                      {(['yes', 'no', 'partial'] as const).map((a) => (
                        <Button
                          key={a}
                          size="sm"
                          variant={nvAnswer === a ? 'default' : 'outline'}
                          onClick={() => setNvAnswer(a)}
                        >
                          {a}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Finding</Label>
                    <textarea
                      className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                      value={nvFinding}
                      onChange={(e) => setNvFinding(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Recommended next step</Label>
                    <textarea
                      className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                      value={nvNextStep}
                      onChange={(e) => setNvNextStep(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setShowAddVerdict(false)}>Cancel</Button>
                    <Button size="sm" onClick={addVerdict} disabled={busy}>
                      {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Sign & store
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {verdicts.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No verdicts yet.</p>
          ) : (
            <div className="space-y-3">
              {verdicts.map((v) => (
                <motion.div
                  key={v.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg border border-border/60 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{v.bodyPart}</Badge>
                      <Badge variant="outline">{v.modality}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(v.signedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">Question asked</p>
                  <p className="text-sm">{v.questionAsked}</p>
                  <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">Verdict</p>
                  <p className="text-sm font-medium">
                    {v.answer === 'yes' ? 'Yes' : v.answer === 'no' ? 'No' : 'Partial'} — {v.finding}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">Recommended next step</p>
                  <p className="text-sm">{v.nextStep}</p>
                  <Separator className="my-3" />
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">— {v.signedBy}</span>
                  </div>
                  <p className="mt-2 text-xs italic text-muted-foreground">{v.limitation}</p>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Consent grants */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-4 w-4 text-primary" />
                Access grants
              </CardTitle>
              <CardDescription>You decide who sees your verdicts, and for how long.</CardDescription>
            </div>
            <Button size="sm" variant="outline" onClick={() => setShowGrant((v) => !v)}>
              <Plus className="mr-1.5 h-4 w-4" /> Grant access
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <AnimatePresence>
            {showGrant && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-3 rounded-lg border border-dashed border-primary/40 p-4">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Grantee type</Label>
                      <select
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                        value={gType}
                        onChange={(e) => setGType(e.target.value)}
                      >
                        <option>Employer</option>
                        <option>Insurer</option>
                        <option>OH firm</option>
                        <option>Union</option>
                        <option>Treating clinician</option>
                      </select>
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label className="text-xs">Grantee name</Label>
                      <Input
                        placeholder="e.g. Teck Coal — Elk Valley"
                        value={gName}
                        onChange={(e) => setGName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Access duration (days)</Label>
                    <Input
                      type="number"
                      min={1}
                      max={365}
                      value={gDays}
                      onChange={(e) => setGDays(Number(e.target.value))}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setShowGrant(false)}>Cancel</Button>
                    <Button size="sm" onClick={grantAccess} disabled={busy}>
                      {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Grant access
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {activeGrants.length === 0 && revokedGrants.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No grants yet. Employers and insurers see nothing until you grant access.
            </p>
          ) : (
            <div className="space-y-3">
              {activeGrants.map((g) => (
                <div key={g.id} className="flex items-center justify-between rounded-lg border border-border/60 p-3">
                  <div className="flex items-center gap-3">
                    <Eye className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{g.granteeType}: {g.granteeName}</p>
                      <p className="text-xs text-muted-foreground">
                        Expires {new Date(g.expiresAt).toLocaleDateString()} · scope: {g.scope}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => revokeGrant(g.id)}>
                    Revoke
                  </Button>
                </div>
              ))}
              {revokedGrants.map((g) => (
                <div key={g.id} className="flex items-center justify-between rounded-lg border border-border/40 p-3 opacity-60">
                  <div className="flex items-center gap-3">
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{g.granteeType}: {g.granteeName}</p>
                      <p className="text-xs text-muted-foreground">
                        {g.revokedAt ? 'Revoked' : 'Expired'}
                      </p>
                    </div>
                  </div>
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
            Indigenous data governance aligned. Worker-owned by design. OCAP-ready where applicable.
          </p>
        </CardFooter>
      </Card>

      {/* Registry consent card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Database className="h-4 w-4 text-primary" />
            The Lumeval Registry
          </CardTitle>
          <CardDescription>
            Contribute de-identified verdict data to build the occupational-imaging dataset
            nobody else has. Your call. Revocable anytime.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeConsent?.granted ? (
            <>
              <div className="flex items-start gap-3 rounded-lg border border-primary/30 bg-primary/5 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">Registry consent active</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Scope: <strong>{activeConsent.scope}</strong>. Granted{' '}
                    {activeConsent.grantedAt ? new Date(activeConsent.grantedAt).toLocaleDateString() : '—'}.
                    Every future verdict you add contributes a de-identified copy to the registry —
                    no link back to you.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Want to stop contributing? Revoke here. Past de-identified entries remain (no link to you).
                </p>
                <Button variant="outline" size="sm" onClick={revokeConsent} disabled={busy}>
                  Revoke consent
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start gap-3 rounded-lg border border-border/60 p-4">
                <Database className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-sm font-semibold">Not contributing yet</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    If you opt in, a de-identified copy of every verdict is stored in the Lumeval
                    Registry — used for research, AI validation, and occupational surveillance
                    analytics. No worker ID. No link back to you. Revocable anytime.
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Choose your scope</Label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {[
                    { v: 'research', label: 'Research only', icon: FlaskConical, desc: 'Academic + clinical research' },
                    { v: 'ai-validation', label: 'AI validation', icon: Cpu, desc: 'Help certify AI MSK imaging' },
                    { v: 'surveillance', label: 'Surveillance analytics', icon: Activity, desc: 'Occupational disease tracking' },
                    { v: 'all', label: 'All of the above', icon: Database, desc: 'Maximum contribution' },
                  ].map((opt) => (
                    <button
                      key={opt.v}
                      onClick={() => setConsentScope(opt.v as typeof consentScope)}
                      className={`flex items-start gap-2 rounded-lg border p-3 text-left transition-colors ${
                        consentScope === opt.v
                          ? 'border-primary bg-primary/5'
                          : 'border-border/60 hover:bg-accent'
                      }`}
                    >
                      <opt.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <div>
                        <p className="text-xs font-medium">{opt.label}</p>
                        <p className="text-xs text-muted-foreground">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <Button onClick={grantConsent} disabled={busy} className="w-full">
                {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Grant registry consent
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
