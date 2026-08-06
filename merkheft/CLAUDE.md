# CLAUDE.md — merkheft

App-specific guidance; the repo root `CLAUDE.md` (verification workflow,
spec-sync rules, cache-busting convention) applies as well.

- Requirements PRD: `PRD.md` in this folder — single source of truth,
  updated in the same change as any behavior change.
- Accent family **amber** (root PRODUCT.md/DESIGN.md baseline).
- **Guiding principle: explaining and practising are separate
  surfaces.** The Merkheft explains; it never quizzes, never scores,
  never stores. Do not add gamification, progress, or localStorage.
- One Merkblatt per concept in `data.js` (stable ids — apps deep-link
  them as `../merkheft/#<id>`); visuals in `illustrations.js`
  following the DESIGN.md `illustration` tokens (stroke 2, soft
  26-alpha fills, quiet labels; motion transform/opacity only,
  paused by default, user-initiated, reduced-motion respected).
  Every visual has `role="img"` and a German `aria-label`.
- Content is own-authored and rock-solid; no copied encyclopedia or
  Lehrplan text. Each page lists the competency codes it supports
  and its "Dazu üben" app links — the suite verifies the targets
  exist.
- Adding a Merkblatt means, in the same change: the page here, the
  `merkblatt: { id, name }` entry on the mapped Stufe(n) in the
  app's `data.js` (link renders on the Stufe card and after rounds
  with mistakes), the app's suite check for the link, and a cache
  bump in that app.
- Tests: `cd tests && npm install && node e2e.test.mjs` — must pass
  before reporting back. `tests/node_modules` is a symlink to
  `../../masswerk/tests/node_modules` locally.
