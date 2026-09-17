import Link from "next/link";
import { getDict } from "@/lib/i18n";
import { SearchForm } from "@/components/SearchForm";
import { createClient } from "@/lib/supabase/server";
import { RideCard } from "@/components/RideCard";

export default async function Home() {
  const dict = getDict();
  const supabase = createClient();
  // fetch upcoming rides for social proof (public)
  const { data: rides } = await supabase
    .from("rides")
    .select("*, driver:profiles!rides_driver_id_fkey(first_name,last_name,avatar_url,rating_avg,verification_badges)")
    .eq("status","SCHEDULED")
    .gte("departure_at", new Date().toISOString())
    .order("departure_at", { ascending: true })
    .limit(6);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-700 via-teal-600 to-cyan-600"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)]"></div>
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-5xl font-black leading-tight text-white tracking-tight">{dict.hero?.title}</h1>
            <p className="mt-4 text-white/90 text-base sm:text-lg leading-relaxed">{dict.hero?.subtitle}</p>
            <p className="mt-3 text-white/70 text-xs sm:text-sm">{dict.hero?.trust}</p>
          </div>
          <div className="mt-8 max-w-4xl">
            <SearchForm dict={dict} />
          </div>
          <div className="mt-6 flex flex-wrap gap-2 text-xs text-white/80">
            <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20">Berlin ↔ Potsdam</span>
            <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20">München ↔ Stuttgart</span>
            <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20">Hamburg ↔ Bremen</span>
            <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20">Köln ↔ Düsseldorf</span>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-xl font-bold tracking-tight">{dict.howItWorks?.title}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { n:"1", t: dict.howItWorks?.step1, d: "Wähle Strecke, Datum und Plätze." },
            { n:"2", t: dict.howItWorks?.step2, d: "Fahrer bestätigt — Chat & Benachrichtigung." },
            { n:"3", t: dict.howItWorks?.step3, d: "Fahrt genießen, danach bewerten." },
          ].map(s=>(
            <div key={s.n} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="h-8 w-8 rounded-full bg-teal-700 text-white grid place-items-center font-bold text-sm">{s.n}</div>
              <div className="mt-3 font-semibold">{s.t}</div>
              <div className="mt-1 text-sm text-slate-600">{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming rides */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Aktuelle Fahrten · Upcoming rides</h2>
          <Link href="/search" className="text-sm font-semibold text-teal-700 hover:underline">Alle ansehen →</Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(rides ?? []).length ? (rides as any[]).map(r=> <RideCard key={r.id} ride={r} />) : (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
              <div className="text-sm">Noch keine Fahrten — sei der Erste! / No rides yet — be the first!</div>
              <Link href="/rides/new" className="mt-3 inline-flex h-10 px-5 items-center rounded-xl bg-teal-700 text-white text-sm font-semibold">Fahrt anbieten · Offer a ride</Link>
            </div>
          )}
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 grid gap-6 sm:grid-cols-3 text-sm">
          <div className="flex gap-3"><span className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-200 grid place-items-center">✓</span><div><div className="font-semibold">Verifizierte Profile</div><div className="text-slate-600">E-Mail & Telefon-Verifikation, Bewertungen.</div></div></div>
          <div className="flex gap-3"><span className="h-10 w-10 rounded-xl bg-sky-50 border border-sky-200 grid place-items-center">◐</span><div><div className="font-semibold">DSGVO-bewusst</div><div className="text-slate-600">Datenminimierung, Löschung & Export.</div></div></div>
          <div className="flex gap-3"><span className="h-10 w-10 rounded-xl bg-amber-50 border border-amber-200 grid place-items-center">€</span><div><div className="font-semibold">Faire Kostenbeteiligung</div><div className="text-slate-600">Kein Abo, kein Taxipreis — transparent.</div></div></div>
        </div>
      </section>
    </div>
  );
}
