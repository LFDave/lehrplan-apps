# PRD — Figurenmass

Version: 1.0. Dieses Dokument ist die massgebende Spezifikation der App.
Verhalten und PRD werden immer in derselben Änderung angepasst.

## Zweck und Leitprinzip

Figurenmass ist ein Übungsmodul der Lehrplan-Familie und folgt dem
Leitprinzip: **Eine App setzt genau eine Kompetenz des Lehrplans 21 um,
ihre Schwierigkeitsstufen sind die offiziellen Kompetenzstufen, ihre
Meilensteine die Grundansprüche.**

Umgesetzt ist MA.2.A.3 (Ausgabe Kanton Bern): Längen, Flächen und
Volumen vergleichen, messen und berechnen. Die elf Stufen a bis k sind
die elf offiziellen Kompetenzstufen dieser Kompetenz
(b = Grundanspruch Zyklus 1, e = Zyklus 2, i = Zyklus 3).

**Bewusste Übersetzung:** Messen mit echten Gegenständen ist als
Messen am Bildschirm-Raster umgesetzt. SVG-Figuren zeigen Strecken
über einem Zentimeter-Raster, Einheitsquadrate und gefärbte Zellen
zum Abzählen; die Berechnungs-Stufen nennen alle Masse im
Aufgabentext. Der Kreis rechnet mit π ≈ 3.14, die Pyramide nennt die
Formel im Aufgabentext.

## Quelle

- Lehrplan 21, Ausgabe Kanton Bern (be.lehrplan.ch, Gesamtausgabe
  PDF), Kompetenzaufbau MA.2.A.3 inklusive Zyklusbänder und
  Grundanspruch-Markierung.
- Stufentitel und -beschreibungen sind kindgerechte Umschreibungen;
  der offizielle Code (MA.2.A.3.a bis .k) steht sichtbar an jeder
  Stufe.

## Stufen und Aufgabenformen

Alle Generatoren leben in `gen.js`; die SVG-Bausteine (`rasterLineSvg`,
`cellRectSvg`, `filledCellsSvg`, `pathsSvg`, Zelle = 20 Einheiten)
werden als Markup-Strings erzeugt und im Aufgabenbereich als
`task.svg` gerendert:

- **a** (Z1): Wege auf dem Raster vergleichen (zwei Polylinien,
  Auswahl), Konstanz von Länge/Menge (gebogener Draht,
  umgeschüttetes Wasser; Auswahl).
- **b** (Z1, GA): Strecken über dem Raster auf 1 cm genau ablesen
  (SVG), Gefässe mit dem Becher füllen.
- **c** (Z1+Z2): Rechtecke (a auf b Quadrate) und Würfelbauten
  vergleichen (Auswahl).
- **d** (Z2): Einheitsquadrate eines Rechtecks auszählen (SVG).
- **e** (Z2, GA): Umfang und Fläche von Rechtecken und Quadraten,
  Würfel in Quadern zählen.
- **f** (Z2+Z3): Quader-Volumen, gefärbte Quadrate in unregelmässigen
  Figuren zählen (SVG).
- **g** (Z3): Dreiecksflächen (g · h : 2), Kantenlängen und
  Oberfläche von Quadern.
- **h** (Z3): Satz des Pythagoras mit pythagoreischen Tripeln
  (Hypotenuse und Kathete).
- **i** (Z3, GA): Kreisumfang und -fläche mit π ≈ 3.14
  (Wertetabelle mit sauberen Ergebnissen), Volumen von Prismen und
  Zylindern aus Grundfläche und Höhe.
- **j** (Z3): Pyramiden-Volumen (Formel im Text), Winkelsumme im
  Dreieck, Satz von Thales (Auswahl).
- **k** (Z3): Ähnlichkeit: Längen mal f, Flächen mal f², Volumen
  mal f³.

## Kernablauf, Eingabe, Gamification, Persistenz

Wie in der Familie üblich: Runden mit 8 Aufgaben, getippte Antworten
prüfen sich bei erwarteter Länge selbst und zusätzlich mit Enter.

- XP: gelöste Aufgaben plus Stufentiefe; Levels Formenzähler 0,
  Umfangkenner 25, Flächenprofi 90, Volumenmeister 220,
  Geometrieweise 500.
- Medaillen: Runden (1, 3, 8, 21, 55), Aufgaben (50, 200, 800),
  Grundanspruch Zyklus 1/2/3 (fehlerfreie Runde auf b/e/i), alle
  Stufen entdeckt.
- Stufenvorschlag nach 5 fehlerfreien Runden in Folge, nie erzwungen.
- `localStorage`-Schlüssel `figurenmass.progress`; Reset im Footer
  mit Bestätigung. Keine externen Requests.

## Sprache und Gestaltung

Einsprachig Deutsch (Schweizer Standarddeutsch), Strings in
`strings.js`. Tokens aus DESIGN.md, Akzentfamilie **blue**, Atkinson
Hyperlegible selbst gehostet, Lucide-Icons inline, SVG-Figuren nutzen
die Farb-Tokens über CSS-Klassen, Cache-Busting `?v=1`.

## Tests

Playwright-Suite in `tests/e2e.test.mjs`: Generatoren mit gesätem
Zufall (550 Runden), geprüft gegen ein unabhängiges Orakel, das
SVG-Aufgaben direkt aus dem Markup nachmisst (Strecken-Koordinaten,
Zellen zählen, Manhattan-Länge von Polylinien) und Text-Aufgaben mit
eigenen Formeln nachrechnet; dazu die UI-Abläufe (Runden auf den drei
GA-Stufen, SVG-Rendering, Fehlerfluss, Persistenz, Medaillen, Reset,
Layout, Konsole, keine externen Requests).
