# PRD — Wordbau

Version: 1.0. Dieses Dokument ist die massgebende Spezifikation der App.
Verhalten und PRD werden immer in derselben Änderung angepasst.

## Zweck und Leitprinzip

Wordbau ist ein Übungsmodul der Lehrplan-Familie und folgt dem
Leitprinzip: **Eine App setzt genau eine Kompetenz des Lehrplans 21 um,
ihre Schwierigkeitsstufen sind die offiziellen Kompetenzstufen, ihre
Meilensteine die Grundansprüche.**

Umgesetzt ist FS2E.5.D.1 (Englisch, Grammatik): erste Bausteine mit
a/an, Mehrzahl und Wendungen (a), be und have, Personalpronomen und
Fragewörter (b), die he-Form, unregelmässige Mehrzahl, Präpositionen
und Wortfolge (c) sowie Verneinung, can und must und
Demonstrativpronomen (d).

**Bewusste Übersetzung:** Sprechen und freies Schreiben sind als
Erkennen und Einsetzen von Formen umgesetzt; die Stufen nennen
Strukturen aus den offiziellen Beispielen.

## Quelle

- Lehrplan 21, Ausgabe Kanton Bern, Stand 01.08.2022 (Datum in der
  Fusszeile des offiziellen PDF):
  https://be.lehrplan.ch/container/BE_DE_Gesamtausgabe.pdf,
  Kompetenzaufbau FS2E.5.D.1. Die Stufen a bis d sind die offiziellen
  Kompetenzstufen (a = Grundanspruch Zyklus 2, c = Zyklus 3).
- Aufgabentexte sind eigene, kindgerechte Formulierungen, keine
  Originaltexte; der offizielle Code steht sichtbar an jeder Stufe.
- Sprachliche Inhalte sind auf gesicherte Grundformen beschränkt
  (regelmässige Mehrzahl, be/have, he-Form, häufige Präpositionen).

## Inhalt und Aufgabenformen

Die regelmässige Mehrzahl und die he-Form werden generiert und von
der Suite mit eigener Regel-Tabelle unabhängig nachgerechnet
(unregelmässige Formen zuerst, sonst -s); alle übrigen Formen liegen
in festen Pools mit neu aufgeschriebener Antwort-Tabelle. Die
Generator-Listen enthalten nur Wörter mit reiner -s-Form; -es-Formen
(watch, go, do) liegen im Pool.

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
- `localStorage`-Schlüssel `wordbau.progress`; Reset im Footer mit
  Bestätigung. Keine externen Requests.

## Sprache und Gestaltung

UI einsprachig Deutsch (Schweizer Standarddeutsch), Lerninhalt
Englisch. Strings in `strings.js`. Tokens aus DESIGN.md,
Akzentfamilie **amber**, Atkinson Hyperlegible selbst gehostet,
Lucide-Icons inline, Cache-Busting `?v=1`.

## Tests

Playwright-Suite in `tests/e2e.test.mjs`: Generatoren mit gesätem
Zufall gegen ein unabhängiges Orakel (eigene Plural- und
he-Form-Regel), dazu die UI-Abläufe (Runden auf den GA-Stufen,
Fehlerfluss, Persistenz, Medaillen, Reset, Layout, Konsole, keine
externen Requests).
