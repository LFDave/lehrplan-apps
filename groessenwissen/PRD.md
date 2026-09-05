# PRD — Grössenwissen

Version: 1.0. Dieses Dokument ist die massgebende Spezifikation der App.
Verhalten und PRD werden immer in derselben Änderung angepasst.

## Zweck und Leitprinzip

Grössenwissen ist ein Übungsmodul der Lehrplan-Familie und folgt dem
Leitprinzip: **Eine App setzt genau eine Kompetenz des Lehrplans 21 um,
ihre Schwierigkeitsstufen sind die offiziellen Kompetenzstufen, ihre
Meilensteine die Grundansprüche.**

Umgesetzt ist MA.3.A.1 (Ausgabe Kanton Bern): Begriffe und Symbole zu
Grössen, Funktionen, Daten und Zufall verstehen und verwenden, sich an
Referenzgrössen orientieren, Masseinheiten und Vorsätze kennen. Die
zwölf Stufen a bis l sind die zwölf offiziellen Kompetenzstufen dieser
Kompetenz (c = Grundanspruch Zyklus 1, h = Zyklus 2, l = Zyklus 3).

Das Rechnen mit Grössen gehört zur Schwester-Kompetenz MA.3.A.2
(Masswerk); Grössenwissen bleibt bewusst auf der Ebene des Benennens,
der Referenzen und der einfachen Faktenwissen-Umrechnungen
("1 kg = ? g").

## Quelle

- Lehrplan 21, Ausgabe Kanton Bern (be.lehrplan.ch, Gesamtausgabe
  PDF), Kompetenzaufbau MA.3.A.1 inklusive Zyklusbänder und
  Grundanspruch-Markierung.
- Stufentitel und -beschreibungen sind kindgerechte Umschreibungen;
  der offizielle Code (MA.3.A.1.a bis .l) steht sichtbar an jeder
  Stufe. Das Münz- und Notensortiment entspricht dem echten Schweizer
  Bargeld.

## Stufen und Aufgabenformen

Frage-Tabellen leben in `GW_QA`, Einheiten-Fakten in `UNIT_FACTS`
(beide in `gen.js`):

- **a** (Z1): Gegenteile (schwer/leicht, lang/kurz, ...).
- **b** (Z1): echte Münzen und Noten erkennen, Steigerungsformen
  (B ist schwerer als A, C schwerer als B → C am schwersten).
- **c** (Z1, GA): Einheiten und Abkürzungen für Länge, Zeit und Geld;
  1 m = 100 cm, 1 Fr. = 100 Rp., 1 h = 60 min.
- **d** (Z1+Z2): Beträge bis 100 Fr. mit Noten und Münzen legen.
- **e** (Z2): Referenzgrössen (1 kg ≈ Packung Mehl), km/dm/mm, l/dl,
  kg/g.
- **f** (Z2): Vorsätze Kilo/Dezi/Centi/Milli, cl/ml, t, mg, Sekunden.
- **g** (Z2): sicher, möglich, unmöglich einordnen.
- **h** (Z2, GA): Kreis-/Säulen-/Liniendiagramm, Häufigkeit,
  Flächenmasse (auch km²), kB und Byte, Tag = 24 h, Mittelwert.
- **i** (Z2+Z3): m³/dm³/cm³ und Liter, Mega/Giga/Tera.
- **j** (Z3): Währungen (CHF, €, $, £), Hektare und Are.
- **k** (Z3): relative Häufigkeit in Prozent, km/h und kB/s,
  x- und y-Achse.
- **l** (Z3, GA): Zins, Zinssatz, Kapital, Brutto/Netto, Rabatt
  berechnen, Mikro und Nano, Dichte-Einheit.

## Kernablauf, Eingabe, Gamification, Persistenz

Wie in der Familie üblich: Runden mit 8 Aufgaben (Duplikat-Schutz
ignoriert die Options-Reihenfolge), Auswahl-Aufgaben werten beim
Antippen, getippte Antworten prüfen sich bei erwarteter Länge selbst
und zusätzlich mit Enter.

- XP: gelöste Aufgaben plus Stufentiefe; Levels Grössenlehrling 0,
  Einheitenkenner 25, Referenzprofi 90, Grössenmeister 220,
  Grössenweise 500.
- Medaillen: Runden (1, 3, 8, 21, 55), Aufgaben (50, 200, 800),
  Grundanspruch Zyklus 1/2/3 (fehlerfreie Runde auf c/h/l), alle
  Stufen entdeckt.
