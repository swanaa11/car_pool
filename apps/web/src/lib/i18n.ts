import { cookies, headers } from "next/headers";
import { getDictionary, detectLocale, type Locale } from "@carpull/i18n/src/index";
export function getLocale(): Locale {
  try {
    const c = cookies().get("locale")?.value as Locale | undefined;
    const h = headers().get("accept-language");
    return detectLocale(h, c);
  } catch {
    // During static generation (e.g. /_not-found prerender) cookies()/headers() may throw
    return "de";
  }
}
export function getDict() {
  try {
    return getDictionary(getLocale());
  } catch {
    return getDictionary("de");
  }
}
