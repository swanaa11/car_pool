import Link from "next/link";
import { centsToEuro } from "@/lib/utils";

export function RideCard({ ride }: { ride:any }) {
  const driver = ride.driver ?? ride.profiles ?? {};
  const name = `${driver.first_name ?? ""} ${driver.last_name ?? ""}`.trim() || "Fahrer";
  const rating = driver.rating_avg ?? 5.0;
  return (
    <Link href={`/rides/${ride.id}`} className="block rounded-2xl border border-slate-200 bg-white p-4 hover:shadow-md transition shadow-sm">
      <div className="flex gap-3">
        <div className="h-10 w-10 rounded-full bg-teal-700 text-white grid place-items-center font-semibold shrink-0">
          {driver.avatar_url ? <img src={driver.avatar_url} alt={name} className="h-10 w-10 rounded-full object-cover"/> : name.slice(0,1).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm">{name}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700">★ {Number(rating).toFixed(1)}</span>
            {driver.verification_badges?.includes("phone") && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">verifiziert</span>}
          </div>
          <div className="mt-2 grid gap-1">
            <div className="flex items-center gap-2 text-sm">
              <span className="h-2 w-2 rounded-full bg-teal-600"></span>
              <span className="font-medium truncate">{ride.origin_label}</span>
            </div>
            <div className="ml-1 border-l-2 border-dotted border-slate-200 h-4"></div>
            <div className="flex items-center gap-2 text-sm">
              <span className="h-2 w-2 rounded-full bg-slate-900"></span>
              <span className="font-medium truncate">{ride.destination_label}</span>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
            <span className="px-2 py-1 rounded-full bg-slate-100 border border-slate-200">{new Date(ride.departure_at).toLocaleString("de-DE",{weekday:"short", day:"2-digit", month:"short", hour:"2-digit", minute:"2-digit"})}</span>
            <span className="px-2 py-1 rounded-full bg-slate-100 border border-slate-200">{ride.seats_available} Plätze frei</span>
            <span className="px-2 py-1 rounded-full bg-slate-100 border border-slate-200">{centsToEuro(ride.contribution_cents)} p.P.</span>
            {ride.pets_allowed && <span className="px-2 py-1 rounded-full bg-slate-100">🐾</span>}
            {ride.smoking_allowed ? <span className="px-2 py-1 rounded-full bg-slate-100">🚬</span> : <span className="px-2 py-1 rounded-full bg-slate-100">🚭</span>}
          </div>
        </div>
        <div className="hidden sm:flex flex-col items-end justify-between">
          <span className="text-sm font-bold text-teal-700">{centsToEuro(ride.contribution_cents)}</span>
          <span className="text-xs text-slate-500">Ansehen →</span>
        </div>
      </div>
    </Link>
  );
}
