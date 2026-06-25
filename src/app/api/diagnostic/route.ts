import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

interface InCase {
  caseRef: string
  bodyPart: string
  caseAgeDays: number
  bottleneck: string
}

// Bottleneck -> avoidable-day range [low, high]
const AVOIDABLE: Record<string, [number, number]> = {
  'imaging-ambiguity': [40, 70],
  'diagnostic-ambiguity': [30, 55],
  'wrong-pathway': [25, 45],
  'specialist-delay': [45, 90],
  'rehab-function': [20, 40],
  'admin-handoff': [15, 30],
  'exposure-protocol': [20, 35],
  'not-imaging': [10, 25],
}

export async function POST(req: Request) {
  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { clientHandle, reviewerEmail, cases } = body as {
    clientHandle: string
    reviewerEmail?: string
    cases: InCase[]
  }

  if (!clientHandle || !Array.isArray(cases) || cases.length === 0) {
    return NextResponse.json({ error: 'clientHandle and cases[] required' }, { status: 400 })
  }

  // Compute profile
  const profile: Record<string, number> = {}
  let low = 0
  let high = 0
  for (const c of cases) {
    profile[c.bottleneck] = (profile[c.bottleneck] || 0) + 1
    const range = AVOIDABLE[c.bottleneck] || [10, 20]
    low += range[0]
    high += range[1]
  }

  const exposureLow = low * 650
  const exposureHigh = high * 1100

  const totalOpenCases = cases.length
  const cases90to180 = cases.filter((c) => c.caseAgeDays >= 90 && c.caseAgeDays < 180).length
  const cases180Plus = cases.filter((c) => c.caseAgeDays >= 180).length
  const litigatedVisibilityOnly = 0

  try {
    const assessment = await db.diagnosticAssessment.create({
      data: {
        clientHandle,
        reviewerEmail: reviewerEmail || null,
        totalOpenCases,
        cases90to180,
        cases180Plus,
        litigatedVisibilityOnly,
        estAvoidableDaysLow: low,
        estAvoidableDaysHigh: high,
        estExposureLow: exposureLow,
        estExposureHigh: exposureHigh,
        profileJson: JSON.stringify(profile),
        cases: {
          create: cases.map((c) => ({
            caseRef: c.caseRef,
            bodyPart: c.bodyPart,
            caseAgeDays: c.caseAgeDays,
            bottleneck: c.bottleneck,
            status: 'open',
          })),
        },
      },
    })

    return NextResponse.json({
      ok: true,
      assessmentId: assessment.id,
      profile,
      avoidableDaysLow: low,
      avoidableDaysHigh: high,
      exposureLow,
      exposureHigh,
    })
  } catch (e) {
    console.error('[/api/diagnostic]', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function GET() {
  const recent = await db.diagnosticAssessment.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      clientHandle: true,
      totalOpenCases: true,
      estAvoidableDaysLow: true,
      estAvoidableDaysHigh: true,
      createdAt: true,
    },
  })
  return NextResponse.json({ assessments: recent })
}
