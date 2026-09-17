import { defineConfig } from "vitest/config";
import path from "path";
export default defineConfig({
  resolve: {
    alias: {
      "@carpull/types": path.resolve(__dirname, "packages/types/src"),
      "@carpull/utils": path.resolve(__dirname, "packages/utils/src"),
      "@carpull/validation": path.resolve(__dirname, "packages/validation/src"),
      "@carpull/config": path.resolve(__dirname, "packages/config/src"),
      "@carpull/i18n": path.resolve(__dirname, "packages/i18n/src"),
      "@carpull/ui": path.resolve(__dirname, "packages/ui/src"),
    },
  },
  test: { 
    include: ["**/*.test.ts"],
    exclude: ["node_modules", "dist", ".next", ".expo"],
    globals: true 
  },
});
