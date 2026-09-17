import Link from "next/link";
import { getDict } from "@/lib/i18n";
import { SearchForm } from "@/components/SearchForm";
import { createClient } from "@/lib/supabase/server";
import { RideCard } from "@/components/RideCard";
import { HomeClient } from "@/components/HomeClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  const dict = getDict();
  let rides: any[] | null = null;
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("rides")
      .select("*, driver:profiles!rides_driver_id_fkey(first_name,last_name,avatar_url,rating_avg,verification_badges)")
      .eq("status","SCHEDULED")
      .gte("departure_at", new Date().toISOString())
      .order("departure_at", { ascending: true })
      .limit(6);
    rides = data;
  } catch {
    rides = [];
  }

  return <HomeClient dict={dict} rides={rides} />;
}
