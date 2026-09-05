# CLAUDE.md — zeitreise

App-specific guidance; the repo root `CLAUDE.md` (verification workflow,
spec-sync rules, cache-busting convention) applies as well.

- Requirements PRD: `PRD.md` in this folder — single source of truth,
  updated in the same change as any behavior change.
- Accent family **amber** (root PRODUCT.md/DESIGN.md baseline).
- **Guiding principle: one app = one Lehrplan 21 competency (NMG.9.1);
  the app's levels ARE the official Kompetenzstufen; the
  Grundansprüche are the visible milestones.** Do not invent extra
  levels, do not reorder, do not hide any Stufe.
- **Strict Lehrplan check before any content change** (root
  CLAUDE.md, content sourcing rules): re-derive the NMG.9.1 Stufen
  locally with `tools/lehrplan-extraktion` and add only what the
  target Stufe names. PRD.md records the verified scope per Stufe and
  the worksheet topics deliberately left out (calendar grid, date
  formats, days per month, abbreviations, 365/52, season features,
  riddles); do not add those without a Stufe that names them.
- Content lives in `gen.js`: fixed pool entries for facts, generators
  for the Wochentage, Monate, Jahreszeiten and Jahreskreis series of
  Stufen a and b. A fixed entry needs its counterpart in the suite's
  hand-written QA table; a generated kind needs a matching rule in the
  suite's independent solver, which restates its own day, month and
  season tables. Both in the same change. Factual content must stay
  rock-solid — no invented facts, no ambiguous options (the oracle's
  index check catches swapped answers, not bad facts).
- Jahreskreis convention: meteorological seasons of the Northern
  Hemisphere as in the Merkblatt (Winter = Dezember, Januar, Februar);
  tasks say «bei uns». No country switch.
- Each Stufe's pool must yield at least 8 distinct tasks (round
  length; the suite asserts it), and Stufen a and b must stay varied
  (the suite asserts 60+ and 25+ distinct tasks over 50 rounds).
- Storage key `zeitreise.progress`; Kompass links here via
  `PRACTICE_APPS['NMG.9.1']` in `lehrplan-kompass/data.js`.
- Tests: `cd tests && npm install && node e2e.test.mjs` — must pass
  before reporting back. Some local checkouts symlink
  `tests/node_modules` to `../../masswerk/tests/node_modules`; a plain
  `npm install` plus `npx playwright install chromium` works too.
