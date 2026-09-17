export default function Page(){
  const faqs=[
    {q:"Kostet CarPull etwas?",a:"Nein. Kein Abo, keine Mitgliedsgebühr. Nur die vom Fahrer angegebene Kostenbeteiligung pro Mitfahrt."},
    {q:"Wie funktioniert die Bezahlung?",a:"Derzeit privat/Bar vor Ort. Online-Zahlung ist als zukünftige Erweiterung architektonisch vorgesehen."},
    {q:"Kann ich pendeln (Mo–Fr)?",a:"Ja — erstelle eine Fahrt und nutze die wiederkehrende Option oder lege mehrere Termine an."},
    {q:"Ist meine Adresse öffentlich?",a:"Nein. Es wird nur der ungefähre Ort (z. B. Stadtteil/Bahnhof) angezeigt, keine exakte Hausadresse."},
    {q:"Deutsch oder Englisch?",a:"Beides. Sprache umschalten oben rechts — Standard DE für deutsche Browser."},
  ];
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-black tracking-tight">FAQ</h1>
      <div className="mt-6 grid gap-3">
        {faqs.map(f=>(
          <details key={f.q} className="rounded-2xl border border-slate-200 bg-white p-5 group">
            <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">{f.q}<span className="text-slate-400 group-open:rotate-180">⌄</span></summary>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
