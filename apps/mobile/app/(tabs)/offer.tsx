import { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Alert, Switch } from "react-native";
import { supabase } from "../../src/lib/supabase";
import { useRouter } from "expo-router";
export default function Offer(){
  const router=useRouter();
  const [form,setForm]=useState({origin_label:"",destination_label:"",departure_at:"",seats_total:"3",contribution_cents:"500", smoking:false, pets:false});
  const [loading,setLoading]=useState(false);
  const submit=async()=>{
    setLoading(true);
    try{
      const { data:{user} } = await supabase.auth.getUser();
      if(!user) throw new Error("Bitte anmelden");
      const iso = form.departure_at ? new Date(form.departure_at).toISOString() : new Date(Date.now()+86400000).toISOString();
      const { data, error } = await supabase.from("rides").insert({
        driver_id: user.id, origin_label: form.origin_label, destination_label: form.destination_label,
        departure_at: iso, seats_total: parseInt(form.seats_total), seats_available: parseInt(form.seats_total),
        contribution_cents: parseInt(form.contribution_cents), smoking_allowed: form.smoking, pets_allowed: form.pets
      }).select("id").single();
      if(error) throw error;
      Alert.alert("Fahrt erstellt", "Deine Fahrt wurde veröffentlicht.");
      router.push(`/ride/${data.id}` as any);
    } catch(e:any){ Alert.alert("Fehler", e.message); } finally{ setLoading(false); }
  };
  return (
    <ScrollView style={{flex:1, backgroundColor:"#F8FAFC"}} contentContainerStyle={{padding:16, gap:12}}>
      <Text style={{fontSize:22, fontWeight:"900"}}>Fahrt anbieten · Offer a ride</Text>
      <View style={{backgroundColor:"white", borderRadius:16, padding:16, gap:10, borderWidth:1, borderColor:"#E2E8F0"}}>
        <TextInput placeholder="Von · Berlin Hbf" value={form.origin_label} onChangeText={v=>setForm({...form, origin_label:v})} style={{borderWidth:1, borderColor:"#E2E8F0", borderRadius:12, padding:12}}/>
        <TextInput placeholder="Nach · Potsdam Hbf" value={form.destination_label} onChangeText={v=>setForm({...form, destination_label:v})} style={{borderWidth:1, borderColor:"#E2E8F0", borderRadius:12, padding:12}}/>
        <TextInput placeholder="Abfahrt ISO z.B. 2026-09-18T07:30" value={form.departure_at} onChangeText={v=>setForm({...form, departure_at:v})} style={{borderWidth:1, borderColor:"#E2E8F0", borderRadius:12, padding:12}}/>
        <View style={{flexDirection:"row", gap:8}}>
          <TextInput placeholder="Plätze" value={form.seats_total} onChangeText={v=>setForm({...form, seats_total:v})} style={{flex:1, borderWidth:1, borderColor:"#E2E8F0", borderRadius:12, padding:12}}/>
          <TextInput placeholder="Cent z.B. 500 = 5,00 €" value={form.contribution_cents} onChangeText={v=>setForm({...form, contribution_cents:v})} style={{flex:1, borderWidth:1, borderColor:"#E2E8F0", borderRadius:12, padding:12}}/>
        </View>
        <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}><Text>Rauchen erlaubt</Text><Switch value={form.smoking} onValueChange={v=>setForm({...form, smoking:v})} /></View>
        <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}><Text>Haustiere erlaubt</Text><Switch value={form.pets} onValueChange={v=>setForm({...form, pets:v})} /></View>
        <Pressable onPress={submit} disabled={loading} style={{backgroundColor:"#0F766E", padding:14, borderRadius:12, alignItems:"center", opacity: loading?0.5:1}}><Text style={{color:"white", fontWeight:"700"}}>{loading?"…":"Veröffentlichen · Publish"}</Text></Pressable>
      </View>
      <Text style={{fontSize:12, color:"#64748B", textAlign:"center"}}>Kostenbeteiligung transparent — kein Taxipreis. Zahlung privat/Bar.</Text>
    </ScrollView>
  );
}
