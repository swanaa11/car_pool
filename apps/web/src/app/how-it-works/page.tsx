export default function Page(){
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-black tracking-tight">So funktioniert CarPull · How it works</h1>
      <ol className="mt-6 grid gap-4">
        <li className="rounded-2xl border border-slate-200 bg-white p-5"><div className="font-semibold">1. Fahrt suchen oder anbieten</div><div className="text-sm text-slate-600">Suche nach Strecke & Datum oder biete deine Fahrt an — einmalig oder regelmäßig (Pendelverkehr Mo–Fr).</div></li>
        <li className="rounded-2xl border border-slate-200 bg-white p-5"><div className="font-semibold">2. Platz anfragen & bestätigen</div><div className="text-sm text-slate-600">Mitfahrer fragen an, Fahrer bestätigt. Ihr chattet in der App — keine Telefonnummer nötig.</div></li>
        <li className="rounded-2xl border border-slate-200 bg-white p-5"><div className="font-semibold">3. Gemeinsam fahren & bewerten</div><div className="text-sm text-slate-600">Treffpunkt wie vereinbart, Kostenbeteiligung transparent teilen, danach gegenseitig bewerten.</div></li>
      </ol>
      <div className="mt-6 rounded-2xl bg-teal-700 text-white p-6"><div className="font-semibold">Kostenbeteiligung, kein Taxi</div><div className="text-sm text-white/80">CarPull ist Mitfahren auf Kostenbeteiligungsbasis — kein kommerzieller Fahrdienst. Online-Zahlung ist als zukünftige Erweiterung vorgesehen; heute erfolgt der Ausgleich privat.</div></div>
    </div>
  );
}
