import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      name: "FeedbackWidget",
      formats: ["es", "iife"],
      fileName: (format) => `feedback-widget.${format}.js`
    }
  }
});
