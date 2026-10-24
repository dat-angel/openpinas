# OpenPinas agent skills (canonical)

**Single place to edit** Philippines news and weekly-review playbooks for this project. Commit changes here and push to [github.com/dat-angel/openpinas](https://github.com/dat-angel/openpinas).

This repo is public. Keep PR descriptions public-facing: do not include internal notes, AI-agent instructions or acceptance checklists, editorial/owner-decision lists, private file references (e.g. CONTEXT.md), deployment secrets or protection details, dashboard links, or personal information.

| Skill | File | Role |
|-------|------|------|
| **ph-news-refresher** | [ph-news-refresher/SKILL.md](./ph-news-refresher/SKILL.md) | News scan; timeline/dynasty JSON in this repo; optional az vault markdown |
| **ph-weekly-review** | [ph-weekly-review/SKILL.md](./ph-weekly-review/SKILL.md) | Weekly JSON under `weekly-reviews/data/` |

The **Purple Docs `az`** repo contains **pointers** at `Skills/ph-news-refresher/SKILL.md` and `Skills/ph-weekly-review/SKILL.md` so morning-news tooling still resolves the skill name — those files tell the agent to load **this** directory.

See also: [CONTEXT.md](../CONTEXT.md), [AUTOMATION.md](../AUTOMATION.md).
