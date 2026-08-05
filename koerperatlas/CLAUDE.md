# CLAUDE.md — koerperatlas

App-specific guidance; the repo root `CLAUDE.md` (verification workflow,
spec-sync rules, cache-busting convention) applies as well.

- Requirements PRD: `PRD.md` in this folder — single source of truth,
  updated in the same change as any behavior change.
- Accent family **coral** (root PRODUCT.md/DESIGN.md baseline).
- **Guiding principle: one app = one Lehrplan 21 competency (NMG.1.4);
  the app's levels ARE the official Kompetenzstufen; the
  Grundansprüche are the visible milestones.** Do not invent extra
  levels, do not reorder, do not hide any Stufe.
- Content lives in pools in `gen.js`; every entry needs its
  counterpart in the suite's independently re-stated oracle table in
  the same change. Anatomy content must stay rock-solid basics — no
  invented facts, no ambiguous options.
- The pulse calculator (Stufe e) keeps its exact sentence format —
  the suite recomputes it.
- Each Stufe's pool must yield at least 8 distinct tasks (round
  length; the suite asserts it).
- Storage key `koerperatlas.progress`; Kompass links here via
  `PRACTICE_APPS['NMG.1.4']` in `lehrplan-kompass/data.js`.
- Tests: `cd tests && npm install && node e2e.test.mjs` — must pass
  before reporting back. `tests/node_modules` is a symlink to
  `../../masswerk/tests/node_modules` locally.
