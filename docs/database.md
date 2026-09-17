# Database — Supabase Postgres

## Tables
See `supabase/migrations/20250917000001_initial_schema.sql` for DDL.
Core: `profiles`, `vehicles`, `rides`, `recurring_rides`, `bookings`, `messages`, `notifications`, `ratings`, `reports`, `blocks`, `favorites`, `devices`, `verification_records`, `audit_logs`, `admin_actions`.

## UUIDs
All PKs `uuid` via `pgcrypto` (`gen_random_uuid()`).

## Constraints
- `seats_available <= seats_total`, `seats_total 1..8`, `contribution_cents 0..9900`
- `arrival_at > departure_at`, language/text length checks
- `bookings unique(ride_id, passenger_id)`, `ratings unique(booking_id)`, `blocks PK(blocker_id,blocked_id)`

## Indexes
- `rides(departure_at, seats_available, status)` — covers search
- `rides(origin_label)`, `rides(destination_label)`, `bookings(ride_id)`, `messages(ride_id, created_at desc)`

## RLS
Enabled on all tables. See `20250917000002_rls.sql`. Policies are deny-by-default; examples:
- `profiles_select_active` — anyone can read ACTIVE profiles (public fields only — private fields hidden by selecting subset in queries)
- `rides_select_scheduled` — scheduled rides public, others only for driver/admin
- `messages_select_participant` — only ride participants (driver or booked passenger) + admin
- `bookings_select_involved` — passenger or driver of ride

Helper functions `is_admin()` / `is_admin_strict()` use `security definer` to check `profiles.role`.

## Transactions
`request_booking` (with `FOR UPDATE` lock), `accept_booking` (decrements seats atomically), `reject_booking`, `cancel_booking_passenger`, `complete_ride`, `create_rating` (updates aggregate `rating_avg`). Prevents race conditions when multiple users hit last seat.

## Migrations
Versioned in `supabase/migrations/`. Apply via `supabase db push` (linked project) or `supabase db reset` locally.

## Seed
`supabase/seed/seed.sql` — inserts demo profiles/rides for local dev (no fake prod users). Uses well-known UUIDs for easy testing.

## Storage
Buckets `avatars` (public), `vehicle-photos` (public). Policies allow authenticated inserts; public reads.
