-- Car Pool — Initial schema (Godordentlich für Germany, GDPR-bewusst)
-- Enables: profiles, vehicles, rides, recurring_rides, bookings, messages, notifications, ratings, reports, blocks...
-- Uses UUIDs, RLS, indexes, constraints, audit.

-- Extensions
create extension if not exists "pgcrypto";
create extension if not exists "pg_stat_statements";

-- Helper: updated_at trigger
create or replace function set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end; $$ language plpgsql;

-- ── PROFILES (extends auth.users) ──
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  first_name text not null check (char_length(first_name) between 1 and 50),
  last_name text not null check (char_length(last_name) between 1 and 50),
  avatar_url text,
  city text,
  bio text check (char_length(bio) <= 500),
  languages text[] default '{}',
  phone text,
  phone_verified boolean not null default false,
  role text not null default 'USER' check (role in ('USER','MODERATOR','ADMIN')),
  state text not null default 'ACTIVE' check (state in ('ACTIVE','SUSPENDED','BANNED','DELETED')),
  rating_avg numeric(3,2) not null default 5.00 check (rating_avg between 1 and 5),
  rating_count int not null default 0 check (rating_count >= 0),
  completed_rides int not null default 0 check (completed_rides >= 0),
  verification_badges text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger profiles_updated_at before update on public.profiles for each row execute function set_updated_at();
create index profiles_city_idx on public.profiles(city);
create index profiles_role_idx on public.profiles(role);

-- ── VEHICLES ──
create table public.vehicles (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  make text not null,
  model text not null,
  color text,
  plate_last4 text check (plate_last4 is null or char_length(plate_last4)=4),
  seats_total int not null check (seats_total between 1 and 8),
  photo_url text,
  created_at timestamptz not null default now()
);
create index vehicles_owner_idx on public.vehicles(owner_id);

