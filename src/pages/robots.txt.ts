import type { APIRoute } from "astro";

export const prerender = true;

// Generated rather than kept in public/, because it names the sitemap by absolute URL. As a
// static file it kept pointing at whichever origin it was written for, which is how it ended up
// advertising the Vercel sitemap from a site served on GitHub Pages. Deriving it from `site`
// means the origin can only ever be wrong in one place instead of two.
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL("sitemap-index.xml", site).href;
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
