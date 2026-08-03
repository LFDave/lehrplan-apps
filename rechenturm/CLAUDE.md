# CLAUDE.md — rechenturm

App-specific guidance; the repo root `CLAUDE.md` (verification workflow,
spec-sync rules, cache-busting convention) applies as well.

- Requirements PRD: `PRD.md` in this folder — single source of truth,
  updated in the same change as any behavior change.
- Follows the repo baseline (root PRODUCT.md/DESIGN.md): dark-only
  tokens in `styles.css`, accent family **coral**.
- **Guiding principle: one app = one Lehrplan 21 competency; the app's
  difficulty levels ARE the official Kompetenzstufen; the
  Grundansprüche are the visible milestones.** Here: MA.1.A.3, Stufen
  a-j in `data.js` with `cycle`, `ga` and generator kinds taken from
  the official step texts. Do not invent extra levels, do not reorder,
  do not hide any Stufe behind progression.
- Two documented translations of the official text (keep them, they
  are deliberate): the Lehrplan sets **no Grundanspruch for cycle 3**
  on this competency — do not add one; the "Turmspitze" medal for a
  clean run on Stufe j is the stand-in. Step parts the Lehrplan
  assigns to the calculator are implemented as **mental arithmetic
  with easy numbers** (the app tests the operation, not the device).
- `gen.js` is pure and DOM-free; the e2e suite imports it with a
  seeded RNG and re-computes every displayed expression with an
  independent oracle (`solveExpr`), including Unicode-superscript
  powers and scientific notation. Every number in a task, including
  the answer, must stay in the Stufe's range. Prime-factor distractors
  must use real divisors (`factors[0] · n/factors[0]`), never
  `2 · n/2` for odd n. Decimal tasks (Stufe f) constrain the tenths so
  they never cancel: a whole-number result would make the expected
  answer "36.0" while a child types "36", and the length-based
  auto-check would never fire. The suite's `asTyped` check enforces
  exact string agreement between oracle typing and expected answer —
  keep it when adding kinds.
- `game.js` is pure: XP formula, LEVELS, MEDALS. Medal checks are pure
  functions of the stored counters, never event flags. XP never
  decreases, no speed bonuses; mastery streak (5 clean rounds) only
  *suggests* the next Stufe.
- Typed answers use the known-length auto-check pattern: evaluate the
  whole answer when the typed length reaches the expected length,
  never per character; keep the advisory line (WCAG 3.2.2) and the
  role="status" feedback region.
- Swiss number formatting via `formatNumber` (apostrophe thousands,
  decimal point). UI copy in `strings.js`, Swiss standard German, ss
  never ß (suite enforces).
- Storage key `rechenturm.progress`; reset lives in the home footer
  with confirmation naming on-device storage.
- Kompass links here via `PRACTICE_APPS['MA.1.A.3']` in
  `lehrplan-kompass/data.js` — keep the folder name stable or update
  that entry.
- Tests: `cd tests && npm install && node e2e.test.mjs` — must pass
  before reporting back.
