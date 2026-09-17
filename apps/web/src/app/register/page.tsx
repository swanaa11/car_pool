"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/I18nProvider";
export default function RegisterPage(){
  const { dict } = useI18n();
  const [firstName,setFirstName]=useState(""); const [lastName,setLastName]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [err,setErr]=useState<string|null>(null); const [loading,setLoading]=useState(false);
  const router=useRouter();
  const onSubmit=async(e:React.FormEvent)=>{
    e.preventDefault(); setLoading(true); setErr(null);
    const supabase=createClient();
    const { data, error } = await supabase.auth.signUp({ email, password, options:{ data:{ first_name:firstName, last_name:lastName } } });
    if(error) setErr(error.message); else { alert(dict.common?.success ?? "Success — check email"); router.push("/login"); }
    setLoading(false);
  };
  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:py-14 animate-fadeIn">
      <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">{dict.auth?.registerTitle}</h1>
      <form onSubmit={onSubmit} className="mt-6 grid gap-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
        {err && <div className="rounded-xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 p-3 text-sm text-red-700 dark:text-red-300">{err}</div>}
        <div className="grid grid-cols-2 gap-3">
          <label className="grid gap-1.5"><span className="text-sm font-medium text-slate-900 dark:text-white">{dict.auth?.firstName}</span><input required value={firstName} onChange={e=>setFirstName(e.target.value)} className="h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-400 focus:outline-none" /></label>
          <label className="grid gap-1.5"><span className="text-sm font-medium text-slate-900 dark:text-white">{dict.auth?.lastName}</span><input required value={lastName} onChange={e=>setLastName(e.target.value)} className="h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-400 focus:outline-none" /></label>
        </div>
        <label className="grid gap-1.5"><span className="text-sm font-medium text-slate-900 dark:text-white">{dict.auth?.email}</span><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-400 focus:outline-none" /></label>
        <label className="grid gap-1.5"><span className="text-sm font-medium text-slate-900 dark:text-white">{dict.auth?.password}</span><input type="password" required value={password} onChange={e=>setPassword(e.target.value)} className="h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-400 focus:outline-none" /></label>
        <button disabled={loading} className="h-11 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold shadow-md disabled:opacity-50 hover:shadow-lg transition-all">{loading ? (dict.common?.loading ?? "Loading…") : (dict.auth?.registerTitle ?? "Sign up")}</button>
        <div className="text-center text-sm text-slate-600 dark:text-slate-400">{dict.auth?.hasAccount} <Link href="/login" className="font-semibold text-teal-700 dark:text-teal-400 hover:underline">{dict.nav?.login}</Link></div>
      </form>
    </div>
  );
}