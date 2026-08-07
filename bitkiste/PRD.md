# PRD — Bitkiste

Version: 1.0. Dieses Dokument ist die massgebende Spezifikation der App.
Verhalten und PRD werden immer in derselben Änderung angepasst.

## Zweck und Leitprinzip

Bitkiste ist ein Übungsmodul der Lehrplan-Familie und folgt dem
Leitprinzip: **Eine App setzt genau eine Kompetenz des Lehrplans 21 um,
ihre Schwierigkeitsstufen sind die offiziellen Kompetenzstufen, ihre
Meilensteine die Grundansprüche.**

Umgesetzt ist MI.2.1: Daten darstellen, strukturieren und
auswerten — ordnen nach Eigenschaften (a), Darstellungsformen (b),
Geheimschriften (c), Datenarten und Dateitypen (d/e), Baum- und
Netzstrukturen (f), fehlererkennende Codes als Prüfbit (g), sinnvolles
Ablegen (h), logische Operatoren (i), Datenbanken (j) und
Backup/Synchronisation/Versionierung (k).

**Bewusste Übersetzung:** Praktisches Arbeiten am Gerät ist als
Erkennen und Entscheiden umgesetzt (Welcher Ablageort ist am besten?).

## Quelle

- Lehrplan 21, Ausgabe Kanton Bern, Stand 01.08.2022 (Datum in der
  Fusszeile des offiziellen PDF):
  https://be.lehrplan.ch/container/BE_DE_Gesamtausgabe.pdf,
  Kompetenzaufbau MI.2.1. Die Stufen a bis k sind die offiziellen
  Kompetenzstufen (a = Grundanspruch Zyklus 1, e = Zyklus 2, j = Zyklus 3).
- Aufgabentexte sind eigene, kindgerechte Formulierungen, keine
  Originaltexte; der offizielle Code steht sichtbar an jeder Stufe.

## Inhalt und Aufgabenformen

Geheimschrift (Caesar-Verschiebung), Prüfbit (Parität) und Logik
(UND/ODER/NICHT) werden generiert und von der Suite mit eigener
Entschlüsselung beziehungsweise Auswertung unabhängig nachgerechnet;
die Wissens-Stufen liegen in festen Pools mit neu aufgeschriebener
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
- `localStorage`-Schlüssel `bitkiste.progress`; Reset im Footer mit
  Bestätigung. Keine externen Requests.

## Sprache und Gestaltung

Einsprachig Deutsch (Schweizer Standarddeutsch), Strings in
`strings.js`. Tokens aus DESIGN.md, Akzentfamilie **coral**,
Atkinson Hyperlegible selbst gehostet, Lucide-Icons inline,
Cache-Busting `?v=3`.

## Merkheft-Verbindung und Deep-Links

Jede Stufe trägt in `data.js` ein `merkblatt: { id, name }`: Die
App zeigt auf der Stufenkarte einen klar erkennbaren Link
«Merkblatt: …» (Chip mit Buch-Symbol und unterstrichenem Text) und
nach einer Runde mit Fehlern «Zum Nachlesen: …», beide auf
`../merkheft/<id>.html`. Die Links sind optional und nie eine
Bedingung; die Suite prüft, dass jede Stufenkarte einen trägt.
Zuordnung: a, b, f, h → daten-ordnen; c, g → codes; d, e → dateien; i, j → suchen; k → daten-sichern.

Deep-Links: `?stufe=<id>` startet die Stufe direkt. Die Query wird
nach dem Einstieg sofort aus der Adresse entfernt, damit sie beim
Neuladen oder Weitergeben nicht kleben bleibt.

## Tests

Playwright-Suite in `tests/e2e.test.mjs`: Generatoren mit gesätem
Zufall gegen ein unabhängiges Orakel, dazu die UI-Abläufe (Runden auf
den GA-Stufen, Fehlerfluss, Persistenz, Medaillen, Reset, Layout,
Konsole, keine externen Requests).
