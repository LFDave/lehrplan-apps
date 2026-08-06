# Lehrplan-Apps

Calm learning apps for the Swiss Lehrplan 21 (Bern edition): the
**Lehrplan-Kompass** for self-assessment across all subjects, plus one
small practice app per competency.

**Open:** [lfdave.github.io/lehrplan-apps](https://lfdave.github.io/lehrplan-apps)

## The principle

Every practice app implements exactly one Lehrplan 21 competency. Its
difficulty levels are the official Kompetenzstufen of that competency,
in the official order, with their cycles. The Grundansprüche (minimum
standards per cycle) are visible milestones — badges on the level
ladder and medals for clean rounds — never gates: nothing is locked,
and harder levels are only suggested after five clean rounds. Steps an
app cannot test honestly (measuring real objects, drawing by hand) are
skipped visibly with a note, or translated openly (documented in each
app's PRD).

## The apps

| App | Covers |
| --- | --- |
| [lehrplan-kompass](lehrplan-kompass/) | All 16 subject areas, 363 competencies, 721 cycle-specific texts for self-assessment ("Das kann ich schon") |
| [zahlenwissen](zahlenwissen/) | MA.1.A.1 — Zahlen lesen, schreiben und benennen |
| [zahlensprung](zahlensprung/) | MA.1.A.2 — zählen, ordnen, überschlagen |
| [rechenturm](rechenturm/) | MA.1.A.3 — addieren bis potenzieren |
| [rechenkniff](rechenkniff/) | MA.1.A.4 — zerlegen, umformen, Rechengesetze |
| [formenreich](formenreich/) | MA.2.A.1 — Formen und Körper benennen |
| [spiegelraster](spiegelraster/) | MA.2.A.2 — spiegeln, drehen, verschieben |
| [figurenmass](figurenmass/) | MA.2.A.3 — Umfang, Fläche, Volumen |
| [groessenwissen](groessenwissen/) | MA.3.A.1 — Einheiten, Referenzen, Fachwörter |
| [masswerk](masswerk/) | MA.3.A.2 — Grössen umwandeln und berechnen |
| [wertepfad](wertepfad/) | MA.3.A.3 — Folgen, Proportionalität, Funktionen |
| [schreibprobe](schreibprobe/) | D.4.F.1 — Rechtschreibregeln beim Überarbeiten |
| [wortbau](wortbau/) | D.5.D.1 — Wortarten, Zeitformen, Satzglieder |
| [motschatz](motschatz/) | FS1F.5.B.1 — französischer Grundwortschatz |
| [wordschatz](wordschatz/) | FS2E.5.B.1 — englischer Grundwortschatz |
| [zeitreise](zeitreise/) | NMG.9.1 — Zeitbegriffe, Kalender, Epochen |
| [bitkiste](bitkiste/) | MI.2.1 — Daten darstellen und strukturieren |
| [schrittweise](schrittweise/) | MI.2.2 — Anleitungen, Schleifen, kleine Programme |
| [nordpfeil](nordpfeil/) | NMG.8.5 — Pläne, Karten, Himmelsrichtungen |
| [sternwarte](sternwarte/) | NMG.4.5 — Sonne, Mond, Planeten, Sterne |
| [buchstabenleiter](buchstabenleiter/) | D.5.E.1 — ABC, Stammregel, Grossschreibung |
| [motbau](motbau/) | FS1F.5.D.1 — französische Grammatik |
| [wordbau](wordbau/) | FS2E.5.D.1 — englische Grammatik |
| [ortho](ortho/) | FS1F.5.E.1 — französische Rechtschreibung |
| [spellwerk](spellwerk/) | FS2E.5.E.1 — englische Rechtschreibung |
| [koerperatlas](koerperatlas/) | NMG.1.4 — Körper, Organe, Kreislauf |
| [artenreich](artenreich/) | NMG.2.4 — Tiere und Pflanzen ordnen |
| [wetterwarte](wetterwarte/) | NMG.4.4 — Wetter und Naturereignisse |
| [weltatlas](weltatlas/) | RZG.4.1 — Kontinente, Länder, Gradnetz |
| [demokratielabor](demokratielabor/) | RZG.8.1 — Schweizer Demokratie |
| [stromkreis](stromkreis/) | NT.5.2 — Elektrik und Ohmsches Gesetz |
| [rechnerraum](rechnerraum/) | MI.2.3 — Computer, Speicher, Netze |
| [merkheft](merkheft/) | Nachschlagewerk: Merkblätter mit Illustrationen und interaktiven Modellen, verlinkt aus den Apps |

That covers all ten math competencies of the Operieren-und-Benennen
aspect, all three Informatik competencies, three German competencies,
vocabulary, grammar and spelling for both French and English, six NMG
competencies, and first modules for RZG (Geografie, Demokratie) and
NT (Elektrik). The older Wortwerkstatt remains standalone in the
sibling
repo [small-apps](https://github.com/LFDave/small-apps); its
competency D.4.F.1 is now covered by Schreibprobe here.

## Common ground

- Static pages, no build step, no framework; each app is one folder.
- Dark, calm design from the shared token system (DESIGN.md); one
  accent family per app; Swiss standard German (ss, never ß).
- Quiet gamification per GAMIFICATION.md: XP and medals reward
  practice, never speed; progress never resets.
- Progress and settings live in localStorage only — no accounts, no
  cookies, no analytics, no external requests.
- Every app has a Playwright e2e suite (`<app>/tests/`) whose oracle
  re-computes each generated task independently; suites must pass
  before any change ships.

## Source

All apps are grounded in **Lehrplan 21, Ausgabe Kanton Bern, Stand
01.08.2022** (the version date printed in the footer of the official
PDF): [be.lehrplan.ch](https://be.lehrplan.ch), Gesamtausgabe PDF at
[be.lehrplan.ch/container/BE_DE_Gesamtausgabe.pdf](https://be.lehrplan.ch/container/BE_DE_Gesamtausgabe.pdf).

## Content and copyright

App texts are child-friendly paraphrases written at the level of each
cycle's Grundanspruch, with the official competency code shown next to
every entry. Verbatim Lehrplan 21 text is not committed to this repo.
`tools/lehrplan-extraktion/` contains the extraction script that
derives the grounding data (Kompetenzstufen per cycle, Grundanspruch
markers) from the public PDF when needed.

## Development

```bash
cd <app>
python3 -m http.server 8000   # ES modules need http

cd <app>/tests
npm install
node e2e.test.mjs
```

See CLAUDE.md for conventions (cache busting, verification workflow)
and PRODUCT.md for the product principles and app registry.
