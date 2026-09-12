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

  // Emit downloads.html rather than downloads/index.html. Every page declares a canonical with
  // no trailing slash, and GitHub Pages 301s /downloads -> /downloads/ under the default
  // "directory" format - which points every canonical and every sitemap entry at a redirect
  // instead of at the page that actually answers 200.
  build: {
    format: "file",
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    sitemap({
      // Emit the same URL shape the pages declare as canonical. Astro's default "directory" build
      // format adds a trailing slash, but Layout.astro normalises canonicals without one, and both
      // shapes serve a 200 - so an unmodified sitemap submits URLs that every page then disavows.
      serialize: (item) => {
        const u = new URL(item.url);
        // Match the canonicals exactly: extensionless, and no trailing slash except at the root.
        u.pathname = u.pathname.replace(/index\.html$/, "").replace(/\.html$/, "");
        if (u.pathname !== "/" && u.pathname.endsWith("/")) u.pathname = u.pathname.slice(0, -1);
        return { ...item, url: u.href };
      },
    }),
  ],

  // Static. GitHub Pages serves files, not a server runtime, so every page is built ahead of
  // time - including the downloads page, which fetches its release list during the build rather
  // than per request. A scheduled workflow rebuild is what keeps that list current.
  output: "static",
});
