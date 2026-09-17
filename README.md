# CarPull — Germany-focused Carpool Platform

**CarPull** is a production-ready, Germany-focused carpool / ride-sharing platform for daily commutes, inter-city and intra-city rides. Inspired by BlaBlaCar but built with a privacy-first, GDPR-conscious, mobile-first architecture.

> Brand: **CarPull** — the name, logo and palette are centralized in `packages/config` and `packages/ui` so rebranding is a single-file change.

**Stack:** Next.js 14 (App Router) • Expo + React Native + Expo Router • Supabase (Postgres, Auth, Realtime, Storage) • TypeScript • Tailwind CSS • Zod • MapLibre • pnpm + Turborepo • Vercel • EAS Build

---

## ✨ Features (MVP)

- **Auth:** Email/password, magic link, Google OAuth, phone verification architecture, password reset, RLS-secured sessions
- **Profiles:** Public/private fields, vehicle details, verification badges, ratings
- **Rides:** One-time & recurring commutes, pickup/dropoff, seats, contribution, preferences (smoking/pets/luggage/conversation)
- **Search & Matching:** Filter by origin/destination/date/time/price/rating/verification, configurable `matchingScore` (route similarity × time compatibility × proximity × preferences × rating)
- **Bookings:** Transactional seat reservation, states `REQUESTED → ACCEPTED/REJECTED → COMPLETED`, prevents overbooking
- **Chat:** Realtime ride-scoped messaging via Supabase Realtime
- **Notifications:** In-app + email/push architecture (pluggable providers)
- **Ratings & Reviews:** 1–5 stars, one review per completed booking, aggregate rating
- **Trust & Safety:** Reports, blocks, moderation, user states `ACTIVE/SUSPENDED/BANNED/DELETED`
- **Admin:** RBAC (`USER/MODERATOR/ADMIN`), dashboards for users/rides/bookings/reports
- **i18n:** German 🇩🇪 + English 🇬🇧 — no hardcoded strings, JSON dictionaries, auto locale detection + manual switch
- **Maps:** `LocationProvider` / `RoutingProvider` / `GeocodingProvider` abstractions — defaults to MapLibre + OSM (free), swappable to Mapbox/Google without touching UI
- **Germany/EU:** Privacy/Terms pages, cookie consent, account deletion, data export, audit logs, address minimization

No subscriptions. No mandatory paid membership. Cost-sharing contribution is transparent and optional; payment settlement is architected as a future extension point.

---

## 🗂️ Repository Structure

```
car-pull/
├── apps/
│   ├── web/              # Next.js 14 web app (Vercel)
│   └── mobile/           # Expo + React Native (EAS)
├── packages/
│   ├── types/            # Shared TypeScript types + Supabase DB types
│   ├── validation/       # Zod schemas (shared web + mobile)
│   ├── i18n/             # de.json / en.json + helpers
│   ├── utils/            # matching, geo, pricing, date helpers
│   ├── config/           # Brand, app constants, feature flags
│   └── ui/               # Shared UI primitives (Tailwind + RN compatible)
├── supabase/
│   ├── migrations/       # SQL migrations (versioned)
│   ├── seed/             # Dev seed data
│   ├── functions/        # Edge Functions (optional)
│   └── config.toml
├── docs/                 # Architecture, security, deployment docs
├── .github/workflows/    # CI (lint, typecheck, test, build)
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+, pnpm 9+, Supabase CLI (`npm i -g supabase`), Expo CLI (`npm i -g eas-cli`)
- Supabase project (free tier) + Vercel account (optional) + Expo account (for mobile builds)

### 1. Clone & install

```bash
git clone https://github.com/swanaa11/car_pull.git
cd car_pull
pnpm install
cp .env.example .env.local   # fill in your Supabase keys
cp apps/web/.env.example apps/web/.env.local
cp apps/mobile/.env.example apps/mobile/.env.local
```

### 2. Supabase local (optional) or cloud

**Cloud (recommended for beginners):**
1. Create project at https://supabase.com → copy URL + anon key + service role key
2. Paste into `.env.local` and `apps/web/.env.local`
3. Run migrations: `supabase link --project-ref YOUR_REF && supabase db push`
4. Seed (optional): `pnpm --filter web seed` or run `supabase/seed/seed.sql` in SQL editor

**Local (Docker):**
```bash
supabase init    # already configured
supabase start   # starts local Postgres + Auth + Storage
supabase db reset # applies migrations + seed
```

See `docs/supabase-setup.md` for detailed steps.

### 3. Run web

```bash
pnpm dev --filter web
# → http://localhost:3000
```

### 4. Run mobile

```bash
cd apps/mobile
pnpm install
pnpm dev        # Expo Go
# or
pnpm android    # emulator
pnpm ios        # simulator (macOS)
```

See `docs/mobile-build.md` for EAS builds.

### 5. Tests

```bash
pnpm test
pnpm typecheck
pnpm lint
```

---

## 🔐 Environment Variables

See `.env.example` (root), `apps/web/.env.example`, `apps/mobile/.env.example` and `docs/environment-variables.md`.

**Rule:** `NEXT_PUBLIC_*` / `EXPO_PUBLIC_*` are client-safe. `SUPABASE_SERVICE_ROLE_KEY` is server-only.

---

## 🚢 Deployment

- **Web (Vercel):** `docs/deployment.md` → Connect GitHub → set env vars → deploy. Preview deployments on every PR.
- **Mobile (EAS):** `docs/mobile-build.md` → `eas build --platform android --profile preview` → `eas build --platform all --profile production` → Play Store / TestFlight.

---

## 🧪 Testing

- Unit: `packages/utils` (matching, pricing), `packages/validation` — Vitest
- Integration: Auth, ride creation, booking concurrency, messaging — Vitest + Supabase test helpers
- E2E: Playwright (web) — register → create ride → search → book → chat → complete → rate

Run `pnpm test` at root.

---

## 📚 Docs

- `docs/architecture.md` — system design, ERD, service layer
- `docs/database.md` — schema, indexes, RLS
- `docs/security.md` — RLS, RBAC, rate limiting, GDPR notes
- `docs/deployment.md` — Vercel
- `docs/supabase-setup.md` — Supabase step-by-step
- `docs/mobile-build.md` — Expo/EAS
- `docs/api.md` — service interfaces
- `docs/testing.md` — test strategy
- `docs/germany-launch-checklist.md` — legal & operational checklist

---

## ⚠️ Legal Disclaimer

This repository provides **technical foundations** for GDPR-conscious handling (data minimization, deletion, export, consent tracking, audit logs). It is **not legal advice**. Have a qualified attorney review Privacy Policy, Terms, and cookie handling before public launch. Search `LEGAL_REVIEW_REQUIRED` in the codebase.

---

## 📄 License

Proprietary — all rights reserved. Contact the repository owner for licensing.
