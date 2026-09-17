"use client";
import Link from "next/link";
import { SearchForm } from "@/components/SearchForm";
import { RideCard } from "@/components/RideCard";
import { useI18n } from "./I18nProvider";

export function HomeClient({ dict: serverDict, rides }: { dict: any; rides: any[] | null }) {
  const { dict: clientDict } = useI18n();
  // Use client dict after mount — ensures language switch updates instantly
  const dict = clientDict ?? serverDict;

  return (
    <div className="animate-fadeIn">
      {/* Hero with gradient + glass */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-700 via-teal-600 to-cyan-600 dark:from-teal-900 dark:via-teal-800 dark:to-cyan-800"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.18),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.12),transparent_40%)]"></div>
        {/* Decorative blurred orbs */}
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-cyan-300/20 blur-3xl"></div>

        <div className="relative mx-auto max-w-6xl px-4 py-10 sm:py-16 lg:py-20">
          <div className="max-w-3xl animate-fade-in">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 dark:bg-white/10 border border-white/20 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse"></span>
              {dict.hero?.badge ?? "#1 Mitfahr-Community"}
            </span>
            <h1 className="mt-4 text-3xl sm:text-5xl lg:text-[52px] font-black leading-[1.05] text-white tracking-tight">
              {dict.hero?.title}
            </h1>
            <p className="mt-4 text-white/90 text-base sm:text-lg leading-relaxed max-w-2xl">
              {dict.hero?.subtitle}
            </p>
            <p className="mt-3 text-white/70 text-xs sm:text-sm">{dict.hero?.trust}</p>
            <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
              <Link href="/search" className="h-11 px-6 inline-flex items-center justify-center rounded-xl bg-white text-teal-700 text-sm font-bold shadow-lg shadow-black/10 hover:shadow-xl hover:scale-[1.02] transition-all">
                {dict.hero?.ctaSearch}
              </Link>
              <Link href="/rides/new" className="h-11 px-6 inline-flex items-center justify-center rounded-xl bg-teal-900/30 text-white border border-white/30 backdrop-blur text-sm font-semibold hover:bg-white/15 transition-colors">
                {dict.hero?.ctaOffer}
              </Link>
            </div>
          </div>

          <div className="mt-8 sm:mt-10 max-w-4xl">
            <div className="rounded-[24px] bg-white dark:bg-slate-900 p-3 sm:p-4 shadow-2xl shadow-black/20 border border-white/20 dark:border-slate-700">
              <SearchForm dict={dict} />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2 text-xs text-white/85">
            {["Berlin → Hamburg", "München → Stuttgart", "Hamburg → Bremen", "Köln → Düsseldorf"].map((r) => (
              <span key={r} className="px-3.5 py-1.5 rounded-full bg-white/12 border border-white/20 backdrop-blur hover:bg-white/20 transition-colors cursor-default">{r}</span>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-3 gap-3 max-w-xl">
            {[
              { k: "4.9/5", l: dict.hero?.statsRides ?? "Fahrten" },
              { k: "50+", l: dict.hero?.statsCities ?? "Städte" },
              { k: "12t", l: dict.hero?.statsCO2 ?? "CO₂ gespart" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl bg-white/10 border border-white/20 backdrop-blur p-3 sm:p-4 text-center">
                <div className="text-lg sm:text-2xl font-black text-white">{s.k}</div>
                <div className="text-[11px] sm:text-xs text-white/80 font-medium">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">{dict.home?.howItWorks ?? dict.howItWorks?.title}</h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">{dict.hero?.subtitle}</p>
        </div>
        <div className="mt-8 grid gap-4 sm:gap-6 sm:grid-cols-3">
          {[
            { n: "1", t: dict.howItWorks?.step1, d: dict.howItWorks?.desc1 ?? "", icon: "🔍" },
            { n: "2", t: dict.howItWorks?.step2, d: dict.howItWorks?.desc2 ?? "", icon: "💬" },
            { n: "3", t: dict.howItWorks?.step3, d: dict.howItWorks?.desc3 ?? "", icon: "🚗" },
          ].map((s, i) => (
            <div key={s.n} className="group relative rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-sm hover:shadow-xl hover:shadow-teal-500/10 dark:hover:shadow-teal-400/10 hover:-translate-y-1 transition-all duration-300 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="absolute -top-3 -right-3 h-10 w-10 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 shadow-lg grid place-items-center text-white font-black text-sm group-hover:scale-110 transition-transform">{s.n}</div>
              <div className="h-12 w-12 rounded-2xl bg-teal-50 dark:bg-teal-950 border border-teal-100 dark:border-teal-900 grid place-items-center text-xl">{s.icon}</div>
              <div className="mt-4 font-bold text-slate-900 dark:text-white">{s.t}</div>
              <div className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming rides */}
      <section className="mx-auto max-w-6xl px-4 pb-12 sm:pb-16">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{dict.ride?.upcoming ?? "Aktuelle Fahrten"}</h2>
          <Link href="/search" className="shrink-0 text-sm font-semibold text-teal-700 dark:text-teal-400 hover:underline inline-flex items-center gap-1">
            {dict.ride?.viewAll ?? "Alle ansehen"} <span>→</span>
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {(rides ?? []).length ? (
            (rides as any[]).map((r) => <RideCard key={r.id} ride={r} dict={dict} />)
          ) : (
            <div className="col-span-full rounded-[24px] border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-10 sm:p-14 text-center">
              <div className="mx-auto h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800 grid place-items-center text-xl">🚗</div>
              <div className="mt-4 text-sm font-medium text-slate-700 dark:text-slate-300">{dict.search?.noResults}</div>
              <Link href="/rides/new" className="mt-5 inline-flex h-11 px-6 items-center justify-center rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 text-white text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
                {dict.hero?.ctaOffer}
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10 grid gap-6 sm:grid-cols-3">
          {[
            { icon: "✓", title: dict.home?.trustVerified ?? "Verifizierte Profile", desc: dict.home?.trustVerifiedDesc ?? "" },
            { icon: "◐", title: dict.home?.trustGDPR ?? "DSGVO-bewusst", desc: dict.home?.trustGDPRDesc ?? "" },
            { icon: "€", title: dict.home?.trustFair ?? "Faire Kostenbeteiligung", desc: dict.home?.trustFairDesc ?? "" },
          ].map((c) => (
            <div key={c.title} className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <span className="h-11 w-11 shrink-0 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-900 grid place-items-center font-bold text-emerald-700 dark:text-emerald-400">{c.icon}</span>
              <div>
                <div className="font-semibold text-slate-900 dark:text-white text-sm">{c.title}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{c.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
