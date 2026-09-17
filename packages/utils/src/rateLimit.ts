// Simple in-memory token bucket — replace with Redis/Upstash for distributed prod
type Bucket = { tokens: number; last: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(key:string, limit:number, windowMs:number): { allowed: boolean; remaining: number; retryAfterMs: number } {
  const now = Date.now();
  const b = buckets.get(key) ?? { tokens: limit, last: now };
  const elapsed = now - b.last;
  const refill = (elapsed / windowMs) * limit;
  b.tokens = Math.min(limit, b.tokens + refill);
  b.last = now;
  if (b.tokens >= 1) {
    b.tokens -= 1;
    buckets.set(key, b);
    return { allowed: true, remaining: Math.floor(b.tokens), retryAfterMs: 0 };
  }
  const retryAfterMs = Math.ceil((1 - b.tokens) * (windowMs / limit));
  buckets.set(key,b);
  return { allowed: false, remaining: 0, retryAfterMs };
}

// For Next.js middleware / API routes: use this helper
export function rateLimitOrThrow(key:string, limit:number, windowMs:number) {
  const r = rateLimit(key, limit, windowMs);
  if (!r.allowed) {
    const e: any = new Error(`Rate limit exceeded. Retry after ${r.retryAfterMs}ms`);
    e.status = 429;
    e.retryAfterMs = r.retryAfterMs;
    throw e;
  }
}
