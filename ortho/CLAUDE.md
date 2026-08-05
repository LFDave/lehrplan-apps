# CLAUDE.md — ortho

App-specific guidance; the repo root `CLAUDE.md` (verification workflow,
spec-sync rules, cache-busting convention) applies as well.

- Requirements PRD: `PRD.md` in this folder — single source of truth,
  updated in the same change as any behavior change.
- Accent family **violet** (root PRODUCT.md/DESIGN.md baseline).
- **Guiding principle: one app = one Lehrplan 21 competency
  (FS1F.5.E.1); the app's levels ARE the official Kompetenzstufen;
  the Grundansprüche are the visible milestones.** Do not invent
  extra levels, do not reorder, do not hide any Stufe.
- Copy tasks (`Schreibe genau ab: ...`) carry their template in the
  expr — the suite checks identity via that exact prefix; keep the
  format. Pool entries need their counterpart in the suite's
  re-stated oracle table in the same change. French content must
  stay rock-solid textbook basics.
- Typed answers use only Swiss-keyboard characters (é, è, à,
  apostrophe). Words with ç or œ may appear for display and in
  multiple-choice options, never as typed answers.
- Each Stufe must yield at least 8 distinct tasks per round (word
  lists plus pools; the suite asserts it).
- Storage key `ortho.progress`; Kompass links here via
  `PRACTICE_APPS['FS1F.5.E.1']` in `lehrplan-kompass/data.js`.
- Tests: `cd tests && npm install && node e2e.test.mjs` — must pass
  before reporting back. `tests/node_modules` is a symlink to
  `../../masswerk/tests/node_modules` locally.
