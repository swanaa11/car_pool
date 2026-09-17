import { getDict, getLocale } from "@/lib/i18n";
export const dynamic = "force-dynamic";
export default function Page(){
  const locale = getLocale();
  const dict = getDict();
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14 animate-fadeIn">
      <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">{dict.about?.title ?? "Über Car Pool"}</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{dict.about?.subtitle ?? dict.brand?.tagline}</p>
      <p className="mt-6 text-slate-600 dark:text-slate-300 leading-relaxed">{dict.about?.p1}</p>
      <div className="mt-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 text-sm text-slate-600 dark:text-slate-400 shadow-sm">
        <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs">packages/config</code> & <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs">packages/ui</code> — {dict.about?.note}
      </div>
    </div>
  );
}
