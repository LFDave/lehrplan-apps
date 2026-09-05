# PRD — Zahlenwissen

Version: 1.0. Dieses Dokument ist die massgebende Spezifikation der App.
Verhalten und PRD werden immer in derselben Änderung angepasst.

## Zweck und Leitprinzip

Zahlenwissen ist ein Übungsmodul der Lehrplan-Familie und folgt dem
Leitprinzip: **Eine App setzt genau eine Kompetenz des Lehrplans 21 um,
ihre Schwierigkeitsstufen sind die offiziellen Kompetenzstufen, ihre
Meilensteine die Grundansprüche.**

Umgesetzt ist MA.1.A.1 (Ausgabe Kanton Bern): "Die Schülerinnen und
Schüler verstehen und verwenden arithmetische Begriffe und Symbole.
Sie können Zahlen lesen und schreiben." Die zwölf Stufen a bis l sind
die zwölf offiziellen Kompetenzstufen dieser Kompetenz, in der
Reihenfolge des Lehrplans, mit ihren Zyklen und den
Grundanspruch-Markierungen (c = Grundanspruch Zyklus 1, g = Zyklus 2,
j = Zyklus 3).

## Quelle

- Lehrplan 21, Ausgabe Kanton Bern (be.lehrplan.ch, Gesamtausgabe
  PDF), Kompetenzaufbau MA.1.A.1 inklusive Zyklusbänder und
  Grundanspruch-Markierung.
- Stufentitel und -beschreibungen sind kindgerechte Umschreibungen,
  keine Originaltexte; der offizielle Code (MA.1.A.1.a bis .l) steht
  sichtbar an jeder Stufe.

## Stufen und Aufgabenformen

Alle Generatoren leben in `gen.js` (rein, ohne DOM, injizierbarer
Zufall), inklusive eines eigenen deutschen Zahlwort-Generators in
Schweizer Schreibweise (dreissig, nie ß). Aufgaben sind getippt
(`typed`) oder Auswahl (`mc`).

- **a** (Z1): Punktmengen vergleichen (mehr/weniger).
- **b** (Z1): Zeichen +, - und = einsetzen, wahre Gleichung erkennen.
- **c** (Z1, GA): Zahlwörter bis 100 als Zahl schreiben,
  gerade/ungerade, < und >, Zehner und Einer.
- **d** (Z1+Z2): das Zeichen : erkennen (Doppeldeutigkeiten wie
  "4 ? 2 = 2" sind im Generator ausgeschlossen).
- **e** (Z2): Zahlwörter bis 1000, Quadratzahlen, Stellenwerte,
  Division mit Rest.
- **f** (Z2): Summe/Differenz/Produkt/Quotient/Summanden/Faktoren,
  Zahlwörter bis 1 Million.
- **g** (Z2, GA): Zähler/Nenner, %- und ≈-Zeichen, Teiler und
  Vielfache, Dezimalzahlen aus Wortform.
- **h** (Z2+Z3): Bruch ↔ Prozent ↔ Dezimalzahl, Primzahlen erkennen.
- **i** (Z3): Basis und Exponent (Erweiterungsinhalt des Lehrplans),
  Symbole √, ≤, ≥, ≠, Zahlen bis 1 Milliarde.
- **j** (Z3, GA): wissenschaftliche Schreibweise lesen und schreiben,
  Quadrate von Dezimalzahlen (Tabelle, kein Float-Rauschen).
- **k** (Z3): Kehrwert, negative Zehnerpotenzen (stringbasierter
  Dezimal-Schieber), dritte Wurzel, Zahlenmengen.
- **l** (Z3): rational und irrational unterscheiden.

## Kernablauf, Eingabe, Gamification, Persistenz

