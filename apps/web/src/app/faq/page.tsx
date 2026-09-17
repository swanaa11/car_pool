import { getDict } from "@/lib/i18n";
export const dynamic = "force-dynamic";
export default function Page(){
  const dict = getDict();
  const faqs = [
    { q: dict.faq?.q1, a: dict.faq?.a1 },
    { q: dict.faq?.q2, a: dict.faq?.a2 },
    { q: dict.faq?.q3, a: dict.faq?.a3 },
    { q: dict.faq?.q4, a: dict.faq?.a4 },
    { q: dict.faq?.q5, a: dict.faq?.a5 },
  ];
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14 animate-fadeIn">
      <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">{dict.faq?.title ?? "FAQ"}</h1>
      <div className="mt-6 grid gap-3">
        {faqs.map((f,i) => (
          <details key={i} className="group rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm card-hover">
            <summary className="font-semibold cursor-pointer list-none flex justify-between items-center text-slate-900 dark:text-white">{f.q}<span className="text-slate-400 group-open:rotate-180 transition-transform">⌄</span></summary>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
