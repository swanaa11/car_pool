"use client";
import Link from "next/link";
import { useI18n } from "./I18nProvider";

export function Footer() {
  const { dict } = useI18n();
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 font-black text-lg">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-cyan-600 text-white">C</span>
              Car Pool
            </div>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{dict.footer?.tagline ?? dict.brand?.tagline ?? ""}</p>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-500">{dict.footer?.madeWith ?? ""}</p>
          </div>
          <div>
            <div className="font-semibold text-sm text-slate-900 dark:text-white">{dict.nav?.home ?? "Links"}</div>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><Link href="/search" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">{dict.nav?.search}</Link></li>
              <li><Link href="/rides/new" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">{dict.nav?.offer}</Link></li>
              <li><Link href="/how-it-works" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">{dict.nav?.howItWorks}</Link></li>
              <li><Link href="/safety" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">{dict.nav?.safety}</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-sm text-slate-900 dark:text-white">Rechtliches</div>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><Link href="/privacy" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">{dict.footer?.privacy}</Link></li>
              <li><Link href="/terms" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">{dict.footer?.terms}</Link></li>
              <li><Link href="/about" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">{dict.nav?.about}</Link></li>
              <li><Link href="/faq" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">{dict.nav?.faq}</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-sm text-slate-900 dark:text-white">{dict.nav?.contact}</div>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><a href="mailto:support@carpool.de" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">support@carpool.de</a></li>
              <li className="text-xs">DSGVO · GDPR · {dict.footer?.cookies ?? "Cookies"}</li>
            </ul>
            <div className="mt-4 flex gap-2">
              <span className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 grid place-items-center text-xs">𝕏</span>
              <span className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 grid place-items-center text-xs">◎</span>
              <span className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 grid place-items-center text-xs">▶</span>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800 pt-6 text-xs text-slate-500 dark:text-slate-500">
          <div>© {new Date().getFullYear()} Car Pool · carpool.de · {dict.footer?.imprint ?? "Imprint"}</div>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-slate-700 dark:hover:text-slate-300">{dict.footer?.privacy}</Link>
            <Link href="/terms" className="hover:text-slate-700 dark:hover:text-slate-300">{dict.footer?.terms}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
