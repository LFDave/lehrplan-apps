# PRD — Grössenwissen

Version: 1.0. Dieses Dokument ist die massgebende Spezifikation der App.
Verhalten und PRD werden immer in derselben Änderung angepasst.

## Zweck und Leitprinzip

Grössenwissen ist ein Übungsmodul der Lehrplan-Familie und folgt dem
Leitprinzip: **Eine App setzt genau eine Kompetenz des Lehrplans 21 um,
ihre Schwierigkeitsstufen sind die offiziellen Kompetenzstufen, ihre
Meilensteine die Grundansprüche.**

Umgesetzt ist MA.3.A.1 (Ausgabe Kanton Bern): Begriffe und Symbole zu
Grössen, Funktionen, Daten und Zufall verstehen und verwenden, sich an
Referenzgrössen orientieren, Masseinheiten und Vorsätze kennen. Die
zwölf Stufen a bis l sind die zwölf offiziellen Kompetenzstufen dieser
Kompetenz (c = Grundanspruch Zyklus 1, h = Zyklus 2, l = Zyklus 3).

Das Rechnen mit Grössen gehört zur Schwester-Kompetenz MA.3.A.2
(Masswerk); Grössenwissen bleibt bewusst auf der Ebene des Benennens,
der Referenzen und der einfachen Faktenwissen-Umrechnungen
("1 kg = ? g").

## Quelle

- Lehrplan 21, Ausgabe Kanton Bern (be.lehrplan.ch, Gesamtausgabe
  PDF), Kompetenzaufbau MA.3.A.1 inklusive Zyklusbänder und
  Grundanspruch-Markierung.
- Stufentitel und -beschreibungen sind kindgerechte Umschreibungen;
  der offizielle Code (MA.3.A.1.a bis .l) steht sichtbar an jeder
  Stufe. Das Münz- und Notensortiment entspricht dem echten Schweizer
  Bargeld.

## Stufen und Aufgabenformen

Frage-Tabellen leben in `GW_QA`, Einheiten-Fakten in `UNIT_FACTS`
(beide in `gen.js`):

- **a** (Z1): Gegenteile (schwer/leicht, lang/kurz, ...).
- **b** (Z1): echte Münzen und Noten erkennen, Steigerungsformen
  (B ist schwerer als A, C schwerer als B → C am schwersten).
- **c** (Z1, GA): Einheiten und Abkürzungen für Länge, Zeit und Geld;
  1 m = 100 cm, 1 Fr. = 100 Rp., 1 h = 60 min.
- **d** (Z1+Z2): Beträge bis 100 Fr. mit Noten und Münzen legen.
- **e** (Z2): Referenzgrössen (1 kg ≈ Packung Mehl), km/dm/mm, l/dl,
  kg/g.
- **f** (Z2): Vorsätze Kilo/Dezi/Centi/Milli, cl/ml, t, mg, Sekunden.
- **g** (Z2): sicher, möglich, unmöglich einordnen.
- **h** (Z2, GA): Kreis-/Säulen-/Liniendiagramm, Häufigkeit,
  Flächenmasse (auch km²), kB und Byte, Tag = 24 h, Mittelwert.
- **i** (Z2+Z3): m³/dm³/cm³ und Liter, Mega/Giga/Tera.
- **j** (Z3): Währungen (CHF, €, $, £), Hektare und Are.
- **k** (Z3): relative Häufigkeit in Prozent, km/h und kB/s,
  x- und y-Achse.
- **l** (Z3, GA): Zins, Zinssatz, Kapital, Brutto/Netto, Rabatt
  berechnen, Mikro und Nano, Dichte-Einheit.

## Kernablauf, Eingabe, Gamification, Persistenz

Wie in der Familie üblich: Runden mit 8 Aufgaben (Duplikat-Schutz
ignoriert die Options-Reihenfolge), Auswahl-Aufgaben werten beim
Antippen, getippte Antworten prüfen sich bei erwarteter Länge selbst
und zusätzlich mit Enter.

- XP: gelöste Aufgaben plus Stufentiefe; Levels Grössenlehrling 0,
  Einheitenkenner 25, Referenzprofi 90, Grössenmeister 220,
  Grössenweise 500.
- Medaillen: Runden (1, 3, 8, 21, 55), Aufgaben (50, 200, 800),
  Grundanspruch Zyklus 1/2/3 (fehlerfreie Runde auf c/h/l), alle
  Stufen entdeckt.
- Stufenvorschlag nach 5 fehlerfreien Runden in Folge, nie erzwungen.
- `localStorage`-Schlüssel `groessenwissen.progress`; Reset im Footer
  mit Bestätigung. Keine externen Requests.

## Sprache und Gestaltung

Einsprachig Deutsch (Schweizer Standarddeutsch), Strings in
`strings.js`. Tokens aus DESIGN.md, Akzentfamilie **amber**, Atkinson
Hyperlegible selbst gehostet, Lucide-Icons inline, Cache-Busting
`?v=1`.

## Tests

Playwright-Suite in `tests/e2e.test.mjs`: Generatoren mit gesätem
Zufall (600 Runden, inklusive Prüfung, dass jede Runde 8 Aufgaben
findet), geprüft gegen ein unabhängiges Orakel mit eigener
Umrechnungstabelle, neu aufgeschriebener Frage-Tabelle und dem
offiziellen Schweizer Münzsortiment; dazu die UI-Abläufe (Runden auf
den drei GA-Stufen, Fehlerfluss, Persistenz, Medaillen, Reset,
Layout, Konsole, keine externen Requests).
