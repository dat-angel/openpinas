# AGENTS.md

## Cursor Cloud specific instructions

**Product:** OpenPinas — a static website (HTML/CSS/vanilla JS) tracking Philippine political dynasties, corruption, and events. No build step, no bundler, no package manager.

### Running the dev server

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/`. A local server is required because the JS fetches JSON data files via `fetch()`, which is blocked by browser CORS on `file://` URLs.

### Validation / Tests

- `./validate-openpinas.sh` — validates all JSON data files (syntax, counts, referential integrity). This is the project's equivalent of a lint + test suite.
- `./corruption-tracker/validate-json.sh` — validates corruption tracker JSON (must be run from `corruption-tracker/` directory or adjust paths).

Both scripts use Python 3 (no pip dependencies needed).

### Data files

All data lives in JSON files at the repo root and in `data/` and `corruption-tracker/data/`. There is no database. Editing data means editing JSON and re-running validation.

### CI

GitHub Actions workflow (`.github/workflows/validate.yml`) runs JSON validation on push/PR to `main`/`develop`.
