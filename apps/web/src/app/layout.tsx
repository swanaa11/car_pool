import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getLocale, getDict } from "@/lib/i18n";

// Ensure Vercel prerender for /_not-found does not fail when cookies()/headers() are unavailable
export const dynamic = "force-dynamic";

function getMetadataBase(): URL {
  const raw = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  try {
    const normalized = raw.startsWith("http://") || raw.startsWith("https://") ? raw : `https://${raw}`;
    return new URL(normalized);
  } catch {
    return new URL("http://localhost:3000");
  }
}

export const metadata = {
  title: "CarPull — Gemeinsam fahren in Deutschland",
  description: "Täglicher Pendelverkehr, Intercity & Inner-City Mitfahrgelegenheiten. Ohne Abo. Kostenbeteiligung statt Taxipreis.",
  metadataBase: getMetadataBase(),
  openGraph: { title: "CarPull", description: "Gemeinsam fahren. Günstig. Nachhaltig.", type: "website" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = getLocale();
  const dict = getDict();
  return (
    <html lang={locale}>
      <body>
        <Header locale={locale} dict={dict} />
        <main className="min-h-[70vh]">{children}</main>
        <Footer dict={dict} />
      </body>
    </html>
  );
}
