# PRD — Zeitreise

Version: 1.1. Dieses Dokument ist die massgebende Spezifikation der App.
Verhalten und PRD werden immer in derselben Änderung angepasst.

## Zweck und Leitprinzip

Zeitreise ist ein Übungsmodul der Lehrplan-Familie und folgt dem
Leitprinzip: **Eine App setzt genau eine Kompetenz des Lehrplans 21 um,
ihre Schwierigkeitsstufen sind die offiziellen Kompetenzstufen, ihre
Meilensteine die Grundansprüche.**

Umgesetzt ist NMG.9.1: Zeitbegriffe anwenden, Zeit darstellen,
Dauer, Entwicklungen und Epochen einordnen — von gestern/heute/morgen,
Wochentagen und Monaten über Jahreszeiten, Uhr und Zeitstrahl bis zu
den Epochen (Steinzeit, Antike, Mittelalter, Neuzeit) und dem Rechnen
mit Jahrhunderten (Bundesbrief 1291 → 13. Jahrhundert).

**Bewusste Übersetzung:** Zeit erleben und selber messen ist als
Einordnen und Vergleichen umgesetzt; die App prüft das Verständnis,
nicht die Stoppuhr. NMG.9.1 endet im 2. Zyklus mit Übergang in den
3.; es gibt darum Grundanspruch-Stufen für die Zyklen 1 und 2.

## Quelle

- Lehrplan 21, Ausgabe Kanton Bern, Stand 01.08.2022 (Datum in der
  Fusszeile des offiziellen PDF):
  https://be.lehrplan.ch/container/BE_DE_Gesamtausgabe.pdf,
  Kompetenzaufbau NMG.9.1. Die Stufen a bis h sind die offiziellen
  Kompetenzstufen (c = Grundanspruch Zyklus 1, g = Zyklus 2).
- Aufgabentexte sind eigene, kindgerechte Formulierungen, keine
  Originaltexte; der offizielle Code steht sichtbar an jeder Stufe.

## Inhalt und Aufgabenformen

Der Inhalt liegt in Aufgaben-Pools pro Stufe in `gen.js`. Feste
Einträge tragen geprüftes Faktenwissen (Uhr, Dauer, Tagesstruktur,
Zeitstrahl, Generationen, Epochen, Ereignisse). Die Reihen der Stufen
a und b werden generiert, damit keine Runde der anderen gleicht:

- **Stufe a, Wochentage und Monate** (NMG.9.1.a, zeitliche Reihen und
  Listen): Vorgänger und Nachfolger im Kreis (nach Sonntag kommt
  Montag, nach Dezember Januar), «Welcher Tag liegt zwischen …?»,
  Lücke in einer Viererreihe, «Was gehört nicht dazu?», für Monate
  zusätzlich die Position im Jahr in beide Richtungen. Vorgänger,
  Nachfolger, Lücke und Position wechseln je zur Hälfte zwischen
  Tippen und Auswahl; Dazwischen und Fremdling sind immer Auswahl.
  Fest bleiben gestern/heute/morgen, 7 Tage, 12 Monate.
- **Stufe b, Jahreszeiten und Jahreskreis** (NMG.9.1.b): Reihenfolge
  der Jahreszeiten im Kreis (vor und nach), Jahreszeit eines Monats,
  die drei Monate einer Jahreszeit, der Monat, der nicht dazugehört,
  3 Monate pro Jahreszeit. Fest bleiben Schnee, 4 Jahreszeiten und
  die Uhr-Aufgaben.

**Jahreskreis-Konvention:** meteorologische Jahreszeiten der
Nordhalbkugel wie im Merkblatt (Frühling März bis Mai, Sommer Juni
bis August, Herbst September bis November, Winter Dezember bis
Februar). Die Aufgaben sagen darum «bei uns». Die App hat bewusst
keinen Länder-Schalter; NMG.9.1 ist an den Schweizer Kontext
gebunden.

Auswahl-Aufgaben haben höchstens drei Optionen. Getippte Namen zählen
unabhängig von Gross- und Kleinschreibung (mittwoch = Mittwoch):
geprüft wird die Zeitkompetenz, nicht die Rechtschreibung.

