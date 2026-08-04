# CLAUDE.md — wertepfad

App-specific guidance; the repo root `CLAUDE.md` (verification workflow,
spec-sync rules, cache-busting convention) applies as well.

- Requirements PRD: `PRD.md` in this folder — single source of truth,
  updated in the same change as any behavior change.
- Follows the repo baseline (root PRODUCT.md/DESIGN.md): dark-only
  tokens in `styles.css`, accent family **blue**.
- **Guiding principle: one app = one Lehrplan 21 competency; the app's
  difficulty levels ARE the official Kompetenzstufen; the
  Grundansprüche are the visible milestones.** Here: MA.3.A.3, Stufen
  a-k in `data.js`, GA on b/e/i. Graph-drawing parts of the official
  text are implemented as computing function values and
  characteristics — a documented translation, keep it.
- `gen.js`: quantities are constructed so answers are clean —
  speed/scale kinds use fixed tables of valid combinations, percent
  and interest kinds force integer results, `sharePercent` and
  `steigung` retry on non-integers. Money answers use the two-decimal
  format ("16.20"); the app's numeric compare accepts "16.2".
- The e2e oracle's sequence solver is generic (first and second
  differences) — any new sequence kind must be solvable that way or
  needs its own oracle rule in `tests/e2e.test.mjs`, added in the
  same change.
- Storage key `wertepfad.progress`; Kompass links here via
  `PRACTICE_APPS['MA.3.A.3']` in `lehrplan-kompass/data.js`.
- Tests: `cd tests && npm install && node e2e.test.mjs` — must pass
  before reporting back. `tests/node_modules` is a symlink to
  `../../masswerk/tests/node_modules` locally.
