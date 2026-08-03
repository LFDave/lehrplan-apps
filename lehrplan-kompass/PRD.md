# PRD — Lehrplan-Kompass

Version: 2.0. Dieses Dokument ist die massgebende Spezifikation der App.
Verhalten und PRD werden immer in derselben Änderung angepasst.

## Zweck

Der Lehrplan-Kompass macht sichtbar, was Kinder in der Volksschule lernen.
Kinder und Eltern wählen einen Zyklus, sehen die Fachbereiche des Lehrplans 21
und haken pro Kompetenz ab: "Das kann ich schon." Die App ist ein
Orientierungs- und Selbsteinschätzungswerkzeug, kein Übungs- oder Quiztool.

Der Kompass ist zugleich die Übersichtsebene für künftige Übungs-Mini-Apps
dieser Sammlung: Jede Kompetenz trägt den offiziellen Lehrplan-21-Code, an den
sich spätere Übungsmodule anhängen lassen.

## Quelle und Inhalte

- Struktur, Codes und Bereichstitel folgen dem Lehrplan 21, Ausgabe Kanton
  Bern (be.lehrplan.ch, Gesamtausgabe PDF, Stand der Ausgabe 2016/2022).
- Abgebildet sind alle 16 Fach- und Modulbereiche mit 90 Kompetenzbereichen
  und 363 Kompetenzen: D, FS1F, FS2E, FS3I, MA, NMG, NT, WAH, RZG, ERG, BG,
  TTG, MU, BS, MI, BO.
- Jede Kompetenz hat pro Zyklus, in dem sie im Lehrplan Kompetenzstufen hat,
  einen eigenen kindgerechten Text in Ich-Form: insgesamt 721 Zyklus-Texte
  (Zyklus 1: 176, Zyklus 2: 239, Zyklus 3: 306). Grundlage ist eine
  layoutbasierte Auswertung des Kompetenzaufbaus im Gesamtausgabe-PDF
  (Zyklusbänder und Grundanspruch-Markierungen pro Kompetenzstufe); der Text
  eines Zyklus orientiert sich am Niveau des jeweiligen Grundanspruchs.
- Die Zyklus-Zuordnung ist damit pro Kompetenz aus dem Lehrplan abgeleitet,
  nicht pauschal pro Fachbereich. Zwei Kompetenzaufbauten weichen vom
  Fachbereichsrahmen ab und werden entsprechend ausgeblendet: TTG.3.B.1
  beginnt erst im 2. Zyklus, MU.3.A.1 endet vor dem 3. Zyklus.
  Kompetenzstufen an Zyklusgrenzen (gestaffelte Bänder im Lehrplan) zählen
  zu beiden angrenzenden Zyklen.
- Die Texte sind keine Originaltexte des Lehrplans; massgebend bleibt der
  offizielle Lehrplan. Der offizielle Code steht sichtbar neben jedem Text,
  damit Eltern und Lehrpersonen die Stelle im Lehrplan finden.
- Lange offizielle Bereichstitel sind für die Anzeige gekürzt (zum Beispiel
  "Identität, Körper, Gesundheit" statt des vollen Titels mit Nachsatz).

## Bewusste Vereinfachungen

- Die einzelnen Kompetenzstufen (a, b, c ...) werden nicht als eigene
  Einträge angezeigt; pro Kompetenz und Zyklus fasst ein Text das
  Zyklus-Niveau zusammen. Grundansprüche und Orientierungspunkte sind
  nicht als Markierung sichtbar; die Texte sind am Grundanspruch
  ausgerichtet.
- Ein Haken gilt pro Kompetenz und Zyklus, weil dieselbe Kompetenz pro
  Zyklus auf höherem Niveau weitergeführt wird.
- FS3I ist als Freifach markiert, MI und BO als Modul.

## Kernablauf

1. Startansicht: Titel, Zyklenwahl (3 grosse Wahlflächen, `aria-pressed`),
   Fachbereichsliste des gewählten Zyklus mit Fortschrittsbalken und
   Zusammenfassung "n von total abgehakt".
2. Fachansicht (Navigation über `location.hash`, Browser-Zurück funktioniert):
   Zurück-Knopf, Fachtitel, Fortschrittszeile mit Balken, Hinweis für welchen
   Zyklus die Häkchen gelten, danach je Kompetenzbereich eine Sektion mit
   Kompetenzzeilen. Angezeigt werden nur Kompetenzen mit Text für den
   gewählten Zyklus; leere Bereiche werden ausgeblendet. Öffnet ein Deep-Link
   ein Fach, das es im gespeicherten Zyklus nicht gibt, wechselt die App auf
   den ersten Zyklus des Fachs.
