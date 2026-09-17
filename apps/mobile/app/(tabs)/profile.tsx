import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Alert } from "react-native";
import { supabase } from "../../src/lib/supabase";
import { useRouter } from "expo-router";
export default function Profile(){
  const router=useRouter();
  const [profile,setProfile]=useState<any>(null); const [form,setForm]=useState({first_name:"",last_name:"",city:"",bio:""});
  useEffect(()=>{
    (async()=>{
      const { data:{user} } = await supabase.auth.getUser();
      if(!user){ router.replace("/login" as any); return; }
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(data); setForm({first_name:data?.first_name??"", last_name:data?.last_name??"", city:data?.city??"", bio:data?.bio??""});
    })();
  },[]);
  const save=async()=>{
    const { data:{user} } = await supabase.auth.getUser();
    const { error } = await supabase.from("profiles").update({ first_name: form.first_name, last_name: form.last_name, city: form.city, bio: form.bio }).eq("id", user!.id);
    if(error) Alert.alert("Fehler", error.message); else Alert.alert("Gespeichert ✓");
  };
  const logout=async()=>{ await supabase.auth.signOut(); router.replace("/login" as any); };
  if(!profile) return <View style={{flex:1, justifyContent:"center", alignItems:"center"}}><Text>Lädt…</Text></View>;
  return (
    <ScrollView style={{flex:1, backgroundColor:"#F8FAFC"}} contentContainerStyle={{padding:16, gap:12}}>
      <Text style={{fontSize:22, fontWeight:"900"}}>Profil · Profile</Text>
      <View style={{backgroundColor:"white", padding:16, borderRadius:16, gap:10, borderWidth:1, borderColor:"#E2E8F0"}}>
        <Text style={{fontSize:12, color:"#64748B"}}>{profile.email} · ★ {Number(profile.rating_avg).toFixed(1)} ({profile.rating_count})</Text>
        <TextInput placeholder="Vorname" value={form.first_name} onChangeText={v=>setForm({...form, first_name:v})} style={{borderWidth:1, borderColor:"#E2E8F0", borderRadius:12, padding:12}}/>
        <TextInput placeholder="Nachname" value={form.last_name} onChangeText={v=>setForm({...form, last_name:v})} style={{borderWidth:1, borderColor:"#E2E8F0", borderRadius:12, padding:12}}/>
        <TextInput placeholder="Stadt" value={form.city} onChangeText={v=>setForm({...form, city:v})} style={{borderWidth:1, borderColor:"#E2E8F0", borderRadius:12, padding:12}}/>
        <TextInput placeholder="Bio" value={form.bio} onChangeText={v=>setForm({...form, bio:v})} multiline style={{borderWidth:1, borderColor:"#E2E8F0", borderRadius:12, padding:12, minHeight:80}}/>
        <Pressable onPress={save} style={{backgroundColor:"#0F766E", padding:14, borderRadius:12, alignItems:"center"}}><Text style={{color:"white", fontWeight:"700"}}>Speichern · Save</Text></Pressable>
        <Pressable onPress={logout} style={{borderWidth:1, borderColor:"#FECACA", backgroundColor:"#FEF2F2", padding:14, borderRadius:12, alignItems:"center"}}><Text style={{color:"#DC2626", fontWeight:"700"}}>Abmelden · Log out</Text></Pressable>
      </View>
    </ScrollView>
  );
}
