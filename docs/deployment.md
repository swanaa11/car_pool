# Deployment — Vercel (Web)

## Prerequisites
- Supabase project created (see `supabase-setup.md`)
- GitHub repo pushed
- Vercel account (free tier OK)

## Steps — Correct Root Directory is critical for pnpm monorepo

> **For this repository `vercel.json` is already configured for the repository root.** Choose **one** of the two setups — do not mix them:

**Recommended (monorepo root, simplest):**
1. **Connect repo:** Vercel → Add New Project → Import `swanaa11/car_pull` → Framework Preset: Next.js → **Root Directory: leave empty** (click Edit but keep it blank / `.`) → Vercel will use the root `vercel.json`:
   - Build Command `pnpm --filter web build`
   - Output Directory `apps/web/.next`
   - Install Command `pnpm install`

**Alternative (if you prefer per-app Root Directory):**
- Set Root Directory → `apps/web` → then you **must** override in Vercel Project Settings → Build & Development Settings to:
  - Build Command `pnpm build` (or `cd ../.. && pnpm --filter web build`)
  - Output Directory `.next`
  - Install Command `cd ../.. && pnpm install`
- And delete or update the root `vercel.json` to `{"framework":"nextjs","regions":["fra1"]}`. Otherwise you’ll see `apps/web/.next was not found at /vercel/path0/apps/web/apps/web/.next` (double nesting).

> **If you already deployed with Root Directory `apps/web` and got `apps/web/.next was not found at /vercel/path0/apps/web/apps/web/.next`:** Go to Vercel → Project → Settings → General → Root Directory → **Edit → clear the field (empty)** → Save → Redeploy. Or keep `apps/web` but change `vercel.json` outputDirectory to `.next` and buildCommand to `pnpm build`.
3. **Env vars (Production + Preview):**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon>
   SUPABASE_SERVICE_ROLE_KEY=<service_role>  # server-only, if needed
   NEXT_PUBLIC_APP_URL=https://your-vercel-url.vercel.app
   NEXT_PUBLIC_DEFAULT_LOCALE=de
   MAP_PROVIDER=maplibre
   ```
   Never put `SUPABASE_SERVICE_ROLE_KEY` in `NEXT_PUBLIC_*`.
4. **Deploy:** Deploy → Vercel builds and assigns URL. Preview deployments on every PR automatically.
5. **Verify:** Visit URL → landing loads, `/api/health` returns `{status:"ok"}`, search works (seeded rides if DB seeded).
6. **Custom domain (optional):** Vercel → Settings → Domains → add `carpull.de` → update DNS.
7. **Supabase Auth redirect:** In Supabase Dashboard → Auth → URL Configuration → add `https://your-vercel-url.vercel.app` and `https://carpull.de` to Redirect URLs + Site URL.

## Environment handling
- `.env.local` for local, Vercel env dashboard for cloud. `vercel env pull` syncs if needed.
- All secrets via env vars, not committed.

## Caching
- Geocode route uses `next: { revalidate: 3600 }`.
- Static pages (how-it-works, safety, etc.) are statically generated.

## Troubleshooting
- `NEXT_PUBLIC_SUPABASE_URL` missing → Supabase client throws; check Vercel logs.
- RLS blocking reads → check Supabase → Table Editor → verify policies.
