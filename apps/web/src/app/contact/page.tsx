import { getDict } from "@/lib/i18n";
export const dynamic = "force-dynamic";
export default function Page(){
  const dict = getDict();
  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:py-14 animate-fadeIn">
      <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">{dict.nav?.contact ?? "Contact"}</h1>
      <div className="mt-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="text-sm text-slate-900 dark:text-white">E-Mail: <a href="mailto:support@carpool.de" className="font-semibold text-teal-700 dark:text-teal-400">support@carpool.de</a></div>
        <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">{dict.hero?.trust?.split("•")[0] ?? "Antwort i. d. R. innerhalb 24–48 h."}</div>
      </div>
      <div className="mt-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-teal-50 dark:bg-teal-950 p-4 text-sm text-teal-800 dark:text-teal-200">
        {dict.safety?.content ?? "Ride only with verified profiles."}
      </div>
    </div>
  );
}
