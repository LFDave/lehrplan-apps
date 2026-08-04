# CLAUDE.md — groessenwissen

App-specific guidance; the repo root `CLAUDE.md` (verification workflow,
spec-sync rules, cache-busting convention) applies as well.

- Requirements PRD: `PRD.md` in this folder — single source of truth,
  updated in the same change as any behavior change.
- Follows the repo baseline (root PRODUCT.md/DESIGN.md): dark-only
  tokens in `styles.css`, accent family **amber**.
- **Guiding principle: one app = one Lehrplan 21 competency; the app's
  difficulty levels ARE the official Kompetenzstufen; the
  Grundansprüche are the visible milestones.** Here: MA.3.A.1, Stufen
  a-l in `data.js`, GA on c/h/l. Scope discipline: this app stays at
  the naming/reference/fact level — computing with quantities belongs
  to Masswerk (MA.3.A.2), don't blur the two.
- Content lives in tables in `gen.js`: `GW_QA` (question → correct +
  wrongs), `UNIT_FACTS` ("1 X = ? Y" facts), `REAL_MONEY` (the actual
  Swiss coin/note set — factual data, don't invent denominations).
  Every new question needs its counterpart in the test oracle's
  independently re-stated `QA`/`FACTORS` tables in the same change.
- Each Stufe's task pool must yield at least 8 distinct tasks
  (dedupe ignores option order); the suite asserts round length — if
  you remove table entries, check the pools.
- Umlauts break `\w` in oracle regexes ("länger") — use `\S`/explicit
  classes when adding patterns.
- Storage key `groessenwissen.progress`; Kompass links here via
  `PRACTICE_APPS['MA.3.A.1']` in `lehrplan-kompass/data.js`.
- Tests: `cd tests && npm install && node e2e.test.mjs` — must pass
  before reporting back. `tests/node_modules` is a symlink to
  `../../masswerk/tests/node_modules` locally.
