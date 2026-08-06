# PRD — Merkheft

Version: 2.0. Dieses Dokument ist die massgebende Spezifikation der App.
Verhalten und PRD werden immer in derselben Änderung angepasst.

## Zweck und Leitprinzip

Das Merkheft ist das Nachschlagewerk der Lehrplan-Familie: **Erklären
und Üben sind getrennte Oberflächen.** Die Übungs-Apps testen und
trainieren Wissen; das Merkheft erklärt die Konzepte davor und danach.
Ein Merkblatt pro Konzept, mit eigenem, kindgerechtem Text, einer
Illustration oder einem interaktiven Modell im illustration-Stil aus
DESIGN.md, kleinen Fakten («Kurz gemerkt»), «Dazu üben»-Links und den
offiziellen Lehrplan-21-Codes, die das Konzept stützt.

Kein Quiz, keine Gamification, kein localStorage: reines Lesen.

## Architektur: eine HTML-Seite pro Merkblatt

Jedes Merkblatt ist eine eigene statische Seite
(`wasserkreislauf.html`, `mondphasen.html`, …), `index.html` ist die
gruppierte Liste. Kein Router, kein data.js: der Inhalt eines
Merkblatts steht vollständig in seiner Datei und kann dort wachsen,
ohne andere Merkblätter zu berühren. Ein Merkblatt darf sich von
wenigen Sätzen zu mehreren Absätzen, Aufzählungen, Formeln und einer
Infografik entwickeln.

- **Formeln:** einfaches HTML (`<sub>`, `<sup>`, ×, ÷, gestylte
  Spans). Keine Mathematik-Bibliotheken (kein KaTeX, kein MathJax);
  Schulstoff braucht sie nicht.
- **Statische Bilder** stehen als Inline-SVG direkt in der Seite.
  Interaktive Modelle (Stromkreis, Globus, Orbits) haben ihr Markup
  in der Seite und laden `illustrations.js`, das über
  `init('<id>', document)` nur die Interaktivität verdrahtet.
- **Drucken:** jedes Merkblatt ist über `@media print` in styles.css
  direkt als helles A4-Blatt druckbar (Navigation und
  Bedienelemente ausgeblendet). Der Browser-Druckdialog ist der
  Export nach PDF; es gibt keinen eigenen Export-Knopf.

## Inhalte (Welle 1)

- Wasserkreislauf (NMG.4.4.1g, Wetterwarte)
- Mondphasen (NMG.4.5.d, Sternwarte)
- Serie- und Parallelschaltung, interaktiv (NT.5.2.b, Stromkreis)
- Gradnetz mit drehbarem Globus (RZG.4.1.c, Weltatlas)
- Sonnensystem mit Orbit-Modell (NMG.4.5.e, Sternwarte)

Bewegung ist transform/opacity, startet erst auf Klick und
respektiert reduzierte Bewegung.

## Woher die Wahrheit kommt (Quellenregel)

Fakten sind urheberrechtsfrei; geschützt ist nur die konkrete
sprachliche Form. Daraus folgt die Regel für jedes Merkblatt:

1. **Eigene Formulierung, immer.** Kein Satz wird aus einer Quelle
   übernommen, auch nicht umgestellt. Wikipedia-Text steht unter
   CC BY-SA 4.0 (Namensnennung und Share-Alike wären Pflicht und
   würden auf das Repo abfärben); darum dient Wikipedia nur zum
   Gegenprüfen von Fakten, nie als Textquelle.
2. **Nur kanonisches Schulwissen.** Ein Merkblatt enthält nur
   Aussagen, die in jedem Schulbuch gleich stehen (der Mond umkreist
   die Erde in rund 29,5 Tagen von Neumond zu Neumond; U = R × I).
   Solches Wissen ist Allgemeingut ohne Schöpfungshöhe.
3. **Zwei unabhängige Prüfungen.** Jede Zahl und jede Aussage wird
   gegen mindestens zwei unabhängige Referenzen geprüft. Was
   unsicher bleibt, kommt nicht ins Merkblatt. Das ist dieselbe
   Messlatte wie bei den Übungs-Apps, deren Test-Orakel die Fakten
   unabhängig noch einmal feststellen.
4. **Kein Lehrplan-Text.** Die Codes werden genannt, der amtliche
   Wortlaut nie übernommen.

## Navigation und Verbindungen

- `index.html` listet alle Merkblätter gruppiert nach Themen; jede
  Merkblatt-Seite hat einen Zurück-Link zur Liste.
- **Apps → Merkheft:** Stufen mit Merkblatt tragen in ihrer
  `data.js` ein `merkblatt: { id, name }`. Die App zeigt auf der
  Stufenkarte einen ruhigen Link «Merkblatt: …» und nach einer Runde
  mit Fehlern auf dem Abschlussbildschirm «Zum Nachlesen: …», beide
  auf `../merkheft/<id>.html`. Beide Links sind optional und nie
  eine Bedingung.
- **Merkheft → Apps:** «Dazu üben» verlinkt die App-Startseite und
  nennt die Stufe.

## Persistenz und Privatsphäre

Keine. Das Merkheft speichert nichts, fragt nichts und lädt nichts
von aussen.

## Sprache und Gestaltung

Einsprachig Deutsch (Schweizer Standarddeutsch). Tokens aus
DESIGN.md, Akzentfamilie **amber**, Atkinson Hyperlegible selbst
gehostet, Illustrationen als Inline-SVG mit `role="img"` und
deutschem `aria-label`, Cache-Busting `?v=1`.

## Tests

Playwright-Suite in `tests/e2e.test.mjs` mit unabhängig
festgehaltenen Erwartungen (Liste der Merkblätter, Gruppen, Links,
Codes): Cache-Busting-Konsistenz, eine Datei pro Merkblatt mit
gültigen App-Zielen und ohne ß, die Liste mit allen Links, jede
Seite mit Titel, Gruppe, Bild und «Dazu üben», die Interaktivität
(alle Stromkreis-Zustände, Globus-Drehung, Orbit-Start nur auf
Klick), Zurück-Navigation, Druckdarstellung (heller Hintergrund,
ausgeblendete Bedienelemente), Layout bei 320px, Konsole ohne
Fehler, keine externen Requests. Die Suiten der vier verlinkenden
Apps prüfen die Merkblatt-Links auf den Stufenkarten.
