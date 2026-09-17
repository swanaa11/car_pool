import { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { supabase } from "../../src/lib/supabase";
import { Link } from "expo-router";
import { useI18n } from "../../src/lib/i18n";

export default function Search(){
  const { dict } = useI18n();
  const [from,setFrom]=useState(""); const [to,setTo]=useState(""); const [date,setDate]=useState(""); const [rides,setRides]=useState<any[]>([]); const [loading,setLoading]=useState(false);
  const search=async()=>{
    setLoading(true);
    let q=supabase.from("rides").select("*, driver:profiles!rides_driver_id_fkey(first_name,last_name,rating_avg)").eq("status","SCHEDULED").gte("departure_at", new Date().toISOString()).order("departure_at").limit(20);
    if(from) q=(q as any).ilike("origin_label", `%${from}%`);
    if(to) q=(q as any).ilike("destination_label", `%${to}%`);
    if(date){ const s=new Date(date); const e=new Date(date); e.setDate(e.getDate()+1); q=q.gte("departure_at", s.toISOString()).lt("departure_at", e.toISOString()); }
    const { data } = await q;
    setRides(data ?? []); setLoading(false);
  };
  useEffect(()=>{ search(); },[]);
  return (
    <ScrollView style={{flex:1, backgroundColor:"#F8FAFC"}} contentContainerStyle={{padding:16, gap:12}}>
      <Text style={{fontSize:22, fontWeight:"900"}}>{dict.search?.title ?? "Fahrt finden"}</Text>
      <View style={{backgroundColor:"white", borderRadius:16, padding:12, gap:8, borderWidth:1, borderColor:"#E2E8F0"}}>
        <TextInput placeholder={dict.search?.from ?? "Von"} value={from} onChangeText={setFrom} style={{borderWidth:1, borderColor:"#E2E8F0", borderRadius:12, padding:12}} />
        <TextInput placeholder={dict.search?.to ?? "Nach"} value={to} onChangeText={setTo} style={{borderWidth:1, borderColor:"#E2E8F0", borderRadius:12, padding:12}} />
        <TextInput placeholder="YYYY-MM-DD" value={date} onChangeText={setDate} style={{borderWidth:1, borderColor:"#E2E8F0", borderRadius:12, padding:12}} />
        <Pressable onPress={search} style={{backgroundColor:"#0F766E", padding:14, borderRadius:12, alignItems:"center"}}><Text style={{color:"white", fontWeight:"700"}}>{dict.search?.searchBtn ?? "Suchen"}</Text></Pressable>
      </View>
      {loading ? <ActivityIndicator/> : rides.map(r=>(
        <Link key={r.id} href={`/ride/${r.id}` as any} asChild>
          <Pressable style={{backgroundColor:"white", borderRadius:16, padding:12, borderWidth:1, borderColor:"#E2E8F0"}}>
            <Text style={{fontWeight:"700"}}>{r.origin_label} → {r.destination_label}</Text>
            <Text style={{color:"#64748B", fontSize:12}}>{new Date(r.departure_at).toLocaleString("de-DE")} · {r.seats_available} Plätze · {(r.contribution_cents/100).toFixed(2).replace(".",",")} €</Text>
            <Text style={{color:"#64748B", fontSize:12}}>Fahrer: {r.driver?.first_name} ★ {Number(r.driver?.rating_avg ?? 5).toFixed(1)}</Text>
          </Pressable>
        </Link>
      ))}
      {!loading && rides.length===0 && <Text style={{textAlign:"center", color:"#64748B", marginTop:20}}>{dict.search?.noResults}</Text>}
    </ScrollView>
  );
}
