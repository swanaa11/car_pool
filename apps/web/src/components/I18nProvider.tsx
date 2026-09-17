"use client";
import { createContext, useContext, useEffect, useState } from "react";
// dictionaries from shared i18n package
import { dictionaries } from "@carpull/i18n/src/index";
import de from "@carpull/i18n/src/locales/de.json";

type Locale = "de" | "en";
const dicts: Record<Locale, any> = dictionaries as any;

type Ctx = { locale: Locale; dict: any; setLocale: (l: Locale) => void; t: (path: string, fallback?: string) => string };
const I18nCtx = createContext<Ctx | null>(null);

export function I18nProvider({ initialLocale, children }: { initialLocale: Locale; children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [dict, setDict] = useState<any>(dicts[initialLocale] || de);

  useEffect(() => {
    setLocaleState(initialLocale);
    setDict(dicts[initialLocale] || de);
  }, [initialLocale]);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    setDict(dicts[l] || de);
    document.cookie = `locale=${l}; path=/; max-age=31536000`;
    // Also update html lang
    document.documentElement.lang = l;
    // Also persist to localStorage for instant reloads
    try { localStorage.setItem("locale", l); } catch {}
  };

  const t = (path: string, fallback?: string) => {
    const parts = path.split(".");
    let cur: any = dict;
    for (const p of parts) {
      if (cur && typeof cur === "object" && p in cur) cur = cur[p];
      else return fallback ?? path;
    }
    return typeof cur === "string" ? cur : fallback ?? path;
  };

  return <I18nCtx.Provider value={{ locale, dict, setLocale, t }}>{children}</I18nCtx.Provider>;
}
export function useI18n() {
  const ctx = useContext(I18nCtx);
  if (!ctx) throw new Error("useI18n outside I18nProvider");
  return ctx;
}
// Hook for components that were server-rendered and receive dict prop: prefer context if available
export function useDict() {
  const ctx = useContext(I18nCtx);
  return ctx?.dict ?? de;
}
