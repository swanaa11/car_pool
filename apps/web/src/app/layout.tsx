import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { I18nProvider } from "@/components/I18nProvider";
import { getLocale, getDict } from "@/lib/i18n";

// Ensure dynamic so locale cookie is read per request
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
  title: "Car Pool — Gemeinsam fahren in Deutschland",
  description: "Täglicher Pendelverkehr, Intercity & Inner-City Mitfahrgelegenheiten. Ohne Abo. Kostenbeteiligung statt Taxipreis.",
  metadataBase: getMetadataBase(),
  openGraph: { title: "Car Pool", description: "Gemeinsam fahren. Günstig. Nachhaltig.", type: "website" as const },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = getLocale() as "de" | "en";
  const dict = getDict();
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            const t = localStorage.getItem('theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const theme = t || (prefersDark ? 'dark' : 'light');
            if (theme === 'dark') document.documentElement.classList.add('dark');
          } catch {}
        `}} />
      </head>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>
          <I18nProvider initialLocale={locale}>
            <Header initialLocale={locale} initialDict={dict} />
            <main className="flex-1 min-h-[70vh]">{children}</main>
            <Footer />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
