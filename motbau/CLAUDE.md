# CLAUDE.md — motbau

App-specific guidance; the repo root `CLAUDE.md` (verification workflow,
spec-sync rules, cache-busting convention) applies as well.

- Requirements PRD: `PRD.md` in this folder — single source of truth,
  updated in the same change as any behavior change.
- Accent family **coral** (root PRODUCT.md/DESIGN.md baseline).
- **Guiding principle: one app = one Lehrplan 21 competency
  (FS1F.5.D.1); the app's levels ARE the official Kompetenzstufen;
  the Grundansprüche are the visible milestones.** Do not invent
  extra levels, do not reorder, do not hide any Stufe.
- Generated tasks (regular plural, -er conjugation) keep their exact
  sentence formats — the suite recomputes them with its own ending
  table and plural rule (-al → -aux, else -s); the regular noun list
  must stay free of -al words. Pool entries need their counterpart in
  the suite's re-stated oracle table in the same change. French
  content must stay rock-solid textbook basics.
- Typed answers use only Swiss-keyboard characters (é, è, à,
  apostrophe); forms with œ or ê stay multiple choice.
- Each Stufe must yield at least 8 distinct tasks per round (pool
  size plus generators; the suite asserts it).
- Storage key `motbau.progress`; Kompass links here via
  `PRACTICE_APPS['FS1F.5.D.1']` in `lehrplan-kompass/data.js`.
- Tests: `cd tests && npm install && node e2e.test.mjs` — must pass
  before reporting back. `tests/node_modules` is a symlink to
  `../../masswerk/tests/node_modules` locally.
