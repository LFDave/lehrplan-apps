# PRD — Lehrplan-Kompass

Version: 1.0. Dieses Dokument ist die massgebende Spezifikation der App.
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
  und 358 Kompetenzen: D, FS1F, FS2E, FS3I, MA, NMG, NT, WAH, RZG, ERG, BG,
  TTG, MU, BS, MI, BO.
- Die Kompetenztexte sind bewusst eigene, kindgerechte Umschreibungen in
  Ich-Form. Sie sind keine Originaltexte des Lehrplans; massgebend bleibt der
  offizielle Lehrplan. Der offizielle Code steht sichtbar neben jedem Text,
  damit Eltern und Lehrpersonen die Stelle im Lehrplan finden.
- Lange offizielle Bereichstitel sind für die Anzeige gekürzt (zum Beispiel
  "Identität, Körper, Gesundheit" statt des vollen Titels mit Nachsatz).

## Bewusste Vereinfachungen

- Die Kompetenzstufen (a, b, c ...) und Grundansprüche des Lehrplans sind
  nicht abgebildet; die App bleibt auf Kompetenz-Ebene. Eine Kompetenz gilt
  in jedem Zyklus des Fachbereichs als eigener Haken, weil dieselbe Kompetenz
  pro Zyklus auf höherem Niveau weitergeführt wird.
- Zyklus-Zuordnung erfolgt pro Fachbereich, nicht pro Kompetenz: NMG gilt für
  Zyklus 1 und 2; NT, WAH, RZG, ERG, BO und FS3I für Zyklus 3; FS1F und FS2E
  für Zyklus 2 und 3; alle übrigen für alle drei Zyklen.
- FS3I ist als Freifach markiert, MI und BO als Modul.

## Kernablauf

1. Startansicht: Titel, Zyklenwahl (3 grosse Wahlflächen, `aria-pressed`),
   Fachbereichsliste des gewählten Zyklus mit Fortschrittsbalken und
   Zusammenfassung "n von total abgehakt".
2. Fachansicht (Navigation über `location.hash`, Browser-Zurück funktioniert):
   Zurück-Knopf, Fachtitel, Fortschrittszeile mit Balken, Hinweis für welchen
   Zyklus die Häkchen gelten, danach je Kompetenzbereich eine Sektion mit
   Kompetenzzeilen.
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
- Cache-Busting `?v=N` auf allen lokalen Asset-URLs, aktuell `v=1`.

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
  Konsistenz, Datenintegrität (358 eindeutige Codes, Präfixe, kein ß),
  Zyklenwahl, Abhaken, Persistenz pro Zyklus über Reload, Browser-Zurück,
  Reset mit Bestätigung, Layout ohne horizontales Scrollen (320px und
  Desktop), Konsole ohne Fehler und dass kein externer Request abgeht.

## Ausblick (nicht Teil von v1)

- Übungsmodule pro Kompetenzbereich, verlinkt über die Lehrplan-Codes.
- Weitere Sprachen (fr, it, rm, en).
- Optionale Anzeige der Kompetenzstufen pro Zyklus.
