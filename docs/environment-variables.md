# Environment Variables

## Root `.env.example` (source of truth)
```
NEXT_PUBLIC_SUPABASE_URL         # public, client-safe
NEXT_PUBLIC_SUPABASE_ANON_KEY    # public, client-safe (anon key)
SUPABASE_SERVICE_ROLE_KEY        # SECRET — server only!
SUPABASE_PROJECT_ID              # for CLI type generation
NEXT_PUBLIC_APP_URL              # e.g. https://carpull.de
NEXT_PUBLIC_DEFAULT_LOCALE       # de
MAP_PROVIDER                     # maplibre | mapbox | google
MAPBOX_TOKEN                     # SECRET — keep server-side, proxy via /api/maps/*
GOOGLE_MAPS_API_KEY              # SECRET
RESEND_API_KEY                   # optional, for email
EMAIL_FROM                       # noreply@carpull.de
EXPO_PUBLIC_SUPABASE_URL         # same as NEXT_PUBLIC_ but for Expo
EXPO_PUBLIC_SUPABASE_ANON_KEY
EXPO_PUBLIC_APP_URL
```

## Rules
- `NEXT_PUBLIC_*` and `EXPO_PUBLIC_*` are bundled into client JS — never put secrets there.
- `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS — only use in server routes / Edge Functions / `supabase db` CLI.
- Gitignore: `.env`, `.env.local`, `.env.*.local` are ignored. Never commit.

## Where to set
- Local: `cp .env.example .env.local` + `cp apps/web/.env.example apps/web/.env.local`
- Vercel: Dashboard → Project → Settings → Environment Variables
- EAS: `eas secret:create` or `eas.json` env

## Validation
App checks at startup: if `NEXT_PUBLIC_SUPABASE_URL` missing, Supabase client throws. Add a CI check `pnpm --filter web build` with placeholder values to catch missing vars early.
