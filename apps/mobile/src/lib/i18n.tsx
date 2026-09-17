import React, { createContext, useContext, useState } from "react";
import {
  dictionaries as i18nDictionaries,
} from "@carpull/i18n";
const de = (i18nDictionaries as any).de;
const en = (i18nDictionaries as any).en;
const dicts: Record<string, any> = { de, en };
type Locale = "de" | "en";
const Ctx = createContext<{ locale: Locale; dict: any; setLocale: (l:Locale)=>void }>({ locale: "de", dict: de, setLocale: ()=>{} });
export function I18nProvider({ children }: { children: React.ReactNode }){
  const [locale, setLocale] = useState<Locale>("de");
  return <Ctx.Provider value={{ locale, dict: dicts[locale], setLocale }}>{children}</Ctx.Provider>;
}
export const useI18n = () => useContext(Ctx);
export function t(dict:any, path:string, vars?:Record<string,string|number>){
  const parts=path.split("."); let cur:any=dict; for(const p of parts) cur=cur?.[p]; if(typeof cur!=="string") return path;
  if(!vars) return cur; return Object.entries(vars).reduce((s,[k,v])=> s.replaceAll(`{${k}}`, String(v)), cur);
}
