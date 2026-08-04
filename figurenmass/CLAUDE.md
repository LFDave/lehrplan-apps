# CLAUDE.md — figurenmass

App-specific guidance; the repo root `CLAUDE.md` (verification workflow,
spec-sync rules, cache-busting convention) applies as well.

- Requirements PRD: `PRD.md` in this folder — single source of truth,
  updated in the same change as any behavior change.
- Follows the repo baseline (root PRODUCT.md/DESIGN.md): dark-only
  tokens in `styles.css`, accent family **blue**.
- **Guiding principle: one app = one Lehrplan 21 competency; the app's
  difficulty levels ARE the official Kompetenzstufen; the
  Grundansprüche are the visible milestones.** Here: MA.2.A.3, Stufen
  a-k in `data.js`, GA on b/e/i. Real-world measuring is translated
  to on-screen raster measuring (documented in the PRD) — keep that
  framing, don't add pseudo-physical tasks.
- **SVG contract:** figures are markup strings from the builders in
  `gen.js` (`rasterLineSvg`, `cellRectSvg`, `filledCellsSvg`,
  `pathsSvg`; CELL = 20). The e2e oracle re-measures answers from
  this markup (`class="strecke"` x1/x2, `class="cell"`/`class="fill"`
  counts, `data-weg` polyline Manhattan lengths) — attribute names,
  classes and attribute order are part of the contract; change them
  only together with the oracle. Styling comes from `.task-figure`
  classes in `styles.css` using color tokens, never inline fills.
- `app.js` renders `task.svg` above the expression; keep the
  `.task-figure` block when syncing template changes across apps.
- Circle tasks use π ≈ 3.14 stated in the task; answers come from a
  fixed table with clean decimals. Pyramid states its formula in the
  text. Pythagoras kinds only use pythagorean triples.
- Storage key `figurenmass.progress`; Kompass links here via
  `PRACTICE_APPS['MA.2.A.3']` in `lehrplan-kompass/data.js`.
- Tests: `cd tests && npm install && node e2e.test.mjs` — must pass
  before reporting back. `tests/node_modules` is a symlink to
  `../../masswerk/tests/node_modules` locally.
