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
        },
        // Configure calcite themes to be used in our app
        {
          src: "node_modules/@arcgis/core/assets/esri/themes/*",
          dest: "assets/themes/",
        },
      ],
    }),
  ],
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
});
