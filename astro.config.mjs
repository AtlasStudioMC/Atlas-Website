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

  integrations: [
    sitemap({
      // Emit the same URL shape the pages declare as canonical. Astro's default "directory" build
      // format adds a trailing slash, but Layout.astro normalises canonicals without one, and both
      // shapes serve a 200 - so an unmodified sitemap submits URLs that every page then disavows.
      serialize: (item) => ({
        ...item,
        url: item.url.replace(/(.+)\/$/, "$1"),
      }),
    }),
  ],

  output: "server",
  adapter: vercel(),
});
