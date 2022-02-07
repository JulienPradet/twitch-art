import "dotenv/config";
import { resolve } from "path";
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import preprocess from "svelte-preprocess";

export default defineConfig({
  build: {
    minify: false,
    rollupOptions: {
      input: {
        main: resolve(process.cwd(), "index.html"),
        fresque: resolve(process.cwd(), "fresque.html"),
      },
    },
    outDir: resolve(process.cwd(), "dist/client"),
  },
  server: {
    host: process.env.HOST,
    port: process.env.DEV_PORT,
  },
  plugins: [
    svelte({
      preprocess: preprocess({}),
    }),
  ],
});
