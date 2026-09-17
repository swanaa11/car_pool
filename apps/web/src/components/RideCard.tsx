import Link from "next/link";
import { centsToEuro } from "@/lib/utils";

export function RideCard({ ride, dict }: { ride:any; dict?: any }) {
  const driver = ride.driver ?? ride.profiles ?? {};
  const name = `${driver.first_name ?? ""} ${driver.last_name ?? ""}`.trim() || (dict?.ride?.detail ?? "Driver");
  const rating = driver.rating_avg ?? 5.0;
  const seatsText = dict?.ride?.seatsAvailable ? dict.ride.seatsAvailable.replace("{n}", String(ride.seats_available)) : `${ride.seats_available} ${dict?.search?.seats ?? "Seats"}`;
  const perPerson = dict?.ride?.perPerson ?? "per person";
  const verified = dict?.common?.success ?? "verified";
  return (
    <Link href={`/rides/${ride.id}`} className="block rounded-[20px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 hover:shadow-xl hover:shadow-teal-500/10 dark:hover:shadow-teal-400/10 hover:-translate-y-1 transition-all duration-300 shadow-sm card-hover">
      <div className="flex gap-3 sm:gap-4">
        <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-teal-600 to-cyan-600 text-white grid place-items-center font-bold shadow-md shrink-0 overflow-hidden">
          {driver.avatar_url ? <img src={driver.avatar_url} alt={name} className="h-11 w-11 sm:h-12 sm:w-12 rounded-full object-cover"/> : name.slice(0,1).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-slate-900 dark:text-white truncate max-w-[120px] sm:max-w-none">{name}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-300 font-medium">★ {Number(rating).toFixed(1)}</span>
            {driver.verification_badges?.includes("phone") && <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 font-medium">{verified}</span>}
          </div>
          <div className="mt-2.5 grid gap-1.5">
            <div className="flex items-center gap-2 text-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-teal-600 shadow-sm shadow-teal-600/30 shrink-0"></span>
              <span className="font-medium truncate text-slate-900 dark:text-white text-[13px] sm:text-sm">{ride.origin_label}</span>
            </div>
            <div className="ml-1 border-l-2 border-dotted border-slate-200 dark:border-slate-700 h-3"></div>
            <div className="flex items-center gap-2 text-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-900 dark:bg-slate-200 shrink-0"></span>
              <span className="font-medium truncate text-slate-900 dark:text-white text-[13px] sm:text-sm">{ride.destination_label}</span>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5 sm:gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium">{new Date(ride.departure_at).toLocaleString("de-DE",{weekday:"short", day:"2-digit", month:"short", hour:"2-digit", minute:"2-digit"})}</span>
            <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium">{seatsText}</span>
            <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hidden sm:inline">{centsToEuro(ride.contribution_cents)} {perPerson}</span>
            <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 inline-flex items-center gap-1 sm:hidden">{centsToEuro(ride.contribution_cents)}</span>
            {ride.pets_allowed && <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800">🐾</span>}
            {ride.smoking_allowed ? <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800">🚬</span> : <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800">🚭</span>}
          </div>
        </div>
        <div className="hidden sm:flex flex-col items-end justify-between shrink-0">
          <span className="text-[15px] font-black text-teal-700 dark:text-teal-400">{centsToEuro(ride.contribution_cents)}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{dict?.common?.next ?? "View"} →</span>
        </div>
      </div>
      {/* Mobile price row */}
      <div className="sm:hidden mt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
        <span className="text-sm font-bold text-teal-700 dark:text-teal-400">{centsToEuro(ride.contribution_cents)} <span className="font-normal text-xs text-slate-500 dark:text-slate-400">{perPerson}</span></span>
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">{dict?.ride?.detail ?? "Details"} →</span>
      </div>
    </Link>
  );
}
