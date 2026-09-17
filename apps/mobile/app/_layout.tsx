import { Stack } from "expo-router";
import { I18nProvider } from "../src/lib/i18n";
import { ThemeProvider, useColors } from "../src/lib/theme";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

function ThemedStack() {
  const c = useColors();
  return (
    <>
      <StatusBar style={c.bg === "#020617" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: c.primary },
          headerTintColor: "white",
          headerTitleStyle: { fontWeight: "800" },
          contentStyle: { backgroundColor: c.bg },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ title: "Anmelden · Log in" }} />
        <Stack.Screen name="register" options={{ title: "Registrieren · Sign up" }} />
      </Stack>
    </>
  );
}

export default function Root() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <I18nProvider>
          <ThemedStack />
        </I18nProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
