# PRD — Schrittweise

Version: 1.0. Dieses Dokument ist die massgebende Spezifikation der App.
Verhalten und PRD werden immer in derselben Änderung angepasst.

## Zweck und Leitprinzip

Schrittweise ist ein Übungsmodul der Lehrplan-Familie und folgt dem
Leitprinzip: **Eine App setzt genau eine Kompetenz des Lehrplans 21 um,
ihre Schwierigkeitsstufen sind die offiziellen Kompetenzstufen, ihre
Meilensteine die Grundansprüche.**

Umgesetzt ist MI.2.2: einfache Problemstellungen analysieren,
Lösungsverfahren beschreiben und in Programmen umsetzen — Anleitungen
befolgen (a), Lösungswege vergleichen (b), Schleifen und Verzweigungen
erkennen (c), Abläufe manuell ausführen (d), verstehen, dass ein
Computer nur Anweisungen ausführt (e), Programme mit Schleifen (f),
mit Bedingungen (g), mit Variablen und Unterprogrammen (h) sowie
Algorithmen vergleichen am Beispiel der Suche (i).

**Bewusste Übersetzung:** Eigenes Schreiben und Testen von Programmen
ist als Lesen, Nachverfolgen und Vorhersagen kleiner Programme
umgesetzt (Was ist x am Ende?).

## Quelle

- Lehrplan 21, Ausgabe Kanton Bern, Stand 01.08.2022 (Datum in der
  Fusszeile des offiziellen PDF):
  https://be.lehrplan.ch/container/BE_DE_Gesamtausgabe.pdf,
  Kompetenzaufbau MI.2.2. Die Stufen a bis i sind die offiziellen
  Kompetenzstufen (a = Grundanspruch Zyklus 1, f = Zyklus 2, h = Zyklus 3).
- Aufgabentexte sind eigene, kindgerechte Formulierungen, keine
  Originaltexte; der offizielle Code steht sichtbar an jeder Stufe.

## Inhalt und Aufgabenformen

Anleitungen (Felder-Lauf), Programm-Abläufe (Wiederholen, Wenn/Sonst),
Unterprogramme (HÜPF, PLUS) und das Halbieren (binäre Suche) werden
generiert und von der Suite mit einem eigenen kleinen Interpreter
unabhängig nachgerechnet; die Wissens-Stufen liegen in festen Pools
mit neu aufgeschriebener Antwort-Tabelle.

## Kernablauf, Eingabe, Gamification, Persistenz

Wie in der Familie üblich: Übersicht mit Stufenleiter, Runden mit 8
Aufgaben, Auswahl-Aufgaben werten beim Antippen, getippte Antworten
prüfen sich bei erwarteter Länge selbst und zusätzlich mit Enter.
Fehler kosten nichts; Ergebnisse erscheinen in einer
role="status"-Region.

- XP: gelöste Aufgaben plus Stufentiefe; fünf Levels (25/90/220/500).
- Medaillen: Runden (1, 3, 8, 21, 55), Aufgaben (50, 200, 800), eine
  Grundanspruch-Medaille pro GA-Stufe, alle Stufen entdeckt.
- Stufenvorschlag nach 5 fehlerfreien Runden in Folge, nie erzwungen.
- `localStorage`-Schlüssel `schrittweise.progress`; Reset im Footer mit
  Bestätigung. Keine externen Requests.

## Sprache und Gestaltung

Einsprachig Deutsch (Schweizer Standarddeutsch), Strings in
`strings.js`. Tokens aus DESIGN.md, Akzentfamilie **violet**,
Atkinson Hyperlegible selbst gehostet, Lucide-Icons inline,
Cache-Busting `?v=3`.

## Tests

Playwright-Suite in `tests/e2e.test.mjs`: Generatoren mit gesätem
Zufall gegen ein unabhängiges Orakel (eigener Interpreter), dazu die
UI-Abläufe (Runden auf den GA-Stufen, Fehlerfluss, Persistenz,
Medaillen, Reset, Layout, Konsole, keine externen Requests).
