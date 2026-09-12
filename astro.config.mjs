import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  // The real deployed origin. This drives sitemap.xml and every canonical/OG absolute URL, so a
  // wrong value here silently points search engines at a domain that doesn't exist.
  //
  // GitHub Pages serves a user site for the AtlasStudioMC account at the account root, which is
  // why this has no path segment. SITE_URL overrides it for a preview or a custom domain; keep
  // exactly one origin live, because two copies of this site both claiming to be canonical is
  // duplicate content and search engines pick the winner for you.
  site: process.env.SITE_URL ?? "https://atlasstudiomc.github.io",

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

  // Static. GitHub Pages serves files, not a server runtime, so every page is built ahead of
  // time - including the downloads page, which fetches its release list during the build rather
  // than per request. A scheduled workflow rebuild is what keeps that list current.
  output: "static",
});
