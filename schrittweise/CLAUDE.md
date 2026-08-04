# CLAUDE.md — schrittweise

App-specific guidance; the repo root `CLAUDE.md` (verification workflow,
spec-sync rules, cache-busting convention) applies as well.

- Requirements PRD: `PRD.md` in this folder — single source of truth,
  updated in the same change as any behavior change.
- Accent family **violet** (root PRODUCT.md/DESIGN.md baseline).
- **Guiding principle: one app = one Lehrplan 21 competency (MI.2.2);
  the app's levels ARE the official Kompetenzstufen; the
  Grundansprüche are the visible milestones.** Do not invent extra
  levels, do not reorder, do not hide any Stufe.
- Generated program tasks (Anleitung, Wiederhole, Wenn/Sonst, HÜPF,
  PLUS, Halbieren) keep their exact sentence formats — the suite's
  independent interpreter parses them. Pool entries need their
  counterpart in the suite's re-stated oracle table in the same change.
- Each Stufe must yield at least 8 distinct tasks per round (pool size
  plus generators; the suite asserts it).
- Storage key `schrittweise.progress`; Kompass links here via
  `PRACTICE_APPS['MI.2.2']` in `lehrplan-kompass/data.js`.
- Tests: `cd tests && npm install && node e2e.test.mjs` — must pass
  before reporting back. `tests/node_modules` is a symlink to
  `../../masswerk/tests/node_modules` locally.
