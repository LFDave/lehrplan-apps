# CLAUDE.md — artenreich

App-specific guidance; the repo root `CLAUDE.md` (verification workflow,
spec-sync rules, cache-busting convention) applies as well.

- Requirements PRD: `PRD.md` in this folder — single source of truth,
  updated in the same change as any behavior change.
- Accent family **sage** (root PRODUCT.md/DESIGN.md baseline).
- **Guiding principle: one app = one Lehrplan 21 competency (NMG.2.4);
  the app's levels ARE the official Kompetenzstufen; the
  Grundansprüche are the visible milestones.** Do not invent extra
  levels, do not reorder, do not hide any Stufe.
- The classification tables (`BAEUME`, `TIERE`) and the generated
  question formats stay in sync with the suite's independently
  re-stated `ZUORDNUNG` table — extend both in the same change.
  Species facts must stay rock-solid and local (einheimische Arten).
- Each Stufe's pool must yield at least 8 distinct tasks (round
  length; the suite asserts it).
- Storage key `artenreich.progress`; Kompass links here via
  `PRACTICE_APPS['NMG.2.4']` in `lehrplan-kompass/data.js`.
- Tests: `cd tests && npm install && node e2e.test.mjs` — must pass
  before reporting back. `tests/node_modules` is a symlink to
  `../../masswerk/tests/node_modules` locally.
