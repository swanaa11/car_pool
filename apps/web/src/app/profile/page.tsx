import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileForm from "./form";
export const dynamic = "force-dynamic";

export default async function ProfilePage(){
  const supabase = createClient();
  const { data:{user} } = await supabase.auth.getUser();
  if(!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  const { data: vehicles } = await supabase.from("vehicles").select("*").eq("owner_id", user.id);
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 animate-fadeIn">
      <h1 className="text-2xl font-black tracking-tight">Profil · Profile</h1>
      <ProfileForm initial={profile} vehicles={vehicles ?? []} email={user.email ?? ""} />
      <form action={async()=>{
        "use server";
        const { createClient } = await import("@/lib/supabase/server");
        const supabase = createClient();
        await supabase.auth.signOut();
        const { redirect } = await import("next/navigation");
        redirect("/login");
      }} className="mt-6">
        <button className="h-10 px-5 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm font-semibold">Abmelden · Log out</button>
      </form>
      <div className="mt-8 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 text-xs text-slate-600 dark:text-slate-400">
        <div className="font-semibold">Datenschutz · Privacy</div>
        <div className="mt-1">Du kannst dein Konto löschen und deine Daten exportieren lassen. Kontaktiere support@carpool.de oder nutze die Konto-Löschen-Funktion (implementiert über Supabase Auth + RLS + Audit-Log). LEGAL_REVIEW_REQUIRED: finale Texte von Anwalt prüfen.</div>
      </div>
    </div>
  );
}