# Security — CarPull

## Auth
- Supabase Auth (JWT, httpOnly cookies via `@supabase/ssr`).
- Email/password, magic link, Google OAuth. Password reset via `resetPasswordForEmail`.
- `handle_new_user()` trigger creates `profiles` row on signup.
- `SUPABASE_SERVICE_ROLE_KEY` never exposed to client — only server routes / Edge Functions.

## RLS
Enabled on all tables (see `database.md`). Verified flows:
- Users can only update own profile (except role/state/rating).
- Messages scoped to ride participants.
- Admin data only for `is_admin()`.

## RBAC
`profiles.role` in `USER | MODERATOR | ADMIN`. Enforced in RLS + in `admin/page.tsx` server check.

## Rate limiting
- `packages/utils/src/rateLimit.ts` (in-memory token bucket) + `apps/web/src/lib/rateLimit.ts` for API routes.
- Covers login, signup, ride creation, search, messages (see `api/maps/geocode` example).
- For distributed prod, replace with Upstash Redis / Vercel KV (documented extension point).

## Validation
Shared Zod schemas in `packages/validation` — used client + server. Never trust client alone.

## XSS / Injection
- React escapes by default. No `dangerouslySetInnerHTML` with user data.
- SQL via Supabase client (parameterized) + RPC functions (definer, controlled inputs).

## Privacy / GDPR
- Data minimization: only required fields.
- Precise addresses not exposed — `origin_label` is user-provided label (e.g., "Berlin Hbf"), not exact home address.
- Account deletion: set `profiles.state='DELETED'` via service role + purge related data per retention policy (see `germany-launch-checklist.md`).
- Data export: query `profiles`, `rides`, `bookings`, `messages` for subject (extension point: `/api/export`).
- Audit logs: `audit_logs` + `admin_actions`.
- Consent: `LEGAL_REVIEW_REQUIRED` cookie banner architecture exists (locale cookie is functional; tracking cookies require explicit consent before launch).

## Secrets
- `.env.example` documents public vs secret vars. `.env*` gitignored.
- CI never logs secrets.

## Abuse
- Reporting (`reports` table), blocking (`blocks`), moderation queue in admin.
- Text length limits, profanity filter hook (future), image moderation via Supabase Storage hooks (future).
