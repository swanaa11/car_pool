import { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { supabase } from "../../src/lib/supabase";
import { Link } from "expo-router";
export default function Messages(){
  const [chats,setChats]=useState<any[]>([]);
  useEffect(()=>{
    (async()=>{
      const { data:{user} } = await supabase.auth.getUser();
      if(!user) return;
      const { data: rides } = await supabase.from("rides").select("id,origin_label,destination_label,departure_at").eq("driver_id", user.id).limit(20);
      const { data: bookings } = await supabase.from("bookings").select("ride:rides!inner(id,origin_label,destination_label,departure_at)").eq("passenger_id", user.id).limit(20);
      const bookingRides=(bookings??[]).map((b:any)=>b.ride).filter(Boolean);
      const all=[...(rides??[]),...bookingRides];
      const uniq=Array.from(new Map(all.map(r=>[r.id,r])).values());
      setChats(uniq);
    })();
  },[]);
  return (
    <ScrollView style={{flex:1, backgroundColor:"#F8FAFC"}} contentContainerStyle={{padding:16, gap:12}}>
      <Text style={{fontSize:22, fontWeight:"900"}}>Nachrichten · Messages</Text>
      {chats.map(c=>(
        <Link key={c.id} href={`/chat/${c.id}` as any} asChild>
          <Pressable style={{backgroundColor:"white", padding:14, borderRadius:12, borderWidth:1, borderColor:"#E2E8F0"}}>
            <Text style={{fontWeight:"700"}}>{c.origin_label} → {c.destination_label}</Text>
            <Text style={{fontSize:12, color:"#64748B"}}>{new Date(c.departure_at).toLocaleString("de-DE")}</Text>
          </Pressable>
        </Link>
      ))}
      {chats.length===0 && <Text style={{color:"#64748B", textAlign:"center", marginTop:20}}>Keine Chats — buche oder biete eine Fahrt an.</Text>}
    </ScrollView>
  );
}
