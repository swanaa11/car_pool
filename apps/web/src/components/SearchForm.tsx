"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { IconPin, IconSwap, IconSearch } from "./icons";

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
  const swap = () => { setFrom(to); setTo(from); };
  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      <div className="relative grid gap-2 sm:grid-cols-2 sm:gap-0 rounded-xl border border-slate-200 dark:border-slate-700 sm:divide-x divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
        <label className="grid gap-1 px-4 py-2.5">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{dict.search?.from}</span>
          <span className="flex items-center gap-2">
            <IconPin className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
            <input value={from} onChange={e=>setFrom(e.target.value)} placeholder="Berlin" className="w-full bg-transparent text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 placeholder:font-normal focus:outline-none" />
          </span>
        </label>
        <label className="grid gap-1 px-4 py-2.5">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{dict.search?.to}</span>
          <span className="flex items-center gap-2">
            <IconPin className="h-4 w-4 text-slate-900 dark:text-slate-200 shrink-0" />
            <input value={to} onChange={e=>setTo(e.target.value)} placeholder="Potsdam" className="w-full bg-transparent text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 placeholder:font-normal focus:outline-none" />
          </span>
        </label>
        <button
          type="button"
          onClick={swap}
          aria-label="Start und Ziel tauschen"
          className="hidden sm:grid absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 place-items-center rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-300 shadow-sm hover:text-teal-600 hover:border-teal-300 hover:rotate-180 transition-all duration-300"
        >
          <IconSwap className="h-4 w-4" />
        </button>
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
        <button className="col-span-2 sm:col-span-1 h-12 rounded-xl bg-amber-400 hover:bg-amber-300 text-asphalt px-6 sm:px-8 text-sm font-bold shadow-md shadow-amber-500/30 hover:shadow-lg hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
          <IconSearch className="h-4 w-4" /> {dict.search?.searchBtn}
        </button>
      </div>
    </form>
  );
}
