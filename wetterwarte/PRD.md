# PRD — Wetterwarte

Version: 1.0. Dieses Dokument ist die massgebende Spezifikation der App.
Verhalten und PRD werden immer in derselben Änderung angepasst.

## Zweck und Leitprinzip

Wetterwarte ist ein Übungsmodul der Lehrplan-Familie und folgt dem
Leitprinzip: **Eine App setzt genau eine Kompetenz des Lehrplans 21 um,
ihre Schwierigkeitsstufen sind die offiziellen Kompetenzstufen, ihre
Meilensteine die Grundansprüche.**

Umgesetzt ist NMG.4.4: Wetterphänomene beobachten und Naturereignisse
einschätzen. Die Kompetenz hat zwei offizielle Stufenreihen, beide
sind vollständig abgebildet: **1a bis 1g (Wetter)** — Wetter erleben,
seine Bedeutung, Beobachten, Jahreszeiten, Messen, Prognosen und
Zusammenhänge wie der Wasserkreislauf — und **2a bis 2e
(Naturereignisse)** — Ereignisse kennen, Schutzregeln, Spuren lesen,
Gefahren verstehen und richtig handeln. Pro Zyklus gibt es darum zwei
Grundansprüche (1b und 2b im Zyklus 1, 1f und 2e im Zyklus 2); die
GA-Medaillen sind pro Stufe eindeutig benannt (Wetter,
Naturereignisse).

**Bewusste Übersetzung:** Eigenes Beobachten und Messen ist als
Wissen über Phänomene, Messgeräte und Verhaltensregeln umgesetzt.

## Quelle

- Lehrplan 21, Ausgabe Kanton Bern, Stand 01.08.2022 (Datum in der
  Fusszeile des offiziellen PDF):
  https://be.lehrplan.ch/container/BE_DE_Gesamtausgabe.pdf,
  Kompetenzaufbau NMG.4.4 mit den zwei Stufenreihen.
- Aufgabentexte sind eigene, kindgerechte Formulierungen, keine
  Originaltexte; der offizielle Code steht sichtbar an jeder Stufe.
- Inhalte sind auf gesichertes Grundwissen und offizielle
  Verhaltensempfehlungen beschränkt.

## Inhalt und Aufgabenformen

Die Temperatur-Differenz (1e, auch über null hinweg) und die
Blitz-Donner-Distanz (1g, 3 Sekunden pro Kilometer) werden generiert
und von der Suite unabhängig nachgerechnet; alle übrigen Stufen
liegen in festen Pools mit neu aufgeschriebener Antwort-Tabelle.

## Kernablauf, Eingabe, Gamification, Persistenz

Wie in der Familie üblich: Übersicht mit Stufenleiter, Runden mit 8
Aufgaben, Auswahl-Aufgaben werten beim Antippen, getippte Antworten
prüfen sich bei erwarteter Länge selbst und zusätzlich mit Enter.
Fehler kosten nichts; Ergebnisse erscheinen in einer
role="status"-Region.

- XP: gelöste Aufgaben plus Stufentiefe; fünf Levels (25/90/220/500).
- Medaillen: Runden (1, 3, 8, 21, 55), Aufgaben (50, 200, 800), eine
  Grundanspruch-Medaille pro GA-Stufe (vier Stück), alle Stufen
  entdeckt.
- Stufenvorschlag nach 5 fehlerfreien Runden in Folge, nie erzwungen.
- `localStorage`-Schlüssel `wetterwarte.progress`; Reset im Footer
  mit Bestätigung. Keine externen Requests.

## Sprache und Gestaltung

Einsprachig Deutsch (Schweizer Standarddeutsch), Strings in
`strings.js`. Tokens aus DESIGN.md, Akzentfamilie **violet**,
Atkinson Hyperlegible selbst gehostet, Lucide-Icons inline,
Cache-Busting `?v=5`.

## Merkheft-Verbindung

Stufe 1g trägt in `data.js` ein `merkblatt: { id, name }`: Die App
zeigt auf der Stufenkarte einen klar erkennbaren Link
«Merkblatt: …» (Chip mit Buch-Symbol und unterstrichenem Text) und
nach einer Runde mit Fehlern «Zum Nachlesen: …», beide auf
`../merkheft/<id>.html` (wasserkreislauf.html, «Wasserkreislauf»). Die Links sind optional und nie
eine Bedingung; die Suite prüft sie.

Deep-Links: `?stufe=<id>` startet die Stufe direkt. Die Query wird
nach dem Einstieg sofort aus der Adresse entfernt, damit sie beim
Neuladen oder Weitergeben nicht kleben bleibt; die Suite prüft
Einstieg und bereinigte Adresse.

## Tests

Playwright-Suite in `tests/e2e.test.mjs`: Generatoren mit gesätem
Zufall gegen ein unabhängiges Orakel (eigene Temperatur- und
Distanz-Rechnung, neu aufgeschriebene Antwort-Tabelle), dazu die
UI-Abläufe (Runden auf allen vier GA-Stufen, Fehlerfluss,
Persistenz, Medaillen, Reset, Layout, Konsole, keine externen
Requests).
