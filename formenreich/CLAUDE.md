# CLAUDE.md — formenreich

App-specific guidance; the repo root `CLAUDE.md` (verification workflow,
spec-sync rules, cache-busting convention) applies as well.

- Requirements PRD: `PRD.md` in this folder — single source of truth,
  updated in the same change as any behavior change.
- Follows the repo baseline (root PRODUCT.md/DESIGN.md): dark-only
  tokens in `styles.css`, accent family **violet**.
- **Guiding principle: one app = one Lehrplan 21 competency; the app's
  difficulty levels ARE the official Kompetenzstufen; the
  Grundansprüche are the visible milestones.** Here: MA.2.A.1, Stufen
  a-l in `data.js`, GA on c/g/k. Drawing/labeling parts are
  translated to recognizing figures (documented in the PRD).
- **SVG signature contract** (documented at the top of `SHAPES` in
  `gen.js`): the e2e oracle classifies figures purely from markup
  geometry — Kreis = 1 circle, Kugel = circle + ellipse, Würfel/
  Quader = 2 rects + 4 lines (square vs not), Zylinder = 2 ellipses +
  2 lines, Kegel = ellipse + polygon, Pyramide = 2 polygons, Prisma =
  2 polygons + 3 lines, 2D-Vielecke = 1 polygon (quads classified by
  parallel pairs and side lengths). A new shape needs a distinct
  signature AND a classifier branch in the suite, same change.
  Styling via `.task-figure` classes only, never inline fills.
- Generators randomize sizes so figures differ between tasks; the
  quad generators keep their class invariants (parallelogram sides
  never equal, trapez top ≠ bottom, rhombus w ≠ h, kite a ≠ b).
- Question tables live in `FR_QA` / `COUNT_FACTS` / `TETRAEDER_FACTS`;
  each entry needs its independently re-stated counterpart in the
  suite's `QA`/`FACTS` maps. Stufen d, e and l pools are exactly 8 —
  don't shrink them below 8 (round length).
- Koordinaten tasks explain the origin in the task text; the oracle
  uses the same fixed mapping (margin 10, cell 20, origin bottom
  left) — part of the render contract.
- Storage key `formenreich.progress`; Kompass links here via
  `PRACTICE_APPS['MA.2.A.1']` in `lehrplan-kompass/data.js`.
- Tests: `cd tests && npm install && node e2e.test.mjs` — must pass
  before reporting back. `tests/node_modules` is a symlink to
  `../../masswerk/tests/node_modules` locally.
