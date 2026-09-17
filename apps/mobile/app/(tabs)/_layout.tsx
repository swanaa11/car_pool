import { Tabs } from "expo-router";
import { Text } from "react-native";
export default function TabsLayout(){
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor:"#0F766E", headerShown:false }}>
      <Tabs.Screen name="index" options={{ title:"Suchen", tabBarIcon:()=> <Text>🔍</Text> }} />
      <Tabs.Screen name="offer" options={{ title:"Anbieten", tabBarIcon:()=> <Text>➕</Text> }} />
      <Tabs.Screen name="rides" options={{ title:"Fahrten", tabBarIcon:()=> <Text>🚗</Text> }} />
      <Tabs.Screen name="messages" options={{ title:"Chat", tabBarIcon:()=> <Text>💬</Text> }} />
      <Tabs.Screen name="profile" options={{ title:"Profil", tabBarIcon:()=> <Text>👤</Text> }} />
    </Tabs>
  );
}
