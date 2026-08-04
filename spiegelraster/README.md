# Spiegelraster

Spiegeln, drehen und verschieben im Raster. Stufe für Stufe, wie in
der Schule.

Spiegelraster übt genau eine Kompetenz des Lehrplans 21: MA.2.A.2
(Figuren und Körper abbilden, zerlegen und zusammensetzen, Ausgabe
Kanton Bern). Die zehn Stufen a bis j sind die offiziellen
Kompetenzstufen dieser Kompetenz; die Grundansprüche der drei Zyklen
sind als Abzeichen markiert. Zeichnen mit Geodreieck und Zirkel ist
als Erkennen der Abbildungen umgesetzt.

## Benutzen

Die App ist eine statische Seite, online unter der GitHub-Pages-Adresse
des Repos (`spiegelraster/`). Lokal genügt ein einfacher Webserver, da
die App ES-Module nutzt:

```bash
cd spiegelraster
python3 -m http.server 8000
# http://localhost:8000
```

- Stufe wählen und eine Runde mit 8 Aufgaben spielen: von Mustern und
  Symmetrie über Spiegelbilder, Drehungen und Verschiebungen bis zu
  Streckfaktoren und Koordinaten.
- Rasterfiguren werden als Bilder gezeigt: das Original gefüllt, das
  Bild umrandet. Auswahl-Antworten werten beim Antippen, getippte
  beim letzten Zeichen (oder mit Enter).
- XP, Levels und Medaillen belohnen Übung, nie Tempo. Nach fünf
  fehlerfreien Runden schlägt die App die nächste Stufe vor.
- Der Fortschritt bleibt auf dem Gerät (localStorage). Keine Konten,
  keine Cookies, keine externen Anfragen.

## Tests

```bash
cd spiegelraster/tests
npm install
node e2e.test.mjs
```

Die Suite prüft zuerst die Aufgaben-Generatoren mit gesätem Zufall
gegen ein unabhängiges Orakel, das die Zellen aus dem SVG-Markup
liest und alle Abbildungen selbst nachrechnet, und fährt dann die
App-Abläufe in Chromium ab. Screenshots landen in
`tests/screenshots/`.
