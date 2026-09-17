export default function Page(){
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-black tracking-tight">Datenschutz · Privacy Policy</h1>
      <p className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">LEGAL_REVIEW_REQUIRED — Dies ist eine technische Vorlage. Vor Live-Gang von Anwalt prüfen lassen.</p>
      <div className="mt-6 prose prose-sm max-w-none text-slate-700 leading-relaxed grid gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5"><h3 className="font-semibold text-slate-900">1. Verantwortlicher</h3><p>CarPull, Berlin, Deutschland — support@carpull.de</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5"><h3 className="font-semibold text-slate-900">2. Datenminimierung</h3><p>Wir speichern nur erforderliche Daten: Profil, Fahrten, Buchungen, Nachrichten, Bewertungen. Keine unnötigen Standortverläufe.</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5"><h3 className="font-semibold text-slate-900">3. Rechte</h3><p>Auskunft, Löschung, Export (Art. 15–20 DSGVO) über Konto-Einstellungen oder Anfrage an support@carpull.de. Löschung setzt Profil auf DELETED, behält audit-relevante Reste minimal.</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5"><h3 className="font-semibold text-slate-900">4. Cookies</h3><p>Nur notwendige Cookies (Session, Sprache). Keine Tracking-Cookies ohne Consent-Banner (Banner-Architektur vorhanden, vor Live-Gang aktivieren).</p></div>
      </div>
    </div>
  );
}
