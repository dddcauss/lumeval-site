'use client'

import * as React from 'react'
import { Database, Loader2, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface RegistryStats {
  total: number
  byBodyPart: Record<string, number>
  bySector: Record<string, number>
  byRegion: Record<string, number>
  byAnswer: Record<string, number>
  consentScopes: Record<string, number>
  message?: string
}

export function RegistryStatsWidget() {
  const [stats, setStats] = React.useState<RegistryStats | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false
    fetch('/api/registry/stats')
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setStats(d)
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (error || !stats) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          Registry stats temporarily unavailable.
        </CardContent>
      </Card>
    )
  }

  const topBodyParts = Object.entries(stats.byBodyPart)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
  const topSectors = Object.entries(stats.bySector)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4)

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          <div>
            <CardTitle className="text-lg">The Lumeval Registry</CardTitle>
            <CardDescription>
              The de-identified occupational-imaging dataset, built from consented verdicts.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {stats.total === 0 ? (
          <div className="rounded-lg border border-dashed border-border/60 p-6 text-center">
            <Database className="mx-auto h-8 w-8 text-muted-foreground/50" />
            <p className="mt-2 text-sm font-medium">Registry in formation</p>
            <p className="mt-1 text-xs text-muted-foreground">
              First entries arrive with the first consented verdicts. Every worker who opts in
              contributes a de-identified copy — building the dataset nobody else has.
            </p>
          </div>
        ) : (
          <>
            {/* Headline number */}
            <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 p-4">
              <TrendingUp className="h-6 w-6 text-primary" />
              <div>
                <p className="text-2xl font-bold text-primary">{stats.total.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">
                  de-identified entries · growing with every consented verdict
                </p>
              </div>
            </div>

            {/* Breakdowns */}
            <div className="grid gap-4 sm:grid-cols-2">
              {topBodyParts.length > 0 && (
                <div>
                  <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
                    By body part
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {topBodyParts.map(([part, count]) => (
                      <Badge key={part} variant="secondary">
                        {part}: {count}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {topSectors.length > 0 && (
                <div>
                  <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
                    By sector
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {topSectors.map(([sector, count]) => (
                      <Badge key={sector} variant="outline">
                        {sector}: {count}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        <p className="text-xs text-muted-foreground">
          The Registry is the bridge: today it powers research and AI validation; tomorrow it
          powers the occupational risk-intelligence platform. Worker-owned consent, de-identified
          by design, OCAP-aligned where applicable.
        </p>
      </CardContent>
    </Card>
  )
}
