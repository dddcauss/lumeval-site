import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Public aggregate stats for the Lumeval Registry.
// Returns ONLY de-identified aggregate counts — no individual entries,
// no worker links, no PII. This powers the "Registry is growing" credibility
// signal on the employer view.

export async function GET() {
  try {
    const total = await db.registryEntry.count()

    // If no entries yet, return a clean zero-state so the UI can show
    // "Registry in formation" rather than misleading numbers.
    if (total === 0) {
      return NextResponse.json({
        total: 0,
        byBodyPart: {},
        bySector: {},
        byRegion: {},
        byAnswer: {},
        consentScopes: {},
        message: 'Registry in formation. First entries arrive with the first consented verdicts.',
      })
    }

    // Group by body part
    const byBodyPartRows = await db.registryEntry.groupBy({
      by: ['bodyPart'],
      _count: true,
      orderBy: { _count: { bodyPart: 'desc' } },
    })
    const byBodyPart: Record<string, number> = {}
    for (const r of byBodyPartRows) byBodyPart[r.bodyPart] = r._count

    // Group by sector
    const bySectorRows = await db.registryEntry.groupBy({
      by: ['sector'],
      _count: true,
      orderBy: { _count: { sector: 'desc' } },
    })
    const bySector: Record<string, number> = {}
    for (const r of bySectorRows) {
      const key = r.sector || 'Unspecified'
      bySector[key] = (bySector[key] || 0) + r._count
    }

    // Group by region
    const byRegionRows = await db.registryEntry.groupBy({
      by: ['region'],
      _count: true,
      orderBy: { _count: { region: 'desc' } },
    })
    const byRegion: Record<string, number> = {}
    for (const r of byRegionRows) {
      const key = r.region || 'Unspecified'
      byRegion[key] = (byRegion[key] || 0) + r._count
    }

    // Group by verdict answer (yes/no/partial)
    const byAnswerRows = await db.registryEntry.groupBy({
      by: ['answer'],
      _count: true,
    })
    const byAnswer: Record<string, number> = {}
    for (const r of byAnswerRows) byAnswer[r.answer] = r._count

    // Consent scope distribution
    const byScopeRows = await db.registryEntry.groupBy({
      by: ['consentScope'],
      _count: true,
    })
    const consentScopes: Record<string, number> = {}
    for (const r of byScopeRows) consentScopes[r.consentScope] = r._count

    return NextResponse.json({
      total,
      byBodyPart,
      bySector,
      byRegion,
      byAnswer,
      consentScopes,
    })
  } catch (e) {
    console.error('[/api/registry/stats]', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
