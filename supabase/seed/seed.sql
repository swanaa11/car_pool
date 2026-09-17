-- Dev seed: run `supabase db reset` or paste into SQL editor. No fake production users.
-- Creates demo profiles, rides, bookings for local testing.

-- Note: profiles are created via auth; this seed creates data assuming you have created users via Supabase Auth dashboard or will run with service role.
-- For quick dev, we insert profiles directly (requires disabling trigger temporarily or using service_role)

-- Sample German routes
insert into public.profiles (id, email, first_name, last_name, city, bio, languages, role, verification_badges, rating_avg, rating_count, completed_rides)
values
  ('00000000-0000-0000-0000-000000000001','anna@example.de','Anna','Müller','Berlin','Pendlerin Berlin → Potsdam, fahre Mo–Fr 08:00','{de,en}','USER','{email,phone}',4.9,23,42),
  ('00000000-0000-0000-0000-000000000002','max@example.de','Max','Schmidt','München','Wochenendfahrten München–Stuttgart, Nichtraucher','{de}','USER','{email}',4.7,12,18),
  ('00000000-0000-0000-0000-000000000003','lea@example.de','Lea','Weber','Hamburg','Studentin, Hamburg–Bremen, Haustiere ok','{de,en}','USER','{email,phone}',5.0,8,10)
on conflict (id) do nothing;

insert into public.vehicles (id, owner_id, make, model, color, seats_total) values
  ('10000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','VW','Golf','Blau',4),
  ('10000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000002','BMW','3er','Schwarz',3)
on conflict (id) do nothing;

-- One-time rides
insert into public.rides (id, driver_id, vehicle_id, origin_label, destination_label, origin_lat, origin_lng, destination_lat, destination_lng, departure_at, seats_total, seats_available, contribution_cents, smoking_allowed, pets_allowed)
values
  ('20000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','Berlin Hbf','Potsdam Hbf',52.525,13.369,52.391,13.067, now() + interval '1 day', 3, 3, 500, false, false),
  ('20000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000002','München Hbf','Stuttgart Hbf',48.140,11.560,48.784,9.183, now() + interval '2 days', 2, 2, 1200, false, true),
  ('20000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','Hamburg Hbf','Bremen Hbf',53.553,9.989,53.083,8.814, now() + interval '3 days', 4, 4, 800, false, true)
on conflict (id) do nothing;

-- Recurring commute
insert into public.recurring_rides (id, driver_id, vehicle_id, origin_label, destination_label, weekdays, departure_time, return_time, seats_total, contribution_cents)
values ('30000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','Berlin','Potsdam','{1,2,3,4,5}','08:00','18:00',3,500)
on conflict (id) do nothing;
