# Atlas Website

The marketing site for [Atlas](https://github.com/AtlasStudioMC/Atlas), built with
[Astro](https://astro.build) + [Tailwind CSS](https://tailwindcss.com), configured for
[Vercel](https://vercel.com).

## Development

```bash
npm install
npm run dev
```

## Building

```bash
npm run build
```

## Deploying

Import this repo on [Vercel](https://vercel.com/new) - the Astro + `@astrojs/vercel` setup is
detected automatically, no configuration needed beyond that.

The Downloads page fetches release data live from the
[Atlas releases API](https://api.github.com/repos/AtlasStudioMC/Atlas/releases/latest)
at request time. That only works if the `Atlas` repo is public - while it's private, the
page falls back to a direct link to the GitHub Releases page instead of failing silently.
