import type { Ride, SearchParams, MatchingWeights } from "@carpull/types";
import { DEFAULT_MATCHING_WEIGHTS } from "@carpull/types";

/**
 * Configurable matching score — clean abstraction so ML can replace it later.
 * Returns 0..1 (higher = better match).
 *
 * matchScore = routeSimilarity * 0.35 + timeCompatibility * 0.25 + proximityScore * 0.15 + preferenceCompatibility * 0.10 + driverRatingWeight * 0.15
 *
 * Each sub-score is 0..1.
 */
export function computeMatchingScore(
  ride: Ride,
  params: SearchParams,
  userPrefs?: { smoking?: boolean; pets?: boolean },
  weights: MatchingWeights = DEFAULT_MATCHING_WEIGHTS
): number {
  const routeSimilarity = scoreRouteSimilarity(ride, params);
  const timeCompatibility = scoreTimeCompatibility(ride, params);
  const proximityScore = scoreProximity(ride, params);
  const preferenceCompatibility = scorePreferences(ride, userPrefs);
  const ratingScore = scoreRating(ride);

  const total =
    routeSimilarity * weights.routeSimilarity +
    timeCompatibility * weights.timeCompatibility +
    proximityScore * weights.proximityScore +
    preferenceCompatibility * weights.preferenceCompatibility +
    ratingScore * weights.driverRatingWeight;

  return Math.max(0, Math.min(1, total));
}

function normalize(s: string) { return s.toLowerCase().trim(); }

function scoreRouteSimilarity(ride: Ride, params: SearchParams): number {
  if (!params.from && !params.to) return 0.5;
  let score = 0.5;
  if (params.from) {
    const from = normalize(params.from);
    if (normalize(ride.origin_label).includes(from)) score += 0.25;
    else if (normalize(ride.origin_label).split(/\s+/).some(w => from.includes(w) || w.includes(from))) score += 0.12;
  }
  if (params.to) {
    const to = normalize(params.to);
    if (normalize(ride.destination_label).includes(to)) score += 0.25;
    else if (normalize(ride.destination_label).split(/\s+/).some(w => to.includes(w) || w.includes(to))) score += 0.12;
  }
  return Math.min(1, score);
}

function scoreTimeCompatibility(ride: Ride, params: SearchParams): number {
  if (!params.date) return 0.7;
  try {
    const rideDate = new Date(ride.departure_at).toISOString().slice(0,10);
    if (rideDate === params.date) return 1;
    const diff = Math.abs(new Date(rideDate).getTime() - new Date(params.date).getTime()) / (1000*60*60*24);
    if (diff === 1) return 0.7;
    if (diff <= 3) return 0.4;
    return 0.1;
  } catch { return 0.5; }
}

function scoreProximity(ride: Ride, _params: SearchParams): number {
  // Placeholder — with real geocoding, compute haversine distance.
  // If lat/lng present, this is replaced by geo-aware logic.
  if (ride.origin_lat != null && ride.origin_lng != null) return 0.8;
  return 0.5;
}

function scorePreferences(ride: Ride, prefs?: { smoking?: boolean; pets?: boolean }): number {
  if (!prefs) return 0.8;
  let ok = 1;
  if (prefs.smoking === false && ride.smoking_allowed) ok -= 0.5;
  if (prefs.pets === false && ride.pets_allowed) ok -= 0.3;
  return Math.max(0, ok);
}

function scoreRating(ride: Ride): number {
  const avg = (ride as any).driver?.rating_avg ?? (ride as any).rating_avg ?? 4.0;
  // Map 1..5 → 0..1
  return Math.max(0, Math.min(1, (Number(avg) - 1) / 4));
}

export function rankRides(rides: Ride[], params: SearchParams, prefs?: { smoking?: boolean; pets?: boolean }): (Ride & { _score: number })[] {
  return rides
    .map(r => ({ ...r, _score: computeMatchingScore(r, params, prefs) }))
    .sort((a,b) => b._score - a._score);
}
