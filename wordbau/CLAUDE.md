# CLAUDE.md — wordbau

App-specific guidance; the repo root `CLAUDE.md` (verification workflow,
spec-sync rules, cache-busting convention) applies as well.

- Requirements PRD: `PRD.md` in this folder — single source of truth,
  updated in the same change as any behavior change.
- Accent family **amber** (root PRODUCT.md/DESIGN.md baseline).
- **Guiding principle: one app = one Lehrplan 21 competency
  (FS2E.5.D.1); the app's levels ARE the official Kompetenzstufen;
  the Grundansprüche are the visible milestones.** Do not invent
  extra levels, do not reorder, do not hide any Stufe.
- Generated tasks (regular plural, he-form) keep their exact sentence
  formats — the suite recomputes them with its own rule tables
  (irregular plurals first, else -s). The generator word lists must
  contain only pure -s forms; -es forms (watch, go, do) and irregular
  plurals live in the pools. Pool entries need their counterpart in
  the suite's re-stated oracle table in the same change. English
  content must stay rock-solid textbook basics.
- Not to be confused with `wortbau/` (D.5.D.1, German grammar) — the
  parallel naming is intentional (Wortbau/Motbau/Wordbau are the
  grammar family), but links and registry rows must point to the
  right folder.
- Each Stufe must yield at least 8 distinct tasks per round (pool
  size plus generators; the suite asserts it).
- Storage key `wordbau.progress`; Kompass links here via
  `PRACTICE_APPS['FS2E.5.D.1']` in `lehrplan-kompass/data.js`.
- Tests: `cd tests && npm install && node e2e.test.mjs` — must pass
  before reporting back. `tests/node_modules` is a symlink to
  `../../masswerk/tests/node_modules` locally.
