import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { centsToEuro } from "@/lib/utils";
import RideActions from "./actions";
export const dynamic = "force-dynamic";

export default async function RideDetail({ params }: { params:{id:string} }) {
  const supabase = createClient();
  const { data: ride } = await supabase.from("rides").select("*, driver:profiles!rides_driver_id_fkey(id,first_name,last_name,avatar_url,rating_avg,rating_count,city,verification_badges,bio)").eq("id", params.id).single();
  if(!ride) return notFound();
  const driver = (ride as any).driver ?? {};
  const { data: bookings } = await supabase.from("bookings").select("*, passenger:profiles!bookings_passenger_id_fkey(first_name,last_name)").eq("ride_id", params.id).order("created_at");
  const { data: { user } } = await supabase.auth.getUser();
  const isDriver = user?.id === ride.driver_id;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 grid lg:grid-cols-[1.6fr_0.9fr] gap-6">
      <div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm text-slate-500">{new Date(ride.departure_at).toLocaleString("de-DE",{weekday:"long", day:"2-digit", month:"long", year:"numeric", hour:"2-digit", minute:"2-digit"})}</div>
              <h1 className="mt-1 text-2xl font-black tracking-tight">{ride.origin_label} → {ride.destination_label}</h1>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <span className="px-2 py-1 rounded-full bg-slate-100 border border-slate-200">{ride.seats_available} / {ride.seats_total} Plätze frei</span>
                <span className="px-2 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 font-semibold">{centsToEuro(ride.contribution_cents)} p.P.</span>
                <span className="px-2 py-1 rounded-full bg-slate-100 border border-slate-200">{ride.status}</span>
              </div>
            </div>
            <div className="hidden sm:block text-right">
              <div className="text-xs text-slate-500">Kostenbeteiligung</div>
              <div className="text-xl font-black text-teal-700">{centsToEuro(ride.contribution_cents)}</div>
              <div className="text-xs text-slate-500">pro Person</div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 rounded-xl bg-slate-50 border border-slate-200 p-4 text-sm">
            <div className="flex gap-3"><span className="h-2 w-2 mt-2 rounded-full bg-teal-600"></span><div><div className="font-semibold">Start · Origin</div><div className="text-slate-600">{ride.origin_label}{ride.pickup_label ? ` — Treff: ${ride.pickup_label}` : ""}</div></div></div>
            <div className="ml-1 border-l-2 border-dotted border-slate-200 h-4"></div>
            <div className="flex gap-3"><span className="h-2 w-2 mt-2 rounded-full bg-slate-900"></span><div><div className="font-semibold">Ziel · Destination</div><div className="text-slate-600">{ride.destination_label}{ride.dropoff_label ? ` — Ziel-Treff: ${ride.dropoff_label}` : ""}</div></div></div>
          </div>

          <div className="mt-6 grid gap-2 text-sm">
            <div className="font-semibold">Präferenzen · Preferences</div>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className={`px-2 py-1 rounded-full border ${ride.smoking_allowed ? "bg-amber-50 border-amber-200" : "bg-slate-100 border-slate-200"}`}>{ride.smoking_allowed ? "Rauchen erlaubt" : "Nichtraucher"}</span>
              <span className={`px-2 py-1 rounded-full border ${ride.pets_allowed ? "bg-emerald-50 border-emerald-200" : "bg-slate-100 border-slate-200"}`}>{ride.pets_allowed ? "Haustiere ok" : "Keine Haustiere"}</span>
              <span className="px-2 py-1 rounded-full bg-slate-100 border border-slate-200">{ride.luggage_large ? "Großes Gepäck" : "Kleines Gepäck"}</span>
              <span className="px-2 py-1 rounded-full bg-slate-100 border border-slate-200">{ride.conversation_pref}</span>
            </div>
            {ride.notes && <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm">{ride.notes}</div>}
          </div>

          {/* Map placeholder */}
          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-3">
            <div className="text-sm font-semibold">Route · Map</div>
            <div className="mt-2 h-56 rounded-xl bg-slate-100 border border-slate-200 grid place-items-center text-sm text-slate-500">MapLibre · OpenStreetMap — Distanz & ETA über RoutingProvider</div>
          </div>
        </div>

        {/* Bookings (driver view) */}
        {isDriver && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
            <div className="font-semibold">Anfragen · Requests ({bookings?.length ?? 0})</div>
            <div className="mt-3 grid gap-2">
              {(bookings ?? []).map((b:any)=>(
                <div key={b.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3 text-sm">
                  <div><span className="font-medium">{b.passenger?.first_name} {b.passenger?.last_name}</span> · {b.seats} Platz · <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-xs">{b.state}</span></div>
                  {b.state==="REQUESTED" && <RideActions bookingId={b.id} />}
                </div>
              ))}
              {(bookings ?? []).length===0 && <div className="text-sm text-slate-500">Keine Anfragen.</div>}
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-6 h-fit">
        {/* Driver card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex gap-3">
            <div className="h-12 w-12 rounded-full bg-teal-700 text-white grid place-items-center font-bold">{(driver.first_name?.[0] ?? "?").toUpperCase()}</div>
            <div>
              <div className="font-semibold">{driver.first_name} {driver.last_name}</div>
              <div className="text-xs text-slate-600">{driver.city ?? ""} · ★ {Number(driver.rating_avg ?? 5).toFixed(1)} ({driver.rating_count ?? 0})</div>
              <div className="mt-1 flex gap-1 flex-wrap">{(driver.verification_badges ?? []).map((b:string)=><span key={b} className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">{b}</span>)}</div>
            </div>
          </div>
          {driver.bio && <div className="mt-3 text-sm text-slate-700 leading-relaxed">{driver.bio}</div>}
          <a href={`/profile/${driver.id}`} className="mt-3 inline-flex text-sm font-semibold text-teal-700 hover:underline">Profil ansehen</a>
        </div>

        {/* Booking action */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="font-semibold">Mitfahren · Book this ride</div>
          <div className="mt-1 text-sm text-slate-600">{ride.seats_available} Plätze verfügbar — {centsToEuro(ride.contribution_cents)} pro Person (Kostenbeteiligung, kein Taxipreis).</div>
          <div className="mt-4"><RideActions rideId={ride.id} isBooking /></div>
          <div className="mt-3 text-xs text-slate-500">Durch Anfragen stimmst du den <a href="/terms" className="underline">Bedingungen</a> zu. Zahlung erfolgt privat/Bar — Online-Zahlung als zukünftige Erweiterung.</div>
          <a href={`/messages/${ride.id}`} className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-xl border border-slate-200 font-semibold text-sm hover:bg-slate-50">Nachricht an Fahrer · Message driver</a>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900">
          <div className="font-semibold">Sicherheit · Safety</div>
          <div className="mt-1">Teile keine sensiblen Daten. Nutze den In-App-Chat. Melde auffälliges Verhalten über &ldquo;Melden&rdquo;.</div>
        </div>
      </div>
    </div>
  );
}