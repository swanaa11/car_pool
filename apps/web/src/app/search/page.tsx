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
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8 animate-fadeIn">
      <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">{dict.search?.title}</h1>
      <div className="mt-4 rounded-[24px] bg-white dark:bg-slate-900 p-4 shadow-xl border border-slate-200 dark:border-slate-700"><SearchForm dict={dict} /></div>

      <div className="mt-6 flex flex-wrap gap-2 text-xs">
        {from && <span className="px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">{dict.search?.from}: {from}</span>}
        {to && <span className="px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">{dict.search?.to}: {to}</span>}
        {date && <span className="px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">{dict.search?.date}: {date}</span>}
        <span className="px-3.5 py-1.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold">{rides?.length ?? 0} {dict.search?.results?.replace("{count}", String(rides?.length ?? 0)) ?? `${rides?.length} rides`}</span>
      </div>

      {error && <div className="mt-6 rounded-xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 p-4 text-sm text-red-700 dark:text-red-300">{error.message}</div>}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {(rides ?? []).map((r:any)=> <RideCard key={r.id} ride={r} dict={dict} />)}
      </div>
      {(rides ?? []).length===0 && !error && (
        <div className="mt-10 rounded-[24px] border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-10 sm:p-12 text-center">
          <div className="mx-auto h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 grid place-items-center">🔍</div>
          <div className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-300">{dict.search?.noResults}</div>
          <a href="/rides/new" className="mt-4 inline-flex h-10 px-5 items-center justify-center rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all">{dict.nav?.offer ?? "Offer a ride"}</a>
        </div>
      )}

      <div className="mt-8 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 sm:p-5">
        <div className="text-sm font-semibold text-slate-900 dark:text-white">{dict.search?.title} · Map (MapLibre / OSM)</div>
        <div className="mt-3 h-64 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 grid place-items-center text-slate-500 dark:text-slate-400 text-sm text-center p-4">
          Map view — Provider abstraction (`LocationProvider`/`RoutingProvider`).<br/>Standard: MapLibre + OpenStreetMap (free). Swappable to Mapbox/Google without UI changes.
        </div>
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">LEGAL_REVIEW: Maps provider may need its own privacy policy. API keys server-side only (see <code>/api/maps/*</code>).</div>
      </div>
    </div>
  );
}
