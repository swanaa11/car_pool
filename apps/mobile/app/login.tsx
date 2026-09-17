import { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { supabase } from "../src/lib/supabase";
import { useRouter, Link } from "expo-router";
export default function Login(){
  const router=useRouter(); const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const submit=async()=>{
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if(error) Alert.alert("Fehler", error.message); else router.replace("/" as any);
  };
  return (
    <View style={{flex:1, backgroundColor:"#F8FAFC", padding:16, justifyContent:"center", gap:12}}>
      <Text style={{fontSize:24, fontWeight:"900", textAlign:"center"}}>Willkommen zurück</Text>
      <TextInput placeholder="E-Mail" value={email} onChangeText={setEmail} autoCapitalize="none" style={{backgroundColor:"white", borderWidth:1, borderColor:"#E2E8F0", borderRadius:12, padding:14}}/>
      <TextInput placeholder="Passwort" value={password} onChangeText={setPassword} secureTextEntry style={{backgroundColor:"white", borderWidth:1, borderColor:"#E2E8F0", borderRadius:12, padding:14}}/>
      <Pressable onPress={submit} style={{backgroundColor:"#0F766E", padding:14, borderRadius:12, alignItems:"center"}}><Text style={{color:"white", fontWeight:"700"}}>Anmelden</Text></Pressable>
      <Link href="/register" asChild><Pressable style={{alignItems:"center", padding:10}}><Text style={{color:"#0F766E", fontWeight:"600"}}>Kein Konto? Registrieren</Text></Pressable></Link>
    </View>
  );
}
