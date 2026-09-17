import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
export async function middleware(request: NextRequest) {
  // LEGAL_REVIEW_REQUIRED: cookie consent handling is minimal; extend for granular consent
  const res = await updateSession(request);
  // locale cookie fallback
  if (!request.cookies.get("locale")) {
    const al = request.headers.get("accept-language") ?? "";
    const locale = al.toLowerCase().includes("de") ? "de" : al.toLowerCase().includes("en") ? "en" : "de";
    res.cookies.set("locale", locale, { path: "/", maxAge: 31536000 });
  }
  return res;
}
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"] };
