"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function RideActions({ rideId, bookingId, isBooking }: { rideId?: string; bookingId?: string; isBooking?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string|null>(null);
  const [err, setErr] = useState<string|null>(null);

  const request = async () => {
    setLoading(true); setErr(null); setMsg(null);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if(!user) throw new Error("Bitte anmelden");
      // use RPC for transactional safety
      const { data, error } = await supabase.rpc("request_booking", { p_ride_id: rideId, p_seats: 1 });
      if(error) throw error;
      setMsg("Anfrage gesendet! / Request sent!");
    } catch (e:any){ setErr(e.message ?? String(e)); } finally { setLoading(false); }
  };
  const accept = async () => {
    setLoading(true); setErr(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.rpc("accept_booking", { p_booking_id: bookingId });
      if(error) throw error;
      setMsg("Angenommen!"); window.location.reload();
    } catch(e:any){ setErr(e.message);} finally{ setLoading(false); }
  };
  const reject = async () => {
    setLoading(true); setErr(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.rpc("reject_booking", { p_booking_id: bookingId });
      if(error) throw error;
      setMsg("Abgelehnt"); window.location.reload();
    } catch(e:any){ setErr(e.message);} finally{ setLoading(false); }
  };

  if (isBooking) {
    return (
      <div>
        <button onClick={request} disabled={loading} className="h-11 w-full rounded-xl bg-teal-700 text-white font-semibold hover:bg-teal-800 disabled:opacity-50">{loading ? "…" : "Platz anfragen · Request seat"}</button>
        {msg && <div className="mt-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl p-2">{msg}</div>}
        {err && <div className="mt-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-2">{err}</div>}
      </div>
    );
  }
  return (
    <div className="flex gap-2">
      <button onClick={accept} disabled={loading} className="h-8 px-3 rounded-xl bg-emerald-600 text-white text-xs font-semibold">Annehmen</button>
      <button onClick={reject} disabled={loading} className="h-8 px-3 rounded-xl border border-slate-200 text-xs font-semibold">Ablehnen</button>
      {(msg||err) && <span className="text-xs self-center ml-2">{msg ?? err}</span>}
    </div>
  );
}
