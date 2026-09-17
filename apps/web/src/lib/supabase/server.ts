import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

// Build-safe: during `next build` for /_not-found, NEXT_PUBLIC_* may be undefined on Vercel if not yet set
// Returning a dummy client prevents "Failed to collect page data for /_not-found"
const PLACEHOLDER_URL = "https://placeholder.supabase.co";
const PLACEHOLDER_KEY = "placeholder";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || PLACEHOLDER_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || PLACEHOLDER_KEY;
  let cookieStore: ReturnType<typeof cookies>;
  try {
    cookieStore = cookies();
  } catch {
    // Fallback for static prerender where cookies() is not available
    return createServerClient(url, anonKey, {
      cookies: {
        get() { return undefined; },
        set() {},
        remove() {},
      },
    });
  }
  return createServerClient(url, anonKey, {
    cookies: {
      get(name: string) { return cookieStore.get(name)?.value; },
      set(name: string, value: string, options: CookieOptions) {
        try { cookieStore.set({ name, value, ...options }); } catch {}
      },
      remove(name: string, options: CookieOptions) {
        try { cookieStore.set({ name, value: "", ...options }); } catch {}
      },
    },
  });
}
