import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react({ jsxRuntime: "classic" })],
  build: {
    emptyOutDir: false,
    rollupOptions: {
      input: "src/block-editor/inspector.tsx",
      output: {
        entryFileNames: "editor.js",
        dir: "dist",
        format: "iife",
        name: "TheatrumAnimationEditor",
        globals: {
          react: "React",
          "@wordpress/hooks": "wp.hooks",
          "@wordpress/block-editor": "wp.blockEditor",
          "@wordpress/components": "wp.components",
          "@wordpress/compose": "wp.compose",
          "@wordpress/element": "wp.element",
        },
      },
      external: ["react", /^@wordpress\//],
    },
  },
});
