import { getDict } from "@/lib/i18n";
export const dynamic = "force-dynamic";
export default function Page(){
  const dict = getDict();
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14 animate-fadeIn">
      <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">{dict.safety?.title}</h1>
      <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">{dict.safety?.content}</p>
      <div className="mt-6 rounded-2xl border border-teal-200 dark:border-teal-900 bg-teal-50 dark:bg-teal-950 p-5 text-sm text-teal-900 dark:text-teal-100">
        {dict.hero?.trust ?? "Kostenbeteiligung statt Taxipreis • DSGVO-bewusst • Verifizierte Profile"}
      </div>
    </div>
  );
}
