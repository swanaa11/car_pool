"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ProfileForm({ initial, vehicles, email }: { initial:any; vehicles:any[]; email:string }){
  const [form,setForm]=useState({ first_name: initial?.first_name ?? "", last_name: initial?.last_name ?? "", city: initial?.city ?? "", bio: initial?.bio ?? "" });
  const [msg,setMsg]=useState<string|null>(null); const [err,setErr]=useState<string|null>(null);
  const save=async(e:React.FormEvent)=>{
    e.preventDefault(); setMsg(null); setErr(null);
    const supabase=createClient();
    const { data:{user} } = await supabase.auth.getUser();
    if(!user) return setErr("Nicht angemeldet");
    const { error } = await supabase.from("profiles").update({ first_name: form.first_name, last_name: form.last_name, city: form.city, bio: form.bio }).eq("id", user.id);
    if(error) setErr(error.message); else setMsg("Gespeichert ✓");
  };
  return (
    <form onSubmit={save} className="mt-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {msg && <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-700">{msg}</div>}
      {err && <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">{err}</div>}
      <div className="text-sm text-slate-600">E-Mail: <span className="font-medium text-slate-900">{email}</span> · Bewertung: ★ {Number(initial?.rating_avg ?? 5).toFixed(1)} ({initial?.rating_count ?? 0}) · Fahrten: {initial?.completed_rides ?? 0}</div>
      <div className="grid grid-cols-2 gap-3">
        <label className="grid gap-1"><span className="text-sm font-medium">Vorname</span><input value={form.first_name} onChange={e=>setForm({...form,first_name:e.target.value})} className="h-11 rounded-xl border border-slate-200 px-3 text-sm"/></label>
        <label className="grid gap-1"><span className="text-sm font-medium">Nachname</span><input value={form.last_name} onChange={e=>setForm({...form,last_name:e.target.value})} className="h-11 rounded-xl border border-slate-200 px-3 text-sm"/></label>
      </div>
      <label className="grid gap-1"><span className="text-sm font-medium">Stadt · City</span><input value={form.city} onChange={e=>setForm({...form,city:e.target.value})} placeholder="Berlin" className="h-11 rounded-xl border border-slate-200 px-3 text-sm"/></label>
      <label className="grid gap-1"><span className="text-sm font-medium">Über mich · Bio</span><textarea value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})} rows={3} maxLength={500} className="rounded-xl border border-slate-200 p-3 text-sm"/></label>
      <button className="h-11 rounded-xl bg-teal-700 text-white font-semibold">Speichern · Save</button>
      <div className="text-xs text-slate-500">Fahrzeuge: {vehicles.length ? vehicles.map(v=> `${v.make} ${v.model} (${v.seats_total} Plätze)`).join(", ") : "Noch kein Fahrzeug — im nächsten Schritt hinzufügen."}</div>
    </form>
  );
}
