# CLAUDE.md — zahlensprung

App-specific guidance; the repo root `CLAUDE.md` (verification workflow,
spec-sync rules, cache-busting convention) applies as well.

- Requirements PRD: `PRD.md` in this folder — single source of truth,
  updated in the same change as any behavior change.
- Follows the repo baseline (root PRODUCT.md/DESIGN.md): dark-only tokens
  in `styles.css`, accent family **amber**.
- **Guiding principle (concept test for the whole app family): one app =
  one Lehrplan 21 competency; the app's difficulty levels ARE the official
  Kompetenzstufen; the Grundansprüche are the visible milestones.** Here:
  MA.1.A.2, Stufen a-j in `data.js` with `cycle`, `ga` and generator
  params taken from the official step texts. Do not invent extra levels,
  do not reorder, do not hide any Stufe behind progression.
- `gen.js` is pure and DOM-free; the e2e suite imports it with a seeded
  RNG. Every number in a task, including the answer, must stay inside the
  Stufe's range. Estimate tasks must keep the invariant "the correct
  option is the option closest to the true value" — the suite enforces it
  over 400 seeded rounds per Stufe.
- `game.js` is pure: XP formula, LEVELS, MEDALS. Medal checks are pure
  functions of the stored counters, never event flags. XP never
  decreases, no speed bonuses; mastery streak (5 clean rounds) only
  *suggests* the next Stufe.
- Typed answers use the known-length auto-check pattern: evaluate the
  whole answer when the typed length reaches the expected length, never
  per character; keep the advisory line (WCAG 3.2.2) and the
  role="status" feedback region. Order tasks evaluate only once all four
  numbers are picked.
- Swiss number formatting via `formatNumber` (apostrophe thousands,
  decimal point). UI copy in `strings.js`, Swiss standard German, ss
  never ß (suite enforces).
- Storage key `zahlensprung.progress`; reset lives in the home footer
  with confirmation naming on-device storage.
- Tests: `cd tests && npm install && node e2e.test.mjs` — must pass
  before reporting back.
