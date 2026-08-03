# CLAUDE.md — lehrplan-kompass

App-specific guidance; the repo root `CLAUDE.md` (verification workflow,
spec-sync rules, cache-busting convention) applies as well.

- Requirements PRD: `PRD.md` in this folder — single source of truth,
  updated in the same change as any behavior change.
- Follows the repo baseline (root PRODUCT.md/DESIGN.md): dark-only tokens
  in `styles.css`, accent family **blue**.
- **Content data** lives in `data.js`: 16 subjects, 90 areas, 358
  competencies. Codes are official Lehrplan 21 codes (Bern edition) and
  double as storage IDs — never rename or reuse them. Competency `text`
  is an intentional child-friendly paraphrase in Ich-form, NOT the
  official wording; do not paste original Lehrplan text (copyright), and
  keep paraphrases grounded in the official statements when editing.
  Swiss standard German, ss never ß (the e2e suite fails on ß).
- **UI copy** lives in `strings.js` keyed by stable IDs; `app.js` renders
  only via `t()`. v1 ships German only; adding a language means a second
  complete table with identical keys, German stays the fallback.
- Cycle scoping is per subject (`cycles` array), a documented
  simplification — see PRD "Bewusste Vereinfachungen" before changing it.
- Checks are stored per cycle: key `"<cycle>|<code>"` in
  `kompass.checked`; cycle choice in `kompass.cycle`. Anything touching
  storage goes through the helpers in `app.js`.
- Navigation uses `location.hash` (`#MA`), so the browser back button
  works; don't replace it with in-memory-only view state.
- No settings view in v1 on purpose: single language, and the cycle
  picker is content, not a setting. Add the standard settings surface
  only when a second language (or another real setting) ships.
- Icons: `icons.js` inline Lucide SVGs; add icons by appending to
  `PATHS`, keep the Lucide names.
- Tests: `cd tests && npm install && node e2e.test.mjs` — must pass
  before reporting back. Enforces `?v=N` consistency (index.html, module
  imports, css font urls), data integrity (358 unique codes, prefix
  chains, minimum text length), per-cycle persistence, reset
  confirmation, no horizontal scroll at 320px, no console errors, no
  external requests.