Wie in der Familie üblich (siehe rechenturm/PRD.md als Referenzmuster):
Übersicht mit Stufenleiter, Runden mit 8 Aufgaben, getippte Antworten
prüfen sich bei erwarteter Länge selbst und zusätzlich mit Enter
(numerischer Vergleich, "36" zählt wie "36.0"); Auswahl-Aufgaben
werten beim Antippen. Ergebnisse in role="status", Fehler kosten
nichts. Satzförmige Aufgaben ("Schreibe als Zahl: ...") erhalten kein
angehängtes "= ?".

- XP: gelöste Aufgaben plus Stufentiefe; Levels Zahlenlehrling 0,
  Zahlenkenner 25, Zahlenprofi 90, Zahlenmeister 220, Zahlenweise 500.
- Medaillen: Runden (1, 3, 8, 21, 55), Aufgaben (50, 200, 800),
  Grundanspruch Zyklus 1/2/3 (fehlerfreie Runde auf c/g/j), alle
  Stufen entdeckt.
- Stufenvorschlag nach 5 fehlerfreien Runden in Folge, nie erzwungen.
- `localStorage`-Schlüssel `zahlenwissen.progress`; Reset im Footer
  mit Bestätigung. Keine externen Requests.

## Sprache und Gestaltung

Einsprachig Deutsch (Schweizer Standarddeutsch), Strings in
`strings.js`. Tokens aus DESIGN.md, Akzentfamilie **sage**, Atkinson
Hyperlegible selbst gehostet, Lucide-Icons inline, Cache-Busting
`?v=4`.

## Merkheft-Verbindung und Deep-Links

Jede Stufe trägt in `data.js` ein `merkblatt: { id, name }`: Die
App zeigt auf der Stufenkarte einen klar erkennbaren Link
«Merkblatt: …» (Fusszeile der Stufenkarte mit Buch-Symbol) und
nach einer Runde mit Fehlern «Zum Nachlesen: …», beide auf
`../merkheft/<id>.html`. Die Links sind optional und nie eine
Bedingung; die Suite prüft, dass jede Stufenkarte einen trägt.
Zuordnung: a → zahlenstrahl; b, d, f → rechenwoerter; c, e → stellenwert; g, h → brueche; i, j, k, l → potenzen.

Deep-Links: `?stufe=<id>` startet die Stufe direkt. Die Query wird
nach dem Einstieg sofort aus der Adresse entfernt, damit sie beim
Neuladen oder Weitergeben nicht kleben bleibt; die Runde erhält ihren
eigenen Verlaufseintrag (`#stufe/<id>`) hinter der Übersicht.

## Navigation

Jede Ansicht beginnt mit dem Pfad «Lehrplan-Apps › Übungs-Apps ›
App» (Breadcrumb, `nav[aria-label="Pfad"]`, Links auf `../` und
`../ueben/`). In Runde, Abschluss und Medaillen ist die App-Ebene ein
Link und die Ansicht («Stufe x», «Medaillen») der letzte Eintrag.
Eine Runde ist ein eigener Verlaufseintrag (`#stufe/<id>`):
Browser-Zurück führt zur Übersicht; «Abbrechen», «Zur Übersicht» und
der App-Link im Pfad bauen den Eintrag über den Verlauf ab, sodass
ein weiteres Zurück dorthin führt, woher man kam, etwa ins Merkblatt.
Der Stufenvorschlag nach einer Runde ersetzt den Eintrag. Der frühere
Fusszeilen-Link «Zur App-Übersicht» ist durch den Pfad ersetzt.

## Tests

Playwright-Suite in `tests/e2e.test.mjs`: Generatoren mit gesätem
Zufall (600 Runden), geprüft gegen ein unabhängiges Orakel mit
eigenem Zahlwort-Parser, eigenem Dezimal-Schieber und neu
aufgeschriebenen Begriff-Tabellen; dazu die UI-Abläufe (Runden auf
den drei GA-Stufen, Fehlerfluss, Persistenz, Medaillen, Reset,
Layout, Konsole, keine externen Requests).
