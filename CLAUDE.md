# Claude Instructions for Mini Apps

Version: 2026-07-31

## Read first

Before creating or editing any mini app, read:

1. PRODUCT.md for product direction, audience, interaction principles, and accepted decisions.
2. DESIGN.md for the token system.

Treat PRODUCT.md as the strategic source and DESIGN.md as the visual source. If they conflict, ask whether the strategy or token system should change. Do not silently invent a new direction.

game-design-system.md is superseded by DESIGN.md. Do not use it for new apps.

## Project goal

Build small, calm, high-usability web apps for learning, practice, quizzes, games, and lightweight tools. The result should be simple, beautiful, focused on the task, and suitable for children and families.

## Tech stack and delivery

- Build each app as a static page: index.html plus optional styles.css, app.js, and data.js in one folder. A fonts subfolder for woff2 files is allowed.
- No framework, no build step, no package manager for the app itself. Dev-time tools such as Impeccable may run via npx. If an app truly needs more, ask before adding it.
- Copy the tokens from DESIGN.md into CSS custom properties on :root. Derive the variable name from the token path, for example --color-background-app or --space-4.
- Self-host fonts as woff2 files in the app's fonts subfolder. No external font services.
- Inline Lucide icons as SVG markup. No icon fonts and no icon CDNs.
- The only allowed external request is flagcdn for country flags.
- Use relative URLs for all assets so the app works from a subpath on GitHub Pages or Cloudflare Pages.
- The app must keep working after the first load without a network connection, except flag images.
- New apps get their own folder. Some older apps exist as single HTML files at the repo root. Leave them until they are next edited.

## Non-negotiable design rules

- Dark theme only. Do not add a light theme or theme switch.
- Use charcoal and navy surfaces, not pure black.
- Use one restrained accent family per app.
- Use accent color mainly for titles, icons, progress, feedback, and selected states.
- Primary buttons should usually be white or near-white on dark.
- Use Lucide icons only.
- Use self-hosted fonts.
- Use design tokens from DESIGN.md.
- Keep DESIGN.md token-only.
- Do not mention or add unrelated corporate branding.

## Accent selection

- Each app uses exactly one accent family from DESIGN.md app-accent-options.
- Check the app registry in PRODUCT.md first and prefer an accent that a similar or recent app does not use.
- Record the chosen accent in the app registry when the app is created.

## Implementation workflow

1. Identify the app goal and primary user task.
2. Create the smallest complete flow that solves that task.
3. Apply the shared screen skeleton: header, main task area, action area, feedback area, optional settings.
4. Use tokens from DESIGN.md for color, type, spacing, radius, shadow, and motion.
5. Add persistent feedback for learning and game states.
6. Test mobile and desktop layouts.
7. Check keyboard access, focus states, contrast, and readable line length.
8. Remove placeholders, broken images, console errors, and unused complexity.

## Verification workflow

For every UI change, before reporting back or opening or updating a PR:

1. Test it yourself in a real browser. Serve the app locally, since ES modules need http, for example with `python3 -m http.server`. Drive the changed flows end to end with Playwright where available. In cloud sessions Chromium is pre-installed at `/opt/pw-browsers/chromium`. Exercise the actual feature that changed, not just a page load, and check for console errors.
2. Take screenshots and provide them to the user. Capture the normal view plus any changed or special states. A change without a screenshot is not done.
3. Automated tests live in `<app>/tests/`. Write or extend the Playwright e2e suite there for every behavior change and run it. It must pass before reporting back.
4. Keep specs in sync. When behavior changes, update the spec in the same change so it always reflects reality. The PRD is a file in the app folder, `<app>/PRD.md`, and is the single source of truth. The README is user facing only, covering what the app is and how to use, run, and test it, and must not duplicate spec detail. Also update the app's own CLAUDE.md notes.
5. Post a fresh live link when reporting back. Include a direct link to the deployed app on GitHub Pages with a unique `?r=` cache buster so the user never hits stale cached HTML, for example `https://lfdave.github.io/small-apps/jass-scoreboard/index.html?r=YYYYMMDD-N`. Any unique value works and the app ignores the query. The change is only live once the PR is merged and Pages has redeployed.

## Repo conventions

- Cache busting: every local asset URL, meaning every CSS link, script tag, and inter-module import, carries the same `?v=N` query. Bump N in all files on every release so mobile browsers pick up changed JS and CSS on a plain reload. Where an e2e suite exists it must enforce this. The jass-scoreboard suite does.
- App-specific instructions live in a CLAUDE.md inside the app's own folder, for example `jass-scoreboard/CLAUDE.md`. It is loaded automatically when working on files in that directory, in addition to this file.

## Product behavior

For learning and quiz apps:

- Ask one clear question at a time.
- Make answer choices or input controls large and easy to understand.
- Show progress when the task has multiple steps.
- Keep feedback visible until the learner moves on.
- Use supportive language.
- Explain mistakes briefly when it helps learning.
- Do not punish mistakes harshly.

For game apps:

