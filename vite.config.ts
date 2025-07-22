import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/',
  server: {
    host: "::",
    port: 8081,
  },
  plugins: [
    react(),
    ...(mode === "development" ? [componentTagger()] : [])
  ],
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
            if (id.includes("react")) return "vendor-react";
            if (id.includes("@radix-ui")) return "vendor-radix";
            return "vendor-other";
          }
        },
      },
      onwarn: (warning, warn) => {
        if (warning.code === "CIRCULAR_DEPENDENCY") return;
        warn(warning);
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
    exclude: ["lovable-tagger"],
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
