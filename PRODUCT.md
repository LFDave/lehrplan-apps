# Mini Apps Product Principles

Version: 2026-08-01

## Product register

Mini apps are product surfaces, not brand surfaces. The interface exists to help someone learn, practise, play, check something, or complete a small task. The screen should make the next action obvious and keep attention on the content.

## Purpose

Create the Lehrplan 21 app family: the Lehrplan-Kompass for self-assessment across all subjects of the Swiss curriculum (Bern edition), plus one small practice app per competency. Every practice app follows one principle: one app = one Lehrplan 21 competency, its difficulty levels are the official Kompetenzstufen, the Grundansprüche are the visible milestones, and steps an app cannot test honestly are skipped visibly. Each app should feel calm, usable, and complete enough to hand to a child, parent, teacher, or casual learner without further explanation.

## Audience

Primary users are children and families using small apps for learning, practice, and play. Secondary users are parents, teachers, and adults who want a clear lightweight tool. Assume mixed reading ability, mixed attention span, and real-world distraction. The primary audience is German-speaking, in Switzerland.

## Product qualities

The apps should feel:

- calm
- focused
- beautiful
- simple
- trustworthy
- playful through content and feedback, not through loud chrome

The apps should not feel:

- loud
- flashy
- generic SaaS
- over-designed
- too bold
- too dark to read
- like an AI-generated landing page

## Core principles

### Content first

The learning or game content is the hero. Layout, color, icons, and motion support the task. They must not compete with the question, prompt, answer, card, map, image, or feedback.

### One main task per screen

Every screen needs one obvious primary action. Avoid competing buttons, secondary panels, and large decoration. If a screen has multiple modes, make the current mode clear and hide advanced controls until they are useful.

### Calm dark default

The default and only theme is dark. Do not add a light mode or a theme switch. Use charcoal and navy surfaces, not pure black. Use near-white text, not harsh white everywhere. Use accent color sparingly.

### Restrained color

Each app may use one accent family. Color is mainly for titles, icons, progress, feedback, selected states, and small highlights. Primary buttons should normally be white or near-white on dark, not saturated accent blocks.

### Usability before personality

The product can be charming, but comprehension wins. Avoid novelty interaction patterns, hidden controls, and decorative complexity. A child should understand what to do within a few seconds.

### Feedback stays visible

Learning apps need persistent feedback. Do not flash feedback and remove it before the learner has processed it. Show what was correct, what was wrong, and what to try next. Use encouraging language.

### Games should feel fair

Games should reward effort, not speed alone. Avoid punishing mistakes harshly. Show progress, score, streak, or completion clearly, but keep rewards quiet and focused.

### Progression stays light

Apps may add XP, levels, and medals as a quiet progression layer. GAMIFICATION.md is the source for how: rewards scale with practice and difficulty, never with speed; progress never resets; locked goals stay visible; harder levels are proposed when the current one sits well, never forced. No daily pressure, no leaderboards, no casino mechanics.

### Small screens are first-class

Many apps will be used on laptops, tablets, and phones. The default layout should work at mobile width without horizontal scrolling, cramped controls, or hidden instructions.

## Language

- The default UI language is German, written in Swiss standard German. Write ss, never ß.
- The supported set is the four Swiss national languages plus English:

| Code | Language | Label shown in the picker |
| --- | --- | --- |
| de | German (default) | Deutsch |
| fr | French | Français |
| it | Italian | Italiano |
| rm | Rumantsch | Rumantsch |
| en | English | English |

- Rumantsch means Rumantsch Grischun, the written standard.
- An app may ship a subset of the five. German is always present. Record the shipped set in the app registry.
- Language is a setting, not a hidden toggle. It lives in the settings view and is the first setting every app gets.
- Every shipped language must be complete. Every label, instruction, and feedback message exists in each one. No mixed screens, apart from proper nouns and factual data such as the name of an emergency service.
- Keep all UI strings in one strings structure keyed by stable IDs, with one entry per language, and render every label from it. Copy never lives in markup or logic.
- German is the fallback when a key is missing. A missing key is a bug, not a feature.
- Set the document language on the root element when the language changes, so screen readers switch voice.
- Test layouts with the longest labels. German and French run long, Rumantsch runs longer still.
- Keep wording child-friendly in every language.
- Store the language choice on the device.

