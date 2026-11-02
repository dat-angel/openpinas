# Date coverage and link audit — October 11, 2026

Covers every edition in `weekly-reviews/data/manifest.json` from `2026-01-02` through `2026-10-10`, plus the homepage panel, the archive index, and every internal and external link reachable from them. Run against `next dev` with the production build also generated, so both the rendered routes and the static export were exercised.

## Conventions, for reading what follows

The canonical format is a non-overlapping Sunday–Saturday window keyed by the ending Saturday, and `weekly-reviews/README.md` dates it to April 2026. In practice the clean seven-day labels start with the **June 13** edition; `scripts/validate-weekly-coverage.mjs` is only ever run from `2026-06-27` onward. Everything before that was imported from the legacy HTML pages by `scripts/import-weekly-html-to-json.mjs` and keeps the older shape: `prevWeekFile` instead of `prevWeekEnding`, a `Total Events` stat instead of `Stories`, a per-article `significance` field, and eight-day or non-Saturday windows. Those differences are noted below but are not defects.

## A. Weeks with no edition

Nine Sunday–Saturday weeks have no edition keyed to their Saturday. Eight of them are an artifact of the pre-June labelling: adjacent eight-day editions still cover every calendar day, so no reporting is actually absent. One is a real hole.

| Week (Sun–Sat) | Status |
|---|---|
| 2025-12-28 .. 2026-01-03 | covered by the `2026-01-02` edition (Friday key) |
| 2026-01-04 .. 2026-01-10 | covered by `2026-01-09` (Friday key) |
| 2026-01-11 .. 2026-01-17 | covered by `2026-01-16` (Friday key) |
| **2026-02-01 .. 2026-02-07** | filled by new Saturday-ending `2026-02-07` (see follow-up) |
| 2026-02-08 .. 2026-02-14 | covered by `2026-02-08` / `2026-02-15` (Sunday keys) |
| 2026-02-15 .. 2026-02-21 | covered by `2026-02-22` (Sunday key) |
| 2026-03-22 .. 2026-03-28 | covered by `2026-03-29` (Sunday key) |
| 2026-04-05 .. 2026-04-11 | covered by `2026-04-12` (Sunday key) |
| 2026-04-12 .. 2026-04-18 | covered by `2026-04-19` (Sunday key) |

Five editions existed with no articles at audit time — `2026-01-09`, `2026-01-16`, `2026-01-24`, `2026-01-31`, `2026-02-08` — and are now filled (see follow-up).

From `2026-04-25` onward every Saturday through `2026-10-10` has an edition, with one deliberate exception: the `2026-06-08` Mindanao earthquake special, which sits in the archive outside the regular chain by design.

## B. prev/next chain

The chain in `manifest.json` is intact end to end: strictly descending, no duplicate keys, every `prevWeekEnding` resolves to the nearest earlier regular edition, every entry has a data file, and no data file is orphaned. The rendered **← Previous Week** link reads the manifest, so navigation works on all 42 editions; walking it from `2026-10-10` reaches `2026-01-02` without a dead end. The 2026-06-08 special correctly links back to `2026-06-06` without being inserted into the regular chain.

The fifteen pre-April data files carry `prevWeekFile` rather than `prevWeekEnding`. Nothing reads `prevWeekFile` — only the importer writes it — and the page does not need it, so this is a shape difference, not a broken link. It would, however, fail `validate-weekly-coverage.mjs` if anyone widened that script's range.

## C. Timeline events outside their edition's window

Three, all in pre-canonical editions:

- `2026-02-08` edition (label February 2–8) holds the `2026-02-01` event *San Miguel Beermen Win Back-to-Back PBA Philippine Cup Championships*. February 1 falls in no edition's label, so the event cannot simply be reassigned.
- `2026-02-22` edition (label February 15–22) holds `2026-02-13` *Atong Ang Bounty Doubled to P20 Million as Manhunt Intensifies* and `2026-02-14` *Philippines Signs Defense Pacts with Italy and Estonia at Munich Security Conference*. Both days belong to the February 9–15 window, whose edition is `2026-02-15`.

Separately, 29 of the 267 events in `philippines-2026-timeline.json` carry no `weekly_review` at all: 19 in March, 3 in April, 6 in May, and the one deliberate September exception (`2026-09-02`, flagged in `2026-backfill-research.md`).

Article dates stay inside their edition's label everywhere from `2026-06-13` on. Before that, headline text and timeline titles were written independently, so most pre-June articles have no exact date-plus-title match in either timeline; their headline links still open the timeline, but the search term may not select a row.

## D. Cross-year timeline links

