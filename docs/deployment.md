# Deployment — Vercel (Web)

## Prerequisites
- Supabase project created (see `supabase-setup.md`)
- GitHub repo pushed
- Vercel account (free tier OK)

## Steps — Use Root Directory `apps/web` (fixes "No Next.js version detected")

> **This repository is a pnpm + Turborepo monorepo. Vercel must see `apps/web/package.json` to detect Next.js.** The root `vercel.json` is now configured for **Root Directory `apps/web`**.

**Do this once:**
1. **Connect repo:** Vercel → Add New Project → Import `swanaa11/car_pull` → Framework Preset: Next.js → **Root Directory: `apps/web`** (click Edit → type `apps/web`)
2. Vercel will read the root `vercel.json`:
   ```json
   {
     "framework": "nextjs",
     "installCommand": "cd ../.. && pnpm install",
     "buildCommand": "cd ../.. && pnpm --filter web build",
     "outputDirectory": ".next",
     "regions": ["fra1"]
   }
   ```
   It installs from the repository root (`cd ../.. && pnpm install` handles the `pnpm-workspace.yaml`), then builds only `web` (`pnpm --filter web build`), and looks for `.next` inside `apps/web` (correct: `/vercel/path0/apps/web/.next`).

**If you previously set Root Directory to empty and got `No Next.js version detected`:** That’s because the repository root `package.json` has no `next` — Vercel looks at `package.json` in the Root Directory to detect the framework. Set it to `apps/web` (where `next` lives) and redeploy.

**If you previously had `apps/web/.next was not found at /vercel/path0/apps/web/apps/web/.next`:** You had `outputDirectory: apps/web/.next` together with Root Directory `apps/web` (double nesting). The new `vercel.json` fixes this to `outputDirectory: .next` with `cd ../..` install/build.

**Alternative (Root Directory empty):** Leave Root Directory empty and change `vercel.json` to `{"buildCommand":"pnpm --filter web build","outputDirectory":"apps/web/.next","installCommand":"pnpm install"}` — but then you must add `"next":"14.2.15"` to the root `package.json` devDependencies so Vercel detects Next.js, which is not recommended.
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
