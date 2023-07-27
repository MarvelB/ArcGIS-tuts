import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        // Copy the calcite assets to the public folder
        {
          src: "node_modules/@esri/calcite-components/dist/calcite/assets/*",
          dest: "assets/",
          overwrite: true,
        },
      ],
    }),
  ],
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
});
