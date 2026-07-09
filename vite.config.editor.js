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
        // Must match the dependency handles in theatrum-animation.php.
        globals: {
          react: "React",
          "@wordpress/hooks": "wp.hooks",
          "@wordpress/block-editor": "wp.blockEditor",
          "@wordpress/components": "wp.components",
          "@wordpress/compose": "wp.compose",
          "@wordpress/data": "wp.data",
          "@wordpress/element": "wp.element",
          "@wordpress/i18n": "wp.i18n",
        },
      },
      external: ["react", /^@wordpress\//],
    },
  },
});
