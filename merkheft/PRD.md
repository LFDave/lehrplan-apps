# PRD — Merkheft

Version: 1.0. Dieses Dokument ist die massgebende Spezifikation der App.
Verhalten und PRD werden immer in derselben Änderung angepasst.

## Zweck und Leitprinzip

Das Merkheft ist das Nachschlagewerk der Lehrplan-Familie: **Erklären
und Üben sind getrennte Oberflächen.** Die Übungs-Apps testen und
trainieren Wissen; das Merkheft erklärt die Konzepte davor und danach.
Ein Merkblatt pro Konzept, mit eigenem, kindgerechtem Text, einer
Illustration oder einem interaktiven Modell im illustration-Stil aus
DESIGN.md, kleinen Fakten («Kurz gemerkt»), «Dazu üben»-Links und den
offiziellen Lehrplan-21-Codes, die das Konzept stützt.

Kein Quiz, keine Gamification, kein localStorage: reines Lesen.

## Inhalte (Welle 1)

- Wasserkreislauf (NMG.4.4.1g, Wetterwarte)
- Mondphasen (NMG.4.5.d, Sternwarte)
- Serie- und Parallelschaltung, interaktiv (NT.5.2.b, Stromkreis)
- Gradnetz mit drehbarem Globus (RZG.4.1.c, Weltatlas)
- Sonnensystem mit Orbit-Modell (NMG.4.5.e, Sternwarte)

Alle Texte und Bilder sind eigene Erklärungen, keine übernommenen
Texte. Bewegung ist transform/opacity, startet erst auf Klick und
respektiert reduzierte Bewegung.

## Navigation und Verbindungen

- `location.hash` als Router: ohne Hash die Liste (gruppiert nach
  Themen), mit Hash das Merkblatt (`#wasserkreislauf`). Unbekannte
  Hashes fallen auf die Liste zurück. Browser-Zurück funktioniert.
- **Apps → Merkheft:** Stufen mit Merkblatt tragen in ihrer
  `data.js` ein `merkblatt: { id, name }`. Die App zeigt auf der
  Stufenkarte einen ruhigen Link «Merkblatt: …» und nach einer Runde
  mit Fehlern auf dem Abschlussbildschirm «Zum Nachlesen: …». Beide
  Links sind optional und nie eine Bedingung.
- **Merkheft → Apps:** «Dazu üben» verlinkt die App-Startseite und
  nennt die Stufe.

## Persistenz und Privatsphäre

Keine. Das Merkheft speichert nichts, fragt nichts und lädt nichts
von aussen.

## Sprache und Gestaltung

Einsprachig Deutsch (Schweizer Standarddeutsch). Tokens aus
DESIGN.md, Akzentfamilie **amber**, Atkinson Hyperlegible selbst
gehostet, Illustrationen als Inline-SVG mit `role="img"` und
deutschem `aria-label`, Cache-Busting `?v=1`.

## Tests

Playwright-Suite in `tests/e2e.test.mjs`: Cache-Busting-Konsistenz,
Datenprüfung (fünf Merkblätter, gültige App-Links, kein ß), Liste,
jedes Merkblatt per Deep-Link mit Bild und «Dazu üben», die
Interaktivität (alle Stromkreis-Zustände, Globus-Drehung,
Orbit-Start nur auf Klick), Zurück-Navigation, unbekannter Hash,
Layout bei 320px, Konsole ohne Fehler, keine externen Requests. Die
Suiten der vier verlinkenden Apps prüfen die Merkblatt-Links auf den
Stufenkarten.
