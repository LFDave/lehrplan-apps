# PRD — Rechenturm

Version: 1.0. Dieses Dokument ist die massgebende Spezifikation der App.
Verhalten und PRD werden immer in derselben Änderung angepasst.

## Zweck und Leitprinzip

Rechenturm ist ein Übungsmodul der Lehrplan-Familie und folgt dem
Leitprinzip: **Eine App setzt genau eine Kompetenz des Lehrplans 21 um,
ihre Schwierigkeitsstufen sind die offiziellen Kompetenzstufen, ihre
Meilensteine die Grundansprüche.**

Umgesetzt ist MA.1.A.3 (Ausgabe Kanton Bern): "Die Schülerinnen und
Schüler können addieren, subtrahieren, multiplizieren, dividieren und
potenzieren." Die zehn Stufen a bis j der App sind die zehn offiziellen
Kompetenzstufen dieser Kompetenz, in der Reihenfolge des Lehrplans, mit
ihren Zyklen und den Grundanspruch-Markierungen (b = Grundanspruch
Zyklus 1, f = Zyklus 2; h ist eine Erweiterung).

Zwei bewusste Übersetzungen gegenüber dem Lehrplantext:

- **Kein Grundanspruch im 3. Zyklus.** Der Lehrplan setzt bei diesem
  Kompetenzaufbau für den 3. Zyklus keinen Grundanspruch. Die App
  erfindet keinen; als Gegenstück gibt es die Medaille "Turmspitze"
  für eine fehlerfreie Runde auf der obersten Stufe j.
- **Rechner-Teile als Kopfrechnen.** Stufenteile, die laut Lehrplan mit
  dem Rechner ausgeführt werden (etwa dividieren und potenzieren in den
  oberen Stufen), sind als Kopfrechnen mit einfachen, dafür geeigneten
  Zahlen umgesetzt. Die App prüft das Verständnis der Operation, nicht
  die Bedienung eines Rechners.

## Quelle

- Lehrplan 21, Ausgabe Kanton Bern (be.lehrplan.ch, Gesamtausgabe PDF),
  Kompetenzaufbau MA.1.A.3 inklusive Zyklusbänder und
  Grundanspruch-Markierung.
- Stufentitel und -beschreibungen sind kindgerechte Umschreibungen,
  keine Originaltexte; der offizielle Code (MA.1.A.3.a bis .j) steht
  sichtbar an jeder Stufe.

## Stufen und Aufgabenformen

Alle Generatoren leben in `gen.js` (rein, ohne DOM, injizierbarer
Zufall). Aufgaben sind getippt (`typed`) oder Auswahl (`mc`).

- **a** (Z1): plus/minus bis 20, verdoppeln, halbieren.
- **b** (Z1, GA): bis 100 ohne Zehnerübergang, auf den Zehner ergänzen,
  runde Zahlen verdoppeln und halbieren.
- **c** (Z1+Z2): bis 100 mit Übergang, Einmaleins mit 2, 5 und 10.
- **d** (Z2): schriftliche Addition/Subtraktion (mehrstellig),
  ganzes Einmaleins.
- **e** (Z2): grosse Zahlen im Kopf (z. B. 320'000 + 38'000),
  Zehnerzahlen multiplizieren.
- **f** (Z2, GA): Dezimalzahlen addieren und subtrahieren. Die
  Zehntel heben sich nie auf; jede Antwort hat genau eine
  Dezimalstelle, damit die Längen-Autoprüfung ehrlich bleibt (ein Kind
  tippt "36", nie "36.0").
- **g** (Z2+Z3): Dezimalzahlen und grosse Zahlen multiplizieren.
- **h** (Z3, Erweiterung): Prozente berechnen, Zahlen in Primfaktoren
  zerlegen (Auswahl; der falsche Zerlegungs-Ablenker nutzt echte
  Teiler, nie 2 · ungerade Hälfte).
- **i** (Z3): negative Zahlen, Brüche addieren, Potenzen und
  Quadratwurzeln auswerten.
- **j** (Z3): Potenzregeln anwenden (aⁿ · aᵐ, Unicode-Superscripts)
  und wissenschaftliche Schreibweise umwandeln.

## Kernablauf

1. Übersicht: Titel, Statistikzeile (Level, XP, Fortschrittsbalken,
   Medaillenzahl; führt zur Medaillengalerie), Stufenleiter a bis j.
   Jede Stufe zeigt Titel, Beschreibung, Zyklus, Code, gegebenenfalls
   Grundanspruch-Abzeichen oder Erweiterungs-Etikett und die Zahl der
   gespielten Runden. Keine Stufe ist je gesperrt.
