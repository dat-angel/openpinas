# OpenPinas deployment

## Canonical hosting: Vercel

This repo is configured for **Next.js static export on Vercel**.

- `npm install`
- `npm run build` (runs `next build`, output to `out/`)
- Vercel serves `out/` (`vercel.json` sets `outputDirectory` to `out`)

URL paths are preserved from the legacy `.html` files (including nested paths like `/weekly-reviews/weekly-review-2026-03-21.html`).

1. Import [github.com/dat-angel/openpinas](https://github.com/dat-angel/openpinas) in the Vercel dashboard (or `vercel link` from a local clone).
2. Use the **production URL** Vercel assigns (e.g. `https://openpinas-<team>.vercel.app`) or attach a custom domain.
3. Treat that URL as **canonical** for links in blog posts, README, and API examples once it is live.

## GitHub Pages (mirror)

[GitHub Pages](https://dat-angel.github.io/openpinas/) can remain enabled as a **backward-compatible mirror** until all references are updated. Prefer Vercel for new integrations (previews per branch, headers, faster rollouts).

## Local preview

```bash
npm install
npm run dev
# open http://localhost:3000/
```

## Related docs

- [AUTOMATION.md](./AUTOMATION.md) — Philippines news pipeline (skills, n8n, optional Vercel cron).
- [CONTEXT.md](./CONTEXT.md) — data rules for timeline and dynasty JSON.
