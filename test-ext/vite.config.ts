import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { readdirSync } from "fs";

const buildTarget = process.env.BUILD_TARGET || "ui";

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

export default defineConfig({
  plugins: buildTarget === "ui" ? [react(), tailwindcss()] : [],
  root: buildTarget === "ui" ? "./src/ui" : "./src/component",
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
