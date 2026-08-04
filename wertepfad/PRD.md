# PRD — Wertepfad

Version: 1.0. Dieses Dokument ist die massgebende Spezifikation der App.
Verhalten und PRD werden immer in derselben Änderung angepasst.

## Zweck und Leitprinzip

Wertepfad ist ein Übungsmodul der Lehrplan-Familie und folgt dem
Leitprinzip: **Eine App setzt genau eine Kompetenz des Lehrplans 21 um,
ihre Schwierigkeitsstufen sind die offiziellen Kompetenzstufen, ihre
Meilensteine die Grundansprüche.**

Umgesetzt ist MA.3.A.3 (Ausgabe Kanton Bern): Zahlenfolgen und
Wertetabellen beschreiben und weiterführen, proportionale und
funktionale Zusammenhänge nutzen. Die elf Stufen a bis k sind die elf
offiziellen Kompetenzstufen dieser Kompetenz, mit ihren Zyklen und
den Grundanspruch-Markierungen (b = Grundanspruch Zyklus 1,
e = Zyklus 2, i = Zyklus 3).

**Bewusste Übersetzung:** Zeichnen-Anteile des Lehrplans (Wertepaare
und Funktionsgraphen einzeichnen) sind als Berechnen von
Funktionswerten und Kenngrössen umgesetzt. Die App prüft das
Verständnis des Zusammenhangs, nicht die Zeichnung.

## Quelle

- Lehrplan 21, Ausgabe Kanton Bern (be.lehrplan.ch, Gesamtausgabe
  PDF), Kompetenzaufbau MA.3.A.3 inklusive Zyklusbänder und
  Grundanspruch-Markierung.
- Stufentitel und -beschreibungen sind kindgerechte Umschreibungen,
  keine Originaltexte; der offizielle Code (MA.3.A.3.a bis .k) steht
  sichtbar an jeder Stufe.

## Stufen und Aufgabenformen

Alle Generatoren leben in `gen.js`; die Aufgabenformen stammen direkt
aus den Beispielen der Stufentexte:

- **a** (Z1): einfache Wertetabellen (1 Flasche → 2 Fr.).
- **b** (Z1, GA): lineare Zahlenfolgen (0, 9, 18, 27, ...), auch
  rückwärts, und lineare Wertetabellen.
- **c** (Z2): Quadratzahlen-, Dreieckszahlen- und fallende Folgen mit
  wachsender Differenz (90, 81, 70, 57, ...).
- **d** (Z2): Preistabellen mit Franken und Rappen
  (100 g → 5.40 Fr.).
- **e** (Z2, GA): proportional rechnen: Preis pro Kilo,
  Geschwindigkeit und Zeit, Verbrauch pro 100 km.
- **f** (Z2+Z3): Anteile in Prozent bestimmen und vergleichen
  (Auswahl "Wo ist der Anteil grösser?").
- **g** (Z3): indirekte Proportionalität (Karten je Person,
  Arbeiter und Tage), Prozentwerte berechnen.
- **h** (Z3): Funktionswerte aus der Gleichung, Strecken aus dem
  Massstab (Tabelle mit ganzzahligen Antworten).
- **i** (Z3, GA): Funktionswerte aus Gleichung und Wertetabelle,
  Steigung in Prozent, Jahreszins.
- **j** (Z3): Schnittpunkt zweier Geraden (x-Wert, ganzzahlig
  konstruiert).
- **k** (Z3): Steigung, y-Achsenabschnitt und Nullstelle ablesen
  beziehungsweise berechnen.

## Kernablauf, Eingabe, Gamification, Persistenz

Wie in der Familie üblich: Runden mit 8 Aufgaben, getippte Antworten
prüfen sich bei erwarteter Länge selbst und zusätzlich mit Enter
(numerischer Vergleich; Geldbeträge im Zwei-Dezimal-Format, "16.2"
zählt wie "16.20").

- XP: gelöste Aufgaben plus Stufentiefe; Levels Pfadstarter 0,
  Spurenleser 25, Wertefinder 90, Musterkenner 220, Pfadmeister 500.
- Medaillen: Runden (1, 3, 8, 21, 55), Aufgaben (50, 200, 800),
  Grundanspruch Zyklus 1/2/3 (fehlerfreie Runde auf b/e/i), alle
  Stufen entdeckt.
- Stufenvorschlag nach 5 fehlerfreien Runden in Folge, nie erzwungen.
- `localStorage`-Schlüssel `wertepfad.progress`; Reset im Footer mit
  Bestätigung. Keine externen Requests.

## Sprache und Gestaltung

Einsprachig Deutsch (Schweizer Standarddeutsch), Strings in
`strings.js`. Tokens aus DESIGN.md, Akzentfamilie **blue**, Atkinson
Hyperlegible selbst gehostet, Lucide-Icons inline, Cache-Busting
`?v=1`.

## Tests

Playwright-Suite in `tests/e2e.test.mjs`: Generatoren mit gesätem
Zufall (550 Runden), geprüft gegen ein unabhängiges Orakel — der
Folgen-Löser erkennt Folgen generisch über erste und zweite
Differenzen, ohne die Generator-Formeln zu kennen; dazu die
UI-Abläufe (Runden auf den drei GA-Stufen, Fehlerfluss, Persistenz,
Medaillen, Reset, Layout, Konsole, keine externen Requests).
