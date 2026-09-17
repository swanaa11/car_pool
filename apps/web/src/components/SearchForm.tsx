"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function SearchForm({ dict }: { dict:any }) {
  const router = useRouter();
  const sp = useSearchParams();
  const [from, setFrom] = useState(sp.get("from") ?? "");
  const [to, setTo] = useState(sp.get("to") ?? "");
  const [date, setDate] = useState(sp.get("date") ?? "");
  const [seats, setSeats] = useState(sp.get("seats") ?? "1");
  const onSubmit = (e:React.FormEvent)=>{
    e.preventDefault();
    const p = new URLSearchParams();
    if(from) p.set("from", from);
    if(to) p.set("to", to);
    if(date) p.set("date", date);
    if(seats) p.set("seats", seats);
    router.push(`/search?${p.toString()}`);
  };
  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1.5">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">◎ {dict.search?.from}</span>
          <input value={from} onChange={e=>setFrom(e.target.value)} placeholder="Berlin" className="h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-400 focus:border-transparent transition-all" />
        </label>
        <label className="grid gap-1.5">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">◎ {dict.search?.to}</span>
          <input value={to} onChange={e=>setTo(e.target.value)} placeholder="Potsdam" className="h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-400 transition-all" />
        </label>
      </div>
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-[1.4fr_0.8fr_auto] sm:items-end">
        <label className="grid gap-1.5">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{dict.search?.date}</span>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-400" />
        </label>
        <label className="grid gap-1.5">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{dict.search?.seats}</span>
          <select value={seats} onChange={e=>setSeats(e.target.value)} className="h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-400">
            {[1,2,3,4,5,6].map(n=><option key={n} value={n}>{n} {n===1? (dict.search?.seats||""): ""}</option>)}
          </select>
        </label>
        <button className="col-span-2 sm:col-span-1 h-12 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 sm:px-8 text-sm font-bold shadow-lg shadow-teal-600/20 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
          <span>🔍</span> {dict.search?.searchBtn}
        </button>
      </div>
    </form>
  );
}
