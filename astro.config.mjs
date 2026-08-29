import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";

export default defineConfig({
  // TODO: set this to your real Vercel/custom domain once deployed - used for sitemap.xml
  // and canonical URLs. Left as a placeholder rather than guessing a real domain.
  site: "https://atlas-website.vercel.app",

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [sitemap()],

  output: "server",
  adapter: vercel(),
});
