# CLAUDE.md — zahlenwissen

App-specific guidance; the repo root `CLAUDE.md` (verification workflow,
spec-sync rules, cache-busting convention) applies as well.

- Requirements PRD: `PRD.md` in this folder — single source of truth,
  updated in the same change as any behavior change.
- Follows the repo baseline (root PRODUCT.md/DESIGN.md): dark-only
  tokens in `styles.css`, accent family **sage**.
- **Guiding principle: one app = one Lehrplan 21 competency; the app's
  difficulty levels ARE the official Kompetenzstufen; the
  Grundansprüche are the visible milestones.** Here: MA.1.A.1, Stufen
  a-l in `data.js`. Do not invent extra levels, do not reorder, do not
  hide any Stufe behind progression.
- `gen.js` contains a German number-word generator (`zahlwort`, Swiss
  spelling: dreissig, never ß) and a string-based decimal shifter
  (`shiftDecimal`) that avoids float noise for 10⁻ⁿ answers — use
  them, never `m * 10 ** -e`. Term questions live in the exported
  `TERM_QA` table. The `divSymbol` generator excludes the ambiguous
  pair b=2, q=2 ("4 ? 2 = 2" fits both : and -); keep option sets
  unambiguous when adding kinds — the suite's oracle findIndex will
  catch violations.
- `app.js` differs from the family template in one detail: sentence
  prompts containing ':' (e.g. "Schreibe als Zahl: ...") get no
  appended " = ?". Keep that condition when syncing template changes.
- The e2e oracle re-implements word→number parsing, decimal shifting
  and the term tables independently — extend those in
  `tests/e2e.test.mjs` in the same change as any generator change.
- Storage key `zahlenwissen.progress`; Kompass links here via
  `PRACTICE_APPS['MA.1.A.1']` in `lehrplan-kompass/data.js`.
- Tests: `cd tests && npm install && node e2e.test.mjs` — must pass
  before reporting back. `tests/node_modules` is a symlink to
  `../../masswerk/tests/node_modules` locally; run `npm install` if it
  is missing.
