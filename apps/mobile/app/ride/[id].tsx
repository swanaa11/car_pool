import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { supabase } from "../../src/lib/supabase";
export default function RideDetail(){
  const { id } = useLocalSearchParams<{id:string}>();
  const [ride,setRide]=useState<any>(null); const [loading,setLoading]=useState(true);
  useEffect(()=>{
    (async()=>{
      const { data } = await supabase.from("rides").select("*, driver:profiles!rides_driver_id_fkey(first_name,last_name,rating_avg,rating_count)").eq("id", id).single();
      setRide(data); setLoading(false);
    })();
  },[id]);
  const request=async()=>{
    const { data:{user} } = await supabase.auth.getUser();
    if(!user) return Alert.alert("Bitte anmelden");
    const { error } = await supabase.rpc("request_booking", { p_ride_id: id, p_seats: 1 });
    if(error) Alert.alert("Fehler", error.message); else Alert.alert("Anfrage gesendet ✓");
  };
  if(loading) return <View style={{flex:1, justifyContent:"center", alignItems:"center"}}><Text>Lädt…</Text></View>;
  if(!ride) return <View style={{flex:1, justifyContent:"center", alignItems:"center"}}><Text>Nicht gefunden</Text></View>;
  return (
    <ScrollView style={{flex:1, backgroundColor:"#F8FAFC"}} contentContainerStyle={{padding:16, gap:12}}>
      <View style={{backgroundColor:"white", padding:16, borderRadius:16, borderWidth:1, borderColor:"#E2E8F0"}}>
        <Text style={{fontSize:12, color:"#64748B"}}>{new Date(ride.departure_at).toLocaleString("de-DE")}</Text>
        <Text style={{fontSize:20, fontWeight:"900"}}>{ride.origin_label} → {ride.destination_label}</Text>
        <Text style={{marginTop:8, color:"#0F766E", fontWeight:"800"}}>{(ride.contribution_cents/100).toFixed(2).replace(".",",")} € <Text style={{color:"#64748B", fontWeight:"400"}}>p.P.</Text></Text>
        <Text style={{marginTop:8, fontSize:12, color:"#64748B"}}>{ride.seats_available}/{ride.seats_total} Plätze frei · {ride.smoking_allowed?"Rauchen erlaubt":"Nichtraucher"} · {ride.pets_allowed?"Haustiere ok":"Keine Haustiere"}</Text>
        {ride.notes && <Text style={{marginTop:10, backgroundColor:"#FFFBEB", padding:10, borderRadius:12, borderWidth:1, borderColor:"#FDE68A"}}>{ride.notes}</Text>}
      </View>
      <View style={{backgroundColor:"white", padding:16, borderRadius:16, borderWidth:1, borderColor:"#E2E8F0"}}>
        <Text style={{fontWeight:"700"}}>Fahrer · Driver</Text>
        <Text style={{color:"#334155"}}>{ride.driver?.first_name} {ride.driver?.last_name} · ★ {Number(ride.driver?.rating_avg ?? 5).toFixed(1)} ({ride.driver?.rating_count ?? 0})</Text>
      </View>
      <Pressable onPress={request} style={{backgroundColor:"#0F766E", padding:16, borderRadius:12, alignItems:"center"}}><Text style={{color:"white", fontWeight:"800"}}>Platz anfragen · Request seat</Text></Pressable>
    </ScrollView>
  );
}