## Settings

Every app with something to configure uses the same settings surface, so a child who learns it in one app knows it in all of them.

- One entry point: a gear icon button in the header of the home screen, with a text label for screen readers. No hidden gestures, no dropdown menus.
- Settings open as their own view with a back button, not as a modal or an overlay.
- One panel per setting. Each panel has a short heading and one line saying what the setting changes.
- Options render as a choice grid of large buttons. The selected option is marked by an accent border and `aria-pressed`, never by color alone.
- A change applies immediately and is saved immediately. No save button, no confirm step, no toast.
- Language is the first setting in every app that has settings, and it stays at the top.
- Settings are stored on the device next to the app's progress, under the app's own storage key.
- Destructive controls such as reset do not belong in settings. They stay in the home footer with their confirmation.
- Defaults must be useful without ever opening settings: German for language, and Switzerland where an app depends on a country.

## Screen model

Use a consistent structure unless a specific app needs otherwise:

1. App shell with title, short instruction, optional progress, and the settings button when the app has settings.
2. Main content area for the current task.
3. Primary action area.
4. Persistent feedback area.
5. Secondary controls below the main content, with everything configurable behind the settings button.

## Learning interaction model

For quizzes and practice apps:

1. Ask one clear question.
2. Let the learner answer without unnecessary friction.
3. Confirm the result.
4. Explain briefly when useful.
5. Move forward only when the learner is ready or when the game mode clearly auto-advances.

When a practice app offers a number range, the range describes the whole number space of the task. Every operand and every result stays inside it. A range of 0 to 100 never produces 96 + 87.

Write feedback in German first. Use language such as:

- Richtig.
- Fast.
- Versuch es noch einmal.
- Schau auf die Endung.
- Hör auf den ersten Laut.
- Zähl zuerst die Zehner.

English equivalents for apps with an English toggle:

- Correct.
- Almost.
- Try again.
- Look at the ending.
- Listen for the first sound.
- Count the tens first.

Avoid language such as:

- Falsch.
- Wrong.
- Failed.
- Obviously.
- You should know this.

## Known-length input checks itself

When an input has a known, fixed length, for example a code, a PIN, or a quiz answer whose digit count the app knows, do not add a confirm button. Check the answer the moment the last character is entered, like a phone unlock screen. The correct answer locks in on the last keypress; that instant confirmation is the reward.

- Evaluate the whole answer, never each character as it is typed. Per-character validation turns recall into digit-by-digit guessing.
- On success, lock the input and show the result immediately. Moving on stays a separate, deliberate action so feedback remains visible.
- On a wrong answer, evaluate just as immediately: mark the wrong positions, keep the feedback supportive, offer retry. Corrections happen via backspace before the last character, so nothing is lost.
- Announce the behavior in visible text near the input, for example "Bei der letzten Ziffer siehst du sofort, ob es stimmt." This advisory is required by WCAG 3.2.2 On Input, not just politeness.
- Announce the result in a status region with role="status" so screen readers hear it without a focus jump (WCAG 4.1.3).
- Do not add hidden timing such as grace delays before showing a wrong result. Auto-check stays instant and predictable (WCAG 2.2.1).
- Keep a confirm button only where the input length is unknown.

## Visual direction

The visual system should be dark-only, quiet, and content-led. Use layered charcoal and navy surfaces with soft separation. Use one accent per app. Avoid loud gradients, glowing neon, oversized decorative headings, nested card stacks, repeated pill labels, and thick colored side borders.

## Typography direction

Typography must be readable before it is expressive. Use a self-hosted, accessible body face and a modest display face only when it improves hierarchy. Do not use overused default AI fonts. Maintain a clear size ramp. Avoid long all-caps text, very tight line height, and body text below comfortable reading size.

