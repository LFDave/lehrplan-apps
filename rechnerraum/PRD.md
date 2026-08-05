# PRD — Rechnerraum

Version: 1.0. Dieses Dokument ist die massgebende Spezifikation der App.
Verhalten und PRD werden immer in derselben Änderung angepasst.

## Zweck und Leitprinzip

Rechnerraum ist ein Übungsmodul der Lehrplan-Familie und folgt dem
Leitprinzip: **Eine App setzt genau eine Kompetenz des Lehrplans 21 um,
ihre Schwierigkeitsstufen sind die offiziellen Kompetenzstufen, ihre
Meilensteine die Grundansprüche.**

Umgesetzt ist MI.2.3: Aufbau und Funktionsweise von
informationsverarbeitenden Systemen — Geräte bedienen (a), Login (b),
Ablegen und Finden (c), Bedienoberfläche (d), Betriebssystem und
Anwendungen (e), Speicherarten und Grösseneinheiten (f),
Lösungsstrategien (g), Datenverlust und Schutz (h), Suchmaschinen
(i), Speicherorte (j), Leistungseinheiten (k) sowie
Eingabe-Verarbeitung-Ausgabe und Internet-Dienste (l).

**Bewusste Übersetzung:** Arbeit am echten Gerät ist als Wissen über Bedienung, Speicher und
Netze umgesetzt.

## Quelle

- Lehrplan 21, Ausgabe Kanton Bern, Stand 01.08.2022 (Datum in der
  Fusszeile des offiziellen PDF):
  https://be.lehrplan.ch/container/BE_DE_Gesamtausgabe.pdf,
  Kompetenzaufbau MI.2.3. Die Stufen a bis l sind die offiziellen
  Kompetenzstufen (c = Grundanspruch Zyklus 1, h = Zyklus 2).
- Aufgabentexte sind eigene, kindgerechte Formulierungen, keine
  Originaltexte; der offizielle Code steht sichtbar an jeder Stufe.
- Inhalte sind auf gesichertes Grundwissen beschränkt.

## Inhalt und Aufgabenformen

Die Grössen-Umrechnungen (Faktor 1000) und die
Speicherplatz-Rechnung werden generiert und von der Suite unabhängig
nachgerechnet; die übrigen Stufen liegen in festen Pools mit neu
aufgeschriebener Antwort-Tabelle.

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
- `localStorage`-Schlüssel `rechnerraum.progress`; Reset im Footer mit
  Bestätigung. Keine externen Requests.

## Sprache und Gestaltung

Einsprachig Deutsch (Schweizer Standarddeutsch), Strings in
`strings.js`. Tokens aus DESIGN.md, Akzentfamilie **blue**,
Atkinson Hyperlegible selbst gehostet, Lucide-Icons inline,
Cache-Busting `?v=1`.

## Tests

Playwright-Suite in `tests/e2e.test.mjs`: Generatoren mit gesätem
Zufall gegen ein unabhängiges Orakel, dazu die UI-Abläufe (Runden auf
den GA-Stufen, Fehlerfluss, Persistenz, Medaillen, Reset, Layout,
Konsole, keine externen Requests).