**Bewusst nicht enthalten** (strikte Prüfung gegen die Stufen a bis h
am 5. September 2026): Kalenderraster mit Datum und Wochentag,
Datumsformate (21.02. gegenüber 21. Februar), Tage pro Monat und
Schaltjahr, Abkürzungen (Mo., Jan.), 365 Tage und 52 Wochen,
Jahreszeiten-Merkmale (Blätter fallen, baden) sowie Rätselaufgaben.
Keine Stufe von NMG.9.1 nennt sie: Die Wörter Kalender, Schaltjahr
und Wochenende kommen im ganzen Lehrplan nicht vor, Datum nur in den
Fremdsprachen, Abkürzungen nur für Masseinheiten (MA.3.A.1), und
Jahreszeiten-Merkmale gehören zu NMG.4.4 (Wetterwarte). Was eine
Stufe nicht nennt, wird nicht ergänzt, auch wenn Schulbücher und
Arbeitsblätter es üben.

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
- `localStorage`-Schlüssel `zeitreise.progress`; Reset im Footer mit
  Bestätigung. Keine externen Requests.

## Sprache und Gestaltung

Einsprachig Deutsch (Schweizer Standarddeutsch), Strings in
`strings.js`. Tokens aus DESIGN.md, Akzentfamilie **amber**,
Atkinson Hyperlegible selbst gehostet, Lucide-Icons inline,
Cache-Busting `?v=8`. Bewegung nur als
Zustandswechsel: Fortschrittsbalken wachsen über `transform: scaleX`
(240 ms), Antwortknöpfe drücken sich beim Antippen ein (120 ms); bei
reduzierter Bewegung springen die Balken, die Knöpfe bleiben still, und
jeder Zustand bleibt sichtbar. Speichern in localStorage ist gegen
blockierten Speicher (privater Modus) abgesichert. Der Aufgabenschirm
trägt die Stufenzeile als h1 und die Frage als h2; bei Auswahlaufgaben
liegt der Fokus nach dem Rendern auf der ersten Antwort, beim Reset auf
der Bestätigung. Neben einem Stufenvorschlag ist «Noch eine Runde» der
Zweitknopf. Über der Stufenleiter filtert eine
Zykluswahl («Alle Stufen», «Zyklus 1» …) die Anzeige: Inhalt wie die
Zykluswahl im Kompass, keine Einstellung; sie sperrt nichts, Standard
«Alle Stufen», gespeichert unter `<app>.zyklus`, beim Zurücksetzen
gelöscht. Apps mit nur einem Zyklus zeigen keine Zykluswahl.

## Merkheft-Verbindung und Deep-Links

Jede Stufe trägt in `data.js` ein `merkblatt: { id, name }`: Die
App zeigt auf der Stufenkarte einen klar erkennbaren Link
«Merkblatt: …» (Fusszeile der Stufenkarte mit Buch-Symbol) und
nach einer Runde mit Fehlern «Zum Nachlesen: …», beide auf
`../merkheft/<id>.html`. Die Links sind optional und nie eine
Bedingung; die Suite prüft, dass jede Stufenkarte einen trägt.
Zuordnung: a, b, c, d → kalender; e, f, g, h → zeitstrahl.

Deep-Links: `?stufe=<id>` startet die Stufe direkt. Die Query wird
nach dem Einstieg sofort aus der Adresse entfernt, damit sie beim
Neuladen oder Weitergeben nicht kleben bleibt; die Runde erhält ihren
eigenen Verlaufseintrag (`#stufe/<id>`) hinter der Übersicht.

## Navigation

Jede Ansicht beginnt mit dem Pfad «Lehrplan-Apps › Übungs-Apps ›
App» (Breadcrumb, `nav[aria-label="Pfad"]`, Links auf `../` und
`../ueben/`). In Runde, Abschluss und Medaillen ist die App-Ebene ein
Link und die Ansicht («Stufe x», «Medaillen») der letzte Eintrag.
Eine Runde ist ein eigener Verlaufseintrag (`#stufe/<id>`):
Browser-Zurück führt zur Übersicht; «Abbrechen», «Zur Übersicht» und
der App-Link im Pfad bauen den Eintrag über den Verlauf ab, sodass
ein weiteres Zurück dorthin führt, woher man kam, etwa ins Merkblatt.
Der Stufenvorschlag nach einer Runde ersetzt den Eintrag. Der frühere
Fusszeilen-Link «Zur App-Übersicht» ist durch den Pfad ersetzt.

## Tests

Playwright-Suite in `tests/e2e.test.mjs`: Generatoren mit gesätem
Zufall gegen ein unabhängiges Orakel (Antwort-Tabelle für die festen
Aufgaben, eigener Löser mit eigenen Tages-, Monats- und
Jahreszeitentabellen für die generierten), Varianz der Stufen a und b
(mindestens 60 beziehungsweise 25 verschiedene Aufgaben in 50 Runden),
dazu die UI-Abläufe (Runden auf a, b und den GA-Stufen,
Kleinschreibung beim Tippen, Fehlerfluss, Persistenz, Medaillen,
Reset, Layout auch in der Aufgabenansicht, Konsole, keine externen
Requests).
