# Lumeval — Deployment Guide

> Step-by-step: take this repo from GitHub to lumeval.com running on Vercel with managed Postgres.

**Estimated time:** 30 min – 2 hours (mostly DNS propagation waiting).

---

## Prerequisites

- A GitHub account
- A Vercel account (free tier works) — [vercel.com](https://vercel.com)
- A Postgres database (free tier works) — recommended: [Neon](https://neon.tech) (free, generous, fast)
- Access to the DNS registrar where `lumeval.com` is registered (GoDaddy, Namecheap, Cloudflare, etc.)
- This repo pushed to GitHub

---

## Step 1 — Push the code to GitHub

```bash
# In the project root
git init
git add .
git commit -m "Lumeval — three-surface production build"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/lumeval.git
git push -u origin main
```

Make the repo **private** (it contains your business logic). Vercel deploys private repos fine on the free tier.

**Verify:** `.env` is NOT committed (it's in `.gitignore`). Only `.env.example` is committed (no real secrets).

---

## Step 2 — Provision a Postgres database (Neon)

1. Go to [neon.tech](https://neon.tech) → Sign up (free)
2. Create a new project → name it `lumeval`
3. Select region closest to your users (e.g. `US East` for North America)
4. Copy the **connection string** — looks like:
   ```
   postgresql://lumeval_owner:AbCdEf12345@ep-cool-name-12345.us-east-2.aws.neon.tech/lumeval?sslmode=require
   ```
5. Save this somewhere safe. You'll paste it into Vercel in Step 4.

**Why Neon:** Free tier (0.5 GB storage, generous compute), branching for dev/prod, fast cold starts, built for serverless. Alternatives that also work: Supabase, Vercel Postgres, Railway.

---

## Step 3 — Switch the schema to Postgres

Before deploying, switch the Prisma schema from SQLite (local dev) to PostgreSQL (production):

```bash
# Replace the active schema with the Postgres version
cp prisma/schema.postgres.prisma prisma/schema.prisma

# Commit the change
git add prisma/schema.prisma
git commit -m "Switch to Postgres for production"
git push
```

**Verify:** `prisma/schema.prisma` now has `provider = "postgresql"` at the top.

---

## Step 4 — Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → Sign up / log in with GitHub
2. Click **"Add New…"** → **"Project"**
3. Import your `lumeval` repo from GitHub
4. Vercel auto-detects Next.js — leave the Build & Output Settings as defaults
5. **Before clicking Deploy**, expand **"Environment Variables"** and add:

   | Name | Value |
   |------|-------|
   | `DATABASE_URL` | (paste your Neon connection string from Step 2) |
   | `NEXTAUTH_SECRET` | (generate with `openssl rand -base64 32` in your terminal) |
   | `NEXTAUTH_URL` | `https://lumeval.com` (or your Vercel URL for now) |

6. Click **"Deploy"**. Build takes ~2 minutes.
7. You'll get a URL like `lumeval-xxx.vercel.app`. **Click it** — verify the site loads.

**If the build fails:** Check the Vercel build logs. Most common issue: Prisma can't connect to Postgres. Verify `DATABASE_URL` is set correctly with `?sslmode=require` at the end.

---

## Step 5 — Create the database tables

After the first deploy, the Postgres database is empty. You need to create the tables.

**Option A — From your local machine (recommended):**
```bash
# In the project root, with the Postgres schema active
# Temporarily point your local .env at the production database
# (Edit .env to have DATABASE_URL="postgresql://...your-neon-url...")

bun run db:push

# This creates all tables in your Neon Postgres database.
# Verify in the Neon dashboard that tables appear: Worker, Verdict, ConsentGrant,
# DiagnosticAssessment, DiagnosticCase, VendorInquiry

# IMPORTANT: Revert .env back to SQLite for local dev afterward:
# DATABASE_URL=file:./dev.db
```

**Option B — Via a Vercel-cron or one-off script:** More complex, ask a developer.

**Verify:** Visit `https://your-vercel-url.vercel.app/`, create a Passport, and confirm the verdict appears. If it does, the database is connected.

---

## Step 6 — Connect lumeval.com

1. In your Vercel project → **Settings** → **Domains**
2. Enter `lumeval.com` → click **Add**
3. Vercel shows you DNS records to add. Typically:
   - **A record:** `@ → 76.76.21.21` (Vercel's IP)
   - **CNAME record:** `www → cname.vercel-dns.com`
4. **Go to your domain registrar** (where you bought lumeval.com):
   - Find DNS management / DNS settings
   - Add the A record for the apex domain (`@`)
   - Add the CNAME record for `www`
   - Save
5. Back in Vercel, mark the domain as "Valid" once DNS propagates (usually 5–30 min, can take up to 24 hrs)
6. Vercel automatically provisions an SSL certificate — HTTPS is automatic

**Verify:** After DNS propagates, visit `https://lumeval.com` — your new site loads with a valid SSL certificate.

---

## Step 7 — Redirect www to apex (or vice versa)

In Vercel → Settings → Domains:
- Add both `lumeval.com` and `www.lumeval.com`
- Set `lumeval.com` as the primary
- Vercel automatically redirects `www.lumeval.com` → `lumeval.com`

Users can type either; they end up at the apex with HTTPS.

---

## Step 8 — Back up the old lumeval.com (do this BEFORE DNS switch)

Before you point lumeval.com at Vercel, capture the current site:

1. **Screenshot every page** of the existing lumeval.com
2. **Save the HTML** (browser → Save Page As → Complete)
3. **Copy all copy** into a Google Doc for reference
4. **Note any indexed URLs** (search `site:lumeval.com` on Google) — if there are pages with traffic, set up 301 redirects in `next.config.ts` so you don't lose SEO

If anything goes wrong with the new deploy, you can revert the DNS to point back at the old host.

---

## Step 9 — Verify everything

Go to `https://lumeval.com` and test:

- [ ] Home page loads (Employer view default)
- [ ] Click "Workers" tab → worker view loads
- [ ] Click "AI Vendors" tab → vendor view loads
- [ ] Run the Stuck-File Diagnostic → generates a profile
- [ ] Create a Passport → seeded verdict appears
- [ ] Grant access → grant appears, revoke works
- [ ] Submit a vendor inquiry → "Inquiry received" success message
- [ ] Mobile responsive (open on phone or use browser dev tools)
- [ ] Footer sticks to bottom on short pages, pushes down on long pages

---

## Post-deploy checklist

- [ ] **Vercel Analytics** — auto-enabled. View at vercel.com → your project → Analytics tab
- [ ] **Set up a contact email handler** (optional) — the forms currently use `mailto:` links. If you want form submissions to email you automatically, wire up [Resend](https://resend.com) (free tier) — add `RESEND_API_KEY` env var and update the API routes to send email.
- [ ] **Add real authentication** (before enrolling real workers) — integrate NextAuth.js with email magic links or a real provider. The current SHA-256 passphrase is prototype-only.
- [ ] **Submit sitemap to Google** — after deploy, submit `https://lumeval.com/sitemap.xml` to Google Search Console
- [ ] **Set up error monitoring** (optional) — [Sentry](https://sentry.io) free tier catches production errors

---

## Troubleshooting

### Build fails on Vercel
- Check build logs in Vercel dashboard
- Most common: Prisma client not generated. Vercel should auto-run `prisma generate` via the `postinstall` script. If not, add `"postinstall": "prisma generate"` to `package.json` scripts.

### Database connection errors
- Verify `DATABASE_URL` is set in Vercel env vars (Settings → Environment Variables)
- Verify the connection string has `?sslmode=require` (Neon requires SSL)
- Verify you ran `bun run db:push` against the production database (Step 5)

### Site loads but interactive features don't work
- Open browser dev tools → Console tab — look for errors
- Most common: API routes return 500 because database tables don't exist. Re-run Step 5.
- Second most common: `DATABASE_URL` not set in Vercel → API routes can't connect

### DNS not propagating
- DNS changes can take 5 min – 24 hrs. Check propagation at [whatsmydns.net](https://whatsmydns.net)
- Make sure you added BOTH the A record (apex) and CNAME (www) at your registrar
- Cloudflare users: set the records to "DNS only" (grey cloud), not "Proxied" (orange cloud), during setup

### Domain shows "Invalid Configuration" in Vercel
- Usually means DNS hasn't propagated yet. Wait 30 min and refresh.
- Or the DNS records are wrong at your registrar. Double-check against what Vercel showed you.

---

## Rollback plan

If the new site breaks and you need to revert to the old lumeval.com:

1. **DNS rollback** — at your registrar, revert the DNS records to point at your old host. Takes 5 min – 24 hrs to propagate.
2. **Vercel rollback** — in Vercel → Deployments tab, click the "…" on any previous successful deploy → "Promote to Production". Instant.

Your old lumeval.com hosting should stay active for at least 2 weeks after the switch, just in case.

---

## Questions?

Email dan@lumeval.com — or file an issue in the GitHub repo.

---

*Last updated: June 2026. Update this guide as the deployment process evolves.*
