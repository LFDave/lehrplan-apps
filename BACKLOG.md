# Backlog

All work remaining to complete the Lehrplan family. Grounded in the
full competency list of Lehrplan 21, Ausgabe Kanton Bern, Stand
01.08.2022 (363 competencies across 16 subjects). The family
principle stays fixed: one app = one competency, the app's levels are
the official Kompetenzstufen, the Grundansprüche are the visible
milestones, and untestable steps are translated openly or excluded
honestly.

Status: **27 of 363 competencies have a practice app**, plus the
Kompass covering all 363 for self-assessment.

## How to read this file

Every remaining competency sits in exactly one bucket:

- **Ready** — the established pattern (pools + generators + independent
  oracle + e2e suite) applies directly and rock-solid content exists.
  These are concrete next apps.
- **Needs concept** — testable in principle, but something must be
  built or authored first (own texts, audio, careful curation, a new
  interaction). The missing piece is named.
- **Not app-testable** — speaking, producing, performing, exploring,
  reflecting. Excluded with the reason stated. These stay covered by
  the Kompass (self-assessment) only. Excluding them is a feature of
  the family principle, not a gap.

Working titles are placeholders; accents are assigned at build time
against the registry in PRODUCT.md.

## Shipped (for reference)

lehrplan-kompass (all 363, self-assessment) — and practice apps:
MA.1.A.1 Zahlenwissen, MA.1.A.2 Zahlensprung, MA.1.A.3 Rechenturm,
MA.1.A.4 Rechenkniff, MA.2.A.1 Formenreich, MA.2.A.2 Spiegelraster,
MA.2.A.3 Figurenmass, MA.3.A.1 Grössenwissen, MA.3.A.2 Masswerk,
MA.3.A.3 Wertepfad, D.4.F.1 Schreibprobe, D.5.D.1 Wortbau,
D.5.E.1 Buchstabenleiter, FS1F.5.B.1 Motschatz, FS1F.5.D.1 Motbau,
FS1F.5.E.1 Ortho, FS2E.5.B.1 Wordschatz, FS2E.5.D.1 Wordbau,
FS2E.5.E.1 Spellwerk, NMG.1.4 Körperatlas, NMG.2.4 Artenreich,
NMG.4.4 Wetterwarte, NMG.4.5 Sternwarte, NMG.8.5 Nordpfeil,
NMG.9.1 Zeitreise, MI.2.1 Bitkiste, MI.2.2 Schrittweise, MI.2.3
Rechnerraum, RZG.4.1 Weltatlas, RZG.8.1 Demokratielabor, NT.5.2
Stromkreis.

---

## Ready — concrete next apps

Ordered by suggested batches. Each is one app, one competency, built
with the existing template and suite pattern.

### Lower priority but ready

| Competency | Working title | Note |
| --- | --- | --- |
| FS3I.5.B.1 | Parolario | Italian basic vocabulary, analogous to Motschatz. Wahlfach in Bern, hence lower priority. |
| FS3I.5.D.1, FS3I.5.E.1 | — | Italian grammar and spelling, after Parolario. |
| NT.3.2 (kernel) | Elementkiste | element names ↔ symbols, Aggregatzustände; the model-understanding part stays a translated remainder documented in the PRD |

---

## Needs concept

Testable in principle; the named ingredient must exist first. Each
entry lists the blocker, not just the wish.

### Own authored texts (biggest lever: one text corpus serves many)

- **D.2.B.1, D.2.C.1** Leseverstehen Sach-/literarische Texte — needs a
  corpus of own short German texts per cycle with questions. No
  copyright issue if we write them ourselves; quality bar is high.
- **FS1F.2.x, FS2E.2.x, FS3I.2.x** reading comprehension — same
  approach with very simple FR/EN/IT texts.
- **D.6.B.1** literarische Texte — possible with public-domain texts
  (fables, Märchen); needs curation.

### Audio (self-hosted, user-initiated per sound rules)

- **D.1.A.1, D.1.B.1** Hören — needs recorded or synthesized German
  audio clips; storage and quality strategy undecided.
- **FS1F.1.x, FS2E.1.x, FS3I.1.x** Hörverstehen — same, per language.
- **FS1F.5.C.x, FS2E.5.C.x, FS3I.5.C.x** Aussprache — recognition
  variant (hear → pick spelling) feasible; speaking itself is not.
