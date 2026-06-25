# Lumeval

> The missing signature. The worker-owned record. The category no one owns.

Lumeval is a fellowship-trained MSK radiologist's signature, delivered as a one-page verdict on stuck workers'-comp MSK files, in five business days — with a worker-owned Passport as a byproduct, and the Lumeval Standard certifying AI MSK imaging products.

**Founder:** Dr. Dan Gill, MD, FRCPC — fellowship-trained MSK radiologist, ten-year Royal College examiner, Vancouver 2010 Olympic Games MSK imaging physician.

---

## Three surfaces, one site

The site has three audience-specific views, toggled via a visible segmented control in the header:

1. **Employers & Insurers** — the verdict business. Stuck-File Diagnostic (8-category classifier), ROI calculator, sample verdict, pricing, three buyer doors (OH firms, insurers, mining).
2. **Workers** — the MSK Passport. Worker-owned verdict vault with consent-governed employer/insurer access. Create a Passport, see a seeded verdict, grant/revoke access.
3. **AI Vendors** — the Lumeval Standard. Clinical-accuracy certification for AI MSK imaging products. Vendor intake form, process, pricing, examiner credibility.

## Tech stack

- **Framework:** Next.js 16 (App Router) + TypeScript 5
- **Styling:** Tailwind CSS 4 + shadcn/ui (New York style)
- **Database:** Prisma ORM (SQLite for local dev; PostgreSQL for production)
- **Animations:** Framer Motion
- **State:** Zustand (view toggle), React state (interactive components)
- **Analytics:** Vercel Analytics
- **Auth:** SHA-256 passphrase hashing (prototype — upgrade to NextAuth before real worker data)

## Project structure

```
src/
├── app/
│   ├── api/
│   │   ├── diagnostic/route.ts      # Stuck-File Diagnostic API
│   │   ├── passport/route.ts        # MSK Passport API (signup/login/verdict/grant)
│   │   └── vendor-inquiry/route.ts  # AI vendor certification intake API
│   ├── globals.css                  # Tailwind + brand theme (emerald)
│   ├── layout.tsx                   # Root layout (ThemeProvider, Toaster, Analytics)
│   └── page.tsx                     # Single route — renders LumevalExperience
├── components/
│   ├── ui/                          # shadcn/ui primitives
│   ├── site-header.tsx              # Sticky header + 3-way audience toggle + section nav
│   ├── site-footer.tsx              # Sticky footer
│   ├── lumeval-experience.tsx       # View switcher (employer/worker/ai-vendor)
│   ├── ai-vendor-view.tsx           # The Lumeval Standard surface
│   ├── roi-calculator.tsx           # ROI / Days-Saved Calculator
│   ├── stuck-file-diagnostic.tsx    # 8-category classifier
│   ├── passport-demo.tsx            # MSK Passport interactive demo
│   └── theme-provider.tsx           # next-themes wrapper
└── lib/
    ├── db.ts                        # Prisma client singleton
    ├── utils.ts                     # cn() helper
    └── view-store.ts                # Zustand store for audience toggle
prisma/
├── schema.prisma                    # SQLite (local dev)
└── schema.postgres.prisma           # PostgreSQL (production)
```

## Local development

```bash
# Install dependencies
bun install

# Set up the database (SQLite, creates db/custom.db)
bun run db:push

# Start the dev server (port 3000)
bun run dev
```

Open http://localhost:3000.

## Production deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for the full step-by-step guide (Vercel + Postgres + DNS).

Quick summary:
1. Push this repo to GitHub
2. Import into Vercel
3. Provision a Postgres database (Neon / Supabase / Vercel Postgres)
4. Switch schema to Postgres (`cp prisma/schema.postgres.prisma prisma/schema.prisma`)
5. Set `DATABASE_URL` in Vercel env vars
6. Run `bun run db:push` against production DB
7. Add `lumeval.com` domain in Vercel, update DNS at registrar

## The Lumeval Brain

See **[LUMEVAL_BRAIN.md](./LUMEVAL_BRAIN.md)** — the persistent context document. Feed it to any AI at the start of a session to start at 80% understanding instead of 0%. Contains: business model, ICP, 8-category taxonomy, verdict template, boundaries charter, 12 objections + rebuttals, competitor map, regulatory constraints, the brutal tear-apart, pricing, and how to use the document.

## Boundaries (non-negotiable)

- No IMEs. No causation, compensability, entitlement, or fitness-for-duty determinations.
- No claim acceptance or denial.
- No employer access to individual worker medical information.
- AI assists, physician signs — every verdict.
- "Opinions inform decisions — they never make them."

---

© Lumeval. Founded by Dr. Dan Gill, MD, FRCPC.
