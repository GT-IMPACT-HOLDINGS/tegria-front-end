import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

/**
 * Tegria talks to GTIH only via gtih-sdk.js.
 * DEPLOY_TARGET / GTIH_SDK_URL come from the environment (see src/deployTarget.ts).
 * COOP/COEP remain so browser Hanuman (SharedArrayBuffer) can run on this origin.
 */
const isolationHeaders = {
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Embedder-Policy": "require-corp",
  "Cross-Origin-Resource-Policy": "same-origin",
} as const;

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Only these names (plus VITE_*) are exposed to browser code — keep them exact.
  envPrefix: ["VITE_", "DEPLOY_TARGET", "GTIH_SDK_URL"],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    headers: { ...isolationHeaders },
    host: "0.0.0.0",
    port: process.env.PORT ? parseInt(process.env.PORT) : 5173,
    allowedHosts: true, // מאפשר לכתובת של Render לגשת לשרת הפיתוח בהצלחה
  },
  preview: {
    headers: { ...isolationHeaders },
  },
});
