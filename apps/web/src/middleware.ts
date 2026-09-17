import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  // Never let middleware throw — it becomes 500 MIDDLEWARE_INVOCATION_FAILED on Vercel
  let res: NextResponse;
  try {
    res = await updateSession(request);
  } catch (e) {
    console.error("[middleware] updateSession failed:", e);
    res = NextResponse.next({ request: { headers: request.headers } });
  }
  try {
    // LEGAL_REVIEW_REQUIRED: cookie consent handling is minimal; extend for granular consent
    if (!request.cookies.get("locale")) {
      const al = request.headers.get("accept-language") ?? "";
      const locale = al.toLowerCase().includes("de") ? "de" : al.toLowerCase().includes("en") ? "en" : "de";
      res.cookies.set("locale", locale, { path: "/", maxAge: 31536000 });
    }
  } catch (e) {
    console.error("[middleware] locale cookie failed:", e);
  }
  return res;
}
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"] };
