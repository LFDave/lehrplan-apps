# Merkheft

Zuerst verstehen, dann üben: kurze Merkblätter zu den Konzepten der
Lehrplan-Übungs-Apps, mit Illustrationen und interaktiven Modellen.

Jedes Merkblatt erklärt ein Konzept in wenigen Sätzen, zeigt ein
Bild oder ein Modell zum Ausprobieren (Globus drehen, Stromkreis
schalten, Planeten kreisen lassen) und verlinkt die passende
Übungs-App («Dazu üben»). Die Codes verweisen auf den Lehrplan 21
(Ausgabe Kanton Bern, Stand 01.08.2022).

Das Merkheft speichert nichts: kein Fortschritt, keine Konten, keine
Cookies, keine externen Anfragen.

## Benutzen

```bash
cd merkheft
python3 -m http.server 8000
# http://localhost:8000
```

Einzelne Merkblätter sind direkt verlinkbar, zum Beispiel
`#wasserkreislauf` oder `#gradnetz`.

## Tests

```bash
cd merkheft/tests
npm install
node e2e.test.mjs
```
