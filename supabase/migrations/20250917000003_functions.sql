-- Car Pool — Business logic functions (transactional, secure)

-- Auto-create profile on signup
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, first_name, last_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'first_name',''), coalesce(new.raw_user_meta_data->>'last_name',''));
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- Transactional booking: prevents overbooking via row lock
create or replace function public.request_booking(p_ride_id uuid, p_seats int) returns uuid language plpgsql security definer set search_path = public as $$
declare v_booking_id uuid; v_available int; v_driver uuid;
begin
  if p_seats <1 or p_seats >8 then raise exception 'Invalid seats'; end if;
  -- lock ride row
  select seats_available, driver_id into v_available, v_driver from public.rides where id = p_ride_id for update;
  if not found then raise exception 'Ride not found'; end if;
  if v_driver = auth.uid() then raise exception 'Cannot book own ride'; end if;
  if v_available < p_seats then raise exception 'Not enough seats'; end if;

  insert into public.bookings (ride_id, passenger_id, seats, state)
  values (p_ride_id, auth.uid(), p_seats, 'REQUESTED') returning id into v_booking_id;

  -- notification to driver
  insert into public.notifications (user_id, type, title, body, data)
  values (v_driver, 'booking_requested', 'Neue Anfrage', 'Jemand möchte mitfahren', jsonb_build_object('ride_id', p_ride_id, 'booking_id', v_booking_id));

  return v_booking_id;
exception when unique_violation then raise exception 'Already requested this ride';
end; $$;

-- Driver accepts booking: decrement seats atomically
create or replace function public.accept_booking(p_booking_id uuid) returns void language plpgsql security definer set search_path = public as $$
declare v_ride uuid; v_seats int; v_passenger uuid; v_available int; v_driver uuid;
begin
  select b.ride_id, b.seats, b.passenger_id into v_ride, v_seats, v_passenger from public.bookings b where b.id = p_booking_id;
  if not found then raise exception 'Booking not found'; end if;
  -- verify caller is driver
  select driver_id, seats_available into v_driver, v_available from public.rides where id = v_ride for update;
  if v_driver <> auth.uid() and not public.is_admin() then raise exception 'Not authorized'; end if;
  if v_available < v_seats then raise exception 'Not enough seats to accept'; end if;

  update public.bookings set state = 'ACCEPTED', updated_at = now() where id = p_booking_id and state = 'REQUESTED';
  if not found then raise exception 'Booking not in REQUESTED state'; end if;

  update public.rides set seats_available = seats_available - v_seats where id = v_ride;
  insert into public.notifications (user_id, type, title, body, data)
  values (v_passenger, 'booking_accepted', 'Anfrage bestätigt', 'Deine Mitfahrt wurde bestätigt', jsonb_build_object('ride_id', v_ride, 'booking_id', p_booking_id));
end; $$;

create or replace function public.reject_booking(p_booking_id uuid) returns void language plpgsql security definer set search_path = public as $$
declare v_ride uuid; v_passenger uuid; v_driver uuid;
begin
  select b.ride_id, b.passenger_id into v_ride, v_passenger from public.bookings b where b.id = p_booking_id;
  select driver_id into v_driver from public.rides where id = v_ride;
  if v_driver <> auth.uid() and not public.is_admin() then raise exception 'Not authorized'; end if;
  update public.bookings set state = 'REJECTED' where id = p_booking_id and state = 'REQUESTED';
  if not found then raise exception 'Not in REQUESTED'; end if;
  insert into public.notifications (user_id, type, title, body, data) values (v_passenger, 'booking_rejected', 'Anfrage abgelehnt', 'Deine Anfrage wurde abgelehnt', jsonb_build_object('ride_id', v_ride));
end; $$;

create or replace function public.cancel_booking_passenger(p_booking_id uuid) returns void language plpgsql security definer set search_path = public as $$
declare v_ride uuid; v_state text; v_seats int; v_driver uuid;
begin
  select ride_id, state, seats into v_ride, v_state, v_seats from public.bookings where id = p_booking_id and passenger_id = auth.uid();
  if not found then raise exception 'Not found or not owner'; end if;
  if v_state = 'ACCEPTED' then
    update public.rides set seats_available = seats_available + v_seats where id = v_ride;
  end if;
  update public.bookings set state = 'CANCELLED_BY_PASSENGER' where id = p_booking_id;
  select driver_id into v_driver from public.rides where id = v_ride;
  insert into public.notifications (user_id, type, title, body) values (v_driver, 'booking_cancelled', 'Buchung storniert', 'Ein Passagier hat storniert');
end; $$;

-- Mark ride completed (driver only) — completes bookings too
create or replace function public.complete_ride(p_ride_id uuid) returns void language plpgsql security definer set search_path = public as $$
declare v_driver uuid;
begin
  select driver_id into v_driver from public.rides where id = p_ride_id;
  if v_driver <> auth.uid() and not public.is_admin() then raise exception 'Not authorized'; end if;
  update public.rides set status = 'COMPLETED' where id = p_ride_id and status = 'SCHEDULED';
  update public.bookings set state = 'COMPLETED' where ride_id = p_ride_id and state = 'ACCEPTED';
  -- bump completed_rides for driver
  update public.profiles set completed_rides = completed_rides +1 where id = v_driver;
end; $$;

-- Rating: one per booking, only after completed
create or replace function public.create_rating(p_booking_id uuid, p_stars int, p_comment text) returns uuid language plpgsql security definer set search_path = public as $$
declare v_passenger uuid; v_ride uuid; v_driver uuid; v_state text; v_ratee uuid; v_id uuid;
begin
  if p_stars <1 or p_stars >5 then raise exception 'Invalid stars'; end if;
  select passenger_id, ride_id, state into v_passenger, v_ride, v_state from public.bookings where id = p_booking_id;
  if not found then raise exception 'Booking not found'; end if;
  if v_state <> 'COMPLETED' then raise exception 'Ride not completed'; end if;
  select driver_id into v_driver from public.rides where id = v_ride;
  if auth.uid() = v_driver then v_ratee := v_passenger; elsif auth.uid() = v_passenger then v_ratee := v_driver; else raise exception 'Not participant'; end if;
  insert into public.ratings (booking_id, rater_id, ratee_id, stars, comment) values (p_booking_id, auth.uid(), v_ratee, p_stars, p_comment) returning id into v_id;
  -- update aggregate
  update public.profiles set rating_count = rating_count+1, rating_avg = ((rating_avg*rating_count)+p_stars)/(rating_count+1) where id = v_ratee;
  return v_id;
exception when unique_violation then raise exception 'Already rated';
end; $$;

-- Storage bucket for avatars/vehicle photos (created via migration; RLS via storage policies)
insert into storage.buckets (id, name, public) values ('avatars','avatars', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('vehicle-photos','vehicle-photos', true) on conflict (id) do nothing;

-- Storage policies (public read, owner write)
create policy "avatars public read" on storage.objects for select using (bucket_id in ('avatars','vehicle-photos'));
create policy "avatars owner insert" on storage.objects for insert with check (bucket_id in ('avatars','vehicle-photos') and auth.role() = 'authenticated');
create policy "avatars owner update" on storage.objects for update using (auth.role() = 'authenticated');
create policy "avatars owner delete" on storage.objects for delete using (auth.role() = 'authenticated');
