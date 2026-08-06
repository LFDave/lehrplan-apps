# PRD — Buchstabenleiter

Version: 1.0. Dieses Dokument ist die massgebende Spezifikation der App.
Verhalten und PRD werden immer in derselben Änderung angepasst.

## Zweck und Leitprinzip

Buchstabenleiter ist ein Übungsmodul der Lehrplan-Familie und folgt dem
Leitprinzip: **Eine App setzt genau eine Kompetenz des Lehrplans 21 um,
ihre Schwierigkeitsstufen sind die offiziellen Kompetenzstufen, ihre
Meilensteine die Grundansprüche.**

Umgesetzt ist D.5.E.1: das ABC kennen, Rechtschreibregeln und
Nachschlage-Strategien nutzen — ABC-Nachbarn mit Hilfe (a), das ABC
auswendig mit Silben und sp/st (b), Vokale, Wortstämme und
ABC-Gruppen (c), Wörterbuch-Reihenfolge und Stammregel (d),
Wortbausteine wie Frei-heit (e), Nominalisierungen wie «beim Essen»
und das Höflichkeits-«Sie» (f) sowie «alles Gute» und Strategien für
schwierige Wörter (g).

**Bewusste Übersetzung:** Das Nachschlagen im echten Wörterbuch ist
als ABC-Wissen und Entscheiden umgesetzt (Welches Wort steht zuerst?
Wo suchst du?).

## Quelle

- Lehrplan 21, Ausgabe Kanton Bern, Stand 01.08.2022 (Datum in der
  Fusszeile des offiziellen PDF):
  https://be.lehrplan.ch/container/BE_DE_Gesamtausgabe.pdf,
  Kompetenzaufbau D.5.E.1. Die Stufen a bis g sind die offiziellen
  Kompetenzstufen (b = Grundanspruch Zyklus 1, d = Zyklus 2, f = Zyklus 3).
- Aufgabentexte sind eigene, kindgerechte Formulierungen, keine
  Originaltexte; der offizielle Code steht sichtbar an jeder Stufe.

## Inhalt und Aufgabenformen

ABC-Nachbarn, Vokale, ABC-Gruppen und die Wörterbuch-Reihenfolge
werden generiert und von der Suite mit eigener ABC-Tabelle und
eigenem Wortvergleich unabhängig nachgerechnet; die Regel-Stufen
liegen in festen Pools mit neu aufgeschriebener Antwort-Tabelle.
Getippte Buchstaben-Aufgaben akzeptieren Gross- und Kleinschreibung
(`ci`-Flag); bei Rechtschreib-Aufgaben zählt die Grossschreibung.

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
- `localStorage`-Schlüssel `buchstabenleiter.progress`; Reset im
  Footer mit Bestätigung. Keine externen Requests.

## Sprache und Gestaltung

Einsprachig Deutsch (Schweizer Standarddeutsch), Strings in
`strings.js`. Tokens aus DESIGN.md, Akzentfamilie **amber**,
Atkinson Hyperlegible selbst gehostet, Lucide-Icons inline,
Cache-Busting `?v=2`.

**Gesplittete Stufe c.** Die offizielle Stufe c mischt Vokale und
ABC-Gruppen; für Kinder sind das zwei Konzepte. Die App zeigt darum
zwei Karten: **c-vokale** «Vokale und Konsonanten» (mit neuer
Frageform «Welcher dieser Buchstaben ist ein Vokal?») und
**c-gruppen** «ABC-Gruppen» (mit neuer Frageform «Steht das B im ABC
vor oder nach dem K?»). Beide zeigen Buchstabe und Code der
offiziellen Stufe c (Feld `code` in `data.js`; die `id` bleibt der
Speicher- und Link-Schlüssel). Die Stamm- und Nachschlage-Fragen der
alten c-Karte gehören thematisch zu Stufe d und sind dorthin
gezogen.

## Merkheft-Verbindung und Deep-Links

Deep-Links: `?stufe=<id>` startet die Stufe direkt (auch Teilstufen
wie `c-vokale`). Die Query wird nach dem Einstieg sofort aus der
Adresse entfernt; die Suite prüft Einstieg und bereinigte Adresse.

## Tests

Playwright-Suite in `tests/e2e.test.mjs`: Generatoren mit gesätem
Zufall gegen ein unabhängiges Orakel (eigene ABC-Tabelle, eigener
Wortvergleich), dazu die UI-Abläufe (Runden auf den GA-Stufen,
Fehlerfluss, Persistenz, Medaillen, Reset, Layout, Konsole, keine
externen Requests).
