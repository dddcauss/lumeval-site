import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import crypto from 'crypto'

const SAMPLE_VERDICT = {
  bodyPart: 'Lumbar spine',
  modality: 'MRI',
  questionAsked:
    'Does the imaging finding explain the current restrictions — yes or no?',
  answer: 'no',
  finding:
    'L4-5 disc protrusion with moderate degenerative change — a common, frequently asymptomatic pattern in working-age adults.',
  nextStep:
    'Duty-progression planning meeting between the OH team and supervisor; imaging does not need to be repeated before that conversation.',
  signedBy: 'Dr. Dan Gill, MD, FRCPC',
  limitation:
    'This opinion provides imaging interpretation and clinical-pathway information only. All return-to-work, duty, and claim decisions remain with the client\u2019s responsible clinicians and decision-makers.',
}

function hash(p: string) {
  return crypto.createHash('sha256').update(p).digest('hex')
}

// Check if a worker has active (non-revoked) registry consent.
function hasActiveConsent(worker: {
  registryConsentGrantedAt: Date | null
  registryConsentRevokedAt: Date | null
}): boolean {
  if (!worker.registryConsentGrantedAt) return false
  if (worker.registryConsentRevokedAt && worker.registryConsentRevokedAt > worker.registryConsentGrantedAt) return false
  return true
}

// Create a de-identified RegistryEntry from a verdict, IF the worker has
// active consent. This is the bridge from verdict business to platform.
// NO workerId is stored on the registry entry — that's the privacy guarantee.
async function maybeCreateRegistryEntry(
  worker: {
    id: string
    region: string | null
    sector: string | null
    registryConsentGrantedAt: Date | null
    registryConsentRevokedAt: Date | null
    registryConsentScope: string | null
  },
  verdict: {
    bodyPart: string
    modality: string
    questionAsked: string
    answer: string
    finding: string
    nextStep: string
    signedBy: string
    signedAt: Date
  }
): Promise<boolean> {
  if (!hasActiveConsent(worker)) return false
  if (!worker.registryConsentScope) return false

  await db.registryEntry.create({
    data: {
      bodyPart: verdict.bodyPart,
      modality: verdict.modality,
      questionAsked: verdict.questionAsked,
      answer: verdict.answer,
      finding: verdict.finding,
      nextStep: verdict.nextStep,
      signedBy: verdict.signedBy,
      signedAt: verdict.signedAt,
      region: worker.region,
      sector: worker.sector,
      // caseAgeDays + bottleneckCategory would be set in a real workflow
      // when the verdict is tied to a stuck-file case. For now, null.
      caseAgeDays: null,
      bottleneckCategory: null,
      consentScope: worker.registryConsentScope,
    },
  })
  return true
}

