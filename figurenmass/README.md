# Figurenmass

Umfang, Fläche und Volumen, vom Raster bis zum Kreis. Stufe für Stufe,
wie in der Schule.

Figurenmass übt genau eine Kompetenz des Lehrplans 21: MA.2.A.3
(Längen, Flächen und Volumen vergleichen, messen und berechnen,
Ausgabe Kanton Bern). Die elf Stufen a bis k sind die offiziellen
Kompetenzstufen dieser Kompetenz; die Grundansprüche der drei Zyklen
sind als Abzeichen markiert. Gemessen wird am Bildschirm-Raster:
Strecken ablesen, Einheitsquadrate auszählen, Wege vergleichen.

## Benutzen

Die App ist eine statische Seite, online unter der GitHub-Pages-Adresse
des Repos (`figurenmass/`). Lokal genügt ein einfacher Webserver, da
die App ES-Module nutzt:

```bash
cd figurenmass
python3 -m http.server 8000
# http://localhost:8000
```

- Stufe wählen und eine Runde mit 8 Aufgaben spielen: vom
  Wege-Vergleichen und Messen auf dem Raster über Umfang, Fläche und
  Volumen bis zu Pythagoras, Kreis und Ähnlichkeit.
- Getippte Antworten prüfen sich beim letzten Zeichen von selbst; mit
  Enter geht es auch früher.
- XP, Levels und Medaillen belohnen Übung, nie Tempo. Nach fünf
  fehlerfreien Runden schlägt die App die nächste Stufe vor.
- Der Fortschritt bleibt auf dem Gerät (localStorage). Keine Konten,
  keine Cookies, keine externen Anfragen.

## Tests

```bash
cd figurenmass/tests
npm install
node e2e.test.mjs
```

Die Suite prüft zuerst die Aufgaben-Generatoren mit gesätem Zufall
gegen ein unabhängiges Orakel, das die SVG-Figuren direkt aus dem
Markup nachmisst, und fährt dann die App-Abläufe in Chromium ab.
Screenshots landen in `tests/screenshots/`.
