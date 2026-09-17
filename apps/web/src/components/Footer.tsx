import Link from "next/link";
export function Footer({ dict }: { dict:any }) {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="font-black text-lg flex items-center gap-2"><span className="h-8 w-8 rounded-xl bg-teal-700 text-white grid place-items-center">C</span> CarPull</div>
          <p className="mt-2 text-slate-600 leading-relaxed">{dict.hero?.trust}</p>
        </div>
        <div>
          <div className="font-semibold">CarPull</div>
          <ul className="mt-3 space-y-2 text-slate-600">
            <li><Link href="/how-it-works" className="hover:text-slate-900">So funktioniert&apos;s / How it works</Link></li>
            <li><Link href="/safety" className="hover:text-slate-900">Sicherheit / Safety</Link></li>
            <li><Link href="/faq" className="hover:text-slate-900">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold">Rechtliches / Legal</div>
          <ul className="mt-3 space-y-2 text-slate-600">
            <li><Link href="/privacy" className="hover:text-slate-900">{dict.footer?.privacy}</Link></li>
            <li><Link href="/terms" className="hover:text-slate-900">{dict.footer?.terms}</Link></li>
            <li><Link href="/privacy" className="hover:text-slate-900">{dict.footer?.cookies}</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold">Kontakt</div>
          <p className="mt-3 text-slate-600">support@carpull.de<br/>Berlin, Deutschland</p>
          <p className="mt-3 text-xs text-slate-500">© {new Date().getFullYear()} CarPull — Cost-sharing, not a taxi.</p>
        </div>
      </div>
    </footer>
  );
}
