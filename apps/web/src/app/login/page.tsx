"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/I18nProvider";
export default function LoginPage(){
  const { dict } = useI18n();
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
    if(error) setErr(error.message); else alert(dict.auth?.magicLink ?? "Magic Link sent");
  };
  const google=async()=>{
    const supabase=createClient();
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options:{ redirectTo: window.location.origin } });
    if(error) setErr(error.message);
  };
  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:py-14 animate-fadeIn">
      <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">{dict.auth?.loginTitle}</h1>
      <form onSubmit={onSubmit} className="mt-6 grid gap-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
        {err && <div className="rounded-xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 p-3 text-sm text-red-700 dark:text-red-300">{err}</div>}
        <label className="grid gap-1.5"><span className="text-sm font-medium text-slate-900 dark:text-white">{dict.auth?.email}</span><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="anna@example.de" className="h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-400 focus:outline-none" /></label>
        <label className="grid gap-1.5"><span className="text-sm font-medium text-slate-900 dark:text-white">{dict.auth?.password}</span><input type="password" required value={password} onChange={e=>setPassword(e.target.value)} className="h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-400 focus:outline-none" /></label>
        <button disabled={loading} className="h-11 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold shadow-md disabled:opacity-50 hover:shadow-lg transition-all">{loading ? (dict.common?.loading ?? "Loading…") : (dict.auth?.loginTitle ?? "Log in")}</button>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={magic} className="h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white transition-colors">{dict.auth?.magicLink}</button>
          <button type="button" onClick={google} className="h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white transition-colors">Google</button>
        </div>
        <div className="text-center text-sm text-slate-600 dark:text-slate-400">{dict.auth?.noAccount} <Link href="/register" className="font-semibold text-teal-700 dark:text-teal-400 hover:underline">{dict.nav?.register}</Link> · <Link href="/forgot-password" className="underline">{dict.auth?.forgot}</Link></div>
      </form>
    </div>
  );
}