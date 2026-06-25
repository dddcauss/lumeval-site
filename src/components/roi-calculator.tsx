'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Calculator,
  TrendingDown,
  Clock,
  DollarSign,
  ArrowRight,
  RotateCcw,
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
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export function RoiCalculator() {
  const [numFiles, setNumFiles] = React.useState(14)
  const [avgAge, setAvgAge] = React.useState(150)
  const [costPerDay, setCostPerDay] = React.useState(800)

  // Blended avoidable-days-per-file range.
  // Weighted average across the 8-category taxonomy, biased toward the
  // imaging-ambiguity and diagnostic-ambiguity categories (the most common
  // stuckness drivers per Lumeval's taxonomy). Conservative.
  // Low: ~32 days/file. High: ~58 days/file.
  const AVOID_LOW_PER_FILE = 32
  const AVOID_HIGH_PER_FILE = 58

  const avoidLow = numFiles * AVOID_LOW_PER_FILE
  const avoidHigh = numFiles * AVOID_HIGH_PER_FILE
  const recoverLow = avoidLow * costPerDay
  const recoverHigh = avoidHigh * costPerDay

  // Proof test: 3 files for $1,500. ROI vs. recoverable on those 3 files.
  const proofCost = 1500
  const proofRecoverLow = 3 * AVOID_LOW_PER_FILE * costPerDay
  const proofRecoverHigh = 3 * AVOID_HIGH_PER_FILE * costPerDay
  const proofRoiLow = proofRecoverLow / proofCost
  const proofRoiHigh = proofRecoverHigh / proofCost

  const reset = () => {
    setNumFiles(14)
    setAvgAge(150)
    setCostPerDay(800)
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <Badge variant="secondary" className="w-fit">
          <Calculator className="mr-1.5 h-3.5 w-3.5" />
          ROI / Days-Saved Calculator
        </Badge>
        <CardTitle className="mt-2 text-2xl sm:text-3xl">
          What are your stuck MSK files actually costing you?
        </CardTitle>
        <CardDescription className="text-base">
          Three inputs. Thirty seconds. See the avoidable days and recoverable dollars
          sitting in your open MSK book — and what a $1,500 proof test returns.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* INPUTS */}
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="numFiles" className="flex items-center gap-1.5 text-xs">
              <Clock className="h-3.5 w-3.5" />
              Open MSK files (90+ days)
            </Label>
            <Input
              id="numFiles"
              type="number"
              min={1}
              max={500}
              value={numFiles}
              onChange={(e) => setNumFiles(Math.max(1, Number(e.target.value) || 0))}
            />
            <p className="text-xs text-muted-foreground">Lost-time MSK cases aged 90+ days</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="avgAge" className="flex items-center gap-1.5 text-xs">
              <Clock className="h-3.5 w-3.5" />
              Average case age (days)
            </Label>
            <Input
              id="avgAge"
              type="number"
              min={90}
              max={730}
              value={avgAge}
              onChange={(e) => setAvgAge(Math.max(90, Number(e.target.value) || 90))}
            />
            <p className="text-xs text-muted-foreground">How long files have been open</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="costPerDay" className="flex items-center gap-1.5 text-xs">
              <DollarSign className="h-3.5 w-3.5" />
              Cost per stuck day ($)
            </Label>
            <Input
              id="costPerDay"
              type="number"
              min={200}
              max={5000}
              step={50}
              value={costPerDay}
              onChange={(e) => setCostPerDay(Math.max(200, Number(e.target.value) || 200))}
            />
            <p className="text-xs text-muted-foreground">Modified duty + replacement labour</p>
          </div>
        </div>

        <Separator />

        {/* OUTPUTS */}
        <div className="grid gap-4 sm:grid-cols-3">
          <motion.div
            key={`avoid-${avoidLow}-${avoidHigh}`}
            initial={{ opacity: 0.6, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-lg border border-border/60 bg-secondary/30 p-4"
          >
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Avoidable days</p>
            </div>
            <p className="mt-1 text-2xl font-bold text-primary">
              {avoidLow.toLocaleString()}–{avoidHigh.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">across your open book</p>
          </motion.div>

          <motion.div
            key={`recover-${recoverLow}-${recoverHigh}`}
            initial={{ opacity: 0.6, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-lg border border-primary/30 bg-primary/5 p-4"
          >
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Recoverable $</p>
            </div>
            <p className="mt-1 text-2xl font-bold text-primary">
              ${(recoverLow / 1000).toFixed(0)}k–${(recoverHigh / 1000).toFixed(0)}k
            </p>
            <p className="mt-1 text-xs text-muted-foreground">if files move 32–58 days faster</p>
          </motion.div>

          <motion.div
            key={`roi-${proofRoiLow}-${proofRoiHigh}`}
            initial={{ opacity: 0.6, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-lg border border-border/60 bg-secondary/30 p-4"
          >
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-primary" />
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Proof test ROI</p>
            </div>
            <p className="mt-1 text-2xl font-bold text-primary">
              {proofRoiLow.toFixed(0)}×–{proofRoiHigh.toFixed(0)}×
            </p>
            <p className="mt-1 text-xs text-muted-foreground">$1,500 in → ${((proofRecoverLow / 1000)).toFixed(0)}k–${((proofRecoverHigh / 1000)).toFixed(0)}k out</p>
          </motion.div>
        </div>

        {/* THE MATH, EXPLAINED */}
        <div className="rounded-lg border border-dashed border-border/60 p-4 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">How we got there</p>
          <p className="mt-1">
            {numFiles} files × 32–58 avoidable days/file = <strong>{avoidLow.toLocaleString()}–{avoidHigh.toLocaleString()} days</strong>.
            At ${costPerDay.toLocaleString()}/day = <strong>${(recoverLow / 1000).toFixed(0)}k–${(recoverHigh / 1000).toFixed(0)}k recoverable</strong>.
            The 32–58 day range is a blended average across Lumeval&apos;s 8-category stuckness taxonomy
            (imaging ambiguity, diagnostic ambiguity, wrong pathway, specialist delay, rehab/function,
            admin handoff, exposure protocol, not-imaging). Run the full{' '}
            <a href="#diagnostic" className="text-primary underline">Stuck-File Diagnostic</a> for a
            case-by-case breakdown.
          </p>
        </div>

        {/* PROOF TEST CTA */}
        <div className="flex flex-col items-center gap-4 rounded-lg border border-primary/30 bg-primary/5 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="text-sm font-semibold">Test it for $1,500.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Your three oldest stuck MSK files. Three signed verdicts in five business days.
              If they don&apos;t move your thinking, we part friends.
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button asChild>
              <a href="#contact">
                Book the proof test <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={reset}>
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Reset
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Illustrative composite. Estimates blend conservatively. Actual results depend on case
          mix, jurisdiction, and client team execution. The SLA is on the verdict, not the outcome —
          files move faster only if the client&apos;s OH team acts on the verdict.
        </p>
      </CardContent>
    </Card>
  )
}
