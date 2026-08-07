# PRD — Artenreich

Version: 1.0. Dieses Dokument ist die massgebende Spezifikation der App.
Verhalten und PRD werden immer in derselben Änderung angepasst.

## Zweck und Leitprinzip

Artenreich ist ein Übungsmodul der Lehrplan-Familie und folgt dem
Leitprinzip: **Eine App setzt genau eine Kompetenz des Lehrplans 21 um,
ihre Schwierigkeitsstufen sind die offiziellen Kompetenzstufen, ihre
Meilensteine die Grundansprüche.**

Umgesetzt ist NMG.2.4: die Artenvielfalt von Pflanzen und Tieren
erkennen und kategorisieren — Merkmale von Tiergruppen (a), Zuordnen
von Laub- und Nadelbäumen sowie Wild-, Nutz- und Heimtieren (b),
Vogelgruppen und Zug-/Standvögel (c), Anpassung an den Lebensraum
(d), Ordnen mit Kriterien wie Blattform und Körperbau (e) sowie
gebräuchliche Ordnungssysteme wie Insektengruppen und krautig/holzig
(f).

**Bewusste Übersetzung:** Untersuchen im Gelände mit Lupe und
Feldstecher ist als Erkennen und Zuordnen von Merkmalen umgesetzt.

## Quelle

- Lehrplan 21, Ausgabe Kanton Bern, Stand 01.08.2022 (Datum in der
  Fusszeile des offiziellen PDF):
  https://be.lehrplan.ch/container/BE_DE_Gesamtausgabe.pdf,
  Kompetenzaufbau NMG.2.4. Die Stufen a bis f sind die offiziellen
  Kompetenzstufen (b = Grundanspruch Zyklus 1, e = Zyklus 2).
- Aufgabentexte sind eigene, kindgerechte Formulierungen, keine
  Originaltexte; der offizielle Code steht sichtbar an jeder Stufe.
- Artenwissen ist auf gesicherte, einheimische Beispiele beschränkt.

## Inhalt und Aufgabenformen

Die Zuordnungen der Stufe b werden aus festen Merkmal-Tabellen
(Bäume, Tiere) generiert und von der Suite mit einer eigenen, neu
aufgeschriebenen Tabelle unabhängig geprüft; alle übrigen Stufen
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
- `localStorage`-Schlüssel `artenreich.progress`; Reset im Footer mit
  Bestätigung. Keine externen Requests.

## Sprache und Gestaltung

Einsprachig Deutsch (Schweizer Standarddeutsch), Strings in
`strings.js`. Tokens aus DESIGN.md, Akzentfamilie **sage**,
Atkinson Hyperlegible selbst gehostet, Lucide-Icons inline,
Cache-Busting `?v=3`.

## Merkheft-Verbindung und Deep-Links

Jede Stufe trägt in `data.js` ein `merkblatt: { id, name }`: Die
App zeigt auf der Stufenkarte einen klar erkennbaren Link
«Merkblatt: …» (Chip mit Buch-Symbol und unterstrichenem Text) und
nach einer Runde mit Fehlern «Zum Nachlesen: …», beide auf
`../merkheft/<id>.html`. Die Links sind optional und nie eine
Bedingung; die Suite prüft, dass jede Stufenkarte einen trägt.
Zuordnung: a, c → tiergruppen; b → baeume; d → lebensraeume; e, f → bestimmen.

Deep-Links: `?stufe=<id>` startet die Stufe direkt. Die Query wird
nach dem Einstieg sofort aus der Adresse entfernt, damit sie beim
Neuladen oder Weitergeben nicht kleben bleibt.

## Tests

Playwright-Suite in `tests/e2e.test.mjs`: Generatoren mit gesätem
Zufall gegen ein unabhängiges Orakel (eigene Zuordnungs-Tabelle, neu
aufgeschriebene Antwort-Tabelle), dazu die UI-Abläufe (Runden auf den
GA-Stufen, Fehlerfluss, Persistenz, Medaillen, Reset, Layout,
Konsole, keine externen Requests).
