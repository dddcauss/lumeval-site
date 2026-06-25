'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity,
  Shield,
  FileSignature,
  ScanLine,
  Clock,
  TrendingDown,
  Users,
  Building2,
  Landmark,
  Pickaxe,
  Quote,
  ArrowRight,
  CheckCircle2,
  Lock,
  Stethoscope,
  Award,
  Globe,
  KeyRound,
  Briefcase,
  HeartPulse,
  Plane,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { StuckFileDiagnostic } from '@/components/stuck-file-diagnostic'
import { PassportDemo } from '@/components/passport-demo'
import { RoiCalculator } from '@/components/roi-calculator'
import { AiVendorView } from '@/components/ai-vendor-view'
import { RegistryStatsWidget } from '@/components/registry-stats-widget'
import { useViewStore } from '@/lib/view-store'
import { FEATURE_FLAGS } from '@/lib/feature-flags'

export function LumevalExperience() {
  const view = useViewStore((s) => s.view)
  return (
    <div id="top">
      <AnimatePresence mode="wait">
        {view === 'employer' ? (
          <motion.div
            key="employer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <EmployerView />
          </motion.div>
        ) : view === 'worker' ? (
          <motion.div
            key="worker"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <WorkerView />
          </motion.div>
        ) : FEATURE_FLAGS.aiVendorEnabled && view === 'ai-vendor' ? (
          <motion.div
            key="ai-vendor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <AiVendorView />
          </motion.div>
        ) : (
          // Fallback: if the view is somehow 'ai-vendor' but the flag is off,
          // show the employer view (default).
          <motion.div
            key="employer-fallback"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <EmployerView />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================
// EMPLOYER VIEW
// ============================================================

function EmployerView() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Badge variant="secondary" className="mb-4">
                Physician-signed verdicts · Stuck MSK files · Canada
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                The missing signature.
              </h1>
              <p className="mt-6 max-w-xl text-lg text-muted-foreground">
                Every stuck claim is waiting for a sentence only a physician can sign. Lumeval
                writes it — one page, five business days, not five months. The Stuck-File
                Diagnostic classifies your backlog. The verdict moves it.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="#diagnostic">Run the Stuck-File Diagnostic</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="#verdict">See a sample verdict</Link>
                </Button>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Opinions inform decisions — they never make them. No IMEs. No causation,
                compensability, entitlement, or fitness-for-duty determinations.
              </p>
            </div>

            {/* Verdict sample card */}
            <div className="lg:pl-8">
              <Card className="overflow-hidden shadow-lg">
                <CardHeader className="bg-secondary/50 pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">VERDICT · File A-0412</Badge>
                    <span className="text-xs text-muted-foreground">5-day SLA</span>
                  </div>
                  <CardTitle className="mt-2 text-base font-medium">
                    Lumbar spine · MRI 9 weeks ago · case age 212 days
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-4 text-sm">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Question asked</p>
                    <p>Does the imaging finding explain the current restrictions — yes or no?</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Finding</p>
                    <p>L4-5 disc protrusion with moderate degenerative change — a common, frequently asymptomatic pattern in working-age adults.</p>
                  </div>
                  <div className="rounded-md bg-primary/5 p-3">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Verdict</p>
                    <p className="font-medium">
                      No — the imaging finding does not, on its own, explain the current restriction level.
                      The file&apos;s clinical picture supports progression planning by the treating team.
                    </p>
                  </div>
                  <Separator />
                  <p className="text-xs font-medium">— Dr. Dan Gill, MD, FRCPC</p>
                  <p className="text-xs italic text-muted-foreground">
                    This opinion provides imaging interpretation and clinical-pathway information only.
                    All return-to-work, duty, and claim decisions remain with the client&apos;s responsible
                    clinicians and decision-makers.
                  </p>
                </CardContent>
              </Card>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                212 days stuck → owner + deadline assigned → moved in 11 days. Illustrative composite.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: Clock, stat: '212→11', label: 'days, a stuck case once owned', sub: 'Illustrative composite' },
              { icon: TrendingDown, stat: '$28–46k', label: 'per stuck file in replacement labour + modified duty', sub: 'Conservative estimate' },
              { icon: FileSignature, stat: '5 days', label: 'SLA on every physician-signed verdict', sub: 'Not five months' },
            ].map((s) => (
              <Card key={s.label}>
                <CardContent className="pt-6 text-center">
                  <s.icon className="mx-auto h-8 w-8 text-primary" />
                  <p className="mt-3 text-3xl font-bold">{s.stat}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground/70">{s.sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ROI CALCULATOR */}
      <section id="roi" className="scroll-mt-16 border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4">30-second estimate · try it</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              What are your stuck MSK files costing you?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Three inputs. See the avoidable days and recoverable dollars sitting in your open
              book — and what a $1,500 proof test returns.
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-4xl">
            <RoiCalculator />
          </div>
        </div>
      </section>

      {/* DIAGNOSTIC */}
      <section id="diagnostic" className="scroll-mt-16 border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4">Live demo · try it</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">The Stuck-File Diagnostic</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              8 categories of stuckness. One printable profile. The IP nobody else has published —
              productized as a paid assessment that sells the diagnosis before the cure.
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-4xl">
            <StuckFileDiagnostic />
          </div>
        </div>
      </section>

      {/* THE VERDICT */}
      <section id="verdict" className="scroll-mt-16 border-b border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4">The anatomy of a stuck file</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Stuck files aren&apos;t waiting for treatment. They&apos;re waiting for a verdict.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Almost every long-aging MSK file has the same shape: an ambiguous imaging report,
              and nobody in the chain licensed to call it. Case managers can&apos;t overrule a
              radiology report. Family physicians defer to it. A specialist consult is months away.
            </p>
          </div>
        </div>
      </section>

      {/* THREE DOORS */}
      <section id="doors" className="scroll-mt-16 border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h3 className="text-center text-2xl font-bold">Three doors. One signature.</h3>
          <p className="mx-auto mt-2 max-w-2xl text-center text-muted-foreground">
            Lumeval works inside your existing process — it does not replace your clinical team,
            your case managers, or your providers. It supplies the one layer none of them can
            staff: a fellowship-trained MSK radiologist, on demand.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <Building2 className="h-6 w-6 text-primary" />
                <CardTitle className="mt-2 text-lg">Disability & OH firms</CardTitle>
                <CardDescription>Your white-label physician layer.</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Verdicts delivered under your brand. Faster closures on your aging MSK book —
                and one line in your next bid no competitor can copy:
                <em> stuck files reviewed by a Royal College examiner in MSK radiology.</em>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Landmark className="h-6 w-6 text-primary" />
                <CardTitle className="mt-2 text-lg">Insurers & claims teams</CardTitle>
                <CardDescription>Clinical clarity on stuck MSK claims.</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Your AI and your adjusters can flag a stalled claim. They can&apos;t sign a
                clinical opinion. One-page imaging-relevance verdicts give your case managers
                the answer the file has been waiting on.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Pickaxe className="h-6 w-6 text-primary" />
                <CardTitle className="mt-2 text-lg">Mining & heavy industry</CardTitle>
                <CardDescription>The 30-case backlog review.</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                For operators carrying 90+ day cases: every reviewed case leaves with an owner,
                an action, a deadline, and an escalation path. Built for how mining actually
                runs — including Indigenous-owned and co-managed operations.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="proof" className="scroll-mt-16 border-b border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4">Start with three files</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              No platform fees. No long-term commitment. No procurement marathon.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Test the verdict on your three oldest MSK files. If they don&apos;t move your
              thinking, we part friends.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {[
              { name: 'Proof Test', price: 'CAD $1,500', desc: 'Your three oldest stuck MSK files. Three signed verdicts in five business days.', cta: 'Start', highlight: true },
              { name: 'Per-Verdict', price: '$500–1,500', desc: 'Per file, by volume and file size. Under your brand or ours.', cta: 'Enquire' },
              { name: 'Partner Retainer', price: 'Monthly', desc: 'Reserved capacity with a turnaround SLA — quoted after the proof test.', cta: 'Enquire' },
              { name: 'Backlog Review', price: 'From $20,000', desc: '30-case accountability review with day-14 and day-30 follow-up, flat fee.', cta: 'Enquire' },
            ].map((p) => (
              <Card key={p.name} className={p.highlight ? 'border-primary shadow-md' : ''}>
                <CardHeader>
                  <Badge variant={p.highlight ? 'default' : 'secondary'} className="w-fit">{p.name}</Badge>
                  <CardTitle className="mt-2 text-2xl">{p.price}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{p.desc}</CardContent>
                <CardContent className="pt-0">
                  <Button asChild variant={p.highlight ? 'default' : 'outline'} size="sm" className="w-full">
                    <Link href="#contact">{p.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* BOUNDARIES */}
      <section className="border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <Badge variant="secondary" className="mb-4">Worker-positive · Governance-first</Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                The boundary is the product.
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                No worker should be left in limbo because the next step is unclear. The model is
                deliberately scoped: opinions inform decisions, they never make them. That
                boundary is the single best defensibility argument against IME-creep, regulatory
                exposure, and union objection.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { icon: Lock, t: 'De-identified intake', d: 'No names, birthdates, SINs, or health card numbers to start.' },
                { icon: Users, t: 'No worker-level dashboards', d: 'Employer-facing outputs are aggregate and de-identified.' },
                { icon: Stethoscope, t: 'No IMEs', d: 'No causation, compensability, entitlement, or fitness-for-duty.' },
                { icon: Shield, t: 'AI-assisted, physician-signed', d: 'AI never signs alone. Every verdict carries a physician signature.' },
                { icon: Globe, t: 'Indigenous governance', d: 'OCAP-aligned where applicable. Engagements shaped with community governance.' },
                { icon: CheckCircle2, t: 'Litigated files excluded', d: 'Appear in executive reporting as aggregate exposure only.' },
              ].map((f) => (
                <div key={f.t} className="rounded-lg border border-border/60 p-4">
                  <f.icon className="h-5 w-5 text-primary" />
                  <p className="mt-2 text-sm font-semibold">{f.t}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{f.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* THE LUMEVAL REGISTRY */}
      <section id="registry" className="scroll-mt-16 border-b border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4">The bridge to the platform</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              The Lumeval Registry.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Every consented verdict contributes a de-identified copy to a registry that compounds
              in value. Today it powers research and AI validation. Tomorrow it powers the
              occupational risk-intelligence platform. Worker-owned consent. De-identified by design.
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-3xl">
            <RegistryStatsWidget />
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section id="founder" className="scroll-mt-16 border-b border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3 lg:items-start">
            <div>
              <Badge variant="secondary" className="mb-4">Founder</Badge>
              <h2 className="text-3xl font-bold tracking-tight">Dr. Dan Gill, MD, FRCPC</h2>
              <p className="mt-2 text-sm text-muted-foreground">Founder, Lumeval</p>
              <div className="mt-6 space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Award className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">Fellowship-trained MSK radiologist</p>
                    <p className="text-muted-foreground">FRCPC, Royal College of Physicians and Surgeons of Canada</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">Ten-year Royal College examiner</p>
                    <p className="text-muted-foreground">Diagnostic Radiology — defined competence for a generation of radiologists</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Activity className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">Vancouver 2010 Olympic Games</p>
                    <p className="text-muted-foreground">MSK imaging physician</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Pickaxe className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">Multi-generational BC coal-mining family</p>
                    <p className="text-muted-foreground">First-hand open-pit coal operations experience</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="pt-6">
                  <Quote className="h-8 w-8 text-primary/30" />
                  <blockquote className="mt-4 text-lg font-medium leading-relaxed">
                    I held three credentials — MSK radiologist, Royal College examiner, Olympic
                    imaging physician — and for years I only swung one. The combination is the
                    rare part. Lumeval is what happens when you swing all three at the same
                    stuck file.
                  </blockquote>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <EmployerContact />
    </>
  )
}

function EmployerContact() {
  return (
    <section id="contact" className="scroll-mt-16">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge variant="secondary" className="mb-4">Test us on your three oldest files</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Tell us where your MSK files are stuck.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Disability-management and OH firms, insurers, and heavy-industry operators: we&apos;ll
            show you what a signed verdict does to them.
          </p>
        </div>
        <Card className="mt-10">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <Button asChild size="lg">
                <a href="mailto:dan@lumeval.com?subject=Proof%20Test%20%E2%80%94%203%20oldest%20MSK%20files">
                  Email dan@lumeval.com <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Separator className="my-2" />
              <p className="text-sm text-muted-foreground">
                Or run the <Link href="#diagnostic" className="font-medium text-primary underline">Stuck-File Diagnostic</Link> first
                — it generates the printable profile you&apos;ll want for that conversation.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

// ============================================================
// WORKER VIEW
// ============================================================

function WorkerView() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/8 via-background to-background" />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Badge variant="secondary" className="mb-4">
                Your record. Your consent. Your call.
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Your back.
                <span className="block text-primary">Your record.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg text-muted-foreground">
                Every MRI, every verdict, every duty decision — owned by you, not your employer.
                The MSK Passport follows you from mine to mine, insurer to insurer, province to
                province. You grant access when you want. You revoke it when you don&apos;t.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="#passport">Create your Passport</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="#protects">How it protects you</Link>
                </Button>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                No IMEs. No causation or fitness-for-duty determinations. No employer access
                without your say. Worker-owned by design.
              </p>
            </div>

            <div className="lg:pl-8">
              <Card className="overflow-hidden shadow-lg">
                <CardHeader className="bg-secondary/50 pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">YOUR PASSPORT · red-cedar-04</Badge>
                    <span className="flex items-center gap-1 text-xs text-primary">
                      <Lock className="h-3 w-3" /> You own this
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pt-4 text-sm">
                  <div className="flex items-center justify-between rounded-md border border-border/60 p-3">
                    <div className="flex items-center gap-2">
                      <FileSignature className="h-4 w-4 text-primary" />
                      <span>Lumbar spine · MRI</span>
                    </div>
                    <Badge variant="secondary">Signed</Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-md border border-border/60 p-3">
                    <div className="flex items-center gap-2">
                      <KeyRound className="h-4 w-4 text-primary" />
                      <span>Teck Coal — access granted</span>
                    </div>
                    <Badge variant="outline">30 days left</Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-md border border-border/60 p-3">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      <span>Revoked: Old employer</span>
                    </div>
                    <Badge variant="outline" className="text-muted-foreground">Revoked</Badge>
                  </div>
                  <p className="pt-2 text-xs italic text-muted-foreground">
                    Nobody sees anything without your say. Revoke anytime.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT IT IS */}
      <section id="what-it-is" className="scroll-mt-16 border-b border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4">What the Passport is</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              A portable record of your MSK health, owned by you.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Right now, your imaging and your injury history live in your employer&apos;s file
              cabinet, your insurer&apos;s system, and your family doctor&apos;s chart. None of
              them talk to each other. None of them follow you when you change jobs. The Passport
              fixes that — one record, yours, that goes where you go.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { icon: KeyRound, title: 'You own it', body: 'A de-identified handle and passphrase. No name required to start. You hold the keys.' },
              { icon: FileSignature, title: 'Physician-signed', body: 'Every entry carries a signature and a standing limitation. AI never signs alone. Your record has weight.' },
              { icon: Shield, title: 'Consent-governed', body: 'Employers and insurers see only what you grant, only for as long as you grant it. Revoke anytime.' },
            ].map((f) => (
              <Card key={f.title}>
                <CardHeader>
                  <f.icon className="h-6 w-6 text-primary" />
                  <CardTitle className="mt-2 text-lg">{f.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{f.body}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* PASSPORT DEMO */}
      <section id="passport" className="scroll-mt-16 border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4">Live demo · try it</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Create your Passport</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Make one in 30 seconds. We&apos;ll seed it with a sample verdict so you can see the
              shape. Then grant access to a (fake) employer, set an expiry, and revoke it. This is
              a working prototype — real workflow, no real health data.
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-3xl">
            <PassportDemo />
          </div>
        </div>
      </section>

      {/* HOW IT PROTECTS YOU */}
      <section id="protects" className="scroll-mt-16 border-b border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4">How it protects you</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              No more re-litigating old injuries.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              The Passport exists to protect you — not your employer, not your insurer. Here&apos;s
              how.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              {
                icon: HeartPulse,
                title: 'Proves what was there before',
                body: 'If a finding was on your baseline imaging before you started the job — or before this injury — the Passport proves it. You stop fighting about whether the disc protrusion is new. It isn\'t. It was there. Move on.',
              },
              {
                icon: Clock,
                title: 'Gets you back to work faster',
                body: 'When the file doesn\'t go stuck for six months while everyone argues about the MRI, your return-to-work planning starts that week. Less limbo. Less lost income. Less stress.',
              },
              {
                icon: Briefcase,
                title: 'Follows you to the next job',
                body: 'Change employers, change provinces — the Passport goes with you. Your new employer doesn\'t need to re-baseline you. Your new insurer doesn\'t re-litigate your history. You carry your credibility.',
              },
              {
                icon: Shield,
                title: 'Nobody sees anything without your say',
                body: 'You grant scoped, time-limited access. 30 days to this employer. 14 days to that insurer. Revoke it the moment you want. Your record is never employer-owned again.',
              },
            ].map((f) => (
              <Card key={f.title}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <f.icon className="h-6 w-6 text-primary" />
                    <CardTitle className="text-lg">{f.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{f.body}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* YOUR RIGHTS */}
      <section id="rights" className="scroll-mt-16 border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <Badge variant="secondary" className="mb-4">Your rights</Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                What this is not.
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                The Passport is deliberately scoped to protect you. It is not a tool for employers
                to surveillance you, adjudicate your claim, or assess your credibility. These
                boundaries are the product.
              </p>
            </div>
            <div className="space-y-3">
              {[
                'Not an IME. No independent medical examination. No causation, compensability, or entitlement determination.',
                'No fitness-for-duty assessment. Your ability to work is assessed by your own clinicians, not Lumeval.',
                'No employer access to your individual medical information. Employer-facing outputs are aggregate and de-identified.',
                'No worker-level dashboards. No credibility scoring. No fraud scoring. No claim acceptance or denial.',
                'No autonomous AI decisions. AI assists with drafting. A physician reviews and signs every entry.',
                'Indigenous data governance aligned (OCAP-ready). Your data, your community\'s governance, wherever applicable.',
              ].map((t) => (
                <div key={t} className="flex items-start gap-3 rounded-lg border border-border/60 p-4">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                  <p className="text-sm">{t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-16 border-b border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">Questions workers ask</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">FAQ</h2>
          </div>
          <Accordion type="single" collapsible className="mt-8">
            <AccordionItem value="own">
              <AccordionTrigger>Does my employer own this?</AccordionTrigger>
              <AccordionContent>
                No. You do. The Passport is worker-owned by design. Your employer may fund a
                baseline imaging panel at hire as a benefit — but the record belongs to you,
                and access is granted by you, not mandated by them.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="force">
              <AccordionTrigger>Can my employer force me to create one?</AccordionTrigger>
              <AccordionContent>
                No. Creating a Passport is your choice. An employer can offer to fund a baseline
                imaging panel as part of a pre-employment medical — you receive the Passport as a
                benefit. But you are not required to create one, and you are not required to
                grant access to anyone.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="hide">
              <AccordionTrigger>What if I don&apos;t want them to see something?</AccordionTrigger>
              <AccordionContent>
                You grant scoped, time-limited access. You decide what they see, and for how long.
                You can revoke access at any time. The Passport is not an open book — it&apos;s a
                record you control door by door.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="ime">
              <AccordionTrigger>Is this an IME?</AccordionTrigger>
              <AccordionContent>
                No. The Passport contains physician-signed verdicts that answer one operational
                question — does the imaging finding explain the current restrictions. It does
                not assess causation, compensability, entitlement, disability, impairment, or
                fitness for duty. It is not an independent medical examination and cannot be
                used as one.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="indigenous">
              <AccordionTrigger>What about Indigenous data governance?</AccordionTrigger>
              <AccordionContent>
                The Passport is built OCAP-aligned (Ownership, Control, Access, Possession)
                where applicable. For Indigenous-owned and co-managed operations, engagement
                structures are shaped with the community&apos;s governance, not around it. Your
                data, your community&apos;s governance.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="province">
              <AccordionTrigger>Does it work if I move to another province?</AccordionTrigger>
              <AccordionContent>
                The Passport is designed to be portable. Your record follows you. The legal
                standing of a physician-signed verdict may vary by province — Lumeval is working
                on multi-province licensure to strengthen cross-border portability. The record
                itself is always yours to carry.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* FOUNDER (worker framing) */}
      <section className="scroll-mt-16 border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3 lg:items-start">
            <div>
              <Badge variant="secondary" className="mb-4">Why I built this</Badge>
              <h2 className="text-3xl font-bold tracking-tight">Dr. Dan Gill, MD, FRCPC</h2>
              <p className="mt-2 text-sm text-muted-foreground">Founder, Lumeval</p>
              <div className="mt-6 space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Pickaxe className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">Multi-generational BC coal-mining family</p>
                    <p className="text-muted-foreground">I come from the people this is built for</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">Fellowship-trained MSK radiologist</p>
                    <p className="text-muted-foreground">FRCPC, Royal College examiner for ten years</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Plane className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">Vancouver 2010 Olympic Games</p>
                    <p className="text-muted-foreground">MSK imaging physician</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="pt-6">
                  <Quote className="h-8 w-8 text-primary/30" />
                  <blockquote className="mt-4 text-lg font-medium leading-relaxed">
                    I come from a coal-mining family. I watched miners get stuck in claim limbo
                    for months because nobody could call the imaging. The Passport exists because
                    no worker should be left in limbo because the next step is unclear — and
                    because the record of your own back should belong to you, not the company
                    you happen to work for this year.
                  </blockquote>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT (worker) */}
      <section id="contact" className="scroll-mt-16">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">Questions?</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Talk to Dr. Gill directly.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              No call centre. No salesperson. Email the founder with any question about the
              Passport, your rights, or how it applies to your situation.
            </p>
          </div>
          <Card className="mt-10">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-4 text-center">
                <Button asChild size="lg">
                  <a href="mailto:dan@lumeval.com?subject=MSK%20Passport%20%E2%80%94%20worker%20question">
                    Email dan@lumeval.com <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Separator className="my-2" />
                <p className="text-sm text-muted-foreground">
                  Or <Link href="#passport" className="font-medium text-primary underline">create your Passport</Link> first
                  — it takes 30 seconds and needs no real health data.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  )
}
