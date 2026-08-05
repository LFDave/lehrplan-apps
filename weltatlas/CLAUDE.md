# CLAUDE.md — weltatlas

App-specific guidance; the repo root `CLAUDE.md` (verification workflow,
spec-sync rules, cache-busting convention) applies as well.

- Requirements PRD: `PRD.md` in this folder — single source of truth,
  updated in the same change as any behavior change.
- Accent family **blue** (root PRODUCT.md/DESIGN.md baseline).
- **Guiding principle: one app = one Lehrplan 21 competency (RZG.4.1);
  the app's levels ARE the official Kompetenzstufen; the
  Grundansprüche are the visible milestones.** Do not invent extra
  levels, do not reorder, do not hide any Stufe.
- Content lives in pools and tables in `gen.js`; every entry needs
  its counterpart in the suite's independently re-stated oracle in
  the same change. Facts must stay rock-solid — no invented facts,
  no ambiguous options.
- The place tables (`LAENDER`, `HAUPTSTAEDTE`) and their question
  formats stay in sync with the suite's re-stated tables — extend
  both in the same change. Geography facts must stay rock-solid.
- Each Stufe must yield at least 8 distinct tasks per round (pool
  size plus generators; the suite asserts it).
- Storage key `weltatlas.progress`; Kompass links here via
  `PRACTICE_APPS['RZG.4.1']` in `lehrplan-kompass/data.js`.
- Tests: `cd tests && npm install && node e2e.test.mjs` — must pass
  before reporting back. `tests/node_modules` is a symlink to
  `../../masswerk/tests/node_modules` locally.
