# CLAUDE.md — rechenkniff

App-specific guidance; the repo root `CLAUDE.md` (verification workflow,
spec-sync rules, cache-busting convention) applies as well.

- Requirements PRD: `PRD.md` in this folder — single source of truth,
  updated in the same change as any behavior change.
- Follows the repo baseline (root PRODUCT.md/DESIGN.md): dark-only
  tokens in `styles.css`, accent family **violet**.
- **Guiding principle: one app = one Lehrplan 21 competency; the app's
  difficulty levels ARE the official Kompetenzstufen; the
  Grundansprüche are the visible milestones.** Here: MA.1.A.4, Stufen
  a-l in `data.js`, GA on c/g/k, Stufe j is pure Erweiterung (flagged).
  Do not invent extra levels, do not reorder, do not hide any Stufe.
- `gen.js`: rounding kinds must never produce answers with a trailing
  zero decimal ("12.0" — a child types "12" and the length auto-check
  never fires); the retry guards enforcing that are load-bearing.
  Term answers ("6a + 3b") are typed strings — whitespace-insensitive
  compare happens in app.js `normalize`. Binomische Formeln live in
  the exported `BINOM_QA` table.
- The e2e oracle re-implements every expression pattern with its own
  regexes and integer-based rounding — extend
  `tests/e2e.test.mjs` in the same change as any generator change.
  Watch for option-set ambiguity (the oracle's findIndex catches it).
- `app.js` keeps the family input behavior (auto-check at expected
  length + Enter + numeric compare + `e.preventDefault()`), and the
  "no appended = ? for ':' sentences" condition.
- Storage key `rechenkniff.progress`; Kompass links here via
  `PRACTICE_APPS['MA.1.A.4']` in `lehrplan-kompass/data.js`.
- Tests: `cd tests && npm install && node e2e.test.mjs` — must pass
  before reporting back. `tests/node_modules` is a symlink to
  `../../masswerk/tests/node_modules` locally.
