# CLAUDE.md — buchstabenleiter

App-specific guidance; the repo root `CLAUDE.md` (verification workflow,
spec-sync rules, cache-busting convention) applies as well.

- Requirements PRD: `PRD.md` in this folder — single source of truth,
  updated in the same change as any behavior change.
- Accent family **amber** (root PRODUCT.md/DESIGN.md baseline).
- **Guiding principle: one app = one Lehrplan 21 competency (D.5.E.1);
  the app's levels ARE the official Kompetenzstufen; the
  Grundansprüche are the visible milestones.** Do not invent extra
  levels, do not reorder, do not hide any Stufe.
- Generated tasks (ABC-Nachbar, Vokal, ABC-Gruppe, Wörterbuch-
  Reihenfolge) keep their exact sentence formats — the suite parses
  them and recomputes with its own alphabet table and word
  comparator. The word groups in `WOERTER` stay umlaut-free so plain
  alphabetical order is correct. Pool entries need their counterpart
  in the suite's re-stated oracle table in the same change.
- Typed letter tasks carry `ci: true` (case-insensitive compare in
  `app.js`); spelling tasks like `Freiheit` must NOT set it — casing
  is the learning goal there.
- Each Stufe must yield at least 8 distinct tasks per round (pool size
  plus generators; the suite asserts it).
- Storage key `buchstabenleiter.progress`; Kompass links here via
  `PRACTICE_APPS['D.5.E.1']` in `lehrplan-kompass/data.js`.
- Tests: `cd tests && npm install && node e2e.test.mjs` — must pass
  before reporting back. `tests/node_modules` is a symlink to
  `../../masswerk/tests/node_modules` locally.