- Stufenvorschlag nach 5 fehlerfreien Runden in Folge, nie erzwungen.
- `localStorage`-Schlüssel `groessenwissen.progress`; Reset im Footer
  mit Bestätigung. Keine externen Requests.

## Sprache und Gestaltung

Einsprachig Deutsch (Schweizer Standarddeutsch), Strings in
`strings.js`. Tokens aus DESIGN.md, Akzentfamilie **amber**, Atkinson
Hyperlegible selbst gehostet, Lucide-Icons inline, Cache-Busting
`?v=10`. Bewegung nur als
Zustandswechsel: Fortschrittsbalken wachsen über `transform: scaleX`
(240 ms), Antwortknöpfe drücken sich beim Antippen ein (120 ms); bei
reduzierter Bewegung springen die Balken, die Knöpfe bleiben still, und
jeder Zustand bleibt sichtbar. Speichern in localStorage ist gegen
blockierten Speicher (privater Modus) abgesichert. Der Aufgabenschirm
trägt die Stufenzeile als h1 und die Frage als h2; bei Auswahlaufgaben
liegt der Fokus nach dem Rendern auf der ersten Antwort, beim Reset auf
der Bestätigung. Neben einem Stufenvorschlag ist «Noch eine Runde» der
Zweitknopf.

## Merkheft-Verbindung

Jede Stufe trägt in `data.js` ein `merkblatt: { id, name }`: Die
App zeigt auf der Stufenkarte einen klar erkennbaren Link
«Merkblatt: …» (Fusszeile der Stufenkarte mit Buch-Symbol) und
nach einer Runde mit Fehlern «Zum Nachlesen: …», beide auf
`../merkheft/<id>.html`. Die Links sind optional und nie eine
Bedingung; die Suite prüft, dass jede Stufenkarte einen trägt.
Zuordnung: a, b-vergleiche, c → laengen; b-geld, d → geld; e → referenzgroessen; f → masseinheiten; g, k-haeufigkeit → wahrscheinlichkeit; h-daten → diagramme; h-flaechen, i, j → flaechenmasse; k-einheiten → geschwindigkeit; k-koordinaten → koordinaten; l-geld → prozente; l-vorsaetze → si-vorsaetze.

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

## Gesplittete Stufen

Die offiziellen Stufen b, h, k und l mischen Konzeptfamilien; die
App zeigt sie als themenreine Karten mit dem Buchstaben und Code der
offiziellen Stufe (Feld `code` in `data.js`, die `id` bleibt der
Speicher- und Link-Schlüssel):

- **b-geld** «Münzen und Noten» (jetzt mit allen echten Noten bis
  1000 Franken) und **b-vergleiche** «Vergleiche» (neun statt vier
  Vergleichs-Adjektive).
- **h-daten** «Diagramme und Mittelwert» (neu mit Piktogramm,
  Strichliste und Datenmengen kB bis TB) und **h-flaechen**
  «Flächenmasse» (acht reine Flächen-Umrechnungen); beide GA Zyklus
  2, die Medaille verlangt beide Karten fehlerfrei.
- **k-haeufigkeit** «Häufigkeit», **k-einheiten** «Zusammengesetzte
  Einheiten» (km/h, m/s, kB/s, kg/dm³) und **k-koordinaten**
  «Koordinaten» (Achsen und neu Zahlenpaare ablesen).
- **l-geld** «Zins und Rabatt» und **l-vorsaetze** «Kleine Vorsätze»
  (acht reine Vorsatz-Fragen zu Mikro und Nano); beide GA Zyklus 3,
  die Medaille verlangt beide Karten fehlerfrei.

Der Kalender-Fakt «1 d = 24 h» ist von den Flächenmassen zu den
Grundumrechnungen der Stufe e gezogen.

## Tests

Playwright-Suite in `tests/e2e.test.mjs`: Generatoren mit gesätem
Zufall (600 Runden, inklusive Prüfung, dass jede Runde 8 Aufgaben
findet), geprüft gegen ein unabhängiges Orakel mit eigener
Umrechnungstabelle, neu aufgeschriebener Frage-Tabelle und dem
offiziellen Schweizer Münzsortiment; dazu die UI-Abläufe (Runden auf
den drei GA-Stufen, Fehlerfluss, Persistenz, Medaillen, Reset,
Layout, Konsole, keine externen Requests).
