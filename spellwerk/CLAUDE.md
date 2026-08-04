# CLAUDE.md — spellwerk

App-specific guidance; the repo root `CLAUDE.md` (verification workflow,
spec-sync rules, cache-busting convention) applies as well.

- Requirements PRD: `PRD.md` in this folder — single source of truth,
  updated in the same change as any behavior change.
- Accent family **blue** (root PRODUCT.md/DESIGN.md baseline).
- **Guiding principle: one app = one Lehrplan 21 competency
  (FS2E.5.E.1); the app's levels ARE the official Kompetenzstufen;
  the Grundansprüche are the visible milestones.** Do not invent
  extra levels, do not reorder, do not hide any Stufe.
- Copy tasks (`Schreibe genau ab: ...`) carry their template in the
  expr — the suite checks identity via that exact prefix; keep the
  format. Pool entries need their counterpart in the suite's
  re-stated oracle table in the same change. English content must
  stay rock-solid textbook basics.
- Comparison is case-sensitive on purpose: capital I and capitalized
  weekdays are part of the orthography being practiced. Do not add a
  case-insensitive flag here.
- Each Stufe must yield at least 8 distinct tasks per round (word
  lists plus pools; the suite asserts it).
- Storage key `spellwerk.progress`; Kompass links here via
  `PRACTICE_APPS['FS2E.5.E.1']` in `lehrplan-kompass/data.js`.
- Tests: `cd tests && npm install && node e2e.test.mjs` — must pass
  before reporting back. `tests/node_modules` is a symlink to
  `../../masswerk/tests/node_modules` locally.
