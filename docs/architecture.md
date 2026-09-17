# Architecture — CarPull

## High-level
```
[ Web (Next.js) ] ─┐
                   ├─► Supabase (Postgres + Auth + Realtime + Storage)
[ Mobile (Expo) ] ─┘
         │
         └─► Vercel (hosting web) + EAS (build mobile) + MapLibre/OSM (maps)
```

Modular monolith — clean service boundaries, single DB. No microservices for MVP.

## Frontend
- **Web:** Next.js 14 App Router, React 18, Tailwind CSS. Server Components for data fetching via `createClient()` (SSR). Client Components for interactivity.
- **Mobile:** Expo 52 + Expo Router (file-based routing, shared with web concepts). `expo-secure-store` for session persistence.

## Backend — Supabase
- Postgres 15, Row Level Security, Realtime, Storage (avatars, vehicle photos).
- Auth: email/password, magic link, Google OAuth (via Supabase Auth), phone verification architecture (`verification_records`).
- Business logic in SQL functions (`request_booking`, `accept_booking`, etc.) — transactional, `FOR UPDATE` locks to prevent overbooking.

## Service layer (web)
`src/lib/supabase/*` + domain services (`src/lib/location.ts` with provider abstraction). UI never imports Supabase directly except via lib — swap provider without touching components.

## Matching engine
`packages/utils/src/matching.ts` — pure function `computeMatchingScore(ride, params, prefs, weights)`:
```
score = routeSimilarity*0.35 + timeCompatibility*0.25 + proximityScore*0.15 + preferenceCompatibility*0.10 + driverRatingWeight*0.15
```
Weights are configurable; function is stateless so ML can replace it later. `rankRides()` sorts descending.

## Maps
Abstraction:
```ts
interface GeocodingProvider { geocode(q):Promise<GeocodeResult[]>; reverse(lat,lng):Promise<string> }
interface RoutingProvider { route(from,to):Promise<RouteResult> }
```
Default: `OsmGeocodingProvider` (Nominatim, server-side, free) + `HaversineRoutingProvider` (no-cost fallback). Swap to Mapbox/Google by implementing interfaces + adding server route ` /api/maps/*` to keep keys server-side.

## ERD (core)
```
profiles 1──∞ vehicles
profiles 1──∞ rides (driver)
profiles 1──∞ bookings (passenger)
rides 1──∞ bookings
rides 1──∞ messages
profiles 1──∞ ratings (via bookings)
profiles 1──∞ reports, blocks, favorites, devices, notifications
```

## Scalability
- Pagination everywhere (`.limit(20)` + keyset on `departure_at`).
- Indexes on `departure_at`, `origin_label`, `destination_label`, `seats_available`, `status`.
- `audit_logs` for traceability; rate limiting via in-memory (upgrade to Upstash Redis for multi-instance).
