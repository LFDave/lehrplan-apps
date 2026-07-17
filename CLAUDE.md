# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Repository

Small static browser apps (HTML/CSS/vanilla JS, no frameworks, no build
step). Each app lives in its own folder or as a single HTML file and must
run from a static web server (ES modules require http, e.g.
`python3 -m http.server`).

## Mandatory verification workflow

For every UI change, before reporting back or opening/updating a PR:

1. **Test it yourself in a real browser.** Serve the app locally and drive
   the changed flows end-to-end with Playwright (Chromium is pre-installed
   at `/opt/pw-browsers/chromium`). Exercise the actual feature that
   changed — not just a page load — and check for console errors.
2. **Always take screenshots and provide them to the user.** Capture the
   relevant states (normal view plus any changed/special states) and send
   them with the summary. A change without a screenshot is not done.
3. **Automated tests live in `<app>/tests/`.** Write or extend the
   Playwright e2e suite there for every behavior change, and run it —
   it must pass before reporting back. For jass-scoreboard:
   `cd jass-scoreboard/tests && npm install && node e2e.test.mjs`.
4. **Keep specs in sync.** Whenever behavior changes, update the spec in
   the same change so it always reflects reality: the PRD issue (issue #6
   for jass-scoreboard), the app's README, and this file's app notes.

## App notes

### jass-scoreboard

- Requirements PRD: issue #6. Module structure (`state.js`, `storage.js`,
  `scoring.js`, `renderer.js`, `ui.js`, `app.js`) is mandated by the PRD.
- The board is one SVG scene; each Z is point-symmetric so both Z's read
  correctly from both sides of the table (far half rotated 180°).
- Chalk semantics: marks are written per round and never converted
  between lines (no exchanging five 20s for a 100); 20s align right on
  the bottom bar; all lines bundle tallies in fives (`||||\`); only undo
  removes the last round's marks. The rest number is always below 20 —
  at 20 it carries into a 20-mark.
