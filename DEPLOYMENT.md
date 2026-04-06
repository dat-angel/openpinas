# OpenPinas deployment

## Canonical URL: openpinas.dev

The live site is **[openpinas.dev](https://openpinas.dev)**, hosted on Vercel.

## Vercel (primary)

This repo is configured for **Next.js static export on Vercel**.

```bash
npm install
npm run build   # runs next build, output to out/
```

Vercel serves `out/` — `vercel.json` sets `outputDirectory` to `out`.

1. Import [github.com/dat-angel/openpinas](https://github.com/dat-angel/openpinas) in the Vercel dashboard (or `vercel link` from a local clone).
2. Attach the custom domain `openpinas.dev` in the Vercel project settings.
3. URL paths from the legacy `.html` files are preserved (e.g. `/weekly-reviews/weekly-review-2026-03-21.html`).

## GitHub Pages (data endpoint)

[dat-angel.github.io/openpinas](https://dat-angel.github.io/openpinas/) stays enabled — not as a site mirror, but as a **stable CDN endpoint for the raw JSON data files**. Because the JSON files live in the repo root, GitHub Pages serves them automatically with no build step required.

Use `https://dat-angel.github.io/openpinas/<file>.json` in scripts, notebooks, and third-party apps. No action needed to keep this working.

## Local development

```bash
npm install
npm run dev
# open http://localhost:3000/
```

## Related docs

- [AUTOMATION.md](./AUTOMATION.md) — Philippines news pipeline (skills, n8n, optional Vercel cron).
- [CONTEXT.md](./CONTEXT.md) — data rules for timeline and dynasty JSON.
