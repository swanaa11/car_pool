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
    <form onSubmit={onSubmit} className="grid gap-3 rounded-[1.7rem] bg-white p-4 shadow-xl border border-slate-200 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
      <label className="grid gap-1">
        <span className="text-xs font-semibold text-slate-600">{dict.search?.from}</span>
        <input value={from} onChange={e=>setFrom(e.target.value)} placeholder="Berlin" className="h-12 rounded-xl border border-slate-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-700" />
      </label>
      <label className="grid gap-1">
        <span className="text-xs font-semibold text-slate-600">{dict.search?.to}</span>
        <input value={to} onChange={e=>setTo(e.target.value)} placeholder="Potsdam" className="h-12 rounded-xl border border-slate-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-700" />
      </label>
      <div className="grid gap-3 sm:grid-cols-[1.2fr_0.7fr_auto] sm:items-end">
        <label className="grid gap-1">
          <span className="text-xs font-semibold text-slate-600">{dict.search?.date}</span>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="h-12 rounded-xl border border-slate-200 px-3 text-sm" />
        </label>
        <label className="grid gap-1">
          <span className="text-xs font-semibold text-slate-600">{dict.search?.seats}</span>
          <select value={seats} onChange={e=>setSeats(e.target.value)} className="h-12 rounded-xl border border-slate-200 px-3 text-sm">
            {[1,2,3,4,5,6].map(n=><option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <button className="h-12 rounded-xl bg-teal-700 px-6 text-sm font-semibold text-white hover:bg-teal-800">{dict.search?.searchBtn}</button>
      </div>
    </form>
  );
}
