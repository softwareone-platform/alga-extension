import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

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
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@lib": path.resolve(__dirname, "./src/lib"),
      "@ui": path.resolve(__dirname, "./src/ui"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@utils": path.resolve(__dirname, "./src/utils"),
    },
  },
  build: {
    outDir: "./dist/ui",
  },
});
