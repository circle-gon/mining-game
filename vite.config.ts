import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import tsconfigPaths from "vite-tsconfig-paths";
import projInfo from "./src/data/projInfo.json";
import checker from "vite-plugin-checker";
import eruda from "vite-plugin-eruda";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  resolve: {
    alias: {
      vue: "vue/dist/vue.esm-bundler.js",
    },
  },
  plugins: [
    vue(),
    vueJsx({
      // options are passed on to @vue/babel-plugin-jsx
    }),
    checker({
      vueTsc: true,
      eslint: {
        lintCommand: "eslint --ext .ts,.tsx,.vue --fix src",
      },
    }),
    eruda(),
    tsconfigPaths(),
    VitePWA({
      includeAssets: [
        "Logo.svg",
        "favicon.ico",
        "robots.txt",
        "apple-touch-icon.png",
      ],
      manifest: {
        name: projInfo.title,
        short_name: projInfo.title,
        description: projInfo.description,
        theme_color: "#2E3440",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
});
