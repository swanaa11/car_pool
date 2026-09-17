# Supabase Setup — Step-by-Step

## 1. Create project
1. Go to https://supabase.com → New Project → name `carpool`, region `eu-central-1` (Frankfurt, GDPR-friendly), set DB password.
2. Wait for provisioning (~2 min).

## 2. Get keys
Project Settings → API → copy:
- `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` → `SUPABASE_SERVICE_ROLE_KEY` (server-only)
- Project Reference (from URL) → `SUPABASE_PROJECT_ID`

## 3. Configure Auth
- Authentication → Providers → enable Email, Google (add `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` from https://console.cloud.google.com), enable Magic Link if desired.
- Authentication → URL Configuration → Site URL = `http://localhost:3000` (local) + add production URL after Vercel deploy.
- Authentication → Email Templates → customize (optional, i18n).

## 4. Run migrations
**Option A — Supabase CLI (recommended):**
```bash
npm i -g supabase
supabase login
supabase link --project-ref <PROJECT_REF>
supabase db push   # applies supabase/migrations/*
```

**Option B — SQL Editor:**
Copy each file in `supabase/migrations/` and run in order in Dashboard → SQL Editor.

Verify: Table Editor shows `profiles`, `rides`, etc. Authentication → Users → triggers work.

## 5. Seed (optional, dev only)
Dashboard → SQL Editor → paste `supabase/seed/seed.sql` → Run.
Or locally: `supabase db reset` (applies migrations + seed).

## 6. Storage
Storage → Buckets → verify `avatars` and `vehicle-photos` exist (public). If not, run the `insert into storage.buckets` from `20250917000003_functions.sql`.

## 7. Realtime
Database → Realtime → enable for `messages` table (or all). Needed for chat.

## 8. RLS verification
Table Editor → try to read `profiles` as anon — should see only ACTIVE users. Test with different JWTs in API docs.

## 9. Env files
Root `.env.local` + `apps/web/.env.local` + `apps/mobile/.env.local` from `.env.example` templates.

## 10. Production hardening
- Enable MFA for Supabase dashboard?
- Rotate `service_role` if ever exposed.
- Set up backups (Supabase → Database → Backups).
- Enable `pg_stat_statements` for slow query analysis.
