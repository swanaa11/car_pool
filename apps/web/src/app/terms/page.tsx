import { getDict } from "@/lib/i18n";
export const dynamic = "force-dynamic";
export default function Page(){
  const dict = getDict();
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 animate-fadeIn">
      <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">{dict.footer?.terms ?? "AGB"}</h1>
      <div className="mt-6 prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
        <p>Mit Nutzung von Car Pool stimmst du fairer Kostenbeteiligung, respektvollem Umgang und geltendem Recht zu.</p>
        <p>By using Car Pool you agree to fair cost-sharing, respectful conduct and applicable law.</p>
      </div>
    </div>
  );
}