The `2026-01-02` edition cites two events dated `2025-12-29` that are stored in `philippines-2026-timeline.json`. The timeline page chooses which year file to load from the `date` query parameter, so a `date=2025-12-29` link opens the **2025** timeline, where those two events do not exist. Either the two events move to `philippines-2025-timeline.json` — which would reduce the 2026 count and shrink that edition's What's New panel — or the timeline page needs an explicit year hint. Left for the owner.

## E. Internal links

557 unique internal URLs were reached from the homepage, the archive index, the now-developing panel and all 42 edition pages, following prev links, legacy `.html` routes, dynasty links and links embedded in the legacy visualization iframes.

After the fixes in this branch: **0 non-200 responses and 0 redirects.** Before them:

- `/corruption-tracker/cases/` returned 308 to a path with no page. Fixed.
- `/business-connections-2025.json`, `/elite-schools-influence-2025.json`, `/philippine-political-dynasties-network-2025.json`, `/philippine-startup-ecosystem-2025.json`, `/pogo-corruption-cases-2025.json` and `/regional-data.json` all returned 404 in dev and in the static export, because the sync step never copied them into `public/`. The regional and startup-ecosystem visualizations fetch these at runtime, so both were failing to render; four other visualization shells linked to them as downloadable data. Fixed.

Anchors: 17 distinct `#dynasty-` fragments are referenced and 16 resolve. `#dynasty-GO_FAMILY`, used by the `2026-02-28` edition's dynasty highlight for Senator Christopher "Bong Go", matches no node in `philippine-political-dynasties-network-2025.json` — the link loads the map but selects nothing. Left for the owner, since the choice is between adding a sourced dynasty node and dropping the highlight's link.

`/corruption-tracker/cases/index.html#statistics` targets a real `id="statistics"`, but that page is served inside an iframe, so a fragment on the parent URL can never scroll to it. Harmless; the card still lands on the right page.

## F. External source links

865 unique URLs across all 42 editions and both timeline files, each retried three times.

- **597 reachable.**
- **193 refuse automated clients** (401, 403, 405, 429, 451, 503) and load normally in a browser. Concentrated in `newsinfo.inquirer.net` (47), `mb.com.ph` (37), `pia.gov.ph` (13), `globalnation.inquirer.net` (9), `pco.gov.ph` (9), `bloomberg.com` (9) and `apnews.com` (8). Two more hosts behave the same way with a different status: `time.com` and `newsweek.com` answer 406.
- **47 returned 522** — every one on `www.pna.gov.ph`, whose origin was timing out site-wide during this audit. Not dead links; this is the outage that also failed the preview check on this branch.
- **11 never answered** an automated request: `culturalcenter.gov.ph` (3), `washingtonpost.com` (4), plus `earthquake.phivolcs.dost.gov.ph`, `ph.usembassy.gov`, `rcam.org`, `sc.judiciary.gov.ph` and the bare hosts `www.cbcponline.net` and `www.pco.gov.ph`. Treat as blocked rather than dead.

### Confirmed dead (HTTP 404) — 13 links

| URL | Cited by |
|---|---|
| `abcnews.com/.../20000-people-displaced-philippine-earthquake-killed-37-133702358` | review 2026-06-08, timeline 2026-06-08 |
| `abcnews.go.com/.../icc-judges-find-former-philippine-president-rodrigo-duterte-129556516` | timeline 2026-01-26 |
| `abcnews.go.com/.../mound-garbage-collapses-philippine-landfill-burying-38-people-129038874` | timeline 2026-01-08 |
| `abcnews.go.com/.../philippine-court-convicts-journalist-terror-financing-charge-ruling-129445362` | timeline 2026-01-22 |
| `abcnews.go.com/.../philippine-lawmakers-find-bid-impeach-marcos-insufficient-substance-129842292` | timeline 2026-02-04 |
| `abcnews.go.com/.../philippine-vice-president-faces-2-new-impeachment-bids-129775355` | timeline 2026-02-02 |
| `abcnews.go.com/.../philippines-tells-beijing-alarmed-escalating-verbal-tussle-south-129557051` | timeline 2026-01-26 |
| `abcnews.go.com/.../philippines-evacuates-3000-people-after-activity-increases-mayon-129000629` | timeline 2026-01-12 |
| `gmanetwork.com/news/topstories/nation/984649/balikatan-exercise-officially-opens/story/` | review 2026-04-25, timeline 2026-04-20 |
| `gmanetwork.com/news/topstories/nation/984842/afp-contingencies-for-possible-conflict-between-china-taiwan-in-place/story/` | review 2026-04-25, timeline 2026-04-20 |
| `manilatimes.net/2026/02/21/news/duterte-to-skip-pre-trial-hearing/2281809` | review 2026-02-22, timeline 2026-02-20 |
| `phivolcs.dost.gov.ph/.../21358-kanlaon-volcano-bulletin-25-april-2026-8-00-a-m` | review 2026-04-25, timeline 2026-04-25 |
| `rappler.com/nation/weather/typhoon-kalmaegi-death-toll-2025/` | timeline 2025-07-22, 2025-11-16, 2025-12-25 |

