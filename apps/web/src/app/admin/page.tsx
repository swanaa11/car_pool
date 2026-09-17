import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
export default async function Admin(){
  const supabase = createClient();
  const { data:{user} } = await supabase.auth.getUser();
  if(!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if(!profile || !["ADMIN","MODERATOR"].includes(profile.role)) return <div className="mx-auto max-w-6xl px-4 py-10 text-center">Kein Zugriff — Admin/Moderator erforderlich.</div>;
  const [{count: userCount}, {count: rideCount}, {count: bookingCount}, {count: reportCount}] = await Promise.all([
    supabase.from("profiles").select("*",{count:"exact", head:true}),
    supabase.from("rides").select("*",{count:"exact", head:true}),
    supabase.from("bookings").select("*",{count:"exact", head:true}),
    supabase.from("reports").select("*",{count:"exact", head:true}),
  ]);
  const { data: reports } = await supabase.from("reports").select("*").order("created_at",{ascending:false}).limit(10);
  const { data: rides } = await supabase.from("rides").select("id,origin_label,destination_label,departure_at,driver_id,status").order("created_at",{ascending:false}).limit(10);
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-2xl font-black tracking-tight">Admin-Dashboard · Moderation</h1>
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5"><div className="text-xs text-slate-500">Nutzer</div><div className="text-2xl font-black">{userCount ?? 0}</div></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5"><div className="text-xs text-slate-500">Fahrten</div><div className="text-2xl font-black">{rideCount ?? 0}</div></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5"><div className="text-xs text-slate-500">Buchungen</div><div className="text-2xl font-black">{bookingCount ?? 0}</div></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5"><div className="text-xs text-slate-500">Meldungen</div><div className="text-2xl font-black">{reportCount ?? 0}</div></div>
      </div>
      <div className="mt-8 grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="font-semibold">Letzte Meldungen · Reports</div>
          <div className="mt-3 grid gap-2 text-sm">
            {(reports ?? []).map((r:any)=><div key={r.id} className="rounded-xl border border-slate-200 p-3 flex justify-between"><span>{r.reason} — {r.status}</span><span className="text-xs text-slate-500">{new Date(r.created_at).toLocaleString("de-DE")}</span></div>)}
            {(reports ?? []).length===0 && <div className="text-sm text-slate-500">Keine Meldungen.</div>}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="font-semibold">Letzte Fahrten</div>
          <div className="mt-3 grid gap-2 text-sm">
            {(rides ?? []).map((r:any)=><div key={r.id} className="rounded-xl border border-slate-200 p-3 flex justify-between"><span>{r.origin_label} → {r.destination_label}</span><span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200">{r.status}</span></div>)}
          </div>
        </div>
      </div>
      <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">Hinweis: Alle Admin-Aktionen werden in <code>audit_logs</code> & <code>admin_actions</code> protokolliert. RLS erzwingt serverseitige Autorisierung — Frontend-Routen allein schützen nicht.</div>
    </div>
  );
}
