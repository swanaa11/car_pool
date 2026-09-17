export default function Page(){
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-black tracking-tight">Sicherheit & Vertrauen · Safety</h1>
      <div className="mt-6 grid gap-4 text-sm leading-relaxed">
        <div className="rounded-2xl border border-slate-200 bg-white p-5"><div className="font-semibold">Verifizierung</div><p className="text-slate-600">E-Mail-Verifikation Pflicht, Telefon-Verifikation optional. Profile zeigen Badges und Bewertungen.</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5"><div className="font-semibold">Chat & Privatsphäre</div><p className="text-slate-600">Nutze den In-App-Chat. Teile keine sensiblen Daten öffentlich. Adresse wird nicht exakt angezeigt — nur ungefähre Gebiete.</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5"><div className="font-semibold">Melden & Blockieren</div><p className="text-slate-600">Du kannst Nutzer & Fahrten melden und Nutzer blockieren. Moderatoren prüfen Meldungen im Admin-Bereich.</p></div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900"><div className="font-semibold">Notfall</div><p>Im Notfall wähle 112. CarPull hat eine Notfallkontakt-Architektur (zukünftig: SOS-Button, Standortfreigabe).</p></div>
      </div>
    </div>
  );
}