Replacing these means finding another report of the same facts, so they are listed rather than substituted. The eight ABC News entries are expired AP wire URLs and the PHIVOLCS bulletin is a rotated-off daily bulletin; both patterns will keep recurring.

Eight `www.bworldonline.com` links redirect to the apex `bworldonline.com`. That is the publisher's own canonical redirect and needs no change.

## Follow-up — October 11, 2026 (same branch)

All 13 confirmed-dead URLs were replaced in the reviews and timelines that cited them. None were left unresolved.

| Old (404) | New (live) |
|---|---|
| `abcnews.com/.../20000-people-displaced-philippine-earthquake-killed-37-133702358` | `https://apnews.com/article/philippines-earthquake-2907e17ea68fca76cb4c6fde3e15f139` |
| `abcnews.go.com/.../icc-judges-find-former-philippine-president-rodrigo-duterte-129556516` | `https://www.icc-cpi.int/news/situation-philippines-rodrigo-roa-duterte-fit-take-part-pre-trial-proceedings-confirmation` |
| `abcnews.go.com/.../mound-garbage-collapses-philippine-landfill-burying-38-people-129038874` | `https://cebudailynews.inquirer.net/686219/binaliw-landfill-collapse-how-the-disaster-unfolded` |
| `abcnews.go.com/.../philippine-court-convicts-journalist-terror-financing-charge-ruling-129445362` | `https://apnews.com/article/philippines-convicted-journalist-frenchie-mae-cumpio-57be4ce81346539ece2913f67460e5e9` |
| `abcnews.go.com/.../philippine-lawmakers-find-bid-impeach-marcos-insufficient-substance-129842292` | `https://www.gmanetwork.com/news/topstories/nation/976061/house-representatives-impeachment-complaints-president-marcos/story/` |
| `abcnews.go.com/.../philippine-vice-president-faces-2-new-impeachment-bids-129775355` | `https://www.gmanetwork.com/news/topstories/nation/975010/impeachment-complaint-filed-anew-vs-sara-duterte/story/` |
| `abcnews.go.com/.../philippines-tells-beijing-alarmed-escalating-verbal-tussle-south-129557051` | `https://apnews.com/article/philippines-beijing-south-china-sea-disputes-dac69e3e7159dc3672879feeee87de5d` |
| `abcnews.go.com/.../philippines-evacuates-3000-people-after-activity-increases-mayon-129000629` | `https://bworldonline.com/the-nation/2026/01/08/723097/over-3000-affected-by-mayon-volcanos-unrest-says-ndrrmc/` |
| `gmanetwork.com/.../984649/balikatan-exercise-officially-opens/story/` | `https://mb.com.ph/2026/04/20/brawner-declares-largest-balikatan-open-highlights-alliance-strength-amid-regional-tensions` |
| `gmanetwork.com/.../984842/afp-contingencies-for-possible-conflict-between-china-taiwan-in-place/story/` | `https://www.gmanetwork.com/news/topstories/nation/984760/afp-readies-contingencies-for-china-s-possible-actions-following-2026-balikatan/story/` |
| `manilatimes.net/2026/02/21/news/duterte-to-skip-pre-trial-hearing/2281809` | `https://www.philstar.com/headlines/2026/02/21/2509417/icc-allows-duterte-skip-confirmation-hearings` |
| `phivolcs.dost.gov.ph/.../21358-kanlaon-volcano-bulletin-25-april-2026-8-00-a-m` | `https://www.gmanetwork.com/news/topstories/regions/985288/watch-kanlaon-volcano-emits-ash-anew-alert-level-2-remains/story/` |
| `rappler.com/nation/weather/typhoon-kalmaegi-death-toll-2025/` | `https://www.gmanetwork.com/news/topstories/nation/966407/269-dead-523-injured-due-to-typhoon-tino-ocd/story/` |

January–February editions `2026-01-09`, `01-16`, `01-24`, `01-31`, and `02-08` now have 6–8 grouped stories drawn from existing timeline events. A new Saturday-ending `2026-02-07` edition covers the February 1–7 hole and holds the February 1 PBA championship. The February 13 Atong Ang bounty and February 14 Italy/Estonia defense pacts moved from `2026-02-22` to `2026-02-15`.

The Bong Go highlight on `2026-02-28` no longer uses `#dynasty-GO_FAMILY` (no such node exists). The two `2025-12-29` events stay in the 2026 timeline; the timeline page now loads 2026 when a date exists only there, and the January 2 headlines pass `year=2026`.