- **MU.2.A/B/C, MU.6.A/B** Musik hören/Musiklehre — visual note
  reading (staff → note name, note values) works without audio and
  could be a first slice; interval/rhythm hearing needs audio.

### Careful curation (facts exist, sensitivity or scope is the work)

- **NMG.1.3** Ernährung — food groups and Ernährungsscheibe; avoid
  moralising, keep to established basics.
- **NMG.2.1, NMG.2.2, NMG.2.3, NMG.2.5** Lebensräume, Lebensgrundlagen,
  Entwicklung (Metamorphose), Erdgeschichte — solid kernels
  (lifecycle of frog/butterfly, dinosaur eras) needing careful scoping.
- **NMG.3.1, NMG.3.2, NMG.3.3, NMG.3.4** Kräfte, Energie, Stoffe —
  everyday physics kernels (Hebel, Energieformen, Aggregatzustände).
- **NMG.4.1, NMG.4.2, NMG.4.3** Sinne, Akustik, Optik — five senses,
  loud/quiet, light and shadow.
- **NMG.5.1, NMG.5.2** Geräte, Magnetismus/Elektrizität — everyday
  technology, magnet attracts iron, simple circuits (Zyklus 1+2
  counterpart of NT.5.2).
- **NMG.6.3, NMG.6.4, NMG.6.5** Güterwege, Tausch, Konsum — production
  chains (Milch → Käse), money basics; overlaps WAH in Zyklus 3.
- **NMG.7.1–7.4** Lebensweisen hier und anderswo — factual kernels
  exist but stereotype risk is real; needs careful, respectful design.
- **NMG.8.1–8.4** Räume erkennen, nutzen, Veränderung, Darstellungen —
  kernels around Siedlungsformen, Flusslandschaften, Verkehrswege.
- **NMG.9.2, NMG.9.3** Dauer und Wandel, Geschichte rekonstruieren —
  then-vs-now comparisons, Quellenarten (Bild/Text/Sachquelle).
- **NMG.10.3, NMG.10.4, NMG.10.5** Institutionen, Macht und Recht,
  politische Prozesse — Zyklus-1/2 counterpart of Demokratielabor.
- **NMG.12.1–12.5, ERG.3.x, ERG.4.1–4.4** Religionskunde — Festtraditionen
  and Weltreligionen basics; extra care for neutral, respectful
  framing across traditions.
- **RZG.1.1–1.4, RZG.2.1–2.5, RZG.3.2, RZG.3.3, RZG.4.2, RZG.5.1–5.3,
  RZG.6.1–6.3, RZG.8.2, RZG.8.3** Geografie und Geschichte Zyklus 3 —
  climate zones, population, Swiss history timeline, human rights;
  each a solid knowledge kernel, each needs a curated fact table.
- **NT.2.1, NT.2.2, NT.3.1, NT.4.1, NT.4.2, NT.5.1, NT.6.1–6.3,
  NT.7.1–7.4, NT.8.1–8.3, NT.9.2** Naturwissenschaft Zyklus 3 —
  testable knowledge kernels (Trennverfahren, Energieformen, Auge/Ohr,
  Organe, Vererbungsgrundlagen); the untersuchen/experimentieren parts
  are translated remainders to document per PRD.
- **WAH.1.3, WAH.2.1, WAH.2.2, WAH.2.3, WAH.3.1–3.3, WAH.4.2, WAH.4.3,
  WAH.4.5, WAH.5.2** Wirtschaft, Konsum, Ernährung, Alltagsrecht —
  budget scenarios, Handelsketten, Verträge/Versicherungen basics.
- **BO.2.1** Bildungssystem — Lehre, Gymnasium, Fachmittelschule,
  Anschlüsse; small factual kernel of an otherwise personal process.
- **MI.1.2, MI.1.4** Medien entschlüsseln, sicher kommunizieren —
  advertising recognition, source checking, Netiquette; scenario
  design must stay honest (no invented "one right opinion").
- **BG.3.A.1** Kunstwerke betrachten — feasible with public-domain
  artworks; image curation is the work.

### New interaction needed

- **D.2.A.1** Grundfertigkeiten Lesen — fluency is inherently
  speed-related, which collides with the no-speed-pressure product
  rule; needs a concept that rewards accuracy at self-chosen pace
  (e.g. Blitzwörter with untimed reveal), or stays out.
