# CLAUDE.md — nordpfeil

App-specific guidance; the repo root `CLAUDE.md` (verification workflow,
spec-sync rules, cache-busting convention) applies as well.

- Requirements PRD: `PRD.md` in this folder — single source of truth,
  updated in the same change as any behavior change.
- Accent family **sage** (root PRODUCT.md/DESIGN.md baseline).
- **Guiding principle: one app = one Lehrplan 21 competency (NMG.8.5);
  the app's levels ARE the official Kompetenzstufen; the
  Grundansprüche are the visible milestones.** Do not invent extra
  levels, do not reorder, do not hide any Stufe.
- The official Stufen e and h are split into topic-pure cards
  (`e-signaturen`/`e-massstab`, `h-karte`/`h-richtungen`). Split cards
  carry the official letter in `code`; the `id` stays the storage and
  deep-link key. The GA-Zyklus-2 medal needs clean runs on BOTH h
  cards.
- Generated tasks (Massstab, Planmass, Gegenrichtung, Vierteldrehung)
  keep their exact sentence formats — the suite parses them and
  recomputes with its own direction ring and scale conversion. Pool
  entries need their counterpart in the suite's re-stated oracle table
  in the same change. Factual content must stay rock-solid.
- Each Stufe must yield at least 8 distinct tasks per round (pool size
  plus generators; the suite asserts it).
- Storage key `nordpfeil.progress`; Kompass links here via
  `PRACTICE_APPS['NMG.8.5']` in `lehrplan-kompass/data.js`.
- Tests: `cd tests && npm install && node e2e.test.mjs` — must pass
  before reporting back. `tests/node_modules` is a symlink to
  `../../masswerk/tests/node_modules` locally.
