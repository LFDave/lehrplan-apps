# CLAUDE.md — nachfragen

App-specific guidance; the repo root `CLAUDE.md` applies as well.

- Requirements PRD: `PRD.md` in this folder, single source of truth,
  updated in the same change as any behavior change.
- Part of the site shell: uses `../site.css` (amber, family accent)
  plus a local `styles.css`, shares the shell's `?v=N` (currently 3)
  on every asset and module import, and is tested by the root suite
  in `tests/e2e.test.mjs`, not by a suite of its own.
- No form. Every variable a prompt needs is a button (`aria-pressed`,
  persisted under `nachfragen.lang`, `nachfragen.zyklus`,
  `nachfragen.check`); everything else the AI service asks the parent
  itself. The one free-text field is the name of another answer
  language behind «Andere» (`nachfragen.langOther`, cleaned by
  `cleanLang`, max `OTHER_LANG_MAX`); it feeds only the closing line.
  Never add a field for the child's name or for personal details.
- Only the five official markers are offered as check points
  (`CHECKS` in data.js): Grundanspruch at the end of Zyklus 1, 2, 3
  and the two Orientierungspunkte (end of 4th class, middle of 8th).
  An Orientierungspunkt prompt says «bearbeitet», not «erreicht».
- Every prompt ends with `SOURCE_BLOCK`: the official PDF is the
  only allowed source, no other website, no invented Stufen, answer
  in the chosen language. Keep it when editing templates.
- Providers (`PROVIDERS`) are only services with a native prefill
  URL parameter: ChatGPT `?q=`, Claude `/new?q=`, Perplexity
  `/search?q=`, Le Chat `/chat?q=`. Gemini has none and is left out;
  the copy button is the general fallback. Links open in a new tab
  with `rel="noopener noreferrer"` and `referrerpolicy="no-referrer"`.
  The page itself makes no external request.
- `APPS` in data.js mirrors `ueben/index.html`; the root suite fails
  when the two drift. Regenerate the list when an app is added.
- UI copy lives in `strings.js` (German only for now); prompt
  templates live in `data.js` and are own wording.
