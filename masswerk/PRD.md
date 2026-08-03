# PRD — Masswerk

Version: 1.0. Dieses Dokument ist die massgebende Spezifikation der App.
Verhalten und PRD werden immer in derselben Änderung angepasst.

## Zweck und Leitprinzip

Masswerk ist ein Übungsmodul der Lehrplan-Familie und folgt dem
Leitprinzip: **Eine App setzt genau eine Kompetenz des Lehrplans 21 um,
ihre Schwierigkeitsstufen sind die offiziellen Kompetenzstufen, ihre
Meilensteine die Grundansprüche.**

Umgesetzt ist MA.3.A.2 (Ausgabe Kanton Bern): "Die Schülerinnen und
Schüler können Grössen schätzen, messen, umwandeln, runden und mit
ihnen rechnen." Die Stufen der App sind die offiziellen
Kompetenzstufen dieser Kompetenz mit ihren Zyklen und den
Grundanspruch-Markierungen (c = Grundanspruch Zyklus 1, h = Zyklus 2,
j = Zyklus 3).

**Bewusst ausgelassene Stufen.** Die Stufen a und f üben Schätzen und
Messen mit echten Dingen (Schnur schneiden, Wasser verteilen,
Gegenstände ausmessen). Das kann eine App nicht prüfen. Sie fehlen
darum in der Stufenleiter; ein sichtbarer Hinweis im Fuss der
Übersicht nennt sie und sagt, dass man das draussen übt, nicht in der
App (`SKIPPED = ['a', 'f']` in `data.js`). Die App erfindet keine
Ersatz-Aufgaben und tut nicht so, als wäre die Kompetenz vollständig
abgedeckt.

## Quelle

- Lehrplan 21, Ausgabe Kanton Bern (be.lehrplan.ch, Gesamtausgabe
  PDF), Kompetenzaufbau MA.3.A.2 inklusive Zyklusbänder und
  Grundanspruch-Markierung.
- Stufentitel und -beschreibungen sind kindgerechte Umschreibungen,
  keine Originaltexte; der offizielle Code (MA.3.A.2.b bis .k) steht
  sichtbar an jeder Stufe.

## Stufen und Aufgabenformen

Alle Generatoren leben in `gen.js` (rein, ohne DOM, injizierbarer
Zufall). Aufgaben sind getippt (`typed`) oder Auswahl (`mc`). Grössen
stehen als "Zahl Einheit", das Ziel als "? Einheit".

- **b** (Z1): ganze Franken bis 20, halbe Stunden.
- **c** (Z1, GA): Zentimeter bis 1 m, Meter teilen, Längen verdoppeln,
  Geldbeträge halbieren.
