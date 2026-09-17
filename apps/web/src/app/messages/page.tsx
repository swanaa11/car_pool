import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
export default async function MessagesPage(){
  const supabase = createClient();
  const { data:{user} } = await supabase.auth.getUser();
  if(!user) return <div className="mx-auto max-w-6xl px-4 py-10 text-center">Bitte anmelden.</div>;
  // rides where user is driver or has a booking
  const { data: rides } = await supabase.from("rides").select("id,origin_label,destination_label,departure_at,driver_id").or(`driver_id.eq.${user.id}`).order("departure_at",{ascending:false}).limit(20);
  // also fetch rides via bookings
  const { data: bookings } = await supabase.from("bookings").select("ride:rides!inner(id,origin_label,destination_label,departure_at,driver_id)").eq("passenger_id", user.id).limit(20);
  const bookingRides = (bookings ?? []).map((b:any)=> b.ride).filter(Boolean);
  const all = [...(rides ?? []), ...bookingRides];
  const unique = Array.from(new Map(all.map(r=>[r.id,r])).values());
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-2xl font-black tracking-tight">Nachrichten · Messages</h1>
      <div className="mt-6 grid gap-3">
        {unique.map((r:any)=>(
          <Link key={r.id} href={`/messages/${r.id}`} className="rounded-2xl border border-slate-200 bg-white p-4 hover:shadow-sm flex justify-between items-center">
            <div><div className="font-semibold text-sm">{r.origin_label} → {r.destination_label}</div><div className="text-xs text-slate-600">{new Date(r.departure_at).toLocaleString("de-DE")}</div></div>
            <span className="text-xs font-semibold text-teal-700">Chat öffnen →</span>
          </Link>
        ))}
        {unique.length===0 && <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-600">Keine Chats. Buche eine Fahrt oder biete eine an.</div>}
      </div>
    </div>
  );
}
