"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import { useI18n } from "./I18nProvider";

export function Header({ initialLocale, initialDict }: { initialLocale: "de" | "en"; initialDict: any }) {
  const { locale, dict, setLocale } = useI18n();
  const { theme, toggle } = useTheme();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  // Sync initial if mismatch (first render)
  useEffect(() => {
    // ensure html lang matches
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, sess) => setUser(sess?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  const switchLang = (l: "de" | "en") => {
    setLocale(l);
    // Trigger server refresh so any server-rendered page re-fetches with new cookie
    // Client dict already updated instantly via provider
    setTimeout(() => router.refresh(), 50);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-6xl px-3 sm:px-4 h-[64px] flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0 group">
          <span className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-600 text-white font-black text-lg shadow-lg shadow-teal-600/20 group-hover:shadow-teal-600/30 transition-all duration-300 group-hover:scale-105">C</span>
          <span className="flex flex-col leading-none">
            <span className="font-black text-[17px] sm:text-xl tracking-tight text-slate-900 dark:text-white">Car Pool</span>
            <span className="hidden sm:block text-[11px] font-medium text-slate-500 dark:text-slate-400 tracking-wide">{dict.brand?.tagline ?? ""}</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1 text-sm">
          <Link href="/search" className="px-3.5 py-2 rounded-xl font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">{dict.nav?.search}</Link>
          <Link href="/rides/new" className="px-3.5 py-2 rounded-xl font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">{dict.nav?.offer}</Link>
          <Link href="/how-it-works" className="px-3.5 py-2 rounded-xl font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">{dict.nav?.howItWorks}</Link>
          <Link href="/safety" className="px-3.5 py-2 rounded-xl font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">{dict.nav?.safety}</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Theme toggle */}
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="h-9 w-9 grid place-items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 shrink-0"
          >
            <span className="text-[16px] leading-none">{theme === "dark" ? "☀️" : "🌙"}</span>
          </button>

          {/* Lang switch */}
          <div className="hidden sm:flex rounded-full border border-slate-200 dark:border-slate-700 p-1 bg-white dark:bg-slate-800 text-xs shadow-sm">
            <button onClick={() => switchLang("de")} className={`px-3 py-1.5 rounded-full font-semibold transition-all ${locale === "de" ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow" : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"}`}>DE</button>
            <button onClick={() => switchLang("en")} className={`px-3 py-1.5 rounded-full font-semibold transition-all ${locale === "en" ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow" : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"}`}>EN</button>
          </div>

          {/* Mobile lang (compact) */}
          <div className="flex sm:hidden rounded-full border border-slate-200 dark:border-slate-700 p-0.5 bg-white dark:bg-slate-800 text-[11px]">
            <button onClick={() => switchLang("de")} className={`px-2 py-1 rounded-full font-bold ${locale === "de" ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900" : "text-slate-600 dark:text-slate-300"}`}>DE</button>
            <button onClick={() => switchLang("en")} className={`px-2 py-1 rounded-full font-bold ${locale === "en" ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900" : "text-slate-600 dark:text-slate-300"}`}>EN</button>
          </div>

          {user ? (
            <>
              <Link href="/my-rides" className="hidden sm:inline-flex h-9 px-3.5 items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">{dict.nav?.myRides}</Link>
              <Link href="/messages" className="hidden sm:inline-flex h-9 px-3.5 items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">{dict.nav?.messages}</Link>
              <Link href="/profile" className="h-9 w-9 rounded-full bg-gradient-to-br from-teal-600 to-cyan-600 text-white grid place-items-center font-bold shadow-md shrink-0">{(user.email?.[0] ?? "U").toUpperCase()}</Link>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden sm:inline-flex h-9 px-4 items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">{dict.nav?.login}</Link>
              <Link href="/register" className="h-9 px-3.5 sm:px-5 inline-flex items-center rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 text-white text-sm font-semibold shadow-md shadow-teal-600/20 hover:shadow-lg hover:shadow-teal-600/25 hover:scale-[1.02] transition-all duration-200">{dict.nav?.register}</Link>
            </>
          )}

          {/* Mobile menu toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden h-9 w-9 grid place-items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <span className="text-slate-700 dark:text-slate-200 text-lg leading-none">{mobileOpen ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl animate-fadeIn">
          <div className="mx-auto max-w-6xl px-3 py-3 grid grid-cols-2 gap-2 text-sm">
            <Link onClick={() => setMobileOpen(false)} href="/search" className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-medium text-center">{dict.nav?.search}</Link>
            <Link onClick={() => setMobileOpen(false)} href="/rides/new" className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-medium text-center">{dict.nav?.offer}</Link>
            <Link onClick={() => setMobileOpen(false)} href="/how-it-works" className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-medium text-center">{dict.nav?.howItWorks}</Link>
            <Link onClick={() => setMobileOpen(false)} href="/safety" className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-medium text-center">{dict.nav?.safety}</Link>
            {user && (
              <>
                <Link onClick={() => setMobileOpen(false)} href="/my-rides" className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-medium text-center">{dict.nav?.myRides}</Link>
                <Link onClick={() => setMobileOpen(false)} href="/messages" className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-medium text-center">{dict.nav?.messages}</Link>
              </>
            )}
            {!user && (
              <Link onClick={() => setMobileOpen(false)} href="/login" className="col-span-2 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-medium text-center">{dict.nav?.login}</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