3. Eine Kompetenzzeile ist ein einziger grosser Toggle-Button
   (`aria-pressed`): Kreis-Checkbox, Ich-Text, Code-Chip. Antippen hakt ab,
   erneut antippen entfernt den Haken. Fortschritt aktualisiert sofort.
4. Haken sind pro Zyklus getrennt gespeichert: Schlüssel `zyklus|code`.
   Der Zykluswechsel auf der Startansicht wechselt damit auch den Stand.
5. Reset ("Alles zurücksetzen") sitzt im Footer der Startansicht, verlangt
   eine Bestätigung und nennt, dass die Daten nur auf diesem Gerät liegen.
   Er löscht alle Haken in allen Zyklen, behält aber die Zykluswahl.

## Zustände

- Leer: alle Fortschritte 0, kein Sonderzustand nötig.
- Fortschritt: Balken pro Fach, Summenzeile pro Zyklus (`role="status"`).
- Reset-Bestätigung: Inline-Dialog (`role="alertdialog"`) mit Ja/Abbrechen.

## Übungs-Apps

Kompetenzen, zu denen es in dieser Sammlung ein Übungsmodul gibt, zeigen
unter der Kompetenzzeile einen Link "Üben mit ..." (relative URL, damit er
lokal und auf GitHub Pages funktioniert). Die Zuordnung liegt als
`PRACTICE_APPS` in `data.js`, keyed nach dem offiziellen Kompetenz-Code:
MA.1.A.2 Zahlensprung, MA.1.A.3 Rechenturm, MA.3.A.2 Masswerk,
D.4.F.1 Wortwerkstatt. Neue Übungsmodule werden dort ergänzt.

## Persistenz

- `localStorage`, Schlüssel `kompass.cycle` (gewählter Zyklus als Zahl) und
  `kompass.checked` (Objekt, Schlüssel `zyklus|code`, Wert `true`).
- Keine Konten, keine Analytik, keine Cookies, keine externen Requests.

## Sprache

- v1 ist einsprachig Deutsch (Schweizer Standarddeutsch, ss statt ß).
- Alle UI-Texte liegen in `strings.js` in einer Tabelle mit stabilen IDs;
  `data.js` enthält die Inhaltsdaten. Weitere Sprachen kämen als zusätzliche
  Tabellen mit identischen Keys dazu, Deutsch bleibt Referenz und Fallback.
- Keine Einstellungen-Ansicht in v1: Es gibt nichts zu konfigurieren, solange
  nur eine Sprache ausgeliefert wird. Die Zyklenwahl ist Inhalt, keine
  Einstellung.

## Gestaltung

- Tokens aus DESIGN.md, Akzentfamilie **blue**, dunkel, ruhig.
- Schrift Atkinson Hyperlegible (400/700), selbst gehostet.
- Lucide-Icons inline (`icons.js`), ein Icon pro Fachbereich.
- Cache-Busting `?v=N` auf allen lokalen Asset-URLs, aktuell `v=2`.

## Barrierefreiheit

- Semantische Struktur (h1/h2, Listen, Landmark-freundlich).
- Alle Bedienelemente per Tastatur erreichbar, sichtbarer Fokus
  (`:focus-visible`, Token border.focus).
- Toggle-Zustand über `aria-pressed`, nie nur über Farbe (Checkbox-Kreis mit
  Haken-Icon).
- Fortschrittszusammenfassungen in `role="status"`.
- Zielgrössen mindestens 3rem, reduzierte Bewegung wird respektiert.

## Tests

- Playwright-e2e-Suite in `tests/e2e.test.mjs`; sie prüft Cache-Busting-
  Konsistenz, Datenintegrität (363 eindeutige Codes, 721 Zyklus-Texte mit
  Summen 176/239/306, Präfixe, keine identischen Texte über Zyklen, kein ß,
  die beiden Abweichungen TTG.3.B.1 und MU.3.A.1), Zyklenwahl mit
  zyklusspezifischen Texten und Anzahlen, Abhaken, Persistenz pro Zyklus
  über Reload, Browser-Zurück, Reset mit Bestätigung, Layout ohne
  horizontales Scrollen (320px und Desktop), Konsole ohne Fehler und dass
  kein externer Request abgeht.

## Ausblick (nicht Teil von v2)

- Übungsmodule pro Kompetenzbereich, verlinkt über die Lehrplan-Codes.
- Weitere Sprachen (fr, it, rm, en).
- Optionale Anzeige der einzelnen Kompetenzstufen und der Grundanspruch-
  Markierung.
