import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { LumevalExperience } from '@/components/lumeval-experience'

export default function Home() {
  return (
    <div id="top" className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <LumevalExperience />
      </main>
      <SiteFooter />
    </div>
  )
}
