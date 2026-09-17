"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function Header({ locale, dict }: { locale:string; dict:any }) {
  const [user, setUser] = useState<any>(null);
  const [lang, setLang] = useState(locale);
  useEffect(()=>{
    const supabase=createClient();
    supabase.auth.getUser().then(({data})=> setUser(data.user));
    const {data: {subscription}} = supabase.auth.onAuthStateChange((_e, sess)=> setUser(sess?.user ?? null));
    return ()=> subscription.unsubscribe();
  },[]);
  const switchLang = async (l:string) => {
    setLang(l);
    document.cookie = `locale=${l}; path=/; max-age=31536000`;
    window.location.reload();
  };
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/80 border-b border-slate-200">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tight">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-teal-700 text-white">C</span>
          <span>CarPull</span>
          <span className="hidden sm:inline text-slate-400 font-normal text-sm ml-1">{dict.brand?.tagline ?? ""}</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1 text-sm">
          <Link href="/search" className="px-3 py-2 rounded-xl hover:bg-slate-100">{dict.nav?.search}</Link>
          <Link href="/rides/new" className="px-3 py-2 rounded-xl hover:bg-slate-100">{dict.nav?.offer}</Link>
          <Link href="/how-it-works" className="px-3 py-2 rounded-xl hover:bg-slate-100">{dict.nav?.howItWorks}</Link>
          <Link href="/safety" className="px-3 py-2 rounded-xl hover:bg-slate-100">{dict.nav?.safety}</Link>
        </nav>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex rounded-full border border-slate-200 p-1 text-xs">
            <button onClick={()=>switchLang("de")} className={`px-3 py-1 rounded-full ${lang==="de"?"bg-slate-900 text-white":"text-slate-600"}`}>DE</button>
            <button onClick={()=>switchLang("en")} className={`px-3 py-1 rounded-full ${lang==="en"?"bg-slate-900 text-white":"text-slate-600"}`}>EN</button>
          </div>
          {user ? (
            <>
              <Link href="/my-rides" className="hidden sm:inline-flex h-9 px-4 items-center rounded-xl border border-slate-200 text-sm font-medium hover:bg-slate-50">{dict.nav?.myRides}</Link>
              <Link href="/messages" className="hidden sm:inline-flex h-9 px-4 items-center rounded-xl border border-slate-200 text-sm font-medium hover:bg-slate-50">{dict.nav?.messages}</Link>
              <Link href="/profile" className="h-9 w-9 rounded-full bg-teal-700 text-white grid place-items-center font-semibold">{(user.email?.[0] ?? "U").toUpperCase()}</Link>
            </>
          ) : (
            <>
              <Link href="/login" className="h-9 px-4 inline-flex items-center rounded-xl border border-slate-200 text-sm font-medium hover:bg-slate-50">{dict.nav?.login}</Link>
              <Link href="/register" className="h-9 px-4 inline-flex items-center rounded-xl bg-teal-700 text-white text-sm font-semibold hover:bg-teal-800">{dict.nav?.register}</Link>
            </>
          )}
        </div>
      </div>
      <div className="md:hidden border-t border-slate-100 bg-white">
        <div className="mx-auto max-w-6xl px-2 py-2 flex gap-1 overflow-auto text-sm">
          <Link href="/search" className="px-3 py-2 rounded-xl bg-slate-100 whitespace-nowrap">{dict.nav?.search}</Link>
          <Link href="/rides/new" className="px-3 py-2 rounded-xl bg-slate-100 whitespace-nowrap">{dict.nav?.offer}</Link>
          <Link href="/my-rides" className="px-3 py-2 rounded-xl bg-slate-100 whitespace-nowrap">{dict.nav?.myRides}</Link>
          <Link href="/messages" className="px-3 py-2 rounded-xl bg-slate-100 whitespace-nowrap">{dict.nav?.messages}</Link>
        </div>
      </div>
    </header>
  );
}
