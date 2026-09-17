export default function Page(){
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-black tracking-tight">Über CarPull · About</h1>
      <p className="mt-4 text-slate-600 leading-relaxed">CarPull ist eine in Deutschland gebaute Mitfahr-Plattform für den Alltag — Pendeln, Intercity, Inner-City. Fokus: Vertrauen, Einfachheit, Datenschutz, mobile-first. Gebaut mit Next.js, Supabase, Expo — hostbar auf Vercel & EAS.</p>
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">Branding ist zentralisiert — Name, Farben, Logo in <code>packages/config</code> & <code>packages/ui</code>. Einfach austauschbar.</div>
    </div>
  );
}
