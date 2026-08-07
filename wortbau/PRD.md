# PRD — Wortbau

Version: 1.0. Dieses Dokument ist die massgebende Spezifikation der App.
Verhalten und PRD werden immer in derselben Änderung angepasst.

## Zweck und Leitprinzip

Wortbau ist ein Übungsmodul der Lehrplan-Familie und folgt dem
Leitprinzip: **Eine App setzt genau eine Kompetenz des Lehrplans 21 um,
ihre Schwierigkeitsstufen sind die offiziellen Kompetenzstufen, ihre
Meilensteine die Grundansprüche.**

Umgesetzt ist D.5.D.1: Wortarten, Zeitformen und grammatische
Proben. Die Stufen folgen dem offiziellen Aufbau: Hauptwortarten (a),
Zeitformen und Wortfamilien (b), Infinitiv und Morpheme (c), Pronomen,
Partikeln und die vier Fälle (d), Fälle und Satzglieder bestimmen (e),
alle Wortarten sicher (f), Modus, Aktiv/Passiv, Subjekt und Objekt (g).

## Quelle

- Lehrplan 21, Ausgabe Kanton Bern, Stand 01.08.2022 (Datum in der
  Fusszeile des offiziellen PDF):
  https://be.lehrplan.ch/container/BE_DE_Gesamtausgabe.pdf,
  Kompetenzaufbau D.5.D.1. Die Stufen a bis g sind die offiziellen
  Kompetenzstufen (a = Grundanspruch Zyklus 1, c = Zyklus 2, e = Zyklus 3).
- Aufgabentexte sind eigene, kindgerechte Formulierungen, keine
  Originaltexte; der offizielle Code steht sichtbar an jeder Stufe.

## Inhalt und Aufgabenformen

Der Inhalt liegt in festen Aufgaben-Pools pro Stufe; jede Frage ist
eindeutig formuliert («Was für ein Wort ist ‹Hund›?»), damit die
Suite sie gegen eine unabhängig neu aufgeschriebene Antwort-Tabelle
prüfen kann.

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
- `localStorage`-Schlüssel `wortbau.progress`; Reset im Footer mit
  Bestätigung. Keine externen Requests.

## Sprache und Gestaltung

Einsprachig Deutsch (Schweizer Standarddeutsch), Strings in
`strings.js`. Tokens aus DESIGN.md, Akzentfamilie **violet**,
Atkinson Hyperlegible selbst gehostet, Lucide-Icons inline,
Cache-Busting `?v=2`.

## Tests

Playwright-Suite in `tests/e2e.test.mjs`: Generatoren mit gesätem
Zufall gegen ein unabhängiges Orakel, dazu die UI-Abläufe (Runden auf
den GA-Stufen, Fehlerfluss, Persistenz, Medaillen, Reset, Layout,
Konsole, keine externen Requests).
