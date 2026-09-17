import { defineConfig } from "vitest/config";
import path from "path";
export default defineConfig({ 
  resolve: {
    alias: {
      "@carpull/types": path.resolve(__dirname, "../types/src"),
    },
  },
  test: { include: ["src/**/*.test.ts"], globals: true } 
});
