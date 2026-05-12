import { defineConfig } from "vite";

export default defineConfig({
  build: {
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: "src/index.ts",
      },
      output: {
        entryFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
        dir: "dist",
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
