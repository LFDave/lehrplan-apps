# PRD — Sternwarte

Version: 1.0. Dieses Dokument ist die massgebende Spezifikation der App.
Verhalten und PRD werden immer in derselben Änderung angepasst.

## Zweck und Leitprinzip

Sternwarte ist ein Übungsmodul der Lehrplan-Familie und folgt dem
Leitprinzip: **Eine App setzt genau eine Kompetenz des Lehrplans 21 um,
ihre Schwierigkeitsstufen sind die offiziellen Kompetenzstufen, ihre
Meilensteine die Grundansprüche.**

Umgesetzt ist NMG.4.5: astronomische Phänomene und Sachverhalte
erklären — der Blick zum Himmel (a), Sonnenlauf, Mond und Sterne am
Tag- und Nachthimmel (b), die Erde als Planet (c), Beobachtungen über
Zeit mit Mondphasen und Jahreszeiten (d), das Sonnensystem als Modell
(e) sowie Galaxien, Sternbilder und Kometen (f).

**Bewusste Übersetzung:** Eigenes Beobachten am Himmel und Modellbau
sind als Wissen über die beobachtbaren Phänomene und Modelle
umgesetzt (Wo geht die Sonne auf? Was zeigt ein Modell?).

## Quelle

- Lehrplan 21, Ausgabe Kanton Bern, Stand 01.08.2022 (Datum in der
  Fusszeile des offiziellen PDF):
  https://be.lehrplan.ch/container/BE_DE_Gesamtausgabe.pdf,
  Kompetenzaufbau NMG.4.5. Die Stufen a bis f sind die offiziellen
  Kompetenzstufen (b = Grundanspruch Zyklus 1, e = Zyklus 2).
- Aufgabentexte sind eigene, kindgerechte Formulierungen, keine
  Originaltexte; der offizielle Code steht sichtbar an jeder Stufe.

## Inhalt und Aufgabenformen

Astronomie ist Faktenwissen: alle Stufen liegen in festen
Aufgaben-Pools, beschränkt auf gesicherte Grundlagen (Sonnenlauf,
Mondphasen, acht Planeten, Milchstrasse). Die Suite prüft jede
Aufgabe gegen eine unabhängig neu aufgeschriebene Antwort-Tabelle.

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
- `localStorage`-Schlüssel `sternwarte.progress`; Reset im Footer mit
  Bestätigung. Keine externen Requests.

## Sprache und Gestaltung

Einsprachig Deutsch (Schweizer Standarddeutsch), Strings in
`strings.js`. Tokens aus DESIGN.md, Akzentfamilie **blue**,
Atkinson Hyperlegible selbst gehostet, Lucide-Icons inline,
Cache-Busting `?v=4`.

## Merkheft-Verbindung

Die Stufen d und e tragen in `data.js` ein `merkblatt: { id, name }`: Die App
zeigt auf der Stufenkarte einen klar erkennbaren Link
«Merkblatt: …» (Chip mit Buch-Symbol und unterstrichenem Text) und
nach einer Runde mit Fehlern «Zum Nachlesen: …», beide auf
`../merkheft/<id>.html` (mondphasen.html und sonnensystem.html). Die Links sind optional und nie
eine Bedingung; die Suite prüft sie.

Deep-Links: `?stufe=<id>` startet die Stufe direkt, optional begrenzt
`&thema=<art1,art2>` die Runde auf die Aufgabenarten des verlinkten
Merkblatt-Themas. Unbekannte Filter fallen auf die ganze Stufe
zurück; die Suite prüft den Einstieg.

## Tests

Playwright-Suite in `tests/e2e.test.mjs`: Generatoren mit gesätem
Zufall gegen ein unabhängiges Orakel (neu aufgeschriebene
Antwort-Tabelle), dazu die UI-Abläufe (Runden auf den GA-Stufen,
Fehlerfluss, Persistenz, Medaillen, Reset, Layout, Konsole, keine
externen Requests).
