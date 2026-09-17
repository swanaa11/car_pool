// Re-export Supabase generated types once available; fallback to manual domain types for MVP
export type UUID = string;

export type UserRole = "USER" | "MODERATOR" | "ADMIN";
export type UserState = "ACTIVE" | "SUSPENDED" | "BANNED" | "DELETED";
export type BookingState = "REQUESTED" | "ACCEPTED" | "REJECTED" | "CANCELLED_BY_PASSENGER" | "CANCELLED_BY_DRIVER" | "COMPLETED" | "NO_SHOW";
export type RideType = "ONE_TIME" | "RECURRING";
export type Weekday = 0|1|2|3|4|5|6; // 0=Sunday

export interface Profile {
  id: UUID;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  city: string | null;
  bio: string | null;
  languages: string[];
  phone: string | null;
  phone_verified: boolean;
  role: UserRole;
  state: UserState;
  rating_avg: number;
  rating_count: number;
  completed_rides: number;
  verification_badges: string[];
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: UUID;
  owner_id: UUID;
  make: string;
  model: string;
  color: string | null;
  plate_last4: string | null;
  seats_total: number;
  photo_url: string | null;
  created_at: string;
}

export interface Ride {
  id: UUID;
  driver_id: UUID;
  vehicle_id: UUID | null;
  type: RideType;
  origin_label: string;
  origin_lat: number | null;
  origin_lng: number | null;
  destination_label: string;
  destination_lat: number | null;
  destination_lng: number | null;
  pickup_label: string | null;
  dropoff_label: string | null;
  departure_at: string; // ISO
  arrival_at: string | null;
  seats_total: number;
  seats_available: number;
  contribution_cents: number; // EUR cents
  notes: string | null;
  smoking_allowed: boolean;
  pets_allowed: boolean;
  luggage_large: boolean;
  conversation_pref: "quiet" | "chatty" | "whatever";
  recurring_group_id: UUID | null;
  status: "SCHEDULED" | "CANCELLED" | "COMPLETED";
  created_at: string;
  driver?: Profile;
  vehicle?: Vehicle | null;
}

export interface RecurringRide {
  id: UUID;
  driver_id: UUID;
  vehicle_id: UUID | null;
  origin_label: string;
  origin_lat: number | null;
  origin_lng: number | null;
  destination_label: string;
  destination_lat: number | null;
  destination_lng: number | null;
  weekdays: Weekday[];
  departure_time: string; // "08:00"
  return_time: string | null;
  seats_total: number;
  contribution_cents: number;
  preferences: Ride["conversation_pref"] | null;
  active: boolean;
  created_at: string;
}

export interface Booking {
  id: UUID;
  ride_id: UUID;
  passenger_id: UUID;
  seats: number;
  state: BookingState;
  created_at: string;
  updated_at: string;
  ride?: Ride;
  passenger?: Profile;
}

export interface Message {
  id: UUID;
  ride_id: UUID;
  sender_id: UUID;
  body: string;
  created_at: string;
  read_at: string | null;
}

export interface Rating {
  id: UUID;
  booking_id: UUID;
  rater_id: UUID;
  ratee_id: UUID;
  stars: number;
  comment: string | null;
  created_at: string;
}

export interface Report {
  id: UUID;
  reporter_id: UUID;
  reported_user_id: UUID | null;
  ride_id: UUID | null;
  reason: string;
  details: string | null;
  status: "OPEN" | "REVIEWED" | "RESOLVED" | "DISMISSED";
  created_at: string;
}

export interface Notification {
  id: UUID;
  user_id: UUID;
  type: string;
  title: string;
  body: string;
  data: Record<string, unknown> | null;
  read_at: string | null;
  created_at: string;
}

// Matching
export interface SearchParams {
  from?: string;
  to?: string;
  date?: string; // YYYY-MM-DD
  seats?: number;
  timeWindow?: string; // e.g. "06:00-12:00"
  maxPriceCents?: number;
  verifiedOnly?: boolean;
  smokingAllowed?: boolean;
  petsAllowed?: boolean;
}

export interface MatchingWeights {
  routeSimilarity: number;
  timeCompatibility: number;
  proximityScore: number;
  preferenceCompatibility: number;
  driverRatingWeight: number;
}
export const DEFAULT_MATCHING_WEIGHTS: MatchingWeights = {
  routeSimilarity: 0.35,
  timeCompatibility: 0.25,
  proximityScore: 0.15,
  preferenceCompatibility: 0.10,
  driverRatingWeight: 0.15,
};
