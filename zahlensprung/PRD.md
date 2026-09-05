# PRD — Zahlensprung

Version: 1.0. Dieses Dokument ist die massgebende Spezifikation der App.
Verhalten und PRD werden immer in derselben Änderung angepasst.

## Zweck und Leitprinzip

Zahlensprung ist das erste Übungsmodul der Lehrplan-Familie und der
Konzepttest für das Leitprinzip: **Eine App setzt genau eine Kompetenz des
Lehrplans 21 um, ihre Schwierigkeitsstufen sind die offiziellen
Kompetenzstufen, ihre Meilensteine die Grundansprüche.**

Umgesetzt ist MA.1.A.2 (Ausgabe Kanton Bern): "Die Schülerinnen und Schüler
können flexibel zählen, Zahlen nach der Grösse ordnen und Ergebnisse
überschlagen." Die zehn Stufen a bis j der App sind die zehn offiziellen
Kompetenzstufen dieser Kompetenz, in der Reihenfolge des Lehrplans, mit
ihren Zyklen und den Grundanspruch-Markierungen (c = Grundanspruch Zyklus 1,
g = Zyklus 2, j = Zyklus 3; i ist eine Erweiterung). Die Zahlenräume und
Schrittweiten der Generatoren stammen direkt aus den Stufentexten
(Zahlenraum 20/100/1000/1 Million, Dezimalschritte wie 0.005, Brüche,
Prozent-Überschläge, negative Zahlen).

## Quelle

- Lehrplan 21, Ausgabe Kanton Bern (be.lehrplan.ch, Gesamtausgabe PDF),
  Kompetenzaufbau MA.1.A.2 inklusive Zyklusbänder und
  Grundanspruch-Markierung.
- Stufentitel und -beschreibungen sind kindgerechte Umschreibungen, keine
  Originaltexte; der offizielle Code (MA.1.A.2.a bis .j) steht sichtbar an
  jeder Stufe.

## Kernablauf

1. Übersicht: Titel, Statistikzeile (Level, XP, Fortschrittsbalken,
   Medaillenzahl; führt zur Medaillengalerie), Stufenleiter a bis j.
   Jede Stufe zeigt Titel, Beschreibung, Zyklus, Code, gegebenenfalls
   Grundanspruch-Abzeichen oder Erweiterungs-Etikett und die Zahl der
   gespielten Runden. Keine Stufe ist je gesperrt.
2. Eine Runde hat 8 Aufgaben aus den Aufgabenformen der Stufe:
   - **Punkte zählen** (Stufe a): Punkte in 5er-Gruppen zählen, Anzahl
     tippen.
   - **Zahlenfolge** (b bis g): vier Glieder einer Reihe, das fünfte
     tippen. Vorwärts und rückwärts, Schrittweiten gemäss Stufe.
   - **Ordnen** (a, c, e, f, g, j): vier Zahlen von der kleinsten zur
     grössten antippen. Dezimalzahlen mit ähnlichen Ziffern, negative
     Zahlen auf Stufe j.
   - **Überschlagen** (g, h, i): Ausdruck mit drei Antwortflächen; die
     richtige ist der sinnvolle Überschlag, die Ablenker liegen in
     falscher Grössenordnung.
3. Getippte Antworten prüfen sich beim letzten Zeichen selbst (Muster
   "Known-length input", Hinweistext sichtbar, WCAG 3.2.2); geordnet wird
   erst ausgewertet, wenn alle Zahlen gewählt sind. Immer wird die ganze
   Antwort geprüft, nie einzelne Zeichen. Ergebnisse erscheinen in einer
   role="status"-Region.
