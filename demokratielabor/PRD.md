# PRD — Demokratielabor

Version: 1.0. Dieses Dokument ist die massgebende Spezifikation der App.
Verhalten und PRD werden immer in derselben Änderung angepasst.

## Zweck und Leitprinzip

Demokratielabor ist ein Übungsmodul der Lehrplan-Familie und folgt dem
Leitprinzip: **Eine App setzt genau eine Kompetenz des Lehrplans 21 um,
ihre Schwierigkeitsstufen sind die offiziellen Kompetenzstufen, ihre
Meilensteine die Grundansprüche.**

Umgesetzt ist RZG.8.1: die Schweizer Demokratie erklären — wie
Demokratie entstand und sich von anderen Regierungsformen
unterscheidet (a), die drei Gewalten auf Gemeinde-, Kantons- und
Bundesebene (b), Besonderheiten wie Föderalismus, Initiative und
Referendum (c) sowie das Begründen von Positionen (d).

**Bewusste Übersetzung:** Eigenes Stellungbeziehen (Stufe d) ist als Wissen über Argumente,
Quellen und faire Debatten umgesetzt; die App gibt keine Meinungen
vor.

## Quelle

- Lehrplan 21, Ausgabe Kanton Bern, Stand 01.08.2022 (Datum in der
  Fusszeile des offiziellen PDF):
  https://be.lehrplan.ch/container/BE_DE_Gesamtausgabe.pdf,
  Kompetenzaufbau RZG.8.1. Die Stufen a bis d sind die offiziellen
  Kompetenzstufen (c = Grundanspruch Zyklus 3).
- Aufgabentexte sind eigene, kindgerechte Formulierungen, keine
  Originaltexte; der offizielle Code steht sichtbar an jeder Stufe.
- Inhalte sind auf gesichertes Grundwissen beschränkt.

## Inhalt und Aufgabenformen

Staatskunde ist Faktenwissen: alle Stufen liegen in festen Pools
(inklusive getippter Zahlen wie 1848, 7 Bundesräte, 100000
Unterschriften), geprüft gegen eine unabhängig neu aufgeschriebene
Antwort-Tabelle.

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
- `localStorage`-Schlüssel `demokratielabor.progress`; Reset im Footer mit
  Bestätigung. Keine externen Requests.

## Sprache und Gestaltung

Einsprachig Deutsch (Schweizer Standarddeutsch), Strings in
`strings.js`. Tokens aus DESIGN.md, Akzentfamilie **amber**,
Atkinson Hyperlegible selbst gehostet, Lucide-Icons inline,
Cache-Busting `?v=4`.

## Merkheft-Verbindung und Deep-Links

Jede Stufe trägt in `data.js` ein `merkblatt: { id, name }`: Die
App zeigt auf der Stufenkarte einen klar erkennbaren Link
«Merkblatt: …» (Chip mit Buch-Symbol und unterstrichenem Text) und
nach einer Runde mit Fehlern «Zum Nachlesen: …», beide auf
`../merkheft/<id>.html`. Die Links sind optional und nie eine
Bedingung; die Suite prüft, dass jede Stufenkarte einen trägt.
Zuordnung: a, c → abstimmen; b → gewaltenteilung; d → meinung.

Deep-Links: `?stufe=<id>` startet die Stufe direkt. Die Query wird
nach dem Einstieg sofort aus der Adresse entfernt, damit sie beim
Neuladen oder Weitergeben nicht kleben bleibt.

## Tests

Playwright-Suite in `tests/e2e.test.mjs`: Generatoren mit gesätem
Zufall gegen ein unabhängiges Orakel, dazu die UI-Abläufe (Runden auf
den GA-Stufen, Fehlerfluss, Persistenz, Medaillen, Reset, Layout,
Konsole, keine externen Requests).
