# Merkheft

Zuerst verstehen, dann üben: kurze Merkblätter zu den Konzepten der
Lehrplan-Übungs-Apps, mit Illustrationen und interaktiven Modellen.

Jedes Merkblatt ist eine eigene Seite. Sie erklärt ein Konzept in
kurzen Absätzen, zeigt ein Bild oder ein Modell zum Ausprobieren
(Globus drehen, Stromkreis schalten, Planeten kreisen lassen) und
verlinkt die passenden Übungs-Stufen («Dazu üben»). 94 Merkblätter
in 16 Themengruppen decken jede Stufe jeder Übungs-App ab;
umgekehrt trägt jede Stufenkarte in den Apps ihren Merkblatt-Link. Die Codes verweisen
auf den Lehrplan 21 (Ausgabe Kanton Bern, Stand 01.08.2022).

Jedes Merkblatt lässt sich direkt drucken (oder als PDF sichern):
der Ausdruck ist ein helles A4-Blatt ohne Navigation.

Das Merkheft speichert nichts: kein Fortschritt, keine Konten, keine
Cookies, keine externen Anfragen.

## Benutzen

```bash
cd merkheft
python3 -m http.server 8000
# http://localhost:8000
```

Einzelne Merkblätter sind direkt verlinkbar, zum Beispiel
`wasserkreislauf.html` oder `gradnetz.html`.

## Tests

```bash
cd merkheft/tests
npm install
node e2e.test.mjs
```
