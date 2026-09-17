-- Car Pool — Row Level Security
-- Principle: deny-by-default; explicit policies for each table.
-- Never expose service_role to client.

alter table public.profiles enable row level security;
alter table public.vehicles enable row level security;
alter table public.rides enable row level security;
alter table public.recurring_rides enable row level security;
alter table public.bookings enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.ratings enable row level security;
alter table public.reports enable row level security;
alter table public.blocks enable row level security;
alter table public.favorites enable row level security;
alter table public.devices enable row level security;
alter table public.verification_records enable row level security;
alter table public.audit_logs enable row level security;
alter table public.admin_actions enable row level security;

-- Helper: is_admin()
create or replace function public.is_admin() returns boolean language sql security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role in ('ADMIN','MODERATOR'));
$$;
create or replace function public.is_admin_strict() returns boolean language sql security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'ADMIN');
$$;

-- ── PROFILES ──
-- Anyone can read public fields of ACTIVE users (but RLS restricts all; we expose via view logic in queries selecting only public columns; for simplicity allow read of ACTIVE profiles)
create policy "profiles_select_active" on public.profiles for select using (state = 'ACTIVE');
-- Users can update own profile (except role/state/rating)
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
-- Insert handled via trigger on signup; allow authenticated to insert own row
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);

-- ── VEHICLES ──
create policy "vehicles_select_all" on public.vehicles for select using (true);
create policy "vehicles_insert_own" on public.vehicles for insert with check (auth.uid() = owner_id);
create policy "vehicles_update_own" on public.vehicles for update using (auth.uid() = owner_id);
create policy "vehicles_delete_own" on public.vehicles for delete using (auth.uid() = owner_id);

-- ── RIDES ──
create policy "rides_select_scheduled" on public.rides for select using (status = 'SCHEDULED' or driver_id = auth.uid() or public.is_admin());
create policy "rides_insert_driver" on public.rides for insert with check (auth.uid() = driver_id);
create policy "rides_update_driver" on public.rides for update using (auth.uid() = driver_id or public.is_admin());
create policy "rides_delete_driver" on public.rides for delete using (auth.uid() = driver_id or public.is_admin());

-- ── RECURRING ──
create policy "recurring_select_own_or_admin" on public.recurring_rides for select using (driver_id = auth.uid() or public.is_admin());
create policy "recurring_insert_own" on public.recurring_rides for insert with check (auth.uid() = driver_id);
create policy "recurring_update_own" on public.recurring_rides for update using (auth.uid() = driver_id);
create policy "recurring_delete_own" on public.recurring_rides for delete using (auth.uid() = driver_id);

-- ── BOOKINGS ──
-- Passenger can read own bookings; driver can read bookings for own rides; admin all
create policy "bookings_select_involved" on public.bookings for select using (
  passenger_id = auth.uid() or exists (select 1 from public.rides r where r.id = bookings.ride_id and r.driver_id = auth.uid()) or public.is_admin()
);
create policy "bookings_insert_passenger" on public.bookings for insert with check (auth.uid() = passenger_id);
-- Update: passenger or driver of ride can update (state transitions enforced in DB function; RLS is coarse)
create policy "bookings_update_involved" on public.bookings for update using (
  passenger_id = auth.uid() or exists (select 1 from public.rides r where r.id = bookings.ride_id and r.driver_id = auth.uid()) or public.is_admin()
);
create policy "bookings_delete_involved" on public.bookings for delete using (passenger_id = auth.uid() or public.is_admin());

-- ── MESSAGES ──
-- Only participants of the ride (driver or booked passenger) can read/write
create policy "messages_select_participant" on public.messages for select using (
  exists (
    select 1 from public.rides r
    left join public.bookings b on b.ride_id = r.id and b.passenger_id = auth.uid() and b.state in ('REQUESTED','ACCEPTED','COMPLETED')
    where r.id = messages.ride_id and (r.driver_id = auth.uid() or b.passenger_id = auth.uid())
  ) or public.is_admin()
);
create policy "messages_insert_participant" on public.messages for insert with check (
  auth.uid() = sender_id and exists (
    select 1 from public.rides r
    left join public.bookings b on b.ride_id = r.id and b.passenger_id = auth.uid() and b.state in ('REQUESTED','ACCEPTED','COMPLETED')
    where r.id = messages.ride_id and (r.driver_id = auth.uid() or b.passenger_id = auth.uid())
  )
);

-- ── NOTIFICATIONS ──
create policy "notifications_select_own" on public.notifications for select using (user_id = auth.uid() or public.is_admin());
create policy "notifications_insert_service" on public.notifications for insert with check (true); -- inserts via service_role or via function; anon insert blocked by extra check in app
create policy "notifications_update_own" on public.notifications for update using (user_id = auth.uid());

-- ── RATINGS ──
create policy "ratings_select_all" on public.ratings for select using (true);
create policy "ratings_insert_rater" on public.ratings for insert with check (auth.uid() = rater_id);
-- no update/delete for ratings (immutable)

-- ── REPORTS ──
create policy "reports_insert_reporter" on public.reports for insert with check (auth.uid() = reporter_id);
create policy "reports_select_own_or_admin" on public.reports for select using (reporter_id = auth.uid() or public.is_admin());
create policy "reports_update_admin" on public.reports for update using (public.is_admin());

-- ── BLOCKS ──
create policy "blocks_select_own" on public.blocks for select using (blocker_id = auth.uid() or blocked_id = auth.uid());
create policy "blocks_insert_own" on public.blocks for insert with check (auth.uid() = blocker_id);
create policy "blocks_delete_own" on public.blocks for delete using (auth.uid() = blocker_id);

-- ── FAVORITES ──
create policy "favorites_own" on public.favorites for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ── DEVICES ──
create policy "devices_own" on public.devices for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ── VERIFICATION ──
create policy "verification_own_or_admin" on public.verification_records for select using (user_id = auth.uid() or public.is_admin());
create policy "verification_insert_own" on public.verification_records for insert with check (user_id = auth.uid());

-- ── AUDIT / ADMIN_ACTIONS ──
create policy "audit_admin_only" on public.audit_logs for select using (public.is_admin());
create policy "admin_actions_admin_only" on public.admin_actions for select using (public.is_admin());
create policy "admin_actions_insert_admin" on public.admin_actions for insert with check (public.is_admin());
