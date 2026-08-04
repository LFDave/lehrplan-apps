# PRD — Formenreich

Version: 1.0. Dieses Dokument ist die massgebende Spezifikation der App.
Verhalten und PRD werden immer in derselben Änderung angepasst.

## Zweck und Leitprinzip

Formenreich ist ein Übungsmodul der Lehrplan-Familie und folgt dem
Leitprinzip: **Eine App setzt genau eine Kompetenz des Lehrplans 21 um,
ihre Schwierigkeitsstufen sind die offiziellen Kompetenzstufen, ihre
Meilensteine die Grundansprüche.**

Umgesetzt ist MA.2.A.1 (Ausgabe Kanton Bern): Begriffe und Symbole zu
Form und Raum verstehen und verwenden. Die zwölf Stufen a bis l sind
die zwölf offiziellen Kompetenzstufen dieser Kompetenz
(c = Grundanspruch Zyklus 1, g = Zyklus 2, k = Zyklus 3).

**Bewusste Übersetzung:** Zeichnen- und Beschriften-Anteile des
Lehrplans sind als Erkennen und Benennen von SVG-Figuren umgesetzt.
Die App prüft, ob ein Kind Formen, Körper und Fachbegriffe kennt,
nicht die Zeichenfertigkeit.

## Quelle

- Lehrplan 21, Ausgabe Kanton Bern (be.lehrplan.ch, Gesamtausgabe
  PDF), Kompetenzaufbau MA.2.A.1 inklusive Zyklusbänder und
  Grundanspruch-Markierung.
- Stufentitel und -beschreibungen sind kindgerechte Umschreibungen;
  der offizielle Code (MA.2.A.1.a bis .l) steht sichtbar an jeder
  Stufe.

## Stufen und Aufgabenformen

Die SVG-Figurenbibliothek lebt in `SHAPES` (gen.js) mit einem
dokumentierten Signatur-Kontrakt (Kreis = 1 circle, Kugel = circle +
ellipse, Würfel/Quader = 2 rects + 4 Linien, Zylinder = 2 ellipses +
2 Linien, Kegel = ellipse + polygon, Pyramide = 2 polygons, Prisma =
2 polygons + 3 Linien, Vielecke = 1 polygon); Begriff-Tabellen in
`FR_QA`:

- **a** (Z1): Kreis, Dreieck, Quadrat, Rechteck, Würfel und Kugel am
  Bild erkennen.
- **b** (Z1): Strecken vergleichen (am längsten, am kürzesten).
- **c** (Z1, GA): Raumlagen: Punkt über/unter/links/rechts/in der
  Mitte eines Quadrats (SVG) plus Begriffe wie innerhalb und
  ausserhalb.
- **d** (Z1+Z2): Figur oder Körper, spiegeln und verschieben,
  Länge/Breite/Fläche.
- **e** (Z2): Ecken, Kanten und Seitenflächen von Würfel und Quader
  zählen (Fakten-Tabelle).
- **f** (Z2): Würfel, Quader, Kugel, Zylinder und Pyramide am Bild
  erkennen.
- **g** (Z2, GA): Radius, Durchmesser, Schnittpunkt, rechter Winkel,
  Umfang, Diagonale; parallele, senkrechte und schräge Geraden am
  Bild erkennen.
- **h** (Z2+Z3): Punkte im Koordinatenraster finden (Nullpunkt unten
  links, im Aufgabentext erklärt), Auf-, Vorder- und Seitenansicht.
- **i** (Z3): Parallelogramm, Trapez, Rhombus und Drachenviereck am
  Bild erkennen; Dreiecksarten benennen.
- **j** (Z3): Vierecke nach Winkeln, Seiten und Parallelität
  charakterisieren; x- und y-Achse.
- **k** (Z3, GA): Kegel, Prisma, Pyramide und Zylinder am Bild
  erkennen; kongruent, Basis, Kongruenzabbildung.
- **l** (Z3): Hypotenuse, Katheten, Tangente, Sehne, Kreissektor;
  Tetraeder-Fakten.

## Kernablauf, Eingabe, Gamification, Persistenz

Wie in der Familie üblich: Runden mit 8 Aufgaben, Auswahl-Aufgaben
werten beim Antippen, getippte Antworten prüfen sich bei erwarteter
Länge selbst und zusätzlich mit Enter.

- XP: gelöste Aufgaben plus Stufentiefe; Levels Formenspäher 0,
  Eckenzähler 25, Formenkenner 90, Körperprofi 220, Formenmeister 500.
- Medaillen: Runden (1, 3, 8, 21, 55), Aufgaben (50, 200, 800),
  Grundanspruch Zyklus 1/2/3 (fehlerfreie Runde auf c/g/k), alle
  Stufen entdeckt.
- Stufenvorschlag nach 5 fehlerfreien Runden in Folge, nie erzwungen.
- `localStorage`-Schlüssel `formenreich.progress`; Reset im Footer
  mit Bestätigung. Keine externen Requests.

## Sprache und Gestaltung

Einsprachig Deutsch (Schweizer Standarddeutsch), Strings in
`strings.js`. Tokens aus DESIGN.md, Akzentfamilie **violet**,
Atkinson Hyperlegible selbst gehostet, Lucide-Icons inline,
SVG-Figuren nutzen die Farb-Tokens über CSS-Klassen, Cache-Busting
`?v=1`.

## Tests

Playwright-Suite in `tests/e2e.test.mjs`: Generatoren mit gesätem
Zufall (600 Runden), geprüft gegen ein unabhängiges Geometrie-Orakel,
das jede Figur allein aus dem Markup klassifiziert (Element-
Signaturen, parallele Seitenpaare, Seitenlängen, Punkt- und
Linien-Koordinaten) — es kennt die Generator-Schlüssel nicht; dazu
die UI-Abläufe (Runden auf den drei GA-Stufen, SVG-Rendering,
Fehlerfluss, Persistenz, Medaillen, Reset, Layout, Konsole, keine
externen Requests).
