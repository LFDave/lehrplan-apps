# CLAUDE.md — merkheft

App-specific guidance; the repo root `CLAUDE.md` (verification workflow,
spec-sync rules, cache-busting convention) applies as well.

- Requirements PRD: `PRD.md` in this folder — single source of truth,
  updated in the same change as any behavior change.
- Accent family **amber** (root PRODUCT.md/DESIGN.md baseline).
- **Guiding principle: explaining and practising are separate
  surfaces.** The Merkheft explains; it never quizzes, never scores,
  never stores. Do not add gamification, progress, or localStorage.
- **One Merkblatt = one HTML page** (`<id>.html`, stable ids — apps
  deep-link them as `../merkheft/<id>.html`); `index.html` is the
  grouped list. No router, no data.js. Content lives in the page and
  may grow there (paragraphs, lists, formulas as plain HTML with
  `sub`/`sup` — no math libraries). Static visuals are inline SVG in
  the page; interactive models keep their markup in the page and
  wire up via `illustrations.js` `init('<id>', document)`. Visuals
  follow the DESIGN.md `illustration` tokens (stroke 2, soft
  26-alpha fills, quiet labels; motion transform/opacity only,
  paused by default, user-initiated, reduced-motion respected) and
  have `role="img"` with a German `aria-label`. `@media print` in
  styles.css makes every page a light A4 sheet — keep new elements
  printable.
- **Sourcing rule (PRD «Woher die Wahrheit kommt»):** facts are free,
  wording is not. Own wording always; Wikipedia (CC BY-SA) and any
  other source are for cross-checking facts only, never for text.
  Only canonical textbook-invariant knowledge; every fact checked
  against at least two independent references; uncertain facts stay
  out. Never copy Lehrplan wording.
- Infographics (A4 overview per concept) are token-styled inline
  SVGs using the `.ig-*` classes in styles.css; every class has a
  light counterpart in the `@media print` block. Never embed raster
  images or trace provided examples — redraw the information
  structure in this system (see the Masseinheiten pilot).
- Adding a Merkblatt means, in the same change: the page here, the
  index.html list entry, the `merkblatt: { id, name }` entry on the
  mapped Stufe(n) in the app's `data.js` (link renders on the Stufe
  card and after rounds with mistakes), the app's suite check for
  the link, the BLAETTER entry in `tests/e2e.test.mjs`, and a cache
  bump in that app.
- «Dazu üben» links deep-link into the Stufe: `?stufe=<id>`. There
  is no topic parameter: mixed official Stufen are split into
  topic-pure sub-Stufen in the apps (own id, shared display `code`),
  and the app strips the query from the address after entry.
- Full coverage: every Stufe of every practice app links exactly one
  Merkblatt, and every Merkblatt links back to all Stufen it serves.
  The canonical mapping is restated in `tests/e2e.test.mjs`
  (BLAETTER); app suites assert one Merkblatt chip per Stufe card.
- Tests: `cd tests && npm install && node e2e.test.mjs` — must pass
  before reporting back. `tests/node_modules` is a symlink to
  `../../masswerk/tests/node_modules` locally.
