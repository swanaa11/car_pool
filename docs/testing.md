# Testing

## Unit
- `packages/utils` — `matching.test.ts` (score logic), `pricing`, `geo`
- `packages/validation` — Zod schema tests
- Run: `pnpm test` or `npx vitest run`

## Integration
- Auth: sign up → profile created via trigger
- Ride creation → RLS allows driver insert
- Booking concurrency: two parallel `request_booking` calls for last seat — one should fail (tested via RPC, `FOR UPDATE` lock)
- Messaging: insert + Realtime subscription
- Rating: only after COMPLETED, one per booking

Integration tests use a test Supabase project (env `SUPABASE_URL` etc.) or `supabase start` local. See `supabase/seed/seed.sql` for fixtures.

## E2E (Playwright)
Web flows:
1. Register
2. Create profile
3. Create ride
4. Search ride
5. Request seat
6. Accept booking (as driver, second session)
7. Send message
8. Complete ride
9. Rate user

Run: `npx playwright test` (config to be added when Playwright installed).

## CI
`.github/workflows/ci.yml` runs lint, typecheck, test, build on every push/PR.
