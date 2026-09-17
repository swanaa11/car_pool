import { createClient } from "@/lib/supabase/server";
import { RideCard } from "@/components/RideCard";
import { SearchForm } from "@/components/SearchForm";
import { getDict } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: { searchParams: Record<string,string|undefined> }) {
  const dict = getDict();
  const supabase = createClient();
  const from = searchParams.from ?? "";
  const to = searchParams.to ?? "";
  const date = searchParams.date ?? "";
  const seats = parseInt(searchParams.seats ?? "1", 10);

  let query = supabase
    .from("rides")
    .select("*, driver:profiles!rides_driver_id_fkey(first_name,last_name,avatar_url,rating_avg,verification_badges)")
    .eq("status","SCHEDULED")
    .gte("departure_at", new Date().toISOString())
    .order("departure_at", { ascending: true })
    .limit(20);

  if (from) query = query.ilike("origin_label", `%${from}%`);
  if (to) query = query.ilike("destination_label", `%${to}%`);
  if (date) {
    const start = new Date(date); const end = new Date(date); end.setDate(end.getDate()+1);
    query = query.gte("departure_at", start.toISOString()).lt("departure_at", end.toISOString());
  }
  if (seats) query = query.gte("seats_available", seats);

  const { data: rides, error } = await query;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-2xl font-black tracking-tight">{dict.search?.title}</h1>
      <div className="mt-4"><SearchForm dict={dict} /></div>

      {/* filters summary */}
      <div className="mt-6 flex flex-wrap gap-2 text-xs">
        {from && <span className="px-3 py-1 rounded-full bg-white border border-slate-200">Von: {from}</span>}
        {to && <span className="px-3 py-1 rounded-full bg-white border border-slate-200">Nach: {to}</span>}
        {date && <span className="px-3 py-1 rounded-full bg-white border border-slate-200">Datum: {date}</span>}
        <span className="px-3 py-1 rounded-full bg-slate-900 text-white">{rides?.length ?? 0} Fahrten</span>
      </div>

      {error && <div className="mt-6 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">{error.message}</div>}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {(rides ?? []).map((r:any)=> <RideCard key={r.id} ride={r} />)}
      </div>
      {(rides ?? []).length===0 && !error && (
        <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600 text-sm">
          {dict.search?.noResults}<br/>
          <a href="/rides/new" className="mt-3 inline-flex h-9 px-4 items-center rounded-xl bg-teal-700 text-white font-semibold">Fahrt anbieten</a>
        </div>
      )}

      {/* Map placeholder — abstraction */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="text-sm font-semibold">Karte · Map (MapLibre / OSM)</div>
        <div className="mt-3 h-64 rounded-xl bg-slate-100 border border-slate-200 grid place-items-center text-slate-500 text-sm">
          Kartenansicht — Provider-Abstraktion (`LocationProvider`/`RoutingProvider`).<br/>Standard: MapLibre + OpenStreetMap (kostenlos). Tauschbar zu Mapbox/Google ohne UI-Änderungen.
        </div>
        <div className="mt-2 text-xs text-slate-500">LEGAL_REVIEW: Karten-Provider benötigt ggf. eigene Datenschutzerklärung. API-Keys nur serverseitig (siehe <code>/api/maps/*</code>).</div>
      </div>
    </div>
  );
}
