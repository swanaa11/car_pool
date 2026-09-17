"use client";
import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useParams } from "next/navigation";

export default function ChatPage(){
  const { rideId } = useParams() as { rideId: string };
  const [messages, setMessages] = useState<any[]>([]);
  const [body, setBody] = useState("");
  const [userId, setUserId] = useState<string|null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    const supabase = createClient();
    supabase.auth.getUser().then(({data})=> setUserId(data.user?.id ?? null));
    const fetchMsgs = async ()=>{
      const { data } = await supabase.from("messages").select("*").eq("ride_id", rideId).order("created_at",{ascending:true}).limit(100);
      setMessages(data ?? []);
      setTimeout(()=> listRef.current?.scrollTo(0, 1e9), 100);
    };
    fetchMsgs();
    const channel = supabase.channel(`ride-${rideId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `ride_id=eq.${rideId}` }, (payload)=>{
        setMessages(m=> [...m, payload.new]);
        setTimeout(()=> listRef.current?.scrollTo(0, 1e9), 100);
      })
      .subscribe();
    return ()=> { supabase.removeChannel(channel); };
  },[rideId]);

  const send = async (e:React.FormEvent)=>{
    e.preventDefault();
    if(!body.trim()) return;
    const supabase = createClient();
    const { data:{user} } = await supabase.auth.getUser();
    if(!user) return alert("Bitte anmelden");
    const { error } = await supabase.from("messages").insert({ ride_id: rideId, sender_id: user.id, body: body.trim() });
    if(error) alert(error.message);
    else setBody("");
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 flex flex-col h-[70vh]">
      <h1 className="text-xl font-bold">Chat — Fahrt {rideId.slice(0,8)}…</h1>
      <div ref={listRef} className="mt-4 flex-1 overflow-auto rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
        {messages.map(m=>(
          <div key={m.id} className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${m.sender_id===userId ? "ml-auto bg-teal-700 text-white" : "bg-slate-100"}`}>
            <div>{m.body}</div>
            <div className={`mt-1 text-[11px] ${m.sender_id===userId ? "text-white/70" : "text-slate-500"}`}>{new Date(m.created_at).toLocaleTimeString("de-DE")}</div>
          </div>
        ))}
        {messages.length===0 && <div className="text-sm text-slate-500 text-center py-10">Noch keine Nachrichten — schreib die erste!</div>}
      </div>
      <form onSubmit={send} className="mt-4 flex gap-2">
        <input value={body} onChange={e=>setBody(e.target.value)} placeholder="Nachricht schreiben…" maxLength={2000} className="flex-1 h-11 rounded-xl border border-slate-200 px-3 text-sm"/>
        <button className="h-11 px-6 rounded-xl bg-teal-700 text-white font-semibold text-sm">Senden</button>
      </form>
      <div className="mt-2 text-xs text-slate-500">Realtime via Supabase. Blockierte Nutzer können nicht schreiben (RLS). Moderation über „Melden”.</div>
    </div>
  );
}
