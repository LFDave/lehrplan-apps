# CLAUDE.md — spiegelraster

App-specific guidance; the repo root `CLAUDE.md` (verification workflow,
spec-sync rules, cache-busting convention) applies as well.

- Requirements PRD: `PRD.md` in this folder — single source of truth,
  updated in the same change as any behavior change.
- Follows the repo baseline (root PRODUCT.md/DESIGN.md): dark-only
  tokens in `styles.css`, accent family **coral**.
- **Guiding principle: one app = one Lehrplan 21 competency; the app's
  difficulty levels ARE the official Kompetenzstufen; the
  Grundansprüche are the visible milestones.** Here: MA.2.A.2, Stufen
  a-j in `data.js`, GA on c/f/i. Geodreieck/Zirkel drawing and
  real-body tilting are translated to recognizing the transformations
  (documented in the PRD).
- **Load-bearing invariant:** every piece in `PIECES` must be a
  chiral polyomino with NO rotational or mirror symmetry — otherwise
  "gespiegelt", "gedreht" and "verschoben" stop being mutually
  exclusive and MC answers become ambiguous. The suite's transform
  oracle will catch violations, but check before adding pieces.
- **SVG contract:** cells are `<rect class="cell orig|trans|kand">`
  at multiples of CELL = 20 (candidates wrapped in
  `<g data-kand="A|B|C">`, the mirror axis is `class="achse"`,
  pattern shapes `class="mini"`, triangle parts `class="part"`).
  The oracle parses exactly these classes/attributes — change them
  only together with `tests/e2e.test.mjs`. The oracle implements its
  own normalize/mirror/rotate (grid space, not pixel space — don't
  re-normalize already-transformed grid cells).
- Styling via `.task-figure` classes: original filled with accent,
  image/candidates outlined, axis dashed. Never inline fills.
- Storage key `spiegelraster.progress`; Kompass links here via
  `PRACTICE_APPS['MA.2.A.2']` in `lehrplan-kompass/data.js`.
- Tests: `cd tests && npm install && node e2e.test.mjs` — must pass
  before reporting back. `tests/node_modules` is a symlink to
  `../../masswerk/tests/node_modules` locally.
