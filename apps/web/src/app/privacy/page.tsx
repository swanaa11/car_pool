import { getDict } from "@/lib/i18n";
export const dynamic = "force-dynamic";
export default function Page(){
  const dict = getDict();
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 animate-fadeIn">
      <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">{dict.footer?.privacy ?? "Datenschutz"}</h1>
      <div className="mt-6 prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
        <p>Car Pool verarbeitet nur zur Fahrtenvermittlung notwendige Daten. Rechtsgrundlage: Art. 6 DSGVO. Kontakt: support@carpool.de</p>
        <p>Car Pool processes only data necessary for ride sharing. Legal basis: Art. 6 GDPR. Contact: support@carpool.de</p>
      </div>
    </div>
  );
}