## Motion direction

Motion should clarify state changes. Use short, smooth transitions. Prefer transform and opacity. Do not animate layout properties. Do not use bounce, elastic, wobble, glowing, or celebratory motion unless the game specifically needs a small reward moment.

## Sound direction

Sound is optional. When an app uses sound:

- Sound starts only after a user action. Never autoplay.
- Provide a visible mute control and remember the choice.
- Never rely on sound alone to convey correctness or errors.
- Keep sounds short and quiet. No looping background music by default.

## Copy direction

Write plainly. Use short sentences. Use concrete verbs and nouns. Avoid marketing language, buzzwords, artificial contrast phrases, excessive punctuation, and em dashes. The copy should sound like a helpful teacher or calm game host.

## Accessibility baseline

Every app must support:

- semantic headings in order
- keyboard operation for controls
- visible focus states
- sufficient contrast
- target sizes suitable for children
- readable line length
- no body text touching viewport edges
- no essential information conveyed by color alone
- reduced motion support for non-essential animation

## Country flags

Do not use Unicode flag emoji for country flags in web output. Use image flags from flagcdn with the ISO 3166-1 alpha-2 code in lowercase. This avoids broken rendering on Windows desktop browsers.

## Icons

Use Lucide icons only. Icons should support comprehension, not decorate every heading. Avoid stacked icon tiles above headings.

## Data and content quality

Prefer explicit app data files over hardcoded logic. Data should be reviewable by a parent, teacher, or developer. Use stable IDs. Keep labels and translations consistent. Do not invent facts when a game depends on real-world data.

### Country-dependent facts

Some content is true in one country only: emergency numbers, dialling codes, postal formats, school terms. When an app teaches that kind of content:

- Make the country an explicit setting with Switzerland as the default, and key the fact tables by ISO 3166-1 alpha-2 code.
- Never carry a fact across a border because it looks similar. 118 is the fire brigade in Switzerland and the ambulance service in Italy.
- Where a country has no equivalent of something another country has, say so in the interface and name what to do instead. Do not leave a blank, and never fill the gap with an invented or a foreign number.
- Record the source of the fact table in the app's PRD so a parent can check it.

## Privacy and data storage

- No accounts, no sign-up, no login.
- No analytics, no tracking, no cookies.
- Progress and settings are stored locally on the device.
- Tell users where their data lives when it matters. Example: "Der Fortschritt wird auf diesem Gerät gespeichert."
- The only allowed external request is flagcdn for country flags. Everything else ships with the app.

## Delivery

- Every app is a static page. No server, no database, no build step.
- Apps deploy to GitHub Pages or Cloudflare Pages.
- Apps must keep working after the first load without a network connection, except flag images.
- Every app ships a favicon.
- Every site serves a helpful 404 page that leads back to the app overview.

## Accent assignment

Each app uses exactly one accent family from DESIGN.md. Before starting a new app, check the app registry below and prefer an accent that a similar or recent app does not already use. Record the choice when the app is created.

## App registry

