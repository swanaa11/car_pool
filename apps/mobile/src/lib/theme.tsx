import React, { createContext, useContext, useEffect, useState } from "react";
import { Appearance, ColorSchemeName } from "react-native";

type Theme = "light" | "dark";
type Ctx = { theme: Theme; isDark: boolean; toggle: () => void };
const ThemeCtx = createContext<Ctx>({ theme: "light", isDark: false, toggle: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => (Appearance.getColorScheme() as Theme) || "light");
  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme((colorScheme as Theme) || "light");
    });
    return () => sub.remove();
  }, []);
  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  return <ThemeCtx.Provider value={{ theme, isDark: theme === "dark", toggle }}>{children}</ThemeCtx.Provider>;
}
export const useTheme = () => useContext(ThemeCtx);
export const colors = {
  light: {
    bg: "#F8FAFC",
    card: "#FFFFFF",
    border: "#E2E8F0",
    text: "#0F172A",
    muted: "#64748B",
    primary: "#0F766E",
    primaryDark: "#0D5C56",
  },
  dark: {
    bg: "#020617",
    card: "#0F172A",
    border: "#1E293B",
    text: "#F1F5F9",
    muted: "#94A3B8",
    primary: "#14B8A6",
    primaryDark: "#0D9488",
  },
};
export function useColors() {
  const { isDark } = useTheme();
  return isDark ? colors.dark : colors.light;
}
