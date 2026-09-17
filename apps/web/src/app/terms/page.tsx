export default function Page(){
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-black tracking-tight">AGB · Terms</h1>
      <p className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">LEGAL_REVIEW_REQUIRED — Vorlage. Vor Veröffentlichung rechtlich prüfen.</p>
      <div className="mt-6 grid gap-4 text-sm leading-relaxed">
        <div className="rounded-2xl border border-slate-200 bg-white p-5"><h3 className="font-semibold">1. Plattform</h3><p className="text-slate-600">CarPull vermittelt Mitfahrgelegenheiten auf Kostenbeteiligungsbasis. Kein Beförderungsvertrag mit CarPull.</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5"><h3 className="font-semibold">2. Kostenbeteiligung</h3><p className="text-slate-600">Höhe wird vom Fahrer festgelegt, transparent angezeigt. Kein Gewinnaufschlag — reine Kostenteilung (§ 1 PBefG beachten).</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5"><h3 className="font-semibold">3. Verhalten</h3><p className="text-slate-600">Pünktlichkeit, Respekt, keine Diskriminierung. Verstöße können zu Sperrung/Bann führen.</p></div>
      </div>
    </div>
  );
}
