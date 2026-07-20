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
   it must pass before reporting back.
4. **Keep specs in sync.** Whenever behavior changes, update the spec in
   the same change so it always reflects reality. The PRD is a file in
   the app folder (`<app>/PRD.md`) and is the single source of truth;
   the README is user-facing only (what it is, how to use/run/test) and
   must not duplicate spec detail. Also update the app's `CLAUDE.md`
   notes.

## Repo-wide conventions

- **Cache busting:** every local asset URL (CSS link, script tag, every
  inter-module import) carries the same `?v=N` query. Bump N in ALL
  files on every release so mobile browsers pick up changed JS/CSS on a
  plain reload. Where an e2e suite exists it must enforce this
  (jass-scoreboard's does).

## App notes

App-specific instructions live in a `CLAUDE.md` inside the app's own
folder (e.g. `jass-scoreboard/CLAUDE.md`) — it is loaded automatically
when working on files in that directory, in addition to this file.
