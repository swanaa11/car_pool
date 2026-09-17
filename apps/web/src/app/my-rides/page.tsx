import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { RideCard } from "@/components/RideCard";
export const dynamic = "force-dynamic";

export default async function MyRides() {
  const supabase = createClient();
  const { data:{user} } = await supabase.auth.getUser();
  if(!user) return <div className="mx-auto max-w-6xl px-4 py-10 text-center">Bitte <Link href="/login" className="underline">anmelden</Link>.</div>;
  const { data: offered } = await supabase.from("rides").select("*, driver:profiles!rides_driver_id_fkey(first_name,last_name,avatar_url,rating_avg,verification_badges)").eq("driver_id", user.id).order("departure_at",{ascending:false}).limit(20);
  const { data: bookings } = await supabase.from("bookings").select("*, ride:rides!bookings_ride_id_fkey(*, driver:profiles!rides_driver_id_fkey(first_name,last_name,avatar_url,rating_avg,verification_badges))").eq("passenger_id", user.id).order("created_at",{ascending:false}).limit(20);
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-2xl font-black tracking-tight">Meine Fahrten · My rides</h1>
      <div className="mt-6 grid lg:grid-cols-2 gap-6">
        <div>
          <h2 className="font-semibold">Als Fahrer · As driver ({offered?.length ?? 0})</h2>
          <div className="mt-3 grid gap-3">{(offered ?? []).map((r:any)=><RideCard key={r.id} ride={r} />)}{(offered ?? []).length===0 && <div className="rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-600">Noch keine Fahrten angeboten. <Link href="/rides/new" className="text-teal-700 underline">Jetzt erstellen</Link>.</div>}</div>
        </div>
        <div>
          <h2 className="font-semibold">Als Mitfahrer · As passenger ({bookings?.length ?? 0})</h2>
          <div className="mt-3 grid gap-3">
            {(bookings ?? []).map((b:any)=>(
              <div key={b.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-sm font-semibold">{b.ride?.origin_label} → {b.ride?.destination_label}</div>
                <div className="text-xs text-slate-600">{b.ride ? new Date(b.ride.departure_at).toLocaleString("de-DE") : ""} · Status: <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200">{b.state}</span></div>
                <Link href={`/rides/${b.ride?.id}`} className="mt-2 inline-flex text-xs font-semibold text-teal-700 hover:underline">Details ansehen →</Link>
              </div>
            ))}
            {(bookings ?? []).length===0 && <div className="rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-600">Noch keine Buchungen.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}