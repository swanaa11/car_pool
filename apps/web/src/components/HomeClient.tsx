"use client";
import Link from "next/link";
import { SearchForm } from "@/components/SearchForm";
import { RideCard } from "@/components/RideCard";
import { useI18n } from "./I18nProvider";
import { IconShield, IconLock, IconCoin, IconRoute } from "./icons";

export function HomeClient({ dict: serverDict, rides }: { dict: any; rides: any[] | null }) {
  const { dict: clientDict } = useI18n();
  // Use client dict after mount — ensures language switch updates instantly
  const dict = clientDict ?? serverDict;

  return (
    <div>
      {/* Hero — solid Autobahn blue, a road-map grid instead of a gradient blob,
          and a single drawn route line as the page's one orchestrated motion moment. */}
      <section className="relative overflow-hidden bg-teal-900 dark:bg-teal-950">
        <div className="absolute inset-0 route-grid-invert"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_15%,rgba(255,255,255,0.10),transparent_45%)]"></div>

        <div className="relative mx-auto max-w-6xl px-4 pt-10 sm:pt-16 lg:pt-20">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 animate-pulse-ring"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400"></span>
              </span>
              {dict.hero?.badge ?? "#1 Mitfahr-Community"}
            </span>
            <h1 className="mt-4 font-display text-4xl sm:text-6xl lg:text-[64px] font-extrabold leading-[1.02] text-white tracking-tight">
              {dict.hero?.title}
            </h1>
            <p className="mt-4 text-white/85 text-base sm:text-lg leading-relaxed max-w-2xl">
              {dict.hero?.subtitle}
            </p>
            <p className="mt-3 text-white/60 text-xs sm:text-sm">{dict.hero?.trust}</p>
            <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
              <Link href="/search" className="h-11 px-6 inline-flex items-center justify-center rounded-xl bg-amber-400 hover:bg-amber-300 text-asphalt text-sm font-bold shadow-lg shadow-amber-500/20 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all">
                {dict.hero?.ctaSearch}
              </Link>
              <Link href="/rides/new" className="h-11 px-6 inline-flex items-center justify-center rounded-xl bg-white/5 text-white border border-white/25 backdrop-blur text-sm font-semibold hover:bg-white/15 transition-colors">
                {dict.hero?.ctaOffer}
              </Link>
            </div>
          </div>

          {/* Decorative route line: draws once on load, sits behind the ticket card below */}
          <div className="relative mt-10 sm:mt-12 h-[64px] sm:h-[80px]" aria-hidden="true">
            <svg viewBox="0 0 1200 90" preserveAspectRatio="none" className="absolute inset-0 w-full h-full overflow-visible">
              <path d="M10,55 C 220,10 320,80 480,55 C 640,30 760,80 920,50 C 1020,30 1080,30 1160,45"
                    fill="none" stroke="white" strokeOpacity="0.28" strokeWidth="2" strokeDasharray="1 3.2" strokeLinecap="round" />
              <path d="M10,55 C 220,10 320,80 480,55 C 640,30 760,80 920,50 C 1020,30 1080,30 1160,45"
                    fill="none" stroke="white" strokeOpacity="0.85" strokeWidth="2" strokeLinecap="round"
                    pathLength={1} className="route-path" />
              <circle cx="10" cy="55" r="6" fill="#F59E0B" />
              <circle cx="1160" cy="45" r="5" fill="none" stroke="white" strokeWidth="2" />
            </svg>
          </div>

          <div className="relative -mt-2 sm:-mt-4 max-w-4xl">
            <div className="ticket-edge rounded-[20px] bg-white dark:bg-slate-900 p-3 sm:p-4 shadow-route border border-white/10 -rotate-[0.35deg] hover:rotate-0 transition-transform duration-500">
              <SearchForm dict={dict} />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2 text-xs text-white/85">
            {["Berlin → Hamburg", "München → Stuttgart", "Hamburg → Bremen", "Köln → Düsseldorf"].map((r) => (
              <span key={r} className="px-3.5 py-1.5 rounded-full bg-white/8 border border-white/20 backdrop-blur hover:bg-white/15 hover:border-white/30 transition-colors cursor-default">{r}</span>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-8 pb-10 sm:pb-14 grid grid-cols-3 gap-3 max-w-xl">
            {[
              { k: "4.9/5", l: dict.hero?.statsRides ?? "Fahrten" },
              { k: "50+", l: dict.hero?.statsCities ?? "Städte" },
              { k: "12t", l: dict.hero?.statsCO2 ?? "CO₂ gespart" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl bg-white/8 border border-white/15 backdrop-blur p-3 sm:p-4 text-center">
                <div className="font-display text-xl sm:text-2xl font-extrabold text-white">{s.k}</div>
                <div className="text-[11px] sm:text-xs text-white/75 font-medium">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works — a connected journey strip (3 real waypoints), not 3 identical floating cards */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">{dict.home?.howItWorks ?? dict.howItWorks?.title}</h2>
        </div>
        <div className="mt-10 sm:mt-12 relative">
          <div className="hidden sm:block absolute top-6 left-[16.6%] right-[16.6%] h-px bg-gradient-to-r from-teal-300 via-teal-400 to-teal-300 dark:from-teal-800 dark:via-teal-600 dark:to-teal-800"></div>
          <div className="sm:hidden absolute top-0 bottom-0 left-6 w-px border-l-2 border-dotted border-teal-300 dark:border-teal-700"></div>
          <div className="grid gap-9 sm:grid-cols-3 relative">
            {[
              { n: "1", t: dict.howItWorks?.step1, d: dict.howItWorks?.desc1 ?? "" },
              { n: "2", t: dict.howItWorks?.step2, d: dict.howItWorks?.desc2 ?? "" },
              { n: "3", t: dict.howItWorks?.step3, d: dict.howItWorks?.desc3 ?? "" },
            ].map((s) => (
              <div key={s.n} className="relative pl-16 sm:pl-0 sm:text-center">
                <div className="absolute left-0 top-0 sm:static sm:mx-auto h-12 w-12 rounded-full bg-white dark:bg-slate-900 border-2 border-teal-600 dark:border-teal-400 grid place-items-center font-display font-extrabold text-teal-700 dark:text-teal-400 text-lg shadow-sm shadow-teal-900/5 z-10">{s.n}</div>
                <div className="sm:mt-4">
                  <div className="font-semibold text-slate-900 dark:text-white">{s.t}</div>
                  <div className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed sm:max-w-[230px] sm:mx-auto">{s.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming rides */}
      <section className="mx-auto max-w-6xl px-4 pb-12 sm:pb-16">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">{dict.ride?.upcoming ?? "Aktuelle Fahrten"}</h2>
          <Link href="/search" className="shrink-0 text-sm font-semibold text-teal-700 dark:text-teal-400 hover:underline inline-flex items-center gap-1">
            {dict.ride?.viewAll ?? "Alle ansehen"} <span>→</span>
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {(rides ?? []).length ? (
            (rides as any[]).map((r) => <RideCard key={r.id} ride={r} dict={dict} />)
          ) : (
            <div className="col-span-full rounded-[24px] border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-10 sm:p-14 text-center">
              <div className="mx-auto h-14 w-14 rounded-2xl bg-teal-50 dark:bg-teal-950 grid place-items-center text-teal-600 dark:text-teal-400"><IconRoute className="h-6 w-6" /></div>
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
            { icon: IconShield, title: dict.home?.trustVerified ?? "Verifizierte Profile", desc: dict.home?.trustVerifiedDesc ?? "" },
            { icon: IconLock, title: dict.home?.trustGDPR ?? "DSGVO-bewusst", desc: dict.home?.trustGDPRDesc ?? "" },
            { icon: IconCoin, title: dict.home?.trustFair ?? "Faire Kostenbeteiligung", desc: dict.home?.trustFairDesc ?? "" },
          ].map((c) => (
            <div key={c.title} className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <span className="h-11 w-11 shrink-0 rounded-xl bg-teal-50 dark:bg-teal-950 border border-teal-100 dark:border-teal-900 grid place-items-center text-teal-700 dark:text-teal-400"><c.icon className="h-5 w-5" /></span>
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