2. Eine Runde hat 8 Aufgaben aus den Aufgabenformen der Stufe.
3. Getippte Antworten prüfen sich beim letzten Zeichen selbst (Muster
   "Known-length input", Hinweistext sichtbar, WCAG 3.2.2). Immer wird
   die ganze Antwort geprüft, nie einzelne Zeichen. Ergebnisse
   erscheinen in einer role="status"-Region.
4. Fehler: Markierung, unterstützende Rückmeldung, Korrektur jederzeit
   möglich, kein Zeitdruck, keine XP-Abzüge.
5. Abschluss-Screen: gelöste Aufgaben, XP-Gewinn, Level mit Balken,
   neue Medaillen als ruhiger Block, gegebenenfalls Stufenvorschlag,
   "Noch eine Runde" und "Zur Übersicht".

## Zahlenraum-Regel

Der Zahlenraum der Stufe begrenzt jede Zahl der Aufgabe, auch das
Ergebnis; Generatoren wählen zuerst das Ergebnis beziehungsweise
begrenzen die Operanden so, dass die Summe im Raum bleibt.

## Gamification (nach GAMIFICATION.md)

- XP pro abgeschlossener Runde: gelöste Aufgaben plus Stufentiefe
  (a = +1 bis j = +10). Nie für Tempo, Fehler kosten nichts, XP sinken
  nie.
- Levels (kumulative XP): Steinleger 0, Maurer 25, Baumeister 90,
  Turmwächter 220, Turmmeister 500. Level 2 kommt in der ersten
  Sitzung.
- Medaillen als reine Funktionen der Zähler: Runden (1, 3, 8, 21, 55),
  gelöste Aufgaben (50, 200, 800), Grundanspruch Zyklus 1/2 (je eine
  fehlerfreie Runde auf Stufe b/f), Turmspitze (fehlerfreie Runde auf
  Stufe j), alle Stufen entdeckt. Gesperrte Medaillen bleiben mit Name
  und Beschreibung sichtbar.
- Stufenvorschlag: 5 fehlerfreie Runden in Folge auf einer Stufe
  schlagen auf dem Abschluss-Screen die nächste Stufe vor
  (Ein-Tipp-Start). Nie erzwungen; eine Runde mit Fehlern setzt die
  Serie still zurück, mit vollen XP.

## Persistenz

- `localStorage`, Schlüssel `rechenturm.progress` (XP, Runden,
  Aufgaben, pro Stufe Runden/fehlerfreie Runden/Serie).
- Reset im Footer der Übersicht mit Bestätigung, die den
  Gerätespeicher nennt. Keine Konten, keine Analytik, keine externen
  Requests.

## Sprache und Gestaltung

- v1 einsprachig Deutsch (Schweizer Standarddeutsch, ss statt ß); alle
  UI-Texte in `strings.js` mit stabilen IDs. Keine
  Einstellungen-Ansicht, solange es nichts zu konfigurieren gibt.
- Tokens aus DESIGN.md, Akzentfamilie **coral**, Atkinson Hyperlegible
  selbst gehostet, Lucide-Icons inline, Cache-Busting `?v=1`.
- Schweizer Zahlformat: Tausendertrennung mit Apostroph (320'000),
  Dezimalpunkt wie im Lehrplan. Potenzen als Unicode-Superscripts.

## Tests

Playwright-Suite in `tests/e2e.test.mjs`:

- Generatoren mit gesätem Zufall (500 Runden pro Stufe), geprüft gegen
  ein unabhängiges Orakel, das die angezeigten Ausdrücke selbst parst
  und nachrechnet (inklusive Superscript-Potenzen und
  wissenschaftlicher Schreibweise). Zusätzlich muss die getippte Form
  der Orakel-Antwort dem erwarteten Antwort-String exakt entsprechen,
  damit die Längen-Autoprüfung nie ins Leere läuft.
- Cache-Busting-Konsistenz, kein ß, Levelkurve (Level 2 in der ersten
  Sitzung erreichbar).
- UI-Abläufe: volle Runden (Tippen und Auswahl), Belohnungen,
  Persistenz über Reload, Fehler-und-Korrektur, Medaillengalerie,
  Reset, kein horizontales Scrollen bei 320px, Konsole ohne Fehler,
  keine externen Requests.

## Ausblick (nicht Teil von v1)

- Schriftliche Verfahren mit Stellenwert-Darstellung.
- Weitere Sprachen.
