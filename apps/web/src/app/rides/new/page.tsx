"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function NewRidePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string|null>(null);
  const [form, setForm] = useState({
    origin_label: "", destination_label: "", departure_at: "", seats_total: 3, contribution_cents: 500,
    smoking_allowed: false, pets_allowed: false, luggage_large: true, conversation_pref: "whatever", notes: "",
  });
  const submit = async (e:React.FormEvent)=>{
    e.preventDefault(); setLoading(true); setErr(null);
    try {
      const supabase = createClient();
      const { data:{user} } = await supabase.auth.getUser();
      if(!user) throw new Error("Bitte anmelden / Please log in");
      // basic validation
      if(!form.origin_label || !form.destination_label) throw new Error("Start/Ziel erforderlich");
      const iso = form.departure_at ? new Date(form.departure_at).toISOString() : new Date(Date.now()+86400000).toISOString();
      const { data, error } = await supabase.from("rides").insert({
        driver_id: user.id,
        origin_label: form.origin_label,
        destination_label: form.destination_label,
        departure_at: iso,
        seats_total: Number(form.seats_total),
        seats_available: Number(form.seats_total),
        contribution_cents: Number(form.contribution_cents),
        smoking_allowed: form.smoking_allowed,
        pets_allowed: form.pets_allowed,
        luggage_large: form.luggage_large,
        conversation_pref: form.conversation_pref,
        notes: form.notes || null,
      }).select("id").single();
      if(error) throw error;
      router.push(`/rides/${data.id}`);
    } catch (e:any){ setErr(e.message ?? String(e)); } finally { setLoading(false); }
  };
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-black tracking-tight">Fahrt anbieten · Offer a ride</h1>
      <p className="mt-2 text-sm text-slate-600">Teile deine Fahrt — transparente Kostenbeteiligung, kein Taxipreis. / Share your ride — transparent cost-sharing.</p>
      <form onSubmit={submit} className="mt-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {err && <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">{err}</div>}
        <label className="grid gap-1"><span className="text-sm font-medium">Startort · Origin *</span><input value={form.origin_label} onChange={e=>setForm({...form, origin_label:e.target.value})} placeholder="Berlin Hbf" className="h-11 rounded-xl border border-slate-200 px-3 text-sm"/></label>
        <label className="grid gap-1"><span className="text-sm font-medium">Zielort · Destination *</span><input value={form.destination_label} onChange={e=>setForm({...form, destination_label:e.target.value})} placeholder="Potsdam Hbf" className="h-11 rounded-xl border border-slate-200 px-3 text-sm"/></label>
        <label className="grid gap-1"><span className="text-sm font-medium">Abfahrt · Departure</span><input type="datetime-local" value={form.departure_at} onChange={e=>setForm({...form, departure_at:e.target.value})} className="h-11 rounded-xl border border-slate-200 px-3 text-sm"/></label>
        <div className="grid grid-cols-2 gap-4">
          <label className="grid gap-1"><span className="text-sm font-medium">Plätze · Seats</span><select value={form.seats_total} onChange={e=>setForm({...form, seats_total: parseInt(e.target.value)})} className="h-11 rounded-xl border border-slate-200 px-3 text-sm">{[1,2,3,4,5,6,7,8].map(n=><option key={n} value={n}>{n}</option>)}</select></label>
          <label className="grid gap-1"><span className="text-sm font-medium">Beteiligung (Cent) · Contribution (cents)</span><input type="number" min={0} max={9900} value={form.contribution_cents} onChange={e=>setForm({...form, contribution_cents: parseInt(e.target.value||"0")})} className="h-11 rounded-xl border border-slate-200 px-3 text-sm"/><span className="text-xs text-slate-500">{(form.contribution_cents/100).toFixed(2).replace(".",",")} € p.P.</span></label>
        </div>
        <div className="grid gap-2 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.smoking_allowed} onChange={e=>setForm({...form, smoking_allowed:e.target.checked})}/> Rauchen erlaubt · Smoking allowed</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.pets_allowed} onChange={e=>setForm({...form, pets_allowed:e.target.checked})}/> Haustiere erlaubt · Pets allowed</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.luggage_large} onChange={e=>setForm({...form, luggage_large:e.target.checked})}/> Großes Gepäck · Large luggage</label>
          <label className="grid gap-1"><span className="text-sm font-medium">Gespräch · Conversation</span><select value={form.conversation_pref} onChange={e=>setForm({...form, conversation_pref:e.target.value})} className="h-11 rounded-xl border border-slate-200 px-3 text-sm"><option value="whatever">Egal · Whatever</option><option value="quiet">Ruhig · Quiet</option><option value="chatty">Gesprächig · Chatty</option></select></label>
        </div>
        <label className="grid gap-1"><span className="text-sm font-medium">Hinweise · Notes</span><textarea value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} rows={3} placeholder="Treffpunkt, Gepäck, Musik …" className="rounded-xl border border-slate-200 p-3 text-sm"/></label>
        <button disabled={loading} className="h-11 rounded-xl bg-teal-700 text-white font-semibold hover:bg-teal-800 disabled:opacity-50">{loading ? "Speichert…" : "Fahrt veröffentlichen · Publish ride"}</button>
        <p className="text-xs text-slate-500">Mit dem Veröffentlichen stimmst du den Bedingungen zu. Wiederkehrende Fahrten: erstelle mehrere Einzel-Fahrten oder nutze die kommende Recurring-API.</p>
      </form>
    </div>
  );
}