-- ── RIDES ──
create table public.rides (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references public.profiles(id) on delete cascade,
  vehicle_id uuid references public.vehicles(id) on delete set null,
  type text not null default 'ONE_TIME' check (type in ('ONE_TIME','RECURRING')),
  origin_label text not null,
  origin_lat double precision check (origin_lat between -90 and 90),
  origin_lng double precision check (origin_lng between -180 and 180),
  destination_label text not null,
  destination_lat double precision check (destination_lat between -90 and 90),
  destination_lng double precision check (destination_lng between -180 and 180),
  pickup_label text,
  dropoff_label text,
  departure_at timestamptz not null,
  arrival_at timestamptz,
  seats_total int not null check (seats_total between 1 and 8),
  seats_available int not null check (seats_available >=0),
  contribution_cents int not null check (contribution_cents between 0 and 9900),
  notes text check (char_length(notes) <= 1000),
  smoking_allowed boolean not null default false,
  pets_allowed boolean not null default false,
  luggage_large boolean not null default true,
  conversation_pref text not null default 'whatever' check (conversation_pref in ('quiet','chatty','whatever')),
  recurring_group_id uuid,
  status text not null default 'SCHEDULED' check (status in ('SCHEDULED','CANCELLED','COMPLETED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint seats_available_lte_total check (seats_available <= seats_total),
  constraint arrival_after_departure check (arrival_at is null or arrival_at > departure_at)
);
create trigger rides_updated_at before update on public.rides for each row execute function set_updated_at();
create index rides_driver_idx on public.rides(driver_id);
create index rides_departure_idx on public.rides(departure_at);
create index rides_origin_idx on public.rides(origin_label);
create index rides_destination_idx on public.rides(destination_label);
create index rides_status_idx on public.rides(status);
create index rides_search_idx on public.rides(departure_at, seats_available, status);

-- ── RECURRING RIDES (template) ──
create table public.recurring_rides (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references public.profiles(id) on delete cascade,
  vehicle_id uuid references public.vehicles(id) on delete set null,
  origin_label text not null,
  origin_lat double precision,
  origin_lng double precision,
  destination_label text not null,
  destination_lat double precision,
  destination_lng double precision,
  weekdays int[] not null check (array_length(weekdays,1) between 1 and 7),
  departure_time text not null check (departure_time ~ '^\d{2}:\d{2}$'),
  return_time text check (return_time ~ '^\d{2}:\d{2}$'),
  seats_total int not null check (seats_total between 1 and 8),
  contribution_cents int not null check (contribution_cents between 0 and 9900),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger recurring_updated_at before update on public.recurring_rides for each row execute function set_updated_at();
create index recurring_driver_idx on public.recurring_rides(driver_id);

-- ── BOOKINGS ──
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  ride_id uuid not null references public.rides(id) on delete cascade,
  passenger_id uuid not null references public.profiles(id) on delete cascade,
  seats int not null default 1 check (seats between 1 and 8),
  state text not null default 'REQUESTED' check (state in ('REQUESTED','ACCEPTED','REJECTED','CANCELLED_BY_PASSENGER','CANCELLED_BY_DRIVER','COMPLETED','NO_SHOW')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(ride_id, passenger_id)
);
create trigger bookings_updated_at before update on public.bookings for each row execute function set_updated_at();
create index bookings_ride_idx on public.bookings(ride_id);
create index bookings_passenger_idx on public.bookings(passenger_id);
create index bookings_state_idx on public.bookings(state);

-- ── MESSAGES ──
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  ride_id uuid not null references public.rides(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index messages_ride_created_idx on public.messages(ride_id, created_at desc);
create index messages_sender_idx on public.messages(sender_id);

-- ── NOTIFICATIONS ──
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  data jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index notifications_user_read_idx on public.notifications(user_id, read_at, created_at desc);

-- ── RATINGS ──
create table public.ratings (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references public.bookings(id) on delete cascade,
  rater_id uuid not null references public.profiles(id) on delete cascade,
  ratee_id uuid not null references public.profiles(id) on delete cascade,
  stars int not null check (stars between 1 and 5),
  comment text check (char_length(comment) <= 1000),
  created_at timestamptz not null default now(),
  check (rater_id <> ratee_id)
);
create index ratings_ratee_idx on public.ratings(ratee_id);

-- ── REPORTS ──
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  reported_user_id uuid references public.profiles(id) on delete set null,
  ride_id uuid references public.rides(id) on delete set null,
  reason text not null,
  details text,
  status text not null default 'OPEN' check (status in ('OPEN','REVIEWED','RESOLVED','DISMISSED')),
  created_at timestamptz not null default now(),
  check (reported_user_id is not null or ride_id is not null)
);
create index reports_status_idx on public.reports(status);

-- ── BLOCKS ──
create table public.blocks (
  blocker_id uuid not null references public.profiles(id) on delete cascade,
  blocked_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);

-- ── FAVORITES / SAVED ROUTES ──
create table public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  origin_label text not null,
  destination_label text not null,
  created_at timestamptz not null default now(),
  unique(user_id, origin_label, destination_label)
);

-- ── DEVICES (push) ──
create table public.devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  expo_push_token text,
  platform text check (platform in ('ios','android','web')),
  created_at timestamptz not null default now(),
  unique(user_id, expo_push_token)
);

-- ── VERIFICATION RECORDS ──
create table public.verification_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('email','phone','id_document')),
  status text not null default 'PENDING' check (status in ('PENDING','VERIFIED','REJECTED')),
  created_at timestamptz not null default now()
);

-- ── AUDIT LOGS ──
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity text not null,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);
create index audit_actor_idx on public.audit_logs(actor_id);
create index audit_entity_idx on public.audit_logs(entity, entity_id);

-- ── ADMIN ACTIONS (mirrors audit but for admin panel) ──
create table public.admin_actions (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references public.profiles(id) on delete cascade,
  action text not null,
  target_user_id uuid references public.profiles(id) on delete set null,
  target_ride_id uuid references public.rides(id) on delete set null,
  reason text,
  created_at timestamptz not null default now()
);
