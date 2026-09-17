import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}", "../../packages/ui/src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#0F766E", hover: "#0D5C56", light: "#CCFBF1" },
      },
      borderRadius: { "4xl": "2rem" },
    },
  },
  plugins: [],
};
export default config;
