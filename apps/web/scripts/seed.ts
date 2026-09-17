// Optional seed via service_role — runs with SUPABASE_SERVICE_ROLE_KEY
import { createClient } from "@supabase/supabase-js";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if(!url || !key){ console.error("Set SUPABASE_URL and SERVICE_ROLE_KEY"); process.exit(1); }
const supabase = createClient(url, key);
async function run(){
  console.log("Seeding demo rides...");
  // This assumes profiles already exist via auth; for pure service seed, create them
  // See supabase/seed/seed.sql for SQL version
  console.log("Run supabase/seed/seed.sql in SQL editor, or use `supabase db reset` locally.");
}
run();
