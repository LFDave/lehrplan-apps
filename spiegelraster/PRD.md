# PRD — Spiegelraster

Version: 1.0. Dieses Dokument ist die massgebende Spezifikation der App.
Verhalten und PRD werden immer in derselben Änderung angepasst.

## Zweck und Leitprinzip

Spiegelraster ist ein Übungsmodul der Lehrplan-Familie und folgt dem
Leitprinzip: **Eine App setzt genau eine Kompetenz des Lehrplans 21 um,
ihre Schwierigkeitsstufen sind die offiziellen Kompetenzstufen, ihre
Meilensteine die Grundansprüche.**

Umgesetzt ist MA.2.A.2 (Ausgabe Kanton Bern): Figuren und Körper
abbilden, zerlegen und zusammensetzen. Die zehn Stufen a bis j sind
die zehn offiziellen Kompetenzstufen dieser Kompetenz
(c = Grundanspruch Zyklus 1, f = Zyklus 2, i = Zyklus 3).

**Bewusste Übersetzung:** Zeichnen mit Geodreieck und Zirkel sowie
das Kippen realer Körper sind als Erkennen der entsprechenden
Abbildungen im Raster umgesetzt. Die App prüft das Verständnis der
Abbildung (Was ist ein Spiegelbild? Um wie viel Grad wurde gedreht?),
nicht die Zeichen- oder Bastelfertigkeit.

## Quelle

- Lehrplan 21, Ausgabe Kanton Bern (be.lehrplan.ch, Gesamtausgabe
  PDF), Kompetenzaufbau MA.2.A.2 inklusive Zyklusbänder und
  Grundanspruch-Markierung.
- Stufentitel und -beschreibungen sind kindgerechte Umschreibungen;
  der offizielle Code (MA.2.A.2.a bis .j) steht sichtbar an jeder
  Stufe.

## Figuren-Modell

Spielfiguren sind Zellmengen in einem Raster (Zelle = 20
SVG-Einheiten). Die vier Polyominos in `PIECES` (L4, P5, F5, Y5) sind
**chiral und ohne jede Dreh- oder Spiegelsymmetrie** — dadurch fallen
gespiegelt, gedreht und verschoben nie zusammen und jede
Auswahl-Aufgabe hat genau eine richtige Antwort. Diese Invariante ist
tragend: neue Figuren müssen sie erfüllen.

## Stufen und Aufgabenformen

- **a** (Z1): Muster aus Kreis, Dreieck und Quadrat fortsetzen
  (Periode 2 und 3).
- **b** (Z1): zählen, aus wie vielen Dreiecken eine Figur
  zusammengesetzt ist (Fächer und Streifen).
- **c** (Z1, GA): Symmetrie zur eingezeichneten Achse prüfen
  (Ja/Nein), Symmetrieachsen zählen, Bandornamente fortsetzen.
- **d** (Z2): Rechtecke im Raster vergrössern (Faktor 2 und 3),
  Vielecke von einer Ecke aus in Dreiecke zerlegen (n - 2).
- **e** (Z2): das richtige Spiegelbild unter drei Kandidaten finden
  (Ablenker: unverändertes Original, Punktspiegelung); prüfen, ob
  zwei Figuren Spiegelbilder sind.
- **f** (Z2, GA): erkennen, ob eine Figur gedreht, gespiegelt oder
  verschoben wurde (Original und Bild im selben Raster).
- **g** (Z2+Z3): Vergrösserungs-Faktor ablesen (Zellen werden
  f×f-Blöcke), Abbildungen erkennen.
- **h** (Z3): Drehwinkel bestimmen (90, 180, 270 Grad im
  Uhrzeigersinn).
- **i** (Z3, GA): Spiegelbild und Punktspiegelung (= Drehung um 180
  Grad) unter Kandidaten finden.
- **j** (Z3): Streckfaktoren aus Koordinaten berechnen, Koordinaten
  nach Anweisung verändern (y verdoppeln).

## Kernablauf, Eingabe, Gamification, Persistenz

Wie in der Familie üblich: Runden mit 8 Aufgaben, Auswahl-Aufgaben
werten beim Antippen, getippte Antworten prüfen sich bei erwarteter
Länge selbst und zusätzlich mit Enter.

- XP: gelöste Aufgaben plus Stufentiefe; Levels Rasterstarter 0,
  Spiegellehrling 25, Drehkünstler 90, Musterprofi 220,
  Spiegelmeister 500.
- Medaillen: Runden (1, 3, 8, 21, 55), Aufgaben (50, 200, 800),
  Grundanspruch Zyklus 1/2/3 (fehlerfreie Runde auf c/f/i), alle
  Stufen entdeckt.
- Stufenvorschlag nach 5 fehlerfreien Runden in Folge, nie erzwungen.
- `localStorage`-Schlüssel `spiegelraster.progress`; Reset im Footer
  mit Bestätigung. Keine externen Requests.

## Sprache und Gestaltung

Einsprachig Deutsch (Schweizer Standarddeutsch), Strings in
`strings.js`. Tokens aus DESIGN.md, Akzentfamilie **coral**, Atkinson
Hyperlegible selbst gehostet, Lucide-Icons inline; im Raster ist das
Original gefüllt (Akzent), Bild und Kandidaten sind umrandet, die
Spiegelachse gestrichelt. Cache-Busting `?v=1`.

## Tests

Playwright-Suite in `tests/e2e.test.mjs`: Generatoren mit gesätem
Zufall (500 Runden), geprüft gegen ein unabhängiges Orakel, das die
Zellen aus dem SVG-Markup liest und Spiegelung, Drehungen und
Verschiebung mit eigenen Transformationen nachrechnet (aus gen.js
werden nur die Generatoren selbst importiert); dazu die UI-Abläufe
(Runden auf den drei GA-Stufen, SVG-Rendering, Fehlerfluss,
Persistenz, Medaillen, Reset, Layout, Konsole, keine externen
Requests).
