# PRD — Figurenmass

Version: 1.0. Dieses Dokument ist die massgebende Spezifikation der App.
Verhalten und PRD werden immer in derselben Änderung angepasst.

## Zweck und Leitprinzip

Figurenmass ist ein Übungsmodul der Lehrplan-Familie und folgt dem
Leitprinzip: **Eine App setzt genau eine Kompetenz des Lehrplans 21 um,
ihre Schwierigkeitsstufen sind die offiziellen Kompetenzstufen, ihre
Meilensteine die Grundansprüche.**

Umgesetzt ist MA.2.A.3 (Ausgabe Kanton Bern): Längen, Flächen und
Volumen vergleichen, messen und berechnen. Die elf Stufen a bis k sind
die elf offiziellen Kompetenzstufen dieser Kompetenz
(b = Grundanspruch Zyklus 1, e = Zyklus 2, i = Zyklus 3).

**Bewusste Übersetzung:** Messen mit echten Gegenständen ist als
Messen am Bildschirm-Raster umgesetzt. SVG-Figuren zeigen Strecken
über einem Zentimeter-Raster, Einheitsquadrate und gefärbte Zellen
zum Abzählen; die Berechnungs-Stufen nennen alle Masse im
Aufgabentext. Der Kreis rechnet mit π ≈ 3.14, die Pyramide nennt die
Formel im Aufgabentext.

## Quelle

- Lehrplan 21, Ausgabe Kanton Bern (be.lehrplan.ch, Gesamtausgabe
  PDF), Kompetenzaufbau MA.2.A.3 inklusive Zyklusbänder und
  Grundanspruch-Markierung.
- Stufentitel und -beschreibungen sind kindgerechte Umschreibungen;
  der offizielle Code (MA.2.A.3.a bis .k) steht sichtbar an jeder
  Stufe.

## Stufen und Aufgabenformen

Alle Generatoren leben in `gen.js`; die SVG-Bausteine (`rasterLineSvg`,
`cellRectSvg`, `filledCellsSvg`, `pathsSvg`, Zelle = 20 Einheiten)
werden als Markup-Strings erzeugt und im Aufgabenbereich als
`task.svg` gerendert:

- **a** (Z1): Wege auf dem Raster vergleichen (zwei Polylinien,
  Auswahl), Konstanz von Länge/Menge (gebogener Draht,
  umgeschüttetes Wasser; Auswahl).
- **b** (Z1, GA): Strecken über dem Raster auf 1 cm genau ablesen
  (SVG), Gefässe mit dem Becher füllen.
- **c** (Z1+Z2): Rechtecke (a auf b Quadrate) und Würfelbauten
  vergleichen (Auswahl).
- **d** (Z2): Einheitsquadrate eines Rechtecks auszählen (SVG).
- **e** (Z2, GA): Umfang und Fläche von Rechtecken und Quadraten,
  Würfel in Quadern zählen.
- **f** (Z2+Z3): Quader-Volumen, gefärbte Quadrate in unregelmässigen
  Figuren zählen (SVG).
- **g** (Z3): Dreiecksflächen (g · h : 2), Kantenlängen und
  Oberfläche von Quadern.
- **h** (Z3): Satz des Pythagoras mit pythagoreischen Tripeln
  (Hypotenuse und Kathete).
- **i** (Z3, GA): Kreisumfang und -fläche mit π ≈ 3.14
  (Wertetabelle mit sauberen Ergebnissen), Volumen von Prismen und
  Zylindern aus Grundfläche und Höhe.
- **j** (Z3): Pyramiden-Volumen (Formel im Text), Winkelsumme im
  Dreieck, Satz von Thales (Auswahl).
- **k** (Z3): Ähnlichkeit: Längen mal f, Flächen mal f², Volumen
  mal f³.

## Kernablauf, Eingabe, Gamification, Persistenz

Wie in der Familie üblich: Runden mit 8 Aufgaben, getippte Antworten
prüfen sich bei erwarteter Länge selbst und zusätzlich mit Enter.

- XP: gelöste Aufgaben plus Stufentiefe; Levels Formenzähler 0,
  Umfangkenner 25, Flächenprofi 90, Volumenmeister 220,
  Geometrieweise 500.
- Medaillen: Runden (1, 3, 8, 21, 55), Aufgaben (50, 200, 800),
  Grundanspruch Zyklus 1/2/3 (fehlerfreie Runde auf b/e/i), alle
  Stufen entdeckt.
- Stufenvorschlag nach 5 fehlerfreien Runden in Folge, nie erzwungen.
- `localStorage`-Schlüssel `figurenmass.progress`; Reset im Footer
  mit Bestätigung. Keine externen Requests.

## Sprache und Gestaltung

Einsprachig Deutsch (Schweizer Standarddeutsch), Strings in
`strings.js`. Tokens aus DESIGN.md, Akzentfamilie **blue**, Atkinson
Hyperlegible selbst gehostet, Lucide-Icons inline, SVG-Figuren nutzen
die Farb-Tokens über CSS-Klassen, Cache-Busting `?v=8`. Bewegung nur als
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

**Gesplittete Stufe j.** Die offizielle Stufe j mischt
Körperberechnung und Winkel; die App zeigt zwei Karten:
**j-koerper** «Pyramide» (Volumen und neu auch Höhe berechnen) und
**j-winkel** «Winkel und Thales» (Winkelsummen, neu die Winkelarten
spitz, recht, stumpf). Beide zeigen Buchstabe und Code der
offiziellen Stufe j (Feld `code`).

## Merkheft-Verbindung und Deep-Links

Jede Stufe trägt in `data.js` ein `merkblatt: { id, name }`: Die
App zeigt auf der Stufenkarte einen klar erkennbaren Link
«Merkblatt: …» (Fusszeile der Stufenkarte mit Buch-Symbol) und
nach einer Runde mit Fehlern «Zum Nachlesen: …», beide auf
`../merkheft/<id>.html`. Die Links sind optional und nie eine
Bedingung; die Suite prüft, dass jede Stufenkarte einen trägt.
Zuordnung: a, b, c, d, e, f → umfang-flaeche; g, i, j-koerper → flaechenformeln; h → pythagoras; j-winkel → winkel; k → abbildungen.

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
Zufall (550 Runden), geprüft gegen ein unabhängiges Orakel, das
SVG-Aufgaben direkt aus dem Markup nachmisst (Strecken-Koordinaten,
Zellen zählen, Manhattan-Länge von Polylinien) und Text-Aufgaben mit
eigenen Formeln nachrechnet; dazu die UI-Abläufe (Runden auf den drei
GA-Stufen, SVG-Rendering, Fehlerfluss, Persistenz, Medaillen, Reset,
Layout, Konsole, keine externen Requests).
