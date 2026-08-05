# CLAUDE.md — wetterwarte

App-specific guidance; the repo root `CLAUDE.md` (verification workflow,
spec-sync rules, cache-busting convention) applies as well.

- Requirements PRD: `PRD.md` in this folder — single source of truth,
  updated in the same change as any behavior change.
- Accent family **violet** (root PRODUCT.md/DESIGN.md baseline).
- **Guiding principle: one app = one Lehrplan 21 competency (NMG.4.4);
  the app's levels ARE the official Kompetenzstufen; the
  Grundansprüche are the visible milestones.** This competency has
  TWO official Stufen strands (1a–1g Wetter, 2a–2e Naturereignisse) —
  both stay complete and in order; ids are two characters ('1b').
- Because each cycle has two Grundansprüche, the GA medals in
  `game.js` are keyed per Stufe (`ga-1b`, not `ga-z1`) with distinct
  names (· Wetter / · Naturereignisse). Keep it that way.
- Generated tasks (temperature difference incl. negative mornings,
  lightning distance at 3 s/km) keep their exact sentence formats —
  the suite recomputes them. Pool entries need their counterpart in
  the suite's re-stated oracle table in the same change. Safety
  advice must follow official recommendations, weather facts stay
  rock-solid.
- Each Stufe's pool must yield at least 8 distinct tasks (round
  length; the suite asserts it).
- Storage key `wetterwarte.progress`; Kompass links here via
  `PRACTICE_APPS['NMG.4.4']` in `lehrplan-kompass/data.js`.
- Tests: `cd tests && npm install && node e2e.test.mjs` — must pass
  before reporting back. `tests/node_modules` is a symlink to
  `../../masswerk/tests/node_modules` locally.
