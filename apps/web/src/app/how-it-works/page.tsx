import { getDict } from "@/lib/i18n";
export const dynamic = "force-dynamic";
export default function Page(){
  const dict = getDict();
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14 animate-fadeIn">
      <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">{dict.howItWorks?.title}</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { n:"1", t: dict.howItWorks?.step1, d: dict.howItWorks?.desc1 },
          { n:"2", t: dict.howItWorks?.step2, d: dict.howItWorks?.desc2 },
          { n:"3", t: dict.howItWorks?.step3, d: dict.howItWorks?.desc3 },
        ].map(s=>(
          <div key={s.n} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm card-hover">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-teal-600 to-cyan-600 text-white grid place-items-center font-bold">{s.n}</div>
            <div className="mt-3 font-semibold text-slate-900 dark:text-white">{s.t}</div>
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">{s.d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
