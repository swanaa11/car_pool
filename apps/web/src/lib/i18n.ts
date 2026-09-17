import { cookies, headers } from "next/headers";
import { getDictionary, detectLocale, type Locale } from "@carpull/i18n/src/index";
export function getLocale(): Locale {
  const c = cookies().get("locale")?.value as Locale | undefined;
  const h = headers().get("accept-language");
  return detectLocale(h, c);
}
export function getDict() { return getDictionary(getLocale()); }
