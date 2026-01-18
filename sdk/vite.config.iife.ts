import { defineConfig } from "vite";
import path from "node:path";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/entry-iife.ts"),
      name: "FeedbackWidget",
      formats: ["iife"],
      fileName: () => "feedback-widget.iife.js",
    },
    sourcemap: true,
    emptyOutDir: false,
    rollupOptions: {
      output: {
        exports: "default", // THIS is now valid
        extend: false,
      },
    },
  },
});
