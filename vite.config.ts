import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/',
  server: {
    host: "::",
    port: 8081,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "esnext",
    minify: "esbuild",
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom")) return "vendor-react";
            if (id.includes("@radix-ui")) return "vendor-radix";
            if (id.includes("@supabase")) return "vendor-supabase";
            if (id.includes("@tanstack")) return "vendor-query";
            if (id.includes("lucide-react") || id.includes("chart")) return "vendor-ui";
            return "vendor-other";
          }
        },
      },
      onwarn: (warning, warn) => {
        if (warning.code === "CIRCULAR_DEPENDENCY") return;
        if (warning.code === "THIS_IS_UNDEFINED") return;
        warn(warning);
      },
      external: (id) => {
        // Exclude problematic dependencies in production
        if (mode === "production" && id.includes("lovable-tagger")) {
          return true;
        }
        return false;
      },
    },
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@tanstack/react-query",
      "@supabase/supabase-js",
    ],
  },
  esbuild: {
    target: "esnext",
    logOverride: { "this-is-undefined-in-esm": "silent" },
  },
  // PWA Configuration
  define: {
    __PWA_VERSION__: JSON.stringify(process.env.npm_package_version || "1.0.0"),
    global: "globalThis",
  },
}));
