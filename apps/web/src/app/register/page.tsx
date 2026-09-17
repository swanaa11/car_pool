"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage(){
  const [form,setForm]=useState({first_name:"",last_name:"",email:"",password:""}); const [err,setErr]=useState<string|null>(null); const [loading,setLoading]=useState(false);
  const router=useRouter();
  const onSubmit=async(e:React.FormEvent)=>{
    e.preventDefault(); setLoading(true); setErr(null);
    const supabase=createClient();
    const { error } = await supabase.auth.signUp({ email: form.email, password: form.password, options:{ data:{ first_name: form.first_name, last_name: form.last_name } } });
    if(error) setErr(error.message); else { alert("Konto erstellt — E-Mail bestätigen, falls erforderlich."); router.push("/login"); }
    setLoading(false);
  };
  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-black tracking-tight">Konto erstellen · Create account</h1>
      <form onSubmit={onSubmit} className="mt-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {err && <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">{err}</div>}
        <div className="grid grid-cols-2 gap-3">
          <label className="grid gap-1"><span className="text-sm font-medium">Vorname</span><input required value={form.first_name} onChange={e=>setForm({...form,first_name:e.target.value})} className="h-11 rounded-xl border border-slate-200 px-3 text-sm"/></label>
          <label className="grid gap-1"><span className="text-sm font-medium">Nachname</span><input required value={form.last_name} onChange={e=>setForm({...form,last_name:e.target.value})} className="h-11 rounded-xl border border-slate-200 px-3 text-sm"/></label>
        </div>
        <label className="grid gap-1"><span className="text-sm font-medium">E-Mail</span><input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="anna@example.de" className="h-11 rounded-xl border border-slate-200 px-3 text-sm"/></label>
        <label className="grid gap-1"><span className="text-sm font-medium">Passwort · Password (min. 6)</span><input type="password" required minLength={6} value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="h-11 rounded-xl border border-slate-200 px-3 text-sm"/></label>
        <button disabled={loading} className="h-11 rounded-xl bg-teal-700 text-white font-semibold disabled:opacity-50">{loading?"…":"Registrieren · Sign up"}</button>
        <div className="text-center text-sm text-slate-600">Schon registriert? <Link href="/login" className="font-semibold text-teal-700 hover:underline">Anmelden</Link></div>
        <p className="text-xs text-slate-500">Mit der Registrierung stimmst du <Link href="/terms" className="underline">AGB</Link> & <Link href="/privacy" className="underline">Datenschutz</Link> zu.</p>
      </form>
    </div>
  );
}
