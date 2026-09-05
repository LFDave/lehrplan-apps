# PRD — Ortho

Version: 1.0. Dieses Dokument ist die massgebende Spezifikation der App.
Verhalten und PRD werden immer in derselben Änderung angepasst.

## Zweck und Leitprinzip

Ortho ist ein Übungsmodul der Lehrplan-Familie und folgt dem
Leitprinzip: **Eine App setzt genau eine Kompetenz des Lehrplans 21 um,
ihre Schwierigkeitsstufen sind die offiziellen Kompetenzstufen, ihre
Meilensteine die Grundansprüche.**

Umgesetzt ist FS1F.5.E.1 (Französisch, Rechtschreibung): Wörter
korrekt abschreiben (a), Wendungen und kurze Sätze abschreiben und
Satzzeichen setzen (b), häufige Formen wie j'ai und c'est korrekt
schreiben (c) sowie Schreibfehler finden und Accents sicher wählen
(d).

**Bewusste Übersetzung:** Eigene Texte sind als Abschreiben, Ergänzen
und Prüfen von Wörtern und Wendungen umgesetzt. Das Abschreiben ist
wörtlich aus der Stufe übernommen (können ... korrekt abschreiben).

## Quelle

- Lehrplan 21, Ausgabe Kanton Bern, Stand 01.08.2022 (Datum in der
  Fusszeile des offiziellen PDF):
  https://be.lehrplan.ch/container/BE_DE_Gesamtausgabe.pdf,
  Kompetenzaufbau FS1F.5.E.1. Die Stufen a bis d sind die offiziellen
  Kompetenzstufen (b = Grundanspruch Zyklus 2, c = Zyklus 3).
- Aufgabentexte sind eigene, kindgerechte Formulierungen, keine
  Originaltexte; der offizielle Code steht sichtbar an jeder Stufe.

## Inhalt und Aufgabenformen

Das Abschreiben von Wörtern (a) und Sätzen (b) wird generiert; die
Vorlage steht in der Aufgabe, die Suite prüft die Identität
unabhängig. Häufige Formen, Lücken, Schreibvarianten und die
Fehlerjagd liegen in festen Pools mit neu aufgeschriebener
Antwort-Tabelle. Getippt werden nur Zeichen der Schweizer Tastatur
(é, è, à, Apostroph); ç und œ erscheinen nur zur Auswahl.

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
- `localStorage`-Schlüssel `ortho.progress`; Reset im Footer mit
  Bestätigung. Keine externen Requests.

## Sprache und Gestaltung

UI einsprachig Deutsch (Schweizer Standarddeutsch), Lerninhalt
Französisch. Strings in `strings.js`. Tokens aus DESIGN.md,
Akzentfamilie **violet**, Atkinson Hyperlegible selbst gehostet,
Lucide-Icons inline, Cache-Busting `?v=6`. Bewegung nur als
Zustandswechsel: Fortschrittsbalken wachsen über `transform: scaleX`
(240 ms), Antwortknöpfe drücken sich beim Antippen ein (120 ms); bei
reduzierter Bewegung springen die Balken, die Knöpfe bleiben still, und
jeder Zustand bleibt sichtbar. Speichern in localStorage ist gegen
blockierten Speicher (privater Modus) abgesichert. Der Aufgabenschirm
trägt die Stufenzeile als h1 und die Frage als h2; bei Auswahlaufgaben
liegt der Fokus nach dem Rendern auf der ersten Antwort, beim Reset auf
der Bestätigung. Neben einem Stufenvorschlag ist «Noch eine Runde» der
Zweitknopf.

## Merkheft-Verbindung und Deep-Links

Jede Stufe trägt in `data.js` ein `merkblatt: { id, name }`: Die
App zeigt auf der Stufenkarte einen klar erkennbaren Link
«Merkblatt: …» (Fusszeile der Stufenkarte mit Buch-Symbol) und
nach einer Runde mit Fehlern «Zum Nachlesen: …», beide auf
`../merkheft/<id>.html`. Die Links sind optional und nie eine
Bedingung; die Suite prüft, dass jede Stufenkarte einen trägt.
Zuordnung: a, b, c, d → franzoesisch-schreiben.

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
Zufall gegen ein unabhängiges Orakel (Abschreib-Identität, neu
aufgeschriebene Antwort-Tabelle), dazu die UI-Abläufe (Runden auf den
GA-Stufen, Fehlerfluss, Persistenz, Medaillen, Reset, Layout,
Konsole, keine externen Requests).
