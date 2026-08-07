# PRD — Merkheft

Version: 4.0. Dieses Dokument ist die massgebende Spezifikation der App.
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

## Inhalte und Abdeckung

Seit Welle 3 gilt volle Abdeckung: **Jede Stufe jeder Übungs-App
verlinkt genau ein Merkblatt**, und jedes Merkblatt verlinkt unter
«Dazu üben» alle Stufen, die es stützt. Es gibt 94 Merkblätter
in 16 Themengruppen; jedes trägt eine eigene Infografik oder ein
interaktives Modell. Die kanonische Liste (Titel, Gruppe, Links,
Codes) ist unabhängig festgehalten in `tests/e2e.test.mjs`
(BLAETTER); die Gruppen sind:

- **Zahlen und Rechnen:** Der Zahlenstrahl, Die Stellenwerttafel, Die Rechenwörter, Plus und minus im Kopf, Das Einmaleins, Schriftlich rechnen, Geschickt rechnen, Rechnen mit Dezimalzahlen, Brüche, Dezimalzahlen, Prozente, Prozente berechnen, Runden und Überschlagen, Teilbarkeit und Primzahlen, Punkt vor Strich, Potenzen und Wurzeln, Gleichungen lösen
- **Grössen und Masse:** Das Geld, Die Uhr, Längen messen, Masseinheiten, Referenzgrössen, Flächen- und Raummasse, Die SI-Vorsätze, Die Geschwindigkeit
- **Form und Raum:** Formen und Körper, Die Lagewörter, Die Vierecke, Kreis und Geraden, Das Koordinatensystem, Symmetrie und Muster, Drehen, Spiegeln, Verschieben, Umfang und Fläche, Flächen- und Volumenformeln, Der Satz des Pythagoras, Die Winkel
- **Daten und Funktionen:** Diagramme und Mittelwert, Sicher oder unmöglich, Zahlenfolgen, Proportional rechnen, Funktionen und Graphen
- **Deutsch:** Die ABC-Tabelle, Satzanfang und Satzzeichen, Die Rechtschreib-Regeln, Die Wortarten, Die Zeitformen, Satzglieder und Fälle
- **Französisch:** Französisch: die ersten Wörter, Französisch: Sätze bauen, Französisch: richtig schreiben, Französische Verben: être und avoir
- **Englisch:** Englisch: die ersten Wörter, Englisch: Sätze bauen, Englische Verben: to be und to have, Englisch: richtig schreiben
- **Mensch und Körper:** Das Skelett, Der Blutkreislauf, Die Organe, Die fünf Sinne, Gesund bleiben
- **Tiere und Pflanzen:** Die Tiergruppen, Unsere Bäume, Lebensräume, Bestimmen Schritt für Schritt
- **Wetter und Natur:** Der Wasserkreislauf, Wetter beobachten und messen, Der Wetterbericht, Naturgefahren
- **Natur und Technik:** Serie- und Parallelschaltung, Das Ohmsche Gesetz, Wirkungen des Stroms
- **Informatik:** Speichereinheiten, Daten ordnen, Codes und Geheimschriften, Dateien: Text, Bild, Ton, Suchen mit und, oder, nicht, Die Programm-Bausteine, Schritt für Schritt, Daten schützen und sichern, Die Teile des Computers, Den Computer bedienen
- **Himmel und Weltall:** Tag und Nacht, Die Mondphasen, Das Sonnensystem
- **Zeit und Geschichte:** Der Kalender, Zeitstrahl und Epochen
- **Raum und Erde:** Das Gradnetz der Erde, Die Himmelsrichtungen, Der Massstab, Höhenkurven, Kartenzeichen und Pläne, Sicher unterwegs, Kontinente und Ozeane
- **Zusammenleben:** Die Gewaltenteilung, Abstimmen und Wählen, Eine Meinung begründen

Welle 1 brachte die ersten neun Blätter mit drei interaktiven
Modellen (Stromkreis, Globus, Orbits) und dem Infografik-Piloten
Masseinheiten, Welle 2 elf weitere Blätter, Welle 3 die restlichen
74 für die volle Abdeckung.

Bewegung ist transform/opacity, startet erst auf Klick und
respektiert reduzierte Bewegung.

## Infografiken

Ein Merkblatt kann eine Übersichts-Infografik tragen: ein dichtes
Inline-SVG, das das ganze Konzept auf einem Blatt zeigt (Pilot:
Masseinheiten mit Einheitentreppen, Umrechnungsregel, Zeit-Warnung
und Beispielen). Infografiken sind token-gestylte SVGs über die
`.ig-*`-Klassen in styles.css; jede Klasse hat im `@media print`
Block ein helles Gegenstück, damit die Grafik auf dem A4-Ausdruck
hell und kontrastreich erscheint. Kein Raster, keine externen
Bilder; die Grafik ist eigene Zeichnung nach den
illustration-Tokens aus DESIGN.md.

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
  Stufenkarte einen klar erkennbaren Link «Merkblatt: …» (Chip mit
  Buch-Symbol und unterstrichenem Text) und nach einer Runde mit
  Fehlern auf dem Abschlussbildschirm «Zum Nachlesen: …», beide auf
  `../merkheft/<id>.html`. Beide Links sind optional und nie eine
  Bedingung.
- **Merkheft → Apps:** «Dazu üben» springt per Deep-Link direkt in
  die Stufe (`?stufe=<id>`). Gemischte offizielle Stufen sind in der
  App in themenreine Teilstufen gesplittet (Masswerk b-geld, b-zeit,
  d-geld, d-zeit), darum braucht es keinen Themen-Parameter, und die
  App entfernt die Query nach dem Einstieg aus der Adresse (Beispiel
  Uhr: zwei Links auf Masswerk b «Halbe Stunden» und d «Zeitdauern»).
  Dargestellt als klar erkennbarer Link-Chip mit Stift-Symbol und
  unterstrichenem App-Namen; die Meta-Zeile nennt Stufe und Thema.

## Persistenz und Privatsphäre

Keine. Das Merkheft speichert nichts, fragt nichts und lädt nichts
von aussen.

## Sprache und Gestaltung

Einsprachig Deutsch (Schweizer Standarddeutsch). Tokens aus
DESIGN.md, Akzentfamilie **amber**, Atkinson Hyperlegible selbst
gehostet, Illustrationen als Inline-SVG mit `role="img"` und
deutschem `aria-label`, Cache-Busting `?v=6`.

## Tests

Playwright-Suite in `tests/e2e.test.mjs` mit unabhängig
festgehaltenen Erwartungen (Liste der Merkblätter, Gruppen, Links,
Codes): Cache-Busting-Konsistenz, eine Datei pro Merkblatt mit
gültigen App-Zielen und ohne ß, die Liste mit allen Links, jede
Seite mit Titel, Gruppe, Bild und «Dazu üben», die Interaktivität
(alle Stromkreis-Zustände, Globus-Drehung, Orbit-Start nur auf
Klick), Zurück-Navigation, Druckdarstellung (heller Hintergrund,
ausgeblendete Bedienelemente, Abschnitte ohne Seitenumbruch
mittendrin), Layout bei 320px, Konsole ohne Fehler, keine externen
Requests. Die Suiten aller 31 Übungs-Apps prüfen, dass jede Stufenkarte
ihren Merkblatt-Link trägt, und den Deep-Link-Einstieg.
