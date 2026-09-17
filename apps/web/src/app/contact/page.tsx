export default function Page(){
  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-3xl font-black tracking-tight">Kontakt · Contact</h1>
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="text-sm">E-Mail: <a href="mailto:support@carpull.de" className="font-semibold text-teal-700">support@carpull.de</a></div>
        <div className="mt-2 text-sm text-slate-600">Antwort i. d. R. innerhalb 24–48 h.</div>
      </div>
    </div>
  );
}
