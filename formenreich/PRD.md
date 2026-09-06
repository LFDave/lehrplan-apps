# PRD — Formenreich

Version: 1.0. Dieses Dokument ist die massgebende Spezifikation der App.
Verhalten und PRD werden immer in derselben Änderung angepasst.

## Zweck und Leitprinzip

Formenreich ist ein Übungsmodul der Lehrplan-Familie und folgt dem
Leitprinzip: **Eine App setzt genau eine Kompetenz des Lehrplans 21 um,
ihre Schwierigkeitsstufen sind die offiziellen Kompetenzstufen, ihre
Meilensteine die Grundansprüche.**

Umgesetzt ist MA.2.A.1 (Ausgabe Kanton Bern): Begriffe und Symbole zu
Form und Raum verstehen und verwenden. Die zwölf Stufen a bis l sind
die zwölf offiziellen Kompetenzstufen dieser Kompetenz
(c = Grundanspruch Zyklus 1, g = Zyklus 2, k = Zyklus 3).

**Bewusste Übersetzung:** Zeichnen- und Beschriften-Anteile des
Lehrplans sind als Erkennen und Benennen von SVG-Figuren umgesetzt.
Die App prüft, ob ein Kind Formen, Körper und Fachbegriffe kennt,
nicht die Zeichenfertigkeit.

## Quelle

- Lehrplan 21, Ausgabe Kanton Bern (be.lehrplan.ch, Gesamtausgabe
  PDF), Kompetenzaufbau MA.2.A.1 inklusive Zyklusbänder und
  Grundanspruch-Markierung.
- Stufentitel und -beschreibungen sind kindgerechte Umschreibungen;
  der offizielle Code (MA.2.A.1.a bis .l) steht sichtbar an jeder
  Stufe.

## Stufen und Aufgabenformen

Die SVG-Figurenbibliothek lebt in `SHAPES` (gen.js) mit einem
dokumentierten Signatur-Kontrakt (Kreis = 1 circle, Kugel = circle +
ellipse, Würfel/Quader = 2 rects + 4 Linien, Zylinder = 2 ellipses +
2 Linien, Kegel = ellipse + polygon, Pyramide = 2 polygons, Prisma =
2 polygons + 3 Linien, Vielecke = 1 polygon); Begriff-Tabellen in
`FR_QA`:

- **a** (Z1): Kreis, Dreieck, Quadrat, Rechteck, Würfel und Kugel am
  Bild erkennen.
- **b** (Z1): Strecken vergleichen (am längsten, am kürzesten).
- **c** (Z1, GA): Raumlagen: Punkt über/unter/links/rechts/in der
  Mitte eines Quadrats (SVG) plus Begriffe wie innerhalb und
  ausserhalb.
- **d** (Z1+Z2): Figur oder Körper (die Frage lautet «Was ist ein Würfel?», sie nennt die Antworten nicht, weil drei Knöpfe zur Wahl stehen; 20 Fragen im Pool, damit sich Runden unterscheiden), spiegeln und verschieben,
  Länge/Breite/Fläche.
- **e** (Z2): Ecken, Kanten und Seitenflächen von Würfel und Quader
  zählen (Fakten-Tabelle mit 15 Fragen).
- **f** (Z2): Würfel, Quader, Kugel, Zylinder und Pyramide am Bild
  erkennen.
- **g** (Z2, GA): Radius, Durchmesser, Schnittpunkt, rechter Winkel,
  Umfang, Diagonale; parallele, senkrechte und schräge Geraden am
  Bild erkennen.
- **h** (Z2+Z3): Punkte im Koordinatenraster finden (Nullpunkt unten
  links, im Aufgabentext erklärt), Auf-, Vorder- und Seitenansicht.
- **i** (Z3): Parallelogramm, Trapez, Rhombus und Drachenviereck am
  Bild erkennen; Dreiecksarten benennen.
- **j** (Z3): Vierecke nach Winkeln, Seiten und Parallelität (16 Fragen im Pool, dazu Diagonalen und Dreiecksarten)
  charakterisieren; x- und y-Achse.
- **k** (Z3, GA): Kegel, Prisma, Pyramide und Zylinder am Bild
  erkennen; kongruent, Basis, Kongruenzabbildung.
- **l** (Z3): Hypotenuse, Katheten, Tangente, Sehne, Kreissektor;
  Tetraeder-Fakten.

## Kernablauf, Eingabe, Gamification, Persistenz

Wie in der Familie üblich: Runden mit 8 Aufgaben, Auswahl-Aufgaben
werten beim Antippen, getippte Antworten prüfen sich bei erwarteter
Länge selbst und zusätzlich mit Enter.

- XP: gelöste Aufgaben plus Stufentiefe; Levels Formenspäher 0,
  Eckenzähler 25, Formenkenner 90, Körperprofi 220, Formenmeister 500.
- Medaillen: Runden (1, 3, 8, 21, 55), Aufgaben (50, 200, 800),
  Grundanspruch Zyklus 1/2/3 (fehlerfreie Runde auf c/g/k), alle
  Stufen entdeckt.
- Stufenvorschlag nach 5 fehlerfreien Runden in Folge, nie erzwungen.
- `localStorage`-Schlüssel `formenreich.progress`; Reset im Footer
  mit Bestätigung. Keine externen Requests.

## Sprache und Gestaltung

Einsprachig Deutsch (Schweizer Standarddeutsch), Strings in
`strings.js`. Tokens aus DESIGN.md, Akzentfamilie **violet**,
Atkinson Hyperlegible selbst gehostet, Lucide-Icons inline,
SVG-Figuren nutzen die Farb-Tokens über CSS-Klassen, Cache-Busting
`?v=7`. Bewegung nur als
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
Zuordnung: a, d, e, f, k → formen-koerper; b → laengen; c → lagewoerter; g, l → kreis; h → koordinaten; i, j → vierecke.

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
Zufall (600 Runden), geprüft gegen ein unabhängiges Geometrie-Orakel,
das jede Figur allein aus dem Markup klassifiziert (Element-
Signaturen, parallele Seitenpaare, Seitenlängen, Punkt- und
Linien-Koordinaten) — es kennt die Generator-Schlüssel nicht; dazu
die UI-Abläufe (Runden auf den drei GA-Stufen, SVG-Rendering,
Fehlerfluss, Persistenz, Medaillen, Reset, Layout, Konsole, keine
externen Requests).
