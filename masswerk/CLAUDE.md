# CLAUDE.md — masswerk

App-specific guidance; the repo root `CLAUDE.md` (verification workflow,
spec-sync rules, cache-busting convention) applies as well.

- Requirements PRD: `PRD.md` in this folder — single source of truth,
  updated in the same change as any behavior change.
- Follows the repo baseline (root PRODUCT.md/DESIGN.md): dark-only
  tokens in `styles.css`, accent family **sage**.
- **Guiding principle: one app = one Lehrplan 21 competency; the app's
  difficulty levels ARE the official Kompetenzstufen; the
  Grundansprüche are the visible milestones.** Here: MA.3.A.2, Stufen
  b-k in `data.js` with `cycle`, `ga` and generator kinds taken from
  the official step texts. Do not invent extra levels, do not reorder,
  do not hide any Stufe behind progression.
- **Stufen a and f are deliberately skipped** (`SKIPPED` in
  `data.js`): they train estimating/measuring with real objects, which
  an app cannot verify. The home footer note tells the user so. Do not
  add fake substitutes and do not remove the note while the Stufen are
  missing.
- Input differs from the zahlensprung template in two documented ways
  (keep both): answer lengths vary for quantities, so typed answers
  auto-check at the expected length **and** accept Enter for
  early-complete answers — the Enter keydown handler must call
  `e.preventDefault()`, otherwise the same keypress activates the
  freshly focused Weiter button and silently skips the next task.
  Comparison is numeric when both sides parse as numbers ("7.0" =
  "7"); answers containing ":" (clock times) compare as text.
- `gen.js` is pure and DOM-free; the e2e suite imports it with a
  seeded RNG and re-computes every displayed expression with an
  independent unit-aware oracle (Fr./Rp., clock times, length/weight/
  volume/area conversions, SI prefixes, speeds). Percent bases in
  `relPercent` stay multiples of 20 so parts are integers.
- `game.js` is pure: XP formula, LEVELS, MEDALS. Medal checks are pure
  functions of the stored counters, never event flags. XP never
  decreases, no speed bonuses; mastery streak (5 clean rounds) only
  *suggests* the next Stufe.
- Swiss formats via `formatNumber` (apostrophe thousands, decimal
  point), 24h clock times. UI copy in `strings.js`, Swiss standard
  German, ss never ß (suite enforces).
- Storage key `masswerk.progress`; reset lives in the home footer with
  confirmation naming on-device storage.
- Kompass links here via `PRACTICE_APPS['MA.3.A.2']` in
  `lehrplan-kompass/data.js` — keep the folder name stable or update
  that entry.
- Tests: `cd tests && npm install && node e2e.test.mjs` — must pass
  before reporting back.
