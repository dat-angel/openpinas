# OpenPinas deployment

## Canonical hosting: Vercel

This repo is configured for **static deployment on Vercel** ([`vercel.json`](./vercel.json): no install/build, `outputDirectory` is the repo root).

1. Import [github.com/dat-angel/openpinas](https://github.com/dat-angel/openpinas) in the Vercel dashboard (or `vercel link` from a local clone).
2. Use the **production URL** Vercel assigns (e.g. `https://openpinas-<team>.vercel.app`) or attach a custom domain.
3. Treat that URL as **canonical** for links in blog posts, README, and API examples once it is live.

## GitHub Pages (mirror)

[GitHub Pages](https://dat-angel.github.io/openpinas/) can remain enabled as a **backward-compatible mirror** until all references are updated. Prefer Vercel for new integrations (previews per branch, headers, faster rollouts).

## Local preview

```bash
python3 -m http.server 8000
# open http://localhost:8000/
```

## Related docs

- [AUTOMATION.md](./AUTOMATION.md) — Philippines news pipeline (skills, n8n, optional Vercel cron).
- [CONTEXT.md](./CONTEXT.md) — data rules for timeline and dynasty JSON.
