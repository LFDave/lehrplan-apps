# PRD — Nordpfeil

Version: 1.0. Dieses Dokument ist die massgebende Spezifikation der App.
Verhalten und PRD werden immer in derselben Änderung angepasst.

## Zweck und Leitprinzip

Nordpfeil ist ein Übungsmodul der Lehrplan-Familie und folgt dem
Leitprinzip: **Eine App setzt genau eine Kompetenz des Lehrplans 21 um,
ihre Schwierigkeitsstufen sind die offiziellen Kompetenzstufen, ihre
Meilensteine die Grundansprüche.**

Umgesetzt ist NMG.8.5: sich in Räumen orientieren — Wege beschreiben
(a), sichere und unsichere Stellen im Verkehr (b), einfache
Orientierungsmittel und Lagebezüge (c), Skizzen und Pläne (d), Karten
lesen mit Signaturen und Massstab (e), massstabsgetreues Darstellen
(f), Velo und öffentlicher Verkehr (g), Ortsplan und topographische
Karte (h) sowie Kompass, GPS und Legende (i).

**Bewusste Übersetzung:** Arbeit im Gelände und eigenes Zeichnen von
Plänen ist als Erkennen, Lesen und Berechnen am Bildschirm umgesetzt
(Massstab-Umrechnung, Himmelsrichtungen, Kartenwissen).

**Themenreine Karten.** Die offiziellen Stufen e und h mischen je
zwei Konzepte; für Kinder sind das getrennte Themen, darum stehen
sie als je zwei Karten in der Leiter:

- **e** (Z2), als zwei Karten: **e-signaturen** «Signaturen»
  (Kartenfarben und -zeichen, fester Pool mit 8 Einträgen) und
  **e-massstab** «Massstab umrechnen» (generierte
  Massstab-Aufgaben).
- **h** (Z2, GA), als zwei Karten: **h-karte** «Karte und
  Höhenkurven» (Ortsplan, topographische Karte, Höhenkurven, fester
  Pool) und **h-richtungen** «Himmelsrichtungen» (generierte
  Gegenrichtungs-Aufgaben). Die Grundanspruch-Medaille Zyklus 2
  verlangt beide Karten fehlerfrei; beide tragen das GA-Abzeichen.

Beide Teilstufen zeigen den offiziellen Buchstaben und den Code
NMG.8.5.e bzw. NMG.8.5.h (Feld `code` in `data.js`; die `id` bleibt
der Speicher- und Link-Schlüssel).

## Quelle

- Lehrplan 21, Ausgabe Kanton Bern, Stand 01.08.2022 (Datum in der
  Fusszeile des offiziellen PDF):
  https://be.lehrplan.ch/container/BE_DE_Gesamtausgabe.pdf,
  Kompetenzaufbau NMG.8.5. Die Stufen a bis i sind die offiziellen
  Kompetenzstufen (c = Grundanspruch Zyklus 1, h = Zyklus 2).
- Aufgabentexte sind eigene, kindgerechte Formulierungen, keine
  Originaltexte; der offizielle Code steht sichtbar an jeder Stufe.

## Inhalt und Aufgabenformen

Massstab-Umrechnungen (Karte und Plan), die Gegenrichtung und
Vierteldrehungen der Himmelsrichtungen werden generiert und von der
Suite mit eigener Richtungs-Tabelle und eigener Umrechnung unabhängig
nachgerechnet; die Wissens-Stufen liegen in festen Pools mit neu
aufgeschriebener Antwort-Tabelle.

## Kernablauf, Eingabe, Gamification, Persistenz

Wie in der Familie üblich: Übersicht mit Stufenleiter, Runden mit 8
Aufgaben, Auswahl-Aufgaben werten beim Antippen, getippte Antworten
prüfen sich bei erwarteter Länge selbst und zusätzlich mit Enter.
Fehler kosten nichts; Ergebnisse erscheinen in einer
role="status"-Region.

- XP: gelöste Aufgaben plus Stufentiefe; fünf Levels (25/90/220/500).
- Medaillen: Runden (1, 3, 8, 21, 55), Aufgaben (50, 200, 800), eine
  Grundanspruch-Medaille pro GA-Stufe (Zyklus 1: Stufe c fehlerfrei;
  Zyklus 2: beide h-Karten fehlerfrei), alle Stufen entdeckt.
- Stufenvorschlag nach 5 fehlerfreien Runden in Folge, nie erzwungen.
- `localStorage`-Schlüssel `nordpfeil.progress`; Reset im Footer mit
  Bestätigung. Keine externen Requests.

## Merkheft-Verbindung

Die Karten e-massstab und f (massstab.html), h-karte
(hoehenkurven.html) und h-richtungen (himmelsrichtungen.html) tragen
in `data.js` ein `merkblatt: { id, name }`: Die App zeigt auf der
Stufenkarte einen klar erkennbaren Link «Merkblatt: …» (Chip mit
Buch-Symbol und unterstrichenem Text) und nach einer Runde mit
Fehlern «Zum Nachlesen: …», beide auf `../merkheft/<id>.html`. Die
Links sind optional und nie eine Bedingung; die Suite prüft sie.

Deep-Links: `?stufe=<id>` startet die Stufe direkt (auch Teilstufen
wie `h-richtungen`). Die Query wird nach dem Einstieg sofort aus der
Adresse entfernt, damit sie beim Neuladen oder Weitergeben nicht
kleben bleibt; die Suite prüft Einstieg und bereinigte Adresse.

## Sprache und Gestaltung

Einsprachig Deutsch (Schweizer Standarddeutsch), Strings in
`strings.js`. Tokens aus DESIGN.md, Akzentfamilie **sage**,
Atkinson Hyperlegible selbst gehostet, Lucide-Icons inline,
Cache-Busting `?v=2`.

## Tests

Playwright-Suite in `tests/e2e.test.mjs`: Generatoren mit gesätem
Zufall gegen ein unabhängiges Orakel (eigene Richtungs-Tabelle,
eigene Massstab-Umrechnung, neu aufgeschriebene Antwort-Tabelle für
die Pools), dazu die UI-Abläufe (Stufenleiter mit gesplitteten
Karten und offiziellen Buchstaben, Merkblatt-Links, Runden auf den
GA-Stufen inklusive «beide h-Karten fehlerfrei»-Regel, Deep-Link mit
bereinigter Adresse, Fehlerfluss, Persistenz, Medaillen, Reset,
Layout, Konsole, keine externen Requests).
