import { Stack } from "expo-router";
import { I18nProvider } from "../src/lib/i18n";
import { SafeAreaProvider } from "react-native-safe-area-context";
export default function Root(){
  return (
    <SafeAreaProvider>
      <I18nProvider>
        <Stack screenOptions={{ headerStyle:{ backgroundColor:"#0F766E"}, headerTintColor:"white", headerTitleStyle:{ fontWeight:"800"} }}>
          <Stack.Screen name="(tabs)" options={{ headerShown:false }} />
          <Stack.Screen name="login" options={{ title:"Anmelden" }} />
          <Stack.Screen name="register" options={{ title:"Registrieren" }} />
        </Stack>
      </I18nProvider>
    </SafeAreaProvider>
  );
}
