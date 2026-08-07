# PRD — Schreibprobe

Version: 1.0. Dieses Dokument ist die massgebende Spezifikation der App.
Verhalten und PRD werden immer in derselben Änderung angepasst.

## Zweck und Leitprinzip

Schreibprobe ist ein Übungsmodul der Lehrplan-Familie und folgt dem
Leitprinzip: **Eine App setzt genau eine Kompetenz des Lehrplans 21 um,
ihre Schwierigkeitsstufen sind die offiziellen Kompetenzstufen, ihre
Meilensteine die Grundansprüche.**

Umgesetzt ist D.4.F.1: Texte sprachformal überarbeiten und dabei
Rechtschreibregeln beachten. Jede Stufe übt exakt die Regeln, die ihr
offizieller Stufentext nennt — von Satzanfang gross und Punkt am
Satzende (a) über sp-/st-, ie- und ä-Schreibung, Wortstamm- und
Doppelkonsonantenregel bis zu Kommas vor dass-Sätzen und der
selbstständigen Fehlersuche (g).

**Bewusste Übersetzung:** Das Überarbeiten eigener Texte ist als
Prüfen und Korrigieren vorgegebener Wörter und Sätze umgesetzt; die
App prüft die Regelkenntnis. Diese App ist die präzise
Neu-Implementation der Kompetenz; die ältere Wortwerkstatt bleibt als
eigenständige App im Repo small-apps.

## Quelle

- Lehrplan 21, Ausgabe Kanton Bern, Stand 01.08.2022 (Datum in der
  Fusszeile des offiziellen PDF):
  https://be.lehrplan.ch/container/BE_DE_Gesamtausgabe.pdf,
  Kompetenzaufbau D.4.F.1. Die Stufen a bis g sind die offiziellen
  Kompetenzstufen (a = Grundanspruch Zyklus 1, d = Zyklus 2, f = Zyklus 3).
- Aufgabentexte sind eigene, kindgerechte Formulierungen, keine
  Originaltexte; der offizielle Code steht sichtbar an jeder Stufe.

## Inhalt und Aufgabenformen

Der Inhalt liegt in festen Aufgaben-Pools pro Stufe (`POOLS` in
gen.js): richtige und falsche Schreibvarianten, getippte Korrekturen
("Schreibe richtig: Schtein" → Stein), Lücken-Entscheide (isst/ist,
das/dass) und Fehlersuche in Sätzen. Die Suite prüft jede Aufgabe
gegen unabhängig neu aufgeschriebene Wortlisten (WRONG-Liste plus
Antwort-Tabelle).

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
- `localStorage`-Schlüssel `schreibprobe.progress`; Reset im Footer mit
  Bestätigung. Keine externen Requests.

## Sprache und Gestaltung

Einsprachig Deutsch (Schweizer Standarddeutsch), Strings in
`strings.js`. Tokens aus DESIGN.md, Akzentfamilie **coral**,
Atkinson Hyperlegible selbst gehostet, Lucide-Icons inline,
Cache-Busting `?v=4`.

**Gesplittete Stufe c.** Die offizielle Stufe c mischt
Rechtschreibung (ie, ä) und Zeichensetzung (Kommas); die App zeigt
zwei Karten: **c-schreibung** «ie und ä» und **c-kommas** «Kommas bei
Aufzählungen», beide mit erweiterten Aufgabenpools (elf Schreibungs-
und acht Komma-Einträge). Beide zeigen Buchstabe und Code der
offiziellen Stufe c (Feld `code`).

## Merkheft-Verbindung und Deep-Links

Deep-Links: `?stufe=<id>` startet die Stufe direkt (auch Teilstufen
wie `c-kommas`). Die Query wird nach dem Einstieg sofort aus der
Adresse entfernt; die Suite prüft Einstieg und bereinigte Adresse.

## Tests

Playwright-Suite in `tests/e2e.test.mjs`: Generatoren mit gesätem
Zufall gegen ein unabhängiges Orakel, dazu die UI-Abläufe (Runden auf
den GA-Stufen, Fehlerfluss, Persistenz, Medaillen, Reset, Layout,
Konsole, keine externen Requests).
