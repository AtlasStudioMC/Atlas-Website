# Atlas Website

The site for [Atlas and Astra](https://github.com/AtlasStudioMC/Atlas),
[Astro](https://github.com/AtlasStudioMC/Astro) and
[Aurora](https://github.com/AtlasStudioMC/Aurora). Built with
[Astro](https://astro.build) + [Tailwind CSS](https://tailwindcss.com), served by GitHub Pages at
**<https://atlasgames.aa.am>**.

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

Pushing to `main` runs `.github/workflows/pages.yml`, which builds and publishes to GitHub
Pages. The same workflow runs daily, and can be triggered by hand from the Actions tab.

Three things about that setup are load-bearing:

- **`public/CNAME`** is what assigns `atlasgames.aa.am`. It has to live in the built artifact,
  because an Actions deploy replaces the whole site and would drop a domain that only existed in
  the repository's Pages settings.
- **The downloads page is prerendered**, not server-rendered - Pages has no runtime. It fetches
  the [Atlas releases API](https://api.github.com/repos/AtlasStudioMC/Atlas/releases) during the
  build, authenticated when `GITHUB_TOKEN` is set, because runners share an IP and the anonymous
  limit is 60 requests an hour. The daily rebuild is what keeps that list current.
- **The workflow refuses to publish** a downloads page that built without any releases in it.
  Shipping the empty-state fallback silently is worse than not shipping.

`build.format` is `"file"`, so pages are emitted as `downloads.html` rather than
`downloads/index.html`. Pages serves those extensionless, which means the canonical URLs answer
200 directly instead of 301-ing to a trailing-slash variant.
