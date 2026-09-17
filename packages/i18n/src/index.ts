import de from "./locales/de.json";
import en from "./locales/en.json";

export const dictionaries = { de, en } as const;
export type Locale = "de" | "en";
export type Dictionary = typeof de;

export function getDictionary(locale: string): Dictionary {
  return (dictionaries as any)[locale] ?? dictionaries.de;
}

// Simple t helper: t(dict, "nav.search") supports dot paths
export function t(dict: Dictionary, path: string, vars?: Record<string,string|number>): string {
  const parts = path.split(".");
  let cur: any = dict;
  for (const p of parts) cur = cur?.[p];
  if (typeof cur !== "string") return path;
  if (!vars) return cur;
  return Object.entries(vars).reduce((s,[k,v]) => s.replaceAll(`{${k}}`, String(v)), cur);
}

export function detectLocale(acceptLanguageHeader?: string | null, cookieLocale?: string | null): Locale {
  if (cookieLocale === "de" || cookieLocale === "en") return cookieLocale;
  if (!acceptLanguageHeader) return "de";
  const lower = acceptLanguageHeader.toLowerCase();
  if (lower.includes("de")) return "de";
  if (lower.includes("en")) return "en";
  return "de";
}
