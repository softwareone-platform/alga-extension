import { defineConfig } from "tsup";
import path from "path";

export default defineConfig({
  entry: ["src/backend/handler.ts"],
  format: ["esm"],
  outDir: "dist/js",
  clean: true,
  external: [
    "alga:extension/secrets",
    "alga:extension/http",
    "alga:extension/storage",
    "alga:extension/logging",
    "alga:extension/ui-proxy",
    "alga:extension/context",
    "alga:extension/user-v2",
    "alga:extension/invoicing",
  ],
  esbuildOptions(options) {
    options.alias = {
      "@": path.resolve(__dirname, "./src"),
    };
  },
});
