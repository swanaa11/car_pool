import { useLocalSearchParams } from "expo-router";
import { useEffect, useState, useRef } from "react";
import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { supabase } from "../../src/lib/supabase";
export default function Chat(){
  const { rideId } = useLocalSearchParams<{rideId:string}>();
  const [messages,setMessages]=useState<any[]>([]); const [body,setBody]=useState(""); const [userId,setUserId]=useState<string|null>(null);
  const scrollRef=useRef<ScrollView>(null);
  useEffect(()=>{
    supabase.auth.getUser().then(({data})=> setUserId(data.user?.id ?? null));
    const load=async()=>{
      const { data } = await supabase.from("messages").select("*").eq("ride_id", rideId).order("created_at",{ascending:true}).limit(100);
      setMessages(data ?? []);
      setTimeout(()=> scrollRef.current?.scrollToEnd({animated:true}), 300);
    };
    load();
    const ch=supabase.channel(`ride-${rideId}`).on("postgres_changes",{event:"INSERT", schema:"public", table:"messages", filter:`ride_id=eq.${rideId}`}, (p)=> setMessages(m=>[...m, p.new as any])).subscribe();
    return ()=> { supabase.removeChannel(ch); };
  },[rideId]);
  const send=async()=>{
    if(!body.trim()) return;
    const { data:{user} } = await supabase.auth.getUser();
    if(!user) return;
    await supabase.from("messages").insert({ ride_id: rideId, sender_id: user.id, body: body.trim() });
    setBody("");
  };
  return (
    <KeyboardAvoidingView behavior={Platform.OS==="ios" ? "padding" : undefined} style={{flex:1, backgroundColor:"#F8FAFC"}}>
      <ScrollView ref={scrollRef} style={{flex:1}} contentContainerStyle={{padding:16, gap:8}}>
        {messages.map(m=>(
          <View key={m.id} style={{alignSelf: m.sender_id===userId ? "flex-end" : "flex-start", backgroundColor: m.sender_id===userId ? "#0F766E" : "white", padding:10, borderRadius:16, maxWidth:"75%", borderWidth: m.sender_id===userId?0:1, borderColor:"#E2E8F0"}}>
            <Text style={{color: m.sender_id===userId ? "white" : "#0F172A"}}>{m.body}</Text>
            <Text style={{fontSize:10, color: m.sender_id===userId ? "rgba(255,255,255,0.7)" : "#94A3B8", marginTop:4}}>{new Date(m.created_at).toLocaleTimeString("de-DE")}</Text>
          </View>
        ))}
        {messages.length===0 && <Text style={{textAlign:"center", color:"#64748B", marginTop:40}}>Noch keine Nachrichten.</Text>}
      </ScrollView>
      <View style={{flexDirection:"row", gap:8, padding:12, backgroundColor:"white", borderTopWidth:1, borderColor:"#E2E8F0"}}>
        <TextInput value={body} onChangeText={setBody} placeholder="Nachricht…" style={{flex:1, borderWidth:1, borderColor:"#E2E8F0", borderRadius:12, padding:12}}/>
        <Pressable onPress={send} style={{backgroundColor:"#0F766E", paddingHorizontal:18, borderRadius:12, justifyContent:"center"}}><Text style={{color:"white", fontWeight:"700"}}>Senden</Text></Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
