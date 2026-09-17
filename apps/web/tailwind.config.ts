import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}", "../../packages/ui/src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand shorthand — used by shared UI primitives (button/input/avatar)
        brand: { DEFAULT: "#29669B", hover: "#21527D", light: "#EFF5FB", dark: "#5A9AD3" },

        // "Route Blue" — Autobahn-signage blue, replaces the old teal as the primary hue.
        // Same slot name (teal) so every existing utility class repaints without a find/replace.
        teal: {
          50: "#EFF5FB", 100: "#DBE9F5", 200: "#B6D3EC", 300: "#8AB8E0", 400: "#5A9AD3",
          500: "#327CBD", 600: "#29669B", 700: "#21527D", 800: "#1B4265", 900: "#15344F", 950: "#0E2234",
        },
        // "Highway Sky" — lighter companion blue, replaces cyan (gradient partner to Route Blue).
        cyan: {
          50: "#EEF8FB", 100: "#DAEFF6", 200: "#B5DFEE", 300: "#87CCE3", 400: "#56B7D7",
          500: "#2E9DC2", 600: "#25819F", 700: "#1E6880", 800: "#185467", 900: "#134151", 950: "#0D2B36",
        },
        // "Moss" — muted eco green, replaces emerald (verification / sustainability accents).
        emerald: {
          50: "#F2F7F3", 100: "#E2EEE4", 200: "#C5DDC9", 300: "#A2C8A8", 400: "#7BB284",
          500: "#599763", 600: "#497C51", 700: "#3A6441", 800: "#2F5035", 900: "#253F29", 950: "#192A1B",
        },

        paper: "#F4F5F2",     // warm, slightly grey canvas — replaces flat slate-50
        asphalt: "#14181C",   // cool near-black — replaces flat slate-950
      },
      fontFamily: {
        sans: ["var(--font-fira-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-fira-sans-condensed)", "var(--font-fira-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: { "4xl": "2rem" },
      keyframes: {
        "fade-in": { "0%": { opacity: "0", transform: "translateY(8px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "slide-in": { "0%": { opacity: "0", transform: "translateX(-10px)" }, "100%": { opacity: "1", transform: "translateX(0)" } },
        "scale-in": { "0%": { opacity: "0", transform: "scale(0.95)" }, "100%": { opacity: "1", transform: "scale(1)" } },
        "float": { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-6px)" } },
        "shimmer": { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        "draw-route": { "0%": { strokeDashoffset: "1" }, "100%": { strokeDashoffset: "0" } },
        "pin-drop": { "0%": { opacity: "0", transform: "translateY(-6px) scale(0.6)" }, "60%": { opacity: "1" }, "100%": { opacity: "1", transform: "translateY(0) scale(1)" } },
        "pulse-ring": { "0%": { transform: "scale(0.9)", opacity: "0.7" }, "100%": { transform: "scale(2.2)", opacity: "0" } },
      },
      animation: {
        "fade-in": "fade-in 0.6s ease-out both",
        "slide-in": "slide-in 0.5s ease-out both",
        "scale-in": "scale-in 0.4s ease-out both",
        "float": "float 3s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "draw-route": "draw-route 1.6s cubic-bezier(0.65,0,0.35,1) 0.2s both",
        "pin-drop": "pin-drop 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
        "pulse-ring": "pulse-ring 2.2s cubic-bezier(0,0,0.2,1) infinite",
      },
      backdropBlur: { xs: "2px" },
      boxShadow: {
        route: "0 20px 40px -14px rgba(21,52,79,0.35)",
      },
    },
  },
  plugins: [],
};
export default config;
