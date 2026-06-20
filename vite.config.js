import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    emptyOutDir: false,
		cssCodeSplit: true,
    rollupOptions: {
      input: {
        main: "src/index.ts",
      },
      output: {
        entryFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
        dir: "dist",
        format: "iife",
        name: "TheatrumAnimation",
      },
      external: [/^@wordpress\//],
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: [
          "legacy-js-api",
          "import",
          "global-builtin",
          "color-functions",
          "if-function",
        ],
      },
    },
  },
});
