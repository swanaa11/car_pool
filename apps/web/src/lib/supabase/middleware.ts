import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const PLACEHOLDER_URL = "https://placeholder.supabase.co";
const PLACEHOLDER_KEY = "placeholder";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || PLACEHOLDER_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || PLACEHOLDER_KEY;
    // Validate URL — invalid URL would make createServerClient throw and break Edge middleware
    try {
      // eslint-disable-next-line no-new
      new URL(url);
    } catch {
      return response;
    }
    const supabase = createServerClient(url, anonKey, {
      cookies: {
        get(name: string) { return request.cookies.get(name)?.value; },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    });
    await supabase.auth.getUser();
  } catch (e) {
    // Never throw from middleware — it would cause 500 MIDDLEWARE_INVOCATION_FAILED
    console.error("[supabase middleware] updateSession failed:", e);
  }
  return response;
}