- **D.4.A.1** Tastaturschreiben (the keyboard part of Grundfertigkeiten
  Schreiben) — a calm typing trainer is possible; handwriting is not.
- **D.5.C.1** Sprachformales untersuchen — Proben (verschieben,
  ersetzen, weglassen) as drag/tap sentence manipulation; needs a new
  task UI beyond mc/typed.

---

## Not app-testable — excluded with reasons

These stay Kompass-only. Reasons are structural, not priorities.

- **Producing and performing:** D.3 (Sprechen, 4), D.4.B–E
  (Schreibprozess, 4), D.6.A.1/A.2/C.1 (literarisch gestalten, 3),
  FS1F.3.x/4.x, FS2E.3.x/4.x, FS3I.3.x/4.x (Sprechen und Schreiben,
  9 per language), MU.1/3/4/5 (singen, bewegen,
  musizieren, gestalten, 12), BG.1/2 und BG.3.B (bildnerische Prozesse
  und Produkte, 11), TTG.1–3 (Design- und Technikprozess, Produkte,
  Kontexte, 16), BS.1–6 (Bewegung und Sport, 15).
- **Exploring and investigating in the real world:** NT.1.1, NT.9.1,
  RZG.3.1, RZG.4.3, RZG.7.1–7.3 (ausserschulische Lernorte,
  Zeitzeugen, Realraum, Feldarbeit).
- **Personal reflection and social process:** D.1.C.1/D.1.D.1,
  D.2.D.1, D.5.A.1/B.1, NMG.1.1/1.2/1.5/1.6, NMG.2.6, NMG.6.1/6.2,
  NMG.10.1/10.2, NMG.11.1–11.4, NMG.9.4, ERG.1.x/2.x/4.5/5.x,
  WAH.1.1/1.2/4.1/4.4/5.1, MI.1.1/1.3, BO.1.1/2.2/3.x/4.x,
  FS1F.5.A.x/B.2, FS2E.5.A.x/B.2, FS3I.5.A.x/B.2,
  NT.1.2/1.3, NT.3.3 (Haltungen, Strategien, eigene Projekte,
  Berufswahlprozess).
- **Mathematik B- und C-Aspekte:** MA.1.B.1–3, MA.1.C.1–2,
  MA.2.B.1–2, MA.2.C.1–4, MA.3.B.1–2, MA.3.C.1–3 (Erforschen und
  Argumentieren, Mathematisieren und Darstellen) — process
  competencies; a fixed answer key would fake them. Selected
  Sachaufgaben kernels from MA.3.C can instead become additional task
  kinds inside the existing math apps.
- **Fremdsprachen Kulturen (FSx.6.x)** — partly factual; the
  competencies are about encounter and reflection. Factual kernels can
  join the language apps as bonus Stufen content rather than own apps.

---

## Platform and family work

Infrastructure, quality, and process — independent of new apps.

1. **CI for the suites.** GitHub Actions workflow that runs every
   `<app>/tests/e2e.test.mjs` (and the cache-bust consistency check)
   on each PR. Today the suites run only locally; CI makes the
   passing-suite claim verifiable. Chromium via playwright container
   or apt; no npm publish needed.
2. **Commit the batch tooling** under `tools/app-vorlage/`:
   scaffold script, suite template + generator, support-file
   generator. Scripts only, no Lehrplan content (the grounding data
   stays out of the repo for copyright reasons — regenerate it locally
   with `tools/lehrplan-extraktion/`).
3. **Template maintenance process.** app.js/game.js/strings.js are
   deliberately copied per app (no build step). Document in the root
   CLAUDE.md: fixes to the shared template list the affected apps and
   patch all of them in one change (as done for the inputmode and
   `ci`-flag fixes).
