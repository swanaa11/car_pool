import { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { supabase } from "../../src/lib/supabase";
import { Link } from "expo-router";
export default function MyRides(){
  const [offered,setOffered]=useState<any[]>([]); const [booked,setBooked]=useState<any[]>([]);
  useEffect(()=>{
    (async()=>{
      const { data:{user} } = await supabase.auth.getUser();
      if(!user) return;
      const { data: o } = await supabase.from("rides").select("*").eq("driver_id", user.id).order("departure_at",{ascending:false}).limit(20);
      setOffered(o ?? []);
      const { data: b } = await supabase.from("bookings").select("*, ride:rides(*)").eq("passenger_id", user.id).order("created_at",{ascending:false}).limit(20);
      setBooked(b ?? []);
    })();
  },[]);
  return (
    <ScrollView style={{flex:1, backgroundColor:"#F8FAFC"}} contentContainerStyle={{padding:16, gap:16}}>
      <Text style={{fontSize:22, fontWeight:"900"}}>Meine Fahrten</Text>
      <View style={{gap:8}}>
        <Text style={{fontWeight:"700"}}>Als Fahrer · {offered.length}</Text>
        {offered.map(r=>(
          <Link key={r.id} href={`/ride/${r.id}` as any} asChild>
            <Pressable style={{backgroundColor:"white", padding:12, borderRadius:12, borderWidth:1, borderColor:"#E2E8F0"}}>
              <Text style={{fontWeight:"600"}}>{r.origin_label} → {r.destination_label}</Text>
              <Text style={{fontSize:12, color:"#64748B"}}>{new Date(r.departure_at).toLocaleString("de-DE")} · {r.status}</Text>
            </Pressable>
          </Link>
        ))}
        {offered.length===0 && <Text style={{color:"#64748B"}}>Keine Fahrten als Fahrer.</Text>}
      </View>
      <View style={{gap:8}}>
        <Text style={{fontWeight:"700"}}>Als Mitfahrer · {booked.length}</Text>
        {booked.map((b:any)=>(
          <Link key={b.id} href={`/ride/${b.ride?.id}` as any} asChild>
            <Pressable style={{backgroundColor:"white", padding:12, borderRadius:12, borderWidth:1, borderColor:"#E2E8F0"}}>
              <Text style={{fontWeight:"600"}}>{b.ride?.origin_label} → {b.ride?.destination_label}</Text>
              <Text style={{fontSize:12, color:"#64748B"}}>{b.state}</Text>
            </Pressable>
          </Link>
        ))}
        {booked.length===0 && <Text style={{color:"#64748B"}}>Keine Buchungen.</Text>}
      </View>
    </ScrollView>
  );
}
