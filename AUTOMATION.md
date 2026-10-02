# Philippines news automation (OpenPinas)

Human review is required before merging timeline or dynasty JSON to `main`.

## Option A (current): Agent skills + optional n8n

| Layer | Role |
|--------|------|
| **`ph-news-refresher`** (canonical: **this repo** `Skills/ph-news-refresher/SKILL.md`) | Scans sources; writes Purple Docs `az` vault `09-News/ph-news/YYYY-MM-DD-ph-news-scan.md`; updates JSON under `OPENPINAS_ROOT`. |
| **`ph-weekly-review`** (canonical: **this repo** `Skills/ph-weekly-review/SKILL.md`) | Writes `weekly-reviews/data/*.json` + `manifest.json` from timeline JSON after the news scan. |
| **Purple Docs `az`** | Pointer-only copies under `Skills/ph-*/SKILL.md` so Codex/Cursor still resolve skill names when the vault workspace is open. |
| **n8n** `07-ph-news-refresher.json` | Sunday ~7pm PT: RSS/Reddit aggregation → AI → Slack **draft** (no direct repo write). |
| **n8n** `08-ph-breaking-news-research.json` | On-demand webhook → research → Slack **draft**. |

Keep n8n workflows if you want scheduled Slack prompts; they do not replace the agent for JSON edits. Disable `07` if you rely only on weekly manual/agent runs.

## Option B (future): Vercel Cron + serverless draft

To reduce moving parts, you can add a small Vercel project (this repo or a sibling `openpinas-automation` repo) with:

- [Vercel Cron](https://vercel.com/docs/cron-jobs) hitting a protected route (`CRON_SECRET`).
- A function that fetches the same RSS feeds as n8n `07`, calls **Vercel AI Gateway** for structured candidates, and POSTs to Slack.

**No auto-commit** unless you add a GitHub App and PR flow separately ([CONTEXT.md](./CONTEXT.md) stays the contract for JSON shape).

## Preview check after a pull request

`.github/workflows/preview-check.yml` runs on pull requests, and again when Vercel reports a successful preview deployment. On a pull request it waits for that commit's preview URL.

1. Fetches the homepage, archive, latest review, previous review, and one timeline entry.
2. Checks same-origin links from those pages, and the source links on the two newest editions. A host that answers 401, 403, or 429 is recorded as blocked, not as a broken link.
3. Checks visuals in Chromium at 1440px and 390px: the pages load, and the document does not scroll sideways. Screenshots are uploaded as the `preview-check` artifact.
4. Resolves unresolved Vercel toolbar threads on that branch after the check passes, and replaces a single pull-request comment (`<!-- openpinas-preview-check -->`) with the report.

Repository secrets, all optional except the bypass secret when Deployment Protection is on:

- `VERCEL_AUTOMATION_BYPASS_SECRET` — sent as `x-vercel-protection-bypass`
- `VERCEL_TOKEN`, `VERCEL_TEAM_ID`, `VERCEL_PROJECT_ID` — required to resolve toolbar threads

Locally, against a running app:

```bash
npm run check:preview -- --url http://127.0.0.1:3000
npx playwright install chromium
npm run check:preview -- --url http://127.0.0.1:3000 --visual
```

## Environment variable

- **`OPENPINAS_ROOT`** — Local path to this repo (e.g. `/Users/bzadr/bzg/openpinas`). Used in skills and docs.
