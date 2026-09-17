# API — Service Interfaces

All services are typed; UI imports via `src/lib/*`, not raw Supabase queries scattered in components.

```ts
// authService (via supabase-js)
authService.signUp(email, password, meta)
authService.signIn(email, password)
authService.signInWithOtp(email)
authService.signInWithOAuth(provider)
authService.signOut()
authService.resetPassword(email)

// userService
userService.getProfile(id)
userService.updateProfile(id, data) // Zod-validated
userService.listVehicles(ownerId)

// rideService
rideService.createRide(data) // validated, inserts via RLS
rideService.searchRides(params) // from/to/date/seats + filters
rideService.getRide(id) // with driver join
rideService.listMyRides(userId)

// bookingService (transactional RPCs)
bookingService.request(rideId, seats) // → calls `request_booking` RPC (FOR UPDATE)
bookingService.accept(bookingId)      // → `accept_booking`
bookingService.reject(bookingId)
bookingService.cancelByPassenger(bookingId)

// matchingService
matchingService.score(ride, params, prefs)
matchingService.rank(rides, params, prefs)

// messageService (Realtime)
messageService.list(rideId, { limit, cursor })
messageService.send(rideId, body)
messageService.subscribe(rideId, onInsert) // Supabase Realtime channel

// notificationService (pluggable)
notificationService.notify(userId, type, title, body, data) // inserts into notifications
notificationService.markRead(id)
notificationService.list(userId)

// ratingService
ratingService.create(bookingId, stars, comment) // → `create_rating` RPC, one per booking

// reportService
reportService.create({ reported_user_id, ride_id, reason, details })
reportService.listForAdmin()
reportService.resolve(id)

// locationService (provider abstraction)
locationService.geocode(query) // → GeocodingProvider
locationService.reverse(lat,lng)
locationService.route(from,to) // → RoutingProvider
```

Error format: `{ error: string, code?: string, retryAfterMs?: number }` — never raw DB errors to client (see `security.md`).

Pagination: `limit` + `cursor` (departure_at / created_at). Never load thousands of rows.
