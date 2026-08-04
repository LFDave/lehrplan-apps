# PRD — Spellwerk

Version: 1.0. Dieses Dokument ist die massgebende Spezifikation der App.
Verhalten und PRD werden immer in derselben Änderung angepasst.

## Zweck und Leitprinzip

Spellwerk ist ein Übungsmodul der Lehrplan-Familie und folgt dem
Leitprinzip: **Eine App setzt genau eine Kompetenz des Lehrplans 21 um,
ihre Schwierigkeitsstufen sind die offiziellen Kompetenzstufen, ihre
Meilensteine die Grundansprüche.**

Umgesetzt ist FS2E.5.E.1 (Englisch, Rechtschreibung): Wörter korrekt
abschreiben (a), Wendungen und kurze Sätze abschreiben und
Satzzeichen setzen (b), häufige Formen wie I am und they are korrekt
schreiben (c) sowie Schreibfehler finden und schwierige Wörter
meistern (d).

**Bewusste Übersetzung:** Eigene Texte sind als Abschreiben, Ergänzen
und Prüfen von Wörtern und Wendungen umgesetzt. Das Abschreiben ist
wörtlich aus der Stufe übernommen (können ... korrekt abschreiben).

## Quelle

- Lehrplan 21, Ausgabe Kanton Bern, Stand 01.08.2022 (Datum in der
  Fusszeile des offiziellen PDF):
  https://be.lehrplan.ch/container/BE_DE_Gesamtausgabe.pdf,
  Kompetenzaufbau FS2E.5.E.1. Die Stufen a bis d sind die offiziellen
  Kompetenzstufen (b = Grundanspruch Zyklus 2, c = Zyklus 3).
- Aufgabentexte sind eigene, kindgerechte Formulierungen, keine
  Originaltexte; der offizielle Code steht sichtbar an jeder Stufe.

## Inhalt und Aufgabenformen

Das Abschreiben von Wörtern (a) und Sätzen (b) wird generiert; die
Vorlage steht in der Aufgabe, die Suite prüft die Identität
unabhängig. Häufige Formen, Lücken, Schreibvarianten und die
Fehlerjagd liegen in festen Pools mit neu aufgeschriebener
Antwort-Tabelle. Die Prüfung achtet auf Gross- und Kleinschreibung;
das grosse I und grosse Wochentage gehören zur Rechtschreibung.

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
- `localStorage`-Schlüssel `spellwerk.progress`; Reset im Footer mit
  Bestätigung. Keine externen Requests.

## Sprache und Gestaltung

UI einsprachig Deutsch (Schweizer Standarddeutsch), Lerninhalt
Englisch. Strings in `strings.js`. Tokens aus DESIGN.md,
Akzentfamilie **blue**, Atkinson Hyperlegible selbst gehostet,
Lucide-Icons inline, Cache-Busting `?v=1`.

## Tests

Playwright-Suite in `tests/e2e.test.mjs`: Generatoren mit gesätem
Zufall gegen ein unabhängiges Orakel (Abschreib-Identität, neu
aufgeschriebene Antwort-Tabelle), dazu die UI-Abläufe (Runden auf den
GA-Stufen, Fehlerfluss, Persistenz, Medaillen, Reset, Layout,
Konsole, keine externen Requests).
