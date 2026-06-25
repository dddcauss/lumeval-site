import Link from 'next/link'
import { Activity } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 font-semibold">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Activity className="h-3.5 w-3.5" />
              </span>
              <span>Lumeval</span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              Worker-owned MSK verdicts. The Stuck-File Operating System. Physician-signed,
              governance-first infrastructure for the disability economy.
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              Opinions inform decisions — they never make them. No IMEs. No causation,
              compensability, entitlement, or fitness-for-duty determinations.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Product</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link href="#passport" className="hover:text-foreground">MSK Passport</Link></li>
              <li><Link href="#diagnostic" className="hover:text-foreground">Stuck-File Diagnostic</Link></li>
              <li><Link href="#verdict" className="hover:text-foreground">The Verdict</Link></li>
              <li><Link href="#proof" className="hover:text-foreground">Proof Test</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Contact</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><a href="mailto:dan@lumeval.com" className="hover:text-foreground">dan@lumeval.com</a></li>
              <li><Link href="#contact" className="hover:text-foreground">Book a call</Link></li>
              <li className="text-xs">Canada · Built for heavy industry</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border/60 pt-6 text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Lumeval. Founded by Dr. Dan Gill, MD, FRCPC — fellowship-trained
            MSK radiologist, ten-year Royal College examiner, Vancouver 2010 Olympic Games MSK imaging.
          </p>
        </div>
      </div>
    </footer>
  )
}
