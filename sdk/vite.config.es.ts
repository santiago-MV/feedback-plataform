import { defineConfig } from "vite";
import path from "node:path";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/entry-es.ts"),
      formats: ["es"],
      fileName: () => "feedback-widget.es.js",
    },
    sourcemap: true,
    emptyOutDir: false,
  },
});