| App | Competency | Accent | Languages | Status |
| --- | --- | --- | --- | --- |
| lehrplan-kompass | all subjects (self-assessment) | blue | DE | baseline |
| zahlenwissen | MA.1.A.1 | sage | DE | baseline |
| zahlensprung | MA.1.A.2 | amber | DE | baseline |
| rechenturm | MA.1.A.3 | coral | DE | baseline |
| rechenkniff | MA.1.A.4 | violet | DE | baseline |
| formenreich | MA.2.A.1 | violet | DE | baseline |
| spiegelraster | MA.2.A.2 | coral | DE | baseline |
| figurenmass | MA.2.A.3 | blue | DE | baseline |
| groessenwissen | MA.3.A.1 | amber | DE | baseline |
| masswerk | MA.3.A.2 | sage | DE | baseline |
| wertepfad | MA.3.A.3 | blue | DE | baseline |
| schreibprobe | D.4.F.1 | coral | DE | baseline |
| wortbau | D.5.D.1 | violet | DE | baseline |
| motschatz | FS1F.5.B.1 | blue | DE | baseline |
| wordschatz | FS2E.5.B.1 | sage | DE | baseline |
| zeitreise | NMG.9.1 | amber | DE | baseline |
| bitkiste | MI.2.1 | coral | DE | baseline |
| schrittweise | MI.2.2 | violet | DE | baseline |
| nordpfeil | NMG.8.5 | sage | DE | baseline |
| sternwarte | NMG.4.5 | blue | DE | baseline |
| buchstabenleiter | D.5.E.1 | amber | DE | baseline |
| motbau | FS1F.5.D.1 | coral | DE | baseline |
| wordbau | FS2E.5.D.1 | amber | DE | baseline |
| ortho | FS1F.5.E.1 | violet | DE | baseline |
| spellwerk | FS2E.5.E.1 | blue | DE | baseline |
| koerperatlas | NMG.1.4 | coral | DE | baseline |
| artenreich | NMG.2.4 | sage | DE | baseline |
| wetterwarte | NMG.4.4 | violet | DE | baseline |
| weltatlas | RZG.4.1 | blue | DE | baseline |
| demokratielabor | RZG.8.1 | amber | DE | baseline |
| stromkreis | NT.5.2 | sage | DE | baseline |
| rechnerraum | MI.2.3 | blue | DE | baseline |

D.4.F.1 is covered by Schreibprobe in this repo; the older
Wortwerkstatt remains in the sibling repo small-apps as a standalone.

The full roadmap to complete coverage — every remaining competency
classified as ready, needs-concept, or not app-testable, plus
platform work — lives in BACKLOG.md.

## Accepted decisions

- Default theme: dark only.
- Interactive visuals and in-app graphics: inline SVG and CSS only,
  following the `illustration` tokens in DESIGN.md. No 3D or
  charting libraries (three.js declined after the spike in
  spike-visuals/). Animation is transform/opacity only, paused by
  default, user-initiated, and respects reduced motion.
- Explaining and practising are separate surfaces: practice apps
  test and train knowledge and carry no explainer panels; all
  explanations, illustrations and interactive visuals live in the
  Merkheft reference app (see BACKLOG), which apps link to via quiet
  "Merkblatt" links on Stufe cards and after rounds with mistakes.
  Links are optional and never gates.
- Visual base: charcoal and navy, not pure black.
- Accent usage: one restrained accent per app, recorded in the app registry.
- Buttons: primary buttons usually near-white, not loud accent blocks.
- Feedback: persistent and learning-oriented.
- Icons: Lucide only.
- Fonts: self-hosted.
- Country flags: flagcdn images, never Unicode flag emoji.
- Language: German default in Swiss standard German. Supported set is de, fr, it, rm, en. Apps may ship a subset, always including German.
- Settings: one gear button in the home header, one settings view, one panel per setting, language first, saved immediately.
- Country-dependent facts: explicit country setting defaulting to Switzerland, gaps named in the interface rather than filled.
- Delivery: static pages without a build step, hosted on GitHub Pages or Cloudflare Pages.
- Storage: local device storage only, no accounts, no analytics.
- Sound: user-initiated only, always mutable.
- DESIGN.md: tokens only.
- Gamification: light progression per GAMIFICATION.md, rewards practice, never speed or perfection.
- No project-specific corporate branding unless explicitly requested.

## Definition of done

A mini app is done when:

- the main task is clear within a few seconds
- the app works on mobile and desktop
- the content is readable and not cramped
- the design uses only documented tokens
- the German copy is complete and child-friendly
- every shipped language is complete, with no fallback text visible on screen
- settings follow the shared pattern and every default is useful without opening them
- the app has meaningful empty, loading, success, and error states where relevant
- feedback is persistent enough to learn from
- keyboard and focus behavior work
- no broken images, placeholder content, or console errors remain
- the result feels calm, focused, and usable
