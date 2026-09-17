import { z } from "zod";

export const profileSchema = z.object({
  first_name: z.string().min(1).max(50),
  last_name: z.string().min(1).max(50),
  city: z.string().max(100).optional().nullable(),
  bio: z.string().max(500).optional().nullable(),
  languages: z.array(z.string()).max(5).optional(),
});

export const vehicleSchema = z.object({
  make: z.string().min(1).max(50),
  model: z.string().min(1).max(50),
  color: z.string().max(30).optional().nullable(),
  seats_total: z.number().int().min(1).max(8),
});

export const rideCreateSchema = z.object({
  type: z.enum(["ONE_TIME","RECURRING"]).default("ONE_TIME"),
  origin_label: z.string().min(2).max(200),
  origin_lat: z.number().min(-90).max(90).nullable().optional(),
  origin_lng: z.number().min(-180).max(180).nullable().optional(),
  destination_label: z.string().min(2).max(200),
  destination_lat: z.number().min(-90).max(90).nullable().optional(),
  destination_lng: z.number().min(-180).max(180).nullable().optional(),
  pickup_label: z.string().max(200).nullable().optional(),
  dropoff_label: z.string().max(200).nullable().optional(),
  departure_at: z.string().datetime().or(z.string().min(10)), // ISO or YYYY-MM-DD HH:mm
  seats_total: z.number().int().min(1).max(8),
  contribution_cents: z.number().int().min(0).max(9900),
  notes: z.string().max(1000).nullable().optional(),
  smoking_allowed: z.boolean().default(false),
  pets_allowed: z.boolean().default(false),
  luggage_large: z.boolean().default(true),
  conversation_pref: z.enum(["quiet","chatty","whatever"]).default("whatever"),
  weekdays: z.array(z.number().int().min(0).max(6)).optional(),
  return_time: z.string().regex(/^\d{2}:\d{2}$/).nullable().optional(),
  vehicle_id: z.string().uuid().nullable().optional(),
});

export const searchSchema = z.object({
  from: z.string().min(1).max(200).optional(),
  to: z.string().min(1).max(200).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  seats: z.coerce.number().int().min(1).max(8).optional(),
  maxPriceCents: z.coerce.number().int().min(0).optional(),
  verifiedOnly: z.coerce.boolean().optional(),
});

export const bookingCreateSchema = z.object({
  ride_id: z.string().uuid(),
  seats: z.number().int().min(1).max(8).default(1),
});

export const messageSchema = z.object({
  ride_id: z.string().uuid(),
  body: z.string().min(1).max(2000),
});

export const ratingSchema = z.object({
  booking_id: z.string().uuid(),
  stars: z.number().int().min(1).max(5),
  comment: z.string().max(1000).nullable().optional(),
});

export const reportSchema = z.object({
  reported_user_id: z.string().uuid().nullable().optional(),
  ride_id: z.string().uuid().nullable().optional(),
  reason: z.string().min(3).max(100),
  details: z.string().max(2000).nullable().optional(),
}).refine(v => v.reported_user_id || v.ride_id, { message: "Either reported_user_id or ride_id required" });

export type RideCreateInput = z.infer<typeof rideCreateSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