4. Fehler: Markierung, unterstützende Rückmeldung ("Fast. Versuch es noch
   einmal."), Korrektur jederzeit möglich, kein Zeitdruck, keine
   XP-Abzüge.
5. Abschluss-Screen: gelöste Aufgaben, XP-Gewinn, Level mit Balken, neue
   Medaillen als ruhiger Block, gegebenenfalls Stufenvorschlag, "Noch eine
   Runde" und "Zur Übersicht".

## Zahlenraum-Regel

Der Zahlenraum der Stufe begrenzt jede Zahl der Aufgabe, auch das
Ergebnis; die Folgen-Generatoren wählen den Start so, dass auch das
fünfte Glied im Raum bleibt.

## Gamification (nach GAMIFICATION.md)

- XP pro abgeschlossener Runde: gelöste Aufgaben plus Stufentiefe (a = +1
  bis j = +10). Nie für Tempo, Fehler kosten nichts, XP sinken nie.
- Levels (kumulative XP): Hüpfer 0, Springer 25, Weitspringer 90,
  Überflieger 220, Zahlenakrobat 500. Level 2 kommt in der ersten Sitzung.
- Medaillen als reine Funktionen der Zähler: Runden (1, 3, 8, 21, 55),
  gelöste Aufgaben (50, 200, 800), Grundanspruch Zyklus 1/2/3 (je eine
  fehlerfreie Runde auf Stufe c/g/j), alle Stufen entdeckt. Gesperrte
  Medaillen bleiben mit Name und Beschreibung sichtbar.
- Stufenvorschlag: 5 fehlerfreie Runden in Folge auf einer Stufe schlagen
  auf dem Abschluss-Screen die nächste Stufe vor (Ein-Tipp-Start). Nie
  erzwungen; eine Runde mit Fehlern setzt die Serie still zurück, mit
  vollen XP.

## Persistenz

- `localStorage`, Schlüssel `zahlensprung.progress` (XP, Runden, Aufgaben,
  pro Stufe Runden/fehlerfreie Runden/Serie).
- Reset im Footer der Übersicht mit Bestätigung, die den Gerätespeicher
  nennt. Keine Konten, keine Analytik, keine externen Requests.

## Sprache und Gestaltung

- v1 einsprachig Deutsch (Schweizer Standarddeutsch, ss statt ß); alle
  UI-Texte in `strings.js` mit stabilen IDs. Keine Einstellungen-Ansicht,
  solange es nichts zu konfigurieren gibt.
- Tokens aus DESIGN.md, Akzentfamilie **amber**, Atkinson Hyperlegible
  selbst gehostet, Lucide-Icons inline, Cache-Busting `?v=7`. Bewegung nur als
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
- Schweizer Zahlformat: Tausendertrennung mit Apostroph (13'567),
  Dezimalpunkt wie im Lehrplan.

## Merkheft-Verbindung und Deep-Links

Jede Stufe trägt in `data.js` ein `merkblatt: { id, name }`: Die
App zeigt auf der Stufenkarte einen klar erkennbaren Link
«Merkblatt: …» (Fusszeile der Stufenkarte mit Buch-Symbol) und
nach einer Runde mit Fehlern «Zum Nachlesen: …», beide auf
`../merkheft/<id>.html`. Die Links sind optional und nie eine
Bedingung; die Suite prüft, dass jede Stufenkarte einen trägt.
Zuordnung: a, b, c, d, j → zahlenstrahl; e, f → stellenwert; g → brueche; h, i → runden.

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

Playwright-Suite in `tests/e2e.test.mjs`:

- Generatoren mit gesätem Zufall (400 Runden pro Stufe): Folgen sind
  arithmetisch und raumbegrenzt, Ordnungs-Antworten sortierte
  Permutationen, beim Überschlagen ist die richtige Option die dem wahren
  Wert nächste.
- Cache-Busting-Konsistenz, kein ß, Levelkurve (Level 2 in der ersten
  Sitzung erreichbar).
- UI-Abläufe: je eine volle Runde pro Interaktionsmuster (Tippen, Ordnen,
  Auswahl), Belohnungen, Persistenz über Reload, Fehler-und-Korrektur,
  Medaillengalerie, Reset, kein horizontales Scrollen bei 320px, Konsole
  ohne Fehler, keine externen Requests.

## Ausblick (nicht Teil von v1)

- Zahlenstrahl-Aufgaben (Position schätzen) für die Stufen c und f.
- Verknüpfung mit dem Lehrplan-Kompass über den Kompetenz-Code.
- Weitere Sprachen.
