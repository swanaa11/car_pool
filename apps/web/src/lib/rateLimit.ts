// Simple in-memory limiter for API routes (use Upstash Redis in production for distributed)
const buckets = new Map<string,{tokens:number,last:number}>();
export function checkRateLimit(key:string, limit:number, windowMs:number) {
  const now=Date.now();
  const b=buckets.get(key) ?? {tokens:limit,last:now};
  const elapsed=now-b.last; const refill=(elapsed/windowMs)*limit;
  b.tokens=Math.min(limit,b.tokens+refill); b.last=now;
  if(b.tokens>=1){ b.tokens-=1; buckets.set(key,b); return {allowed:true,remaining:Math.floor(b.tokens)}; }
  buckets.set(key,b);
  return {allowed:false,remaining:0,retryAfter:Math.ceil((1-b.tokens)*(windowMs/limit))};
}
