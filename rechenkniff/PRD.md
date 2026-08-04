# PRD — Rechenkniff

Version: 1.0. Dieses Dokument ist die massgebende Spezifikation der App.
Verhalten und PRD werden immer in derselben Änderung angepasst.

## Zweck und Leitprinzip

Rechenkniff ist ein Übungsmodul der Lehrplan-Familie und folgt dem
Leitprinzip: **Eine App setzt genau eine Kompetenz des Lehrplans 21 um,
ihre Schwierigkeitsstufen sind die offiziellen Kompetenzstufen, ihre
Meilensteine die Grundansprüche.**

Umgesetzt ist MA.1.A.4 (Ausgabe Kanton Bern): "Die Schülerinnen und
Schüler können Zahlen zerlegen, umformen und Rechengesetze nutzen."
Die zwölf Stufen a bis l sind die zwölf offiziellen Kompetenzstufen
dieser Kompetenz, mit ihren Zyklen und den
Grundanspruch-Markierungen (c = Grundanspruch Zyklus 1, g = Zyklus 2,
k = Zyklus 3). Stufe j besteht im Lehrplan vollständig aus
Erweiterungsinhalten und trägt das Erweiterungs-Etikett.

## Quelle

- Lehrplan 21, Ausgabe Kanton Bern (be.lehrplan.ch, Gesamtausgabe
  PDF), Kompetenzaufbau MA.1.A.4 inklusive Zyklusbänder und
  Grundanspruch-Markierung.
- Stufentitel und -beschreibungen sind kindgerechte Umschreibungen,
  keine Originaltexte; der offizielle Code (MA.1.A.4.a bis .l) steht
  sichtbar an jeder Stufe.

## Stufen und Aufgabenformen

Alle Generatoren leben in `gen.js` (rein, ohne DOM, injizierbarer
Zufall). Die Aufgabenformen stammen direkt aus den Beispielen der
Stufentexte:

- **a** (Z1): Mengen angleichen (8 und 4 Knöpfe → 6 und 6).
- **b** (Z1): Zahlen bis 20 zerlegen (5 = 1 + ?), Kommutativgesetz.
- **c** (Z1, GA): Addition als Umkehrung der Subtraktion
  (18 - 15 = ?, denn 15 + ? = 18), Assoziativgesetz über den Zehner
  (17 + 18 = 17 + 3 + ?).
- **d** (Z1+Z2): Nachbar-Produkte (6 · 8 = 5 · 8 + ?),
  Faktoren tauschen.
- **e** (Z2): Division als Umkehrung, Zehnereinmaleins
  (3 · 4 = 12, also 30 · 4 = ?).
- **f** (Z2): Produkte verdoppeln/halbieren (8 · 26 = 4 · ?), Summen
  und Produkte bündeln (136 + 58 + 42; 38 · 4 · 25), auf 10er/100er/
  1'000er runden.
- **g** (Z2, GA): Teilbarkeit durch 2, 5, 10, 100 (Auswahl),
  Dezimalzahlen auf Zehntel runden.
- **h** (Z2+Z3): Punkt vor Strich, Klammerregeln, Gleichungen durch
  Umkehren lösen; Teilbarkeit durch 3 und 9 (Erweiterungsinhalt).
- **i** (Z3): Produkte als Potenz schreiben (15 · 15 · 15 = 15^?),
  Distributivgesetz, sinnvoll runden (auf Hundertstel).
- **j** (Z3, Erweiterung): lineare Gleichungen (5x + 3 = 38),
  gleichartige Terme mit einer Variablen.
- **k** (Z3, GA): Terme mit zwei Variablen zusammenfassen
  (2a + 3b + 4a = 6a + 3b).
- **l** (Z3): x² - c = 0 lösen (positive Lösung), Potenz vor Punkt,
  binomische Formeln (Auswahl aus fester Tabelle `BINOM_QA`).

Rundungs-Generatoren erzeugen nie Antworten mit angehängter Null
("12.0"), damit die Längen-Autoprüfung ehrlich bleibt.

## Kernablauf, Eingabe, Gamification, Persistenz

Wie in der Familie üblich: Übersicht mit Stufenleiter, Runden mit 8
Aufgaben, getippte Antworten prüfen sich bei erwarteter Länge selbst
und zusätzlich mit Enter (numerischer Vergleich; Term-Antworten wie
"6a + 3b" werden nach Entfernen der Leerzeichen als Text verglichen).
Satzförmige Aufgaben mit ':' erhalten kein angehängtes "= ?".

- XP: gelöste Aufgaben plus Stufentiefe; Levels Rechenlehrling 0,
  Umformer 25, Kniffkenner 90, Rechenfuchs 220, Kniffmeister 500.
- Medaillen: Runden (1, 3, 8, 21, 55), Aufgaben (50, 200, 800),
  Grundanspruch Zyklus 1/2/3 (fehlerfreie Runde auf c/g/k), alle
  Stufen entdeckt.
- Stufenvorschlag nach 5 fehlerfreien Runden in Folge, nie erzwungen.
- `localStorage`-Schlüssel `rechenkniff.progress`; Reset im Footer mit
  Bestätigung. Keine externen Requests.

## Sprache und Gestaltung

Einsprachig Deutsch (Schweizer Standarddeutsch), Strings in
`strings.js`. Tokens aus DESIGN.md, Akzentfamilie **violet**,
Atkinson Hyperlegible selbst gehostet, Lucide-Icons inline,
Cache-Busting `?v=1`.

## Tests

Playwright-Suite in `tests/e2e.test.mjs`: Generatoren mit gesätem
Zufall (600 Runden), geprüft gegen ein unabhängiges Ausdrucks-Orakel
(eigene Regex-Parser, Ganzzahl-Rundung, neu aufgeschriebene
Binom-Tabelle); dazu die UI-Abläufe (Runden auf den drei GA-Stufen,
Fehlerfluss, Persistenz, Medaillen, Reset, Layout, Konsole, keine
externen Requests).
