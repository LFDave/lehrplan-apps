# PRD — Weltatlas

Version: 1.0. Dieses Dokument ist die massgebende Spezifikation der App.
Verhalten und PRD werden immer in derselben Änderung angepasst.

## Zweck und Leitprinzip

Weltatlas ist ein Übungsmodul der Lehrplan-Familie und folgt dem
Leitprinzip: **Eine App setzt genau eine Kompetenz des Lehrplans 21 um,
ihre Schwierigkeitsstufen sind die offiziellen Kompetenzstufen, ihre
Meilensteine die Grundansprüche.**

Umgesetzt ist RZG.4.1 (Geografie): Orte lokalisieren — Kontinente,
Ozeane, Länder und Hauptstädte auffinden (a), die Lage von Orten mit
Raummerkmalen beschreiben (b) sowie Orte in Orientierungsraster wie
Gradnetz, Vegetationszonen und Plattengrenzen einordnen (c).

**Bewusste Übersetzung:** Arbeit mit Karte, Globus und Satellitenbild ist als Orts- und
Rasterwissen umgesetzt.

## Quelle

- Lehrplan 21, Ausgabe Kanton Bern, Stand 01.08.2022 (Datum in der
  Fusszeile des offiziellen PDF):
  https://be.lehrplan.ch/container/BE_DE_Gesamtausgabe.pdf,
  Kompetenzaufbau RZG.4.1. Die Stufen a bis c sind die offiziellen
  Kompetenzstufen (c = Grundanspruch Zyklus 3).
- Aufgabentexte sind eigene, kindgerechte Formulierungen, keine
  Originaltexte; der offizielle Code steht sichtbar an jeder Stufe.
- Inhalte sind auf gesichertes Grundwissen beschränkt.

## Inhalt und Aufgabenformen

Die Kontinent- und Hauptstadt-Zuordnungen werden aus festen
Tabellen generiert und von der Suite mit einer eigenen, neu
aufgeschriebenen Tabelle unabhängig geprüft; die übrigen Stufen
liegen in festen Pools mit neu aufgeschriebener Antwort-Tabelle.

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
- `localStorage`-Schlüssel `weltatlas.progress`; Reset im Footer mit
  Bestätigung. Keine externen Requests.

## Sprache und Gestaltung

Einsprachig Deutsch (Schweizer Standarddeutsch), Strings in
`strings.js`. Tokens aus DESIGN.md, Akzentfamilie **blue**,
Atkinson Hyperlegible selbst gehostet, Lucide-Icons inline,
Cache-Busting `?v=3`.

## Merkheft-Verbindung

Stufe c trägt in `data.js` ein `merkblatt: { id, name }`: Die App
zeigt auf der Stufenkarte einen klar erkennbaren Link
«Merkblatt: …» (Chip mit Buch-Symbol und unterstrichenem Text) und
nach einer Runde mit Fehlern «Zum Nachlesen: …», beide auf
`../merkheft/<id>.html` (gradnetz.html, «Gradnetz»). Die Links sind optional und nie
eine Bedingung; die Suite prüft sie.

## Tests

Playwright-Suite in `tests/e2e.test.mjs`: Generatoren mit gesätem
Zufall gegen ein unabhängiges Orakel, dazu die UI-Abläufe (Runden auf
den GA-Stufen, Fehlerfluss, Persistenz, Medaillen, Reset, Layout,
Konsole, keine externen Requests).
