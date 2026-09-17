"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
export default function Forgot(){
  const [email,setEmail]=useState(""); const [msg,setMsg]=useState<string|null>(null);
  const submit=async(e:React.FormEvent)=>{
    e.preventDefault();
    const supabase=createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
    if(error) setMsg(error.message); else setMsg("E-Mail gesendet — Postfach prüfen.");
  };
  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-black">Passwort zurücksetzen</h1>
      <form onSubmit={submit} className="mt-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-6">
        <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="E-Mail" className="h-11 rounded-xl border border-slate-200 px-3 text-sm"/>
        <button className="h-11 rounded-xl bg-teal-700 text-white font-semibold">Link senden</button>
        {msg && <div className="text-sm text-slate-600">{msg}</div>}
      </form>
    </div>
  );
}
