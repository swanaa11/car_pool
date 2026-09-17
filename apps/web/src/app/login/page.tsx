"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage(){
  const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [err,setErr]=useState<string|null>(null); const [loading,setLoading]=useState(false);
  const router=useRouter();
  const onSubmit=async(e:React.FormEvent)=>{
    e.preventDefault(); setLoading(true); setErr(null);
    const supabase=createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if(error) setErr(error.message); else router.push("/"); 
    setLoading(false);
  };
  const magic=async()=>{
    const supabase=createClient();
    const { error } = await supabase.auth.signInWithOtp({ email, options:{ emailRedirectTo: window.location.origin } });
    if(error) setErr(error.message); else alert("Magic Link gesendet — E-Mails prüfen.");
  };
  const google=async()=>{
    const supabase=createClient();
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options:{ redirectTo: window.location.origin } });
    if(error) setErr(error.message);
  };
  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-black tracking-tight">Willkommen zurück · Welcome back</h1>
      <form onSubmit={onSubmit} className="mt-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {err && <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">{err}</div>}
        <label className="grid gap-1"><span className="text-sm font-medium">E-Mail</span><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="anna@example.de" className="h-11 rounded-xl border border-slate-200 px-3 text-sm"/></label>
        <label className="grid gap-1"><span className="text-sm font-medium">Passwort · Password</span><input type="password" required value={password} onChange={e=>setPassword(e.target.value)} className="h-11 rounded-xl border border-slate-200 px-3 text-sm"/></label>
        <button disabled={loading} className="h-11 rounded-xl bg-teal-700 text-white font-semibold disabled:opacity-50">{loading ? "…" : "Anmelden · Log in"}</button>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={magic} className="h-10 rounded-xl border border-slate-200 text-sm font-medium hover:bg-slate-50">Magic Link</button>
          <button type="button" onClick={google} className="h-10 rounded-xl border border-slate-200 text-sm font-medium hover:bg-slate-50">Google</button>
        </div>
        <div className="text-center text-sm text-slate-600">Kein Konto? <Link href="/register" className="font-semibold text-teal-700 hover:underline">Registrieren</Link> · <Link href="/forgot-password" className="underline">Passwort vergessen?</Link></div>
      </form>
    </div>
  );
}
