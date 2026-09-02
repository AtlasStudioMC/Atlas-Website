import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";

export default defineConfig({
  // The real deployed origin. This drives sitemap.xml and every canonical/OG absolute URL, so a
  // wrong value here silently points search engines at a domain that doesn't exist.
  site: "https://atlasstudiomc.vercel.app",

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [sitemap()],

  output: "server",
  adapter: vercel(),
});
