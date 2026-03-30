# Philippines news automation (OpenPinas)

Human review is required before merging timeline or dynasty JSON to `main`.

## Option A (current): Agent skills + optional n8n

| Layer | Role |
|--------|------|
| **`ph-news-refresher`** (canonical: **this repo** `Skills/ph-news-refresher/SKILL.md`) | Scans sources; writes Purple Docs `az` vault `09-News/ph-news/YYYY-MM-DD-ph-news-scan.md`; updates JSON under `OPENPINAS_ROOT`. |
| **`ph-weekly-review`** (canonical: **this repo** `Skills/ph-weekly-review/SKILL.md`) | Builds `weekly-reviews/*.html` from timeline JSON after the news scan. |
| **Purple Docs `az`** | Pointer-only copies under `Skills/ph-*/SKILL.md` so Codex/Cursor still resolve skill names when the vault workspace is open. |
| **n8n** `07-ph-news-refresher.json` | Sunday ~7pm PT: RSS/Reddit aggregation → AI → Slack **draft** (no direct repo write). |
| **n8n** `08-ph-breaking-news-research.json` | On-demand webhook → research → Slack **draft**. |

Keep n8n workflows if you want scheduled Slack prompts; they do not replace the agent for JSON edits. Disable `07` if you rely only on weekly manual/agent runs.

## Option B (future): Vercel Cron + serverless draft

To reduce moving parts, you can add a small Vercel project (this repo or a sibling `openpinas-automation` repo) with:

- [Vercel Cron](https://vercel.com/docs/cron-jobs) hitting a protected route (`CRON_SECRET`).
- A function that fetches the same RSS feeds as n8n `07`, calls **Vercel AI Gateway** for structured candidates, and POSTs to Slack.

**No auto-commit** unless you add a GitHub App and PR flow separately ([CONTEXT.md](./CONTEXT.md) stays the contract for JSON shape).

## Environment variable

- **`OPENPINAS_ROOT`** — Local path to this repo (e.g. `/Users/bzadr/bzg/openpinas`). Used in skills and docs.
