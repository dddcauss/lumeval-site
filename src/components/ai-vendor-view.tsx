'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Cpu,
  ShieldCheck,
  FileCheck,
  Award,
  Microscope,
  Scale,
  ArrowRight,
  CheckCircle2,
  Loader2,
  FlaskConical,
  Building2,
  Landmark,
  Stethoscope,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import { toast } from 'sonner'

const MODALITIES = ['X-ray', 'MRI', 'CT', 'Ultrasound', 'Multimodal']
const BODY_PARTS = ['Spine', 'Shoulder', 'Knee', 'Hip', 'Wrist/hand', 'Ankle/foot', 'Multiple']
const REG_STATUSES = [
  'None / pre-clearance',
  'FDA 510(k) cleared',
  'FDA De Novo',
  'Health Canada licensed',
  'CE marked (MDR)',
  'UKCA marked',
  'Other',
]

export function AiVendorView() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/8 via-background to-background" />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4">
              <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
              The Lumeval Standard · Clinical certification for AI MSK imaging
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              FDA clears on performance.
              <span className="block text-primary">Nobody certifies the hard call.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              AI MSK imaging products are proliferating. Regulators clear on technical performance
              and equivalence. Procurement teams, insurers, and clinicians need to know which
              products get the hard call right — the ambiguous disc, the incidental finding, the
              borderline case that makes or breaks a file. The Lumeval Standard certifies that.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button asChild size="lg">
                <Link href="#intake">Submit your product <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="#standard">What the Standard is</Link>
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Built on ten years of Royal College examining. The first clinical-accuracy
              certification for AI MSK imaging.
            </p>
          </div>
        </div>
      </section>

      {/* THE PROBLEM */}
      <section className="border-b border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4">The gap</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Regulatory clearance is not clinical certification.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              The FDA clears AI on technical performance against a predicate. Health Canada clears
              on equivalence. Neither certifies that a product makes the hard MSK call correctly —
              the ambiguous finding, the incidentaloma, the case where the imaging is real but
              doesn&apos;t explain the restriction. That gap is where files go stuck, claims go
              wrong, and trust in AI erodes.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Landmark,
                title: 'Regulatory ≠ clinical',
                body: '510(k) clears against a predicate, not against the hard call. A product can be cleared and still get the stuck-file cases wrong.',
              },
              {
                icon: Building2,
                title: 'Procurement is blind',
                body: 'Hospital and insurer procurement teams have no clinical-accuracy benchmark to compare AI MSK products. They buy on marketing.',
              },
              {
                icon: Stethoscope,
                title: 'Clinicians don&apos;t trust it',
                body: 'Radiologists and OH physicians won&apos;t defer to AI they can&apos;t trust on the hard cases. Without trust, the AI never moves the file.',
              },
            ].map((p) => (
              <Card key={p.title}>
                <CardHeader>
                  <p.icon className="h-6 w-6 text-primary" />
                  <CardTitle className="mt-2 text-lg" dangerouslySetInnerHTML={{ __html: p.title }} />
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{p.body}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* THE STANDARD */}
      <section id="standard" className="scroll-mt-16 border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4">The Lumeval Standard</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Four components. One certification mark.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              The Lumeval Standard is a published, peer-reviewed clinical-accuracy benchmark for
              AI MSK imaging. Products that meet the threshold earn the Lumeval Certified mark.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Scale className="h-6 w-6 text-primary" />
                  <CardTitle className="text-lg">1. The Benchmark</CardTitle>
                </div>
                <CardDescription>
                  A published set of clinical-accuracy criteria — not just sensitivity and
                  specificity, but calibration on the hard call, false-positive rate on common
                  asymptomatic findings, and agreement with sub-specialist MSK radiologists on
                  ambiguous cases.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <FlaskConical className="h-6 w-6 text-primary" />
                  <CardTitle className="text-lg">2. The Test Set</CardTitle>
                </div>
                <CardDescription>
                  A curated set of de-identified hard MSK cases — the kind stuck files are made of.
                  Built from a decade of Royal College examining material plus real Lumeval
                  stuck-file cases. Continuously refreshed to prevent overfitting.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <FileCheck className="h-6 w-6 text-primary" />
                  <CardTitle className="text-lg">3. The Methodology</CardTitle>
                </div>
                <CardDescription>
                  Peer-reviewed, transparent, published. How the test set is curated, how
                  performance is measured, what threshold earns certification. Methodology is
                  open; the test set is gated. Vendors know the rules, not the answers.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                  <CardTitle className="text-lg">4. The Mark</CardTitle>
                </div>
                <CardDescription>
                  The Lumeval Certified mark — displayed on vendor materials, listed in a public
                  registry. Procurement teams, insurers, and clinicians begin to require it. Annual
                  re-certification against a refreshed test set ensures the mark keeps its meaning.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* WHY IT MATTERS */}
      <section id="why" className="scroll-mt-16 border-b border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4">Why it matters to vendors</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Certification becomes the procurement gate.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              The Lumeval Certified mark is not a regulatory hurdle — it&apos;s a commercial
              accelerant. Certified products win procurement. Here&apos;s what the mark does for you.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Building2, title: 'Win procurement', body: 'Hospital and insurer RFPs begin to require Lumeval Certified. You qualify; competitors don\'t.' },
              { icon: Stethoscope, title: 'Earn clinician trust', body: 'Radiologists and OH physicians defer to AI they can trust on the hard call. The mark is that trust.' },
              { icon: Landmark, title: 'Differentiate from regulators', body: 'FDA clearance is table stakes. Lumeval Certified is the clinical-accuracy layer on top.' },
              { icon: ArrowRight, title: 'Open the disability market', body: 'Insurers and OH firms buying MSK AI for claims will demand clinical-accuracy certification. Be first.' },
            ].map((p) => (
              <Card key={p.title}>
                <CardHeader>
                  <p.icon className="h-5 w-5 text-primary" />
                  <CardTitle className="mt-1 text-base">{p.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{p.body}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="scroll-mt-16 border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4">The process</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Submit. Benchmark. Certify. Re-certify.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Transparent timeline. You know the rules. You know the test distribution (not the
              cases). You get a confidential performance report regardless of outcome.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {[
              { step: '01', title: 'Submit', body: 'Vendor submits product, modality, body parts, intended use, regulatory status. NDA executed. Intake fee: $5,000 (credited toward certification).' },
              { step: '02', title: 'Benchmark', body: 'Lumeval runs the product against the gated test set. Performance measured on the published criteria. 10 business days.' },
              { step: '03', title: 'Certify', body: 'If the product meets threshold: Lumeval Certified mark, public registry listing, confidential performance report. If not: report + remediation guidance.' },
              { step: '04', title: 'Re-certify', body: 'Annual re-certification against a refreshed test set (prevents overfitting). Re-certification fee: $15,000.' },
            ].map((p) => (
              <Card key={p.step}>
                <CardHeader>
                  <span className="text-xs font-mono text-primary">{p.step}</span>
                  <CardTitle className="text-lg">{p.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{p.body}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* THE EXAMINER */}
      <section id="examiner" className="scroll-mt-16 border-b border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <Badge variant="secondary" className="mb-4">Why Lumeval</Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                The credential that can&apos;t be copied.
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                The Lumeval Standard has credibility because the founder spent a decade defining
                competence for the Royal College. You can&apos;t buy that credential. You
                can&apos;t copy it. That&apos;s why the mark will mean something.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { icon: Award, title: 'Ten-year Royal College examiner', body: 'Diagnostic Radiology — defined competence for a generation of Canadian radiologists. He literally set the standard for human MSK reading.' },
                { icon: Microscope, title: 'Fellowship-trained MSK radiologist', body: 'FRCPC, sub-specialty in musculoskeletal imaging. The signature authority behind every Lumeval verdict.' },
                { icon: ShieldCheck, title: 'Vancouver 2010 Olympic Games', body: 'MSK imaging physician for elite athletes. Baseline-to-injury imaging at the highest stakes.' },
                { icon: Cpu, title: 'AI-literate, not AI-skeptical', body: 'Lumeval uses AI to assist with every verdict. The Standard exists to make AI better, not to block it.' },
              ].map((c) => (
                <div key={c.title} className="flex items-start gap-3 rounded-lg border border-border/60 p-4">
                  <c.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="text-sm font-semibold">{c.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{c.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="scroll-mt-16 border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4">Pricing</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Pay for the certification, not the marketing.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Transparent fees. No success fees. No pay-to-play. The mark is earned on performance.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { name: 'Intake', price: '$5,000', desc: 'Product submission, NDA, scoping call. Fee credited toward certification if you proceed.', highlight: false },
              { name: 'Certification', price: '$25,000–75,000', desc: 'Full benchmark against the test set. Confidential performance report. Mark + registry listing if threshold met. Per product, per version.', highlight: true },
              { name: 'Annual Re-cert', price: '$15,000', desc: 'Re-benchmark against refreshed test set. Prevents overfitting. Keeps the mark current.', highlight: false },
            ].map((p) => (
              <Card key={p.name} className={p.highlight ? 'border-primary shadow-md' : ''}>
                <CardHeader>
                  <Badge variant={p.highlight ? 'default' : 'secondary'} className="w-fit">{p.name}</Badge>
                  <CardTitle className="mt-2 text-2xl">{p.price}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{p.desc}</CardContent>
              </Card>
            ))}
          </div>
          <p className="mt-8 text-center text-xs text-muted-foreground">
            Test-set access licensing (for vendors who want to train against the distribution, not
            the exact cases) available separately: $50,000–150,000/year. Inquire.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-16 border-b border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">Questions AI vendors ask</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">FAQ</h2>
          </div>
          <Accordion type="single" collapsible className="mt-8">
            <AccordionItem value="compete">
              <AccordionTrigger>Are you competing with AI MSK vendors?</AccordionTrigger>
              <AccordionContent>
                No. Lumeval uses AI to assist with every verdict. The Standard exists to make AI
                MSK imaging better and more trustworthy — not to block it. Certified products win
                procurement. The certification business is structurally non-competitive with AI
                vendors: we certify, you build.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="testset">
              <AccordionTrigger>How is the test set curated and kept current?</AccordionTrigger>
              <AccordionContent>
                The test set is built from two sources: (1) a decade of Royal College examining
                material — the hard cases that define competence for human radiologists, and (2)
                real Lumeval stuck-file cases, de-identified. The set is refreshed annually with
                new cases to prevent overfitting. The methodology is published; the cases are
                gated.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="threshold">
              <AccordionTrigger>What&apos;s the certification threshold?</AccordionTrigger>
              <AccordionContent>
                The threshold is published in the methodology document and includes: agreement with
                sub-specialist MSK radiologists on ambiguous cases (above a benchmark), false-positive
                rate on common asymptomatic findings (below a threshold), and calibration on the hard
                call. The exact numbers are published before you submit — you know the rules.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="fail">
              <AccordionTrigger>What happens if we don&apos;t meet the threshold?</AccordionTrigger>
              <AccordionContent>
                You receive a confidential performance report with specific failure modes and
                remediation guidance. The result is not published. You can re-submit a new version
                at the re-certification fee ($15,000). Lumeval does not publicly list failed
                certifications — only certified ones.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="data">
              <AccordionTrigger>Do you train on our model? Do we see your data?</AccordionTrigger>
              <AccordionContent>
                No and no. Lumeval runs your product against the gated test set and measures
                performance. We do not retain your model weights, your training data, or your
                inference outputs beyond what&apos;s needed for the performance report. You do not
                see the test set cases. Test-set distribution is described in the methodology;
                the cases themselves are gated to preserve integrity.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="region">
              <AccordionTrigger>Is this only for Canadian vendors?</AccordionTrigger>
              <AccordionContent>
                No. The Lumeval Standard is jurisdiction-agnostic. Any AI MSK imaging product —
                FDA-cleared, CE-marked, Health Canada licensed, or pre-clearance — can be
                certified. The mark is global. Regulatory clearance is the floor; Lumeval
                Certified is the clinical-accuracy layer on top.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* INTAKE FORM */}
      <IntakeForm />
    </>
  )
}

function IntakeForm() {
  const [submitting, setSubmitting] = React.useState(false)
  const [submitted, setSubmitted] = React.useState(false)
  const [form, setForm] = React.useState({
    companyName: '',
    contactName: '',
    contactEmail: '',
    productName: '',
    modality: 'MRI',
    bodyParts: 'Spine',
    intendedUse: '',
    regulatoryStatus: 'None / pre-clearance',
    notes: '',
  })

  const update = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }))

  const submit = async () => {
    if (!form.companyName || !form.contactName || !form.contactEmail || !form.productName) {
      toast.error('Company, contact, email, and product name are required.')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/vendor-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Submission failed')
      setSubmitted(true)
      toast.success('Inquiry received. Dr. Gill will reach out within 2 business days.')
    } catch {
      toast.error('Could not submit. Email dan@lumeval.com directly.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="intake" className="scroll-mt-16">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge variant="secondary" className="mb-4">Submit your product</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Start the certification conversation.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Tell us about your product. Dr. Gill will reach out within two business days to scope
            the certification. Intake fee ($5,000) is credited toward certification if you proceed.
          </p>
        </div>

        <Card className="mt-10">
          {submitted ? (
            <CardContent className="pt-12 pb-12 text-center">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
                <p className="mt-4 text-lg font-semibold">Inquiry received.</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Dr. Gill will reach out to {form.contactEmail} within two business days.
                </p>
                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={() => {
                    setSubmitted(false)
                    setForm({
                      companyName: '', contactName: '', contactEmail: '', productName: '',
                      modality: 'MRI', bodyParts: 'Spine', intendedUse: '',
                      regulatoryStatus: 'None / pre-clearance', notes: '',
                    })
                  }}
                >
                  Submit another
                </Button>
              </motion.div>
            </CardContent>
          ) : (
            <>
              <CardHeader>
                <CardTitle>Product intake</CardTitle>
                <CardDescription>All fields required unless noted.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="companyName">Company name</Label>
                    <Input id="companyName" value={form.companyName} onChange={(e) => update('companyName', e.target.value)} placeholder="Acme MSK AI" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="productName">Product name</Label>
                    <Input id="productName" value={form.productName} onChange={(e) => update('productName', e.target.value)} placeholder="AcmeSpineReader v2" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="contactName">Contact name</Label>
                    <Input id="contactName" value={form.contactName} onChange={(e) => update('contactName', e.target.value)} placeholder="Dr. Jane Smith" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="contactEmail">Contact email</Label>
                    <Input id="contactEmail" type="email" value={form.contactEmail} onChange={(e) => update('contactEmail', e.target.value)} placeholder="jane@acme.com" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="modality">Primary modality</Label>
                    <select
                      id="modality"
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                      value={form.modality}
                      onChange={(e) => update('modality', e.target.value)}
                    >
                      {MODALITIES.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="bodyParts">Body part(s)</Label>
                    <select
                      id="bodyParts"
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                      value={form.bodyParts}
                      onChange={(e) => update('bodyParts', e.target.value)}
                    >
                      {BODY_PARTS.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="regulatoryStatus">Regulatory status</Label>
                  <select
                    id="regulatoryStatus"
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    value={form.regulatoryStatus}
                    onChange={(e) => update('regulatoryStatus', e.target.value)}
                  >
                    {REG_STATUSES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="intendedUse">Intended use (1–2 sentences)</Label>
                  <Textarea
                    id="intendedUse"
                    value={form.intendedUse}
                    onChange={(e) => update('intendedUse', e.target.value)}
                    placeholder="e.g. Automated detection of lumbar disc protrusion on MRI for triage."
                    className="min-h-[70px]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="notes">Anything else? (optional)</Label>
                  <Textarea
                    id="notes"
                    value={form.notes}
                    onChange={(e) => update('notes', e.target.value)}
                    placeholder="e.g. We're launching in Q3 and want certification before procurement season."
                    className="min-h-[60px]"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                <p className="text-xs text-muted-foreground">
                  By submitting you agree to a mutual NDA before any technical details are shared.
                </p>
                <Button onClick={submit} disabled={submitting} className="w-full sm:w-auto">
                  {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Submit inquiry
                </Button>
              </CardFooter>
            </>
          )}
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Prefer email? <a href="mailto:dan@lumeval.com?subject=AI%20MSK%20Certification%20%E2%80%94%20vendor%20inquiry" className="font-medium text-primary underline">dan@lumeval.com</a>
          </p>
        </div>
      </div>
    </section>
  )
}
