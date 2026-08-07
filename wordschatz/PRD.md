# PRD — Wordschatz

Version: 1.0. Dieses Dokument ist die massgebende Spezifikation der App.
Verhalten und PRD werden immer in derselben Änderung angepasst.

## Zweck und Leitprinzip

Wordschatz ist ein Übungsmodul der Lehrplan-Familie und folgt dem
Leitprinzip: **Eine App setzt genau eine Kompetenz des Lehrplans 21 um,
ihre Schwierigkeitsstufen sind die offiziellen Kompetenzstufen, ihre
Meilensteine die Grundansprüche.**

Umgesetzt ist FS2E.5.B.1: der englische Wortschatz, parallel zur
Schwester-App Motschatz. Die vier offiziellen Stufen beschreiben
wachsende Repertoires von hello und thank you über Alltagsthemen zu
Sätzen und Lebenswelt-Themen. Englisch beginnt im 2. Zyklus.

## Quelle

- Lehrplan 21, Ausgabe Kanton Bern, Stand 01.08.2022 (Datum in der
  Fusszeile des offiziellen PDF):
  https://be.lehrplan.ch/container/BE_DE_Gesamtausgabe.pdf,
  Kompetenzaufbau FS2E.5.B.1. Die Stufen a bis d sind die offiziellen
  Kompetenzstufen (b = Grundanspruch Zyklus 2, c = Zyklus 3).
- Aufgabentexte sind eigene, kindgerechte Formulierungen, keine
  Originaltexte; der offizielle Code steht sichtbar an jeder Stufe.

## Inhalt und Aufgabenformen

Vokabeln liegen als Paare in `VOCAB`, Wendungen in `PHRASES`;
Aufgaben laufen EN→DE und DE→EN als Auswahl, einfach schreibbare
Wörter auch getippt. Die Suite prüft gegen ein unabhängig neu
aufgeschriebenes Wörterbuch.

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
- `localStorage`-Schlüssel `wordschatz.progress`; Reset im Footer mit
  Bestätigung. Keine externen Requests.

## Sprache und Gestaltung

Einsprachig Deutsch (Schweizer Standarddeutsch), Strings in
`strings.js`. Tokens aus DESIGN.md, Akzentfamilie **sage**,
Atkinson Hyperlegible selbst gehostet, Lucide-Icons inline,
Cache-Busting `?v=2`.

## Tests

Playwright-Suite in `tests/e2e.test.mjs`: Generatoren mit gesätem
Zufall gegen ein unabhängiges Orakel, dazu die UI-Abläufe (Runden auf
den GA-Stufen, Fehlerfluss, Persistenz, Medaillen, Reset, Layout,
Konsole, keine externen Requests).