4. **Kompass: coverage view.** Optional filter or badge count showing
   which competencies have a practice app ("18 von 363 mit
   Übungs-App"), keeping the registry and PRACTICE_APPS in sync.
5. **Lehrplan version watch.** When be.lehrplan.ch publishes a new
   Stand, re-extract, diff the Stufen, and update data plus version
   citations everywhere (currently Stand 01.08.2022).
6. **Accent balance.** Registry currently leans on amber/blue; keep
   picking accents per PRODUCT.md rule (avoid the accent of similar
   or recent apps).
7. **Content growth for shipped apps.** Motschatz/Wordschatz tiers,
   more pool entries for the knowledge apps, additional generated
   kinds (e.g. MA.3.C word-problem kernels into Masswerk/Wertepfad) —
   each with its oracle counterpart in the same change.
8. **A11y sweep per release.** Keyboard walk, focus states, contrast,
   reduced motion across all apps once per batch, not only per new app.
9.–11. **Merkheft: the family's explanation layer — SHIPPED with
    wave 1, waves remain.** The Merkheft app (merkheft/, amber) is
    the wiki-style reference surface: **one Merkblatt = one static
    HTML page** (`merkheft/<id>.html`; index.html is the grouped
    list — no router, no data.js), so each concept can grow
    independently from a few sentences to paragraphs, lists,
    formulas (plain HTML `sub`/`sup`, no math libraries) and an
    infographic, and edits touch exactly one file. Own-authored
    text under the sourcing rule in merkheft/PRD.md («Woher die
    Wahrheit kommt»: facts are free, wording is not; Wikipedia is
    CC BY-SA and used for fact cross-checks only; canonical
    textbook knowledge, two independent references per fact), an
    illustration or interactive visual in the DESIGN.md
    `illustration` style, mini facts, "Dazu üben" links and the
    supported competency codes. Every page prints as a light A4
    sheet via `@media print` (browser print dialog = PDF export).
    Wave 1 is live: Wasserkreislauf, Mondphasen, Schaltungen
    (interactive circuit), Gradnetz (rotatable globe), Sonnensystem
    (orbits). The four affected apps (Wetterwarte, Sternwarte,
    Stromkreis, Weltatlas) link `../merkheft/<id>.html` from the
    Stufe card and, after rounds with mistakes, from the done
    screen. The visuals spike folder is deleted; its decisions live
    in PRODUCT.md.

    Remaining:
    - **Wave 2 Merkblätter:** Blutkreislauf und Skelett
      (Körperatlas), Höhenkurven und Himmelsrichtungen (Nordpfeil),
      Ohmsches Gesetz (Stromkreis c), Konjugationstabellen
      (Motbau/Wordbau), ABC-Tabelle (Buchstabenleiter),
      Gewaltenteilung (Demokratielabor), Speichereinheiten
      (Rechnerraum), Massstab (Nordpfeil). Each lands with its
      app-side links and suite checks.
    - **Kompass → Merkheft links** next to "Üben mit …" for
      competencies with a Merkblatt.
    - **Deep-link to a Stufe** from "Dazu üben" (today it links to
      the app home).
12. **Merkblatt infographics: one printable A4 overview per
    concept.** Each Merkblatt grows a single dense overview graphic
    that explains the whole concept on one sheet (example brief: a
    unit-conversion flow poster with ml→l→hl steps, prefix ladder,
    and worked examples). Two candidate production paths:
    - *Token-styled SVG* (recommended first): hand-built inline SVG
      in the DESIGN.md illustration style, printed via the existing
      `@media print` path. On-brand, crisp at any size, editable in
      place, versionable in git, no new tooling, no style break with
      the rest of the family.
    - *AI-generated raster* (like the provided Masseinheiten
      example): richer, poster-like look, but breaks the family
      style, needs German-label proofreading (AI images misspell),
      and must be committed as a self-hosted PNG (no external
      requests) — acceptable as an extra download, not as the
      in-page visual.
    Either way the infographic lives in the Merkblatt page and
    prints with it; the raster path additionally needs an
    `<img>`-with-alt block and a file-size budget. Start with one
    pilot (Masseinheiten/Grössen for Masswerk plus a matching
    Merkblatt) before scaling.

## Definition of 100%

- Every **Ready** competency has a shipped app with a green suite.
- Every **Needs concept** competency either has a shipped app (once
  its ingredient exists) or a documented decision to leave it
  Kompass-only.
- Every **Not app-testable** competency stays covered by the Kompass
  with its exclusion reason recorded here.
- Platform items 1–5 and 9–12 done (9–11 count as done once the
  Merkheft app exists with wave 1 and the app-side links; 12 once
  every Merkblatt has its A4 infographic); 6–8 are standing
  practice.
