'use client'

import * as React from 'react'
import Link from 'next/link'
import { Activity, Menu, Moon, Sun, Building2, User, Cpu } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from '@/components/ui/sheet'
import { useViewStore, ACTIVE_VIEWS, type View } from '@/lib/view-store'
import { cn } from '@/lib/utils'

const EMPLOYER_NAV = [
  { href: '#roi', label: 'ROI' },
  { href: '#diagnostic', label: 'Diagnostic' },
  { href: '#verdict', label: 'The Verdict' },
  { href: '#doors', label: "Who it's for" },
  { href: '#proof', label: 'Pricing' },
  { href: '#founder', label: 'Founder' },
  { href: '#contact', label: 'Contact' },
]

const WORKER_NAV = [
  { href: '#what-it-is', label: 'What it is' },
  { href: '#passport', label: 'Your Passport' },
  { href: '#protects', label: 'How it protects you' },
  { href: '#rights', label: 'Your rights' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contact', label: 'Contact' },
]

const VENDOR_NAV = [
  { href: '#standard', label: 'The Standard' },
  { href: '#why', label: 'Why it matters' },
  { href: '#process', label: 'Process' },
  { href: '#examiner', label: 'The Examiner' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
  { href: '#intake', label: 'Submit' },
]

const VIEW_META: Record<View, { label: string; sub: string; icon: React.ElementType }> = {
  employer: { label: 'Employers', sub: '/ for employers', icon: Building2 },
  worker: { label: 'Workers', sub: '/ for workers', icon: User },
  'ai-vendor': { label: 'AI Vendors', sub: '/ for AI vendors', icon: Cpu },
}

export function SiteHeader() {
  const { theme, setTheme } = useTheme()
  const { view, setView } = useViewStore()
  const [mounted, setMounted] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const nav = view === 'employer' ? EMPLOYER_NAV : view === 'worker' ? WORKER_NAV : VENDOR_NAV
  const meta = VIEW_META[view]

  const switchView = (v: View) => {
    setView(v)
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        {/* Logo + brand */}
        <Link href="#top" className="flex shrink-0 items-center gap-2 font-semibold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Activity className="h-4 w-4" />
          </span>
          <span className="text-lg">Lumeval</span>
          <span className="hidden text-xs text-muted-foreground lg:inline">{meta.sub}</span>
        </Link>

        {/* Visible 3-way segmented audience toggle (desktop) */}
        <div className="hidden flex-1 items-center justify-center md:flex">
          <div
            role="tablist"
            aria-label="Audience"
            className="flex items-center rounded-lg border border-border/60 p-0.5"
          >
            {ACTIVE_VIEWS.map((v) => {
              const m = VIEW_META[v]
              const Icon = m.icon
              const active = view === v
              return (
                <button
                  key={v}
                  role="tab"
                  aria-selected={active}
                  onClick={() => switchView(v)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                    active
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{m.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Theme toggle + CTA + mobile menu */}
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {mounted && theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {view === 'employer' && (
            <Button asChild size="sm" className="hidden xl:inline-flex">
              <Link href="#diagnostic">Run the Diagnostic</Link>
            </Button>
          )}
          {view === 'worker' && (
            <Button asChild size="sm" className="hidden xl:inline-flex">
              <Link href="#passport">Create your Passport</Link>
            </Button>
          )}
          {view === 'ai-vendor' && (
            <Button asChild size="sm" className="hidden xl:inline-flex">
              <Link href="#intake">Submit your product</Link>
            </Button>
          )}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="text-left">Lumeval</SheetTitle>
              </SheetHeader>
              {/* Mobile: visible 3-way segmented toggle */}
              <div className="mt-4 space-y-1" role="tablist" aria-label="Audience">
                {ACTIVE_VIEWS.map((v) => {
                  const m = VIEW_META[v]
                  const Icon = m.icon
                  const active = view === v
                  return (
                    <button
                      key={v}
                      role="tab"
                      aria-selected={active}
                      onClick={() => switchView(v)}
                      className={cn(
                        'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                        active
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-accent'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {m.label}
                    </button>
                  )
                })}
              </div>
              <nav className="mt-4 flex flex-col gap-1">
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Section nav — second row, desktop only */}
      <div className="hidden border-t border-border/40 bg-background/60 lg:block">
        <div className="mx-auto flex max-w-7xl items-center gap-1 px-4 sm:px-6 lg:px-8">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}