- Make the win condition clear.
- Keep game chrome quiet.
- Use reward moments sparingly.
- Avoid speed-only pressure unless explicitly requested.
- Let users recover from errors.

## Language rules

- The default UI language is German.
- Use Swiss standard German. Write ss, never ß.
- An English toggle is optional per app. When it exists, keep all UI strings in one strings data structure keyed by stable IDs and render every label from it.
- Never mix languages on one screen, except proper nouns.
- Persist the language choice in localStorage.
- Test layouts with the longer German labels.

## Persistence and privacy

- Store progress and settings in localStorage only.
- Prefix storage keys with the app name, for example geotriad.progress.
- No accounts, no analytics, no cookies, no external storage.
- Ask for confirmation before destructive resets and say that the data lives on this device.

## Sound rules

- Never autoplay sound. Sound starts from a user action.
- Provide a visible mute control and persist the choice.
- Never use sound as the only signal for correctness or errors.

## Visual anti-patterns to avoid

Avoid these generated-UI tells:

- thick colored side borders on cards
- decorative accent borders on rounded cards; selected states may use an accent border
- purple or violet gradients
- cyan-on-dark neon styling
- gradient text
- colored glow shadows
- nested cards inside cards
- repeated pill labels above headings
- icon tiles stacked above headings
- numbered section markers used as decoration
- long oversized hero headlines
- italic serif hero headlines
- monotonous spacing repeated everywhere
- bounce, elastic, wobble, or spring easing
- animating width, height, padding, or margin
- overused AI-default font choices
- all-caps body copy
- marketing buzzwords
- em dashes in body copy

## Country flags in web pages

Never use Unicode flag emoji for country flags in HTML or web UI. Windows desktop browsers can render regional-indicator flag emoji as letters instead of flags.

Use flagcdn with the ISO 3166-1 alpha-2 country code in lowercase.

Preferred scalable SVG:

```html
<img src="https://flagcdn.com/ch.svg" width="66" height="44" alt="Flag of Switzerland">
```

Fixed-width PNG with high-DPI source:

```html
<img src="https://flagcdn.com/w80/ch.png" srcset="https://flagcdn.com/w160/ch.png 2x" alt="Flag of Switzerland">
```

Common codes:

- ch: Switzerland
- us: United States
- gb: United Kingdom
- de: Germany
- fr: France
- it: Italy
- es: Spain
- at: Austria
- no: Norway
- se: Sweden
- dk: Denmark
- fi: Finland

For country data, store the flag code as data, not as rendered emoji.

## Data rules

- Prefer explicit data files, for example data.js or JSON, over content hardcoded in markup or logic.
- Use stable IDs.
- Keep labels consistent across languages.
- Do not invent factual learning data.
- Keep answer validation transparent and easy to review.
- For geography apps, store country code, names, capital, continent, region, and tags separately.

## Accessibility rules

- Use semantic HTML.
- Do not skip heading levels.
- Make controls keyboard reachable.
- Add visible focus styles.
- Keep text contrast high.
- Do not use color alone for correctness.
- Use target sizes suitable for children.
- Respect reduced motion.
- Avoid horizontal scrolling.
- Keep paragraph line length around 65 to 75 characters.

## Responsive rules

- Design mobile first, then expand.
- Avoid fixed pixel widths for main layout.
- Use readable padding at viewport edges.
- Keep primary actions reachable.
- Avoid dense two-column layouts on small screens.
- Test long labels, German text, and translated labels.

## Copy rules

- Use short, concrete sentences.
- Use plain verbs.
- Be supportive and calm.
- Avoid hype language.
- Avoid artificial contrast phrases.
- Avoid em dashes.
- Prefer labels children understand.

## Impeccable workflow

Impeccable uses PRODUCT.md for strategy and DESIGN.md for visuals. If Impeccable is installed, use it as a polish and audit helper.

Common sequence:

```bash
npx impeccable install
```

Then in the coding harness:

```text
/impeccable init
/impeccable document
/impeccable polish the current app
/impeccable audit the current app
```

For direct detection:

```bash
npx impeccable detect <app-folder>/
```

When Impeccable flags an issue, prefer fixing the underlying design or token drift instead of suppressing it. If a token is genuinely missing, update DESIGN.md with a token-only addition.

## Definition of done checklist

Before finalizing, confirm:

- The app solves one clear task.
- The dark-only visual system is used.
- All colors, type, spacing, radius, shadow, and motion come from DESIGN.md.
- No Unicode flag emoji are used in web UI.
- The German copy is complete. When an English toggle exists, both languages are complete.
- Feedback is persistent and useful.
- Mobile and desktop layouts work.
- Keyboard and focus states work.
- Text is readable and not cramped.
- No external requests are made except flagcdn.
- All asset URLs are relative and the app works from a subpath.
- All local asset URLs carry the current cache-busting query and it was bumped for this release.
- Progress and settings survive a reload where the app has progress.
- Where the app has an e2e suite, it passes, and screenshots of the changed states are provided.
- No generated-UI anti-patterns are present.
- No placeholder content or broken images remain.
- No unrelated branding has been introduced.
