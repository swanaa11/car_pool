import { geocodingProvider } from "@/lib/location";
import { checkRateLimit } from "@/lib/rateLimit";
export async function GET(req: Request){
  const ip = (req.headers.get("x-forwarded-for") ?? "anon").split(",")[0];
  const rl = checkRateLimit(`geocode:${ip}`, 30, 60_000);
  if(!rl.allowed) return Response.json({ error:"Rate limit" }, { status: 429 });
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  if(!q) return Response.json({ error:"Missing q" },{ status:400 });
  const results = await geocodingProvider.geocode(q);
  return Response.json({ results });
}
