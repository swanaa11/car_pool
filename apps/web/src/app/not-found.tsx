import Link from "next/link";
export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-700 text-white font-black text-xl">404</div>
      <h1 className="mt-4 text-2xl font-black tracking-tight">Seite nicht gefunden · Page not found</h1>
      <p className="mt-2 text-sm text-slate-600">Die gesuchte Seite existiert nicht. / The page you’re looking for doesn’t exist.</p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/" className="h-11 px-6 inline-flex items-center justify-center rounded-xl bg-teal-700 text-white font-semibold hover:bg-teal-800">Zur Startseite · Go home</Link>
        <Link href="/search" className="h-11 px-6 inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white font-semibold hover:bg-slate-50">Fahrt finden · Find a ride</Link>
      </div>
    </div>
  );
}