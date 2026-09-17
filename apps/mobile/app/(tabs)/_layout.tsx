import { Tabs } from "expo-router";
import { useI18n } from "../../src/lib/i18n";
import { useColors } from "../../src/lib/theme";
import { Text } from "react-native";

export default function TabsLayout() {
  const { dict } = useI18n();
  const c = useColors();
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { backgroundColor: c.card, borderTopColor: c.border, height: 60, paddingBottom: 6, paddingTop: 6 },
        tabBarActiveTintColor: c.primary,
        tabBarInactiveTintColor: c.muted,
        headerStyle: { backgroundColor: c.primary },
        headerTintColor: "white",
        headerTitleStyle: { fontWeight: "800" },
      }}
    >
      <Tabs.Screen name="index" options={{ title: dict.search?.title ?? "Find", tabBarIcon: () => <Text>🔍</Text> }} />
      <Tabs.Screen name="offer" options={{ title: dict.nav?.offer ?? "Offer", tabBarIcon: () => <Text>＋</Text> }} />
      <Tabs.Screen name="rides" options={{ title: dict.nav?.myRides ?? "Rides", tabBarIcon: () => <Text>🚗</Text> }} />
      <Tabs.Screen name="messages" options={{ title: dict.nav?.messages ?? "Chat", tabBarIcon: () => <Text>💬</Text> }} />
      <Tabs.Screen name="profile" options={{ title: dict.nav?.profile ?? "Profile", tabBarIcon: () => <Text>👤</Text> }} />
    </Tabs>
  );
}