- **d** (Z1+Z2): Franken und Rappen (z. B. "25 Fr. 60 Rp. + 14 Fr.
  30 Rp. = ? Fr."), Zeitdauern ("Von 09:40 bis 10:15 = ? min").
- **e** (Z2): benachbarte Einheiten umwandeln (g/kg, mm/cm/m, dl/l),
  Meter und Zentimeter zusammenzählen.
- **g** (Z2): über Einheitsgrenzen rechnen (1 kg − 300 g), Stunden in
  Minuten und zurück.
- **h** (Z2, GA): Grössen vergleichen ("Was ist mehr?"), zweifach
  benannte Grössen umwandeln, auf ganze Einheiten runden.
- **i** (Z3): Flächen (m²/dm²) und Volumen (m³/dm³ zu Litern)
  umwandeln, Anteile relativ in Prozent vergleichen.
- **j** (Z3, GA): SI-Vorsätze Mega, Kilo, Dezi, Centi, Milli den
  Zehnerpotenzen zuordnen (Auswahl).
- **k** (Z3): zusammengesetzte Grössen: m/s und km/h umrechnen
  ("200 m in 10 s = ? km/h").

## Kernablauf

1. Übersicht: Titel, Statistikzeile (Level, XP, Fortschrittsbalken,
   Medaillenzahl; führt zur Medaillengalerie), Stufenleiter b bis k,
   Hinweis auf die ausgelassenen Stufen a und f im Fuss. Keine Stufe
   ist je gesperrt.
2. Eine Runde hat 8 Aufgaben aus den Aufgabenformen der Stufe.
3. Eingabe: Weil Antwortlängen bei Grössen variieren (etwa "39.90"),
   prüft die App getippte Antworten, sobald die getippte Länge die
   erwartete erreicht, und zusätzlich mit Enter für früh vollständige
   Antworten. Der Hinweistext nennt beides (WCAG 3.2.2). Der Vergleich
   ist numerisch, wo die Antwort eine Zahl ist ("7.0" = "7");
   Uhrzeiten mit ":" werden als Text verglichen. Immer wird die ganze
   Antwort geprüft, nie einzelne Zeichen. Ergebnisse erscheinen in
   einer role="status"-Region.
4. Fehler: Markierung, unterstützende Rückmeldung, Korrektur jederzeit
   möglich, kein Zeitdruck, keine XP-Abzüge.
5. Abschluss-Screen: gelöste Aufgaben, XP-Gewinn, Level mit Balken,
   neue Medaillen als ruhiger Block, gegebenenfalls Stufenvorschlag,
   "Noch eine Runde" und "Zur Übersicht".

## Gamification (nach GAMIFICATION.md)

- XP pro abgeschlossener Runde: gelöste Aufgaben plus Stufentiefe
  (b = +1 bis k = +9). Nie für Tempo, Fehler kosten nichts, XP sinken
  nie.
- Levels (kumulative XP): Lehrling 0, Geselle 25, Messprofi 90,
  Masskenner 220, Werkmeister 500. Level 2 kommt in der ersten
  Sitzung.
- Medaillen als reine Funktionen der Zähler: Runden (1, 3, 8, 21, 55),
  gelöste Aufgaben (50, 200, 800), Grundanspruch Zyklus 1/2/3 (je eine
  fehlerfreie Runde auf Stufe c/h/j), alle Stufen entdeckt. Gesperrte
  Medaillen bleiben mit Name und Beschreibung sichtbar.
- Stufenvorschlag: 5 fehlerfreie Runden in Folge auf einer Stufe
  schlagen auf dem Abschluss-Screen die nächste Stufe vor
  (Ein-Tipp-Start). Nie erzwungen; eine Runde mit Fehlern setzt die
  Serie still zurück, mit vollen XP.

## Persistenz

- `localStorage`, Schlüssel `masswerk.progress` (XP, Runden, Aufgaben,
  pro Stufe Runden/fehlerfreie Runden/Serie).
- Reset im Footer der Übersicht mit Bestätigung, die den
  Gerätespeicher nennt. Keine Konten, keine Analytik, keine externen
  Requests.

## Sprache und Gestaltung

- v1 einsprachig Deutsch (Schweizer Standarddeutsch, ss statt ß); alle
  UI-Texte in `strings.js` mit stabilen IDs. Keine
  Einstellungen-Ansicht, solange es nichts zu konfigurieren gibt.
- Tokens aus DESIGN.md, Akzentfamilie **sage**, Atkinson Hyperlegible
  selbst gehostet, Lucide-Icons inline, Cache-Busting `?v=1`.
- Schweizer Formate: Tausendertrennung mit Apostroph (2'000),
  Dezimalpunkt, Franken und Rappen, 24-Stunden-Uhrzeiten (09:40).

## Tests

Playwright-Suite in `tests/e2e.test.mjs`:

- Generatoren mit gesätem Zufall (400 Runden pro Stufe), geprüft gegen
  ein unabhängiges, einheiten-bewusstes Orakel, das die angezeigten
  Ausdrücke selbst parst und nachrechnet (Franken/Rappen, Uhrzeiten,
  Längen-, Gewichts-, Flächen-, Volumen- und
  Geschwindigkeits-Umrechnungen, SI-Vorsätze).
- Cache-Busting-Konsistenz, kein ß, Levelkurve (Level 2 in der ersten
  Sitzung erreichbar).
- UI-Abläufe: volle Runden (Tippen und Auswahl), Enter-Bestätigung,
  Belohnungen, Persistenz über Reload, Fehler-und-Korrektur,
  Medaillengalerie, Reset, Hinweis auf die ausgelassenen Stufen, kein
  horizontales Scrollen bei 320px, Konsole ohne Fehler, keine
  externen Requests.

## Ausblick (nicht Teil von v1)

- Schätz-Aufgaben mit Fotos realer Gegenstände als Annäherung an die
  ausgelassenen Stufen (nur falls sich das ehrlich prüfen lässt).
- Weitere Sprachen.
