# CLAUDE.md — lehrplan-kompass

App-specific guidance; the repo root `CLAUDE.md` (verification workflow,
spec-sync rules, cache-busting convention) applies as well.

- Requirements PRD: `PRD.md` in this folder — single source of truth,
  updated in the same change as any behavior change.
- Follows the repo baseline (root PRODUCT.md/DESIGN.md): dark-only tokens
  in `styles.css`, accent family **blue**.
- **Content data** lives in `data.js`: 16 subjects, 90 areas, 363
  competencies, 721 cycle texts. Codes are official Lehrplan 21 codes
  (Bern edition) and double as storage IDs — never rename or reuse them.
  Each competency carries `texts` keyed by cycle (1/2/3); a missing key
  means the Lehrplan has no Kompetenzstufen for that cycle and the app
  hides the row there (TTG.3.B.1 has no cycle 1, MU.3.A.1 no cycle 3 —
  the e2e suite pins both). Texts are intentional child-friendly
  paraphrases in Ich-form at the level of that cycle's Grundanspruch,
  NOT official wording; do not paste original Lehrplan text (copyright),
  and keep edits grounded in the official Kompetenzstufen. Swiss
  standard German, ss never ß (the e2e suite fails on ß). Cycle texts of
  one competency must differ from each other (suite enforces this).
- **UI copy** lives in `strings.js` keyed by stable IDs; `app.js` renders
  only via `t()`. v1 ships German only; adding a language means a second
  complete table with identical keys, German stays the fallback.
- Subject `cycles` arrays gate the home grid; per-competency presence
  comes from the `texts` keys. Both derive from the PDF's cycle bands —
  see PRD before changing either.
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
  imports, css font urls), data integrity (363 unique codes, prefix
  chains, minimum text length), per-cycle persistence, reset
  confirmation, no horizontal scroll at 320px, no console errors, no
  external requests.
- Practice-app links: `PRACTICE_APPS` in `data.js` maps official codes to sibling apps; rows with an entry render an "Üben mit ..." link below the toggle (relative href, never inside the button element).