export async function POST(req: Request) {
  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { action } = body

  try {
    // ---------- SIGNUP ----------
    if (action === 'signup') {
      const { handle, pass, registryConsent, consentScope } = body
      if (!handle || !pass) {
        return NextResponse.json({ error: 'Handle and passphrase required' }, { status: 400 })
      }
      const existing = await db.worker.findUnique({ where: { handle } })
      if (existing) {
        return NextResponse.json({ error: 'Handle already taken' }, { status: 409 })
      }
      const now = new Date()
      const worker = await db.worker.create({
        data: {
          handle,
          passHash: hash(pass),
          region: 'Canada',
          sector: 'Mining / heavy industry',
          // Capture registry consent at signup if granted
          registryConsentGrantedAt: registryConsent ? now : null,
          registryConsentRevokedAt: null,
          registryConsentScope: registryConsent ? (consentScope || 'research') : null,
        },
      })
      // Seed sample verdict
      const seededVerdict = await db.verdict.create({
        data: {
          workerId: worker.id,
          ...SAMPLE_VERDICT,
        },
      })
      // If worker consented at signup, the seeded sample verdict also goes
      // into the registry (as a demonstration entry — clearly synthetic).
      if (registryConsent) {
        await maybeCreateRegistryEntry(worker, {
          bodyPart: SAMPLE_VERDICT.bodyPart,
          modality: SAMPLE_VERDICT.modality,
          questionAsked: SAMPLE_VERDICT.questionAsked,
          answer: SAMPLE_VERDICT.answer,
          finding: SAMPLE_VERDICT.finding,
          nextStep: SAMPLE_VERDICT.nextStep,
          signedBy: SAMPLE_VERDICT.signedBy,
          signedAt: seededVerdict.signedAt,
        })
      }
      const verdicts = await db.verdict.findMany({ where: { workerId: worker.id }, orderBy: { signedAt: 'desc' } })
      return NextResponse.json({
        ok: true,
        verdicts,
        grants: [],
        registryConsent: {
          granted: !!registryConsent,
          scope: registryConsent ? (consentScope || 'research') : null,
          grantedAt: registryConsent ? now.toISOString() : null,
        },
      })
    }

    // ---------- LOGIN ----------
    if (action === 'login') {
      const { handle, pass } = body
      const worker = await db.worker.findUnique({ where: { handle } })
      if (!worker || worker.passHash !== hash(pass)) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }
      const verdicts = await db.verdict.findMany({ where: { workerId: worker.id }, orderBy: { signedAt: 'desc' } })
      const grants = await db.consentGrant.findMany({ where: { workerId: worker.id }, orderBy: { createdAt: 'desc' } })
      return NextResponse.json({
        ok: true,
        verdicts,
        grants,
        registryConsent: {
          granted: hasActiveConsent(worker),
          scope: worker.registryConsentScope,
          grantedAt: worker.registryConsentGrantedAt?.toISOString() || null,
          revokedAt: worker.registryConsentRevokedAt?.toISOString() || null,
        },
      })
    }

    // ---------- ADD VERDICT ----------
    if (action === 'add-verdict') {
      const { handle, pass, verdict } = body
      const worker = await db.worker.findUnique({ where: { handle } })
      if (!worker || worker.passHash !== hash(pass)) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }
      const created = await db.verdict.create({
        data: {
          workerId: worker.id,
          bodyPart: verdict.bodyPart,
          modality: verdict.modality,
          questionAsked: verdict.questionAsked,
          answer: verdict.answer,
          finding: verdict.finding,
          nextStep: verdict.nextStep,
          signedBy: 'Dr. Dan Gill, MD, FRCPC',
          limitation: SAMPLE_VERDICT.limitation,
        },
      })
      // Bridge to platform: if worker has active consent, a de-identified
      // copy goes into the registry. No workerId link.
      const addedToRegistry = await maybeCreateRegistryEntry(worker, {
        bodyPart: created.bodyPart,
        modality: created.modality,
        questionAsked: created.questionAsked,
        answer: created.answer,
        finding: created.finding,
        nextStep: created.nextStep,
        signedBy: created.signedBy,
        signedAt: created.signedAt,
      })
      return NextResponse.json({ ok: true, verdict: created, addedToRegistry })
    }

    // ---------- GRANT REGISTRY CONSENT ----------
    if (action === 'grant-consent') {
      const { handle, pass, scope } = body
      const worker = await db.worker.findUnique({ where: { handle } })
      if (!worker || worker.passHash !== hash(pass)) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }
      const updated = await db.worker.update({
        where: { id: worker.id },
        data: {
          registryConsentGrantedAt: new Date(),
          registryConsentRevokedAt: null, // clear any prior revocation
          registryConsentScope: scope || 'research',
        },
      })
      return NextResponse.json({
        ok: true,
        registryConsent: {
          granted: true,
          scope: updated.registryConsentScope,
          grantedAt: updated.registryConsentGrantedAt?.toISOString(),
          revokedAt: null,
        },
      })
    }

    // ---------- REVOKE REGISTRY CONSENT ----------
    if (action === 'revoke-consent') {
      const { handle, pass } = body
      const worker = await db.worker.findUnique({ where: { handle } })
      if (!worker || worker.passHash !== hash(pass)) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }
      await db.worker.update({
        where: { id: worker.id },
        data: {
          registryConsentRevokedAt: new Date(),
        },
      })
      // NOTE: existing registry entries are NOT deleted. They are de-identified
      // (no workerId link) and were contributed under a valid consent at the
      // time. This is the standard de-identified research approach. Revoking
      // stops FUTURE contributions.
      return NextResponse.json({
        ok: true,
        registryConsent: {
          granted: false,
          scope: worker.registryConsentScope,
          grantedAt: worker.registryConsentGrantedAt?.toISOString(),
          revokedAt: new Date().toISOString(),
        },
      })
    }

    // ---------- GRANT ACCESS (employer/insurer) ----------
    if (action === 'grant') {
      const { handle, pass, grant } = body
      const worker = await db.worker.findUnique({ where: { handle } })
      if (!worker || worker.passHash !== hash(pass)) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }
      const expiresAt = new Date(Date.now() + (grant.days || 30) * 24 * 60 * 60 * 1000)
      const created = await db.consentGrant.create({
        data: {
          workerId: worker.id,
          granteeType: grant.granteeType,
          granteeName: grant.granteeName,
          scope: grant.scope || 'verdicts',
          expiresAt,
        },
      })
      return NextResponse.json({ ok: true, grant: created })
    }

    // ---------- REVOKE ACCESS ----------
    if (action === 'revoke') {
      const { handle, pass, grantId } = body
      const worker = await db.worker.findUnique({ where: { handle } })
      if (!worker || worker.passHash !== hash(pass)) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }
      await db.consentGrant.update({
        where: { id: grantId },
        data: { revokedAt: new Date() },
      })
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (e) {
    console.error('[/api/passport]', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
