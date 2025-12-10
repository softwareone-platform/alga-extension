import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { readdirSync } from "fs";

const buildTarget = process.env.BUILD_TARGET || "ui";

// Get all .ts files in src/component
const getComponentEntries = () => {
  const componentDir = path.resolve(__dirname, "src/component");
  const files = readdirSync(componentDir, { recursive: true });
  const entries: Record<string, string> = {};

  files.forEach((file) => {
    if (typeof file === "string" && file.endsWith(".ts")) {
      const name = file.replace(/\.ts$/, "");
      entries[name] = path.resolve(componentDir, file);
    }
  });

  return entries;
};

// import { copyFileSync, mkdirSync } from "node:fs";

// Simple plugin to copy alga.manifest.json to ./dist/manifest.json after build
// function manifestPlugin() {
//   return {
//     name: "manifest-copy",
//     closeBundle() {
//       mkdirSync("./dist", { recursive: true });
//       copyFileSync("./manifest.json", "./dist/manifest.json");
//     },
//   };
// }

// https://vite.dev/config/
export default defineConfig({
  // plugins: [react(), manifestPlugin()],
  plugins: buildTarget === "ui" ? [react(), tailwindcss()] : [],
  root: buildTarget === "ui" ? "./src/ui" : "./src/component",
  envDir: path.resolve(__dirname, "./"), // Point to project root for .env files
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@lib/swo-proxy": path.resolve(__dirname, "./src/ui/lib/swo-proxy"),
      "@lib/alga-proxy": path.resolve(__dirname, "./src/ui/lib/alga-proxy"),
      "@lib/proxy": path.resolve(__dirname, "./src/ui/lib/proxy"),
      "@lib": path.resolve(__dirname, "./src/ui/lib"),
      "@ui": path.resolve(__dirname, "./src/ui/ui"),
      "@features": path.resolve(__dirname, "./src/ui/features"),
      "@utils": path.resolve(__dirname, "./src/ui/utils"),
      "@swo/rql-client": path.resolve(__dirname, "./src/shims/swo-rql-client.ts"),
      "@swo/mp-api-model/billing": path.resolve(__dirname, "./src/shims/swo-mp-api-model-billing.ts"),
      "@swo/mp-api-model": path.resolve(__dirname, "./src/shims/swo-mp-api-model.ts"),
    },
  },
  build: {
    outDir: buildTarget === "ui" ? "../../dist/ui" : "../../dist/js",
    lib:
      buildTarget === "component"
        ? {
            entry: getComponentEntries(),
            formats: ["es"],
          }
        : undefined,
    rollupOptions:
      buildTarget === "component"
        ? {
            output: {
              entryFileNames: "[name].js",
            },
          }
        : undefined,
  },
});
