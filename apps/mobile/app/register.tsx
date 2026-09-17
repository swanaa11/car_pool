import { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { supabase } from "../src/lib/supabase";
import { useRouter, Link } from "expo-router";
export default function Register(){
  const router=useRouter(); const [form,setForm]=useState({first_name:"",last_name:"",email:"",password:""});
  const submit=async()=>{
    const { error } = await supabase.auth.signUp({ email: form.email, password: form.password, options:{ data:{ first_name: form.first_name, last_name: form.last_name } } });
    if(error) Alert.alert("Fehler", error.message); else { Alert.alert("Konto erstellt", "E-Mail prüfen."); router.replace("/login" as any); }
  };
  return (
    <View style={{flex:1, backgroundColor:"#F8FAFC", padding:16, justifyContent:"center", gap:10}}>
      <Text style={{fontSize:24, fontWeight:"900", textAlign:"center"}}>Konto erstellen</Text>
      <View style={{flexDirection:"row", gap:8}}>
        <TextInput placeholder="Vorname" value={form.first_name} onChangeText={v=>setForm({...form, first_name:v})} style={{flex:1, backgroundColor:"white", borderWidth:1, borderColor:"#E2E8F0", borderRadius:12, padding:14}}/>
        <TextInput placeholder="Nachname" value={form.last_name} onChangeText={v=>setForm({...form, last_name:v})} style={{flex:1, backgroundColor:"white", borderWidth:1, borderColor:"#E2E8F0", borderRadius:12, padding:14}}/>
      </View>
      <TextInput placeholder="E-Mail" value={form.email} onChangeText={v=>setForm({...form, email:v})} autoCapitalize="none" style={{backgroundColor:"white", borderWidth:1, borderColor:"#E2E8F0", borderRadius:12, padding:14}}/>
      <TextInput placeholder="Passwort" value={form.password} onChangeText={v=>setForm({...form, password:v})} secureTextEntry style={{backgroundColor:"white", borderWidth:1, borderColor:"#E2E8F0", borderRadius:12, padding:14}}/>
      <Pressable onPress={submit} style={{backgroundColor:"#0F766E", padding:14, borderRadius:12, alignItems:"center"}}><Text style={{color:"white", fontWeight:"700"}}>Registrieren</Text></Pressable>
      <Link href="/login" asChild><Pressable style={{alignItems:"center", padding:10}}><Text style={{color:"#0F766E", fontWeight:"600"}}>Schon registriert? Anmelden</Text></Pressable></Link>
    </View>
  );
}
