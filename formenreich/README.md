# Formenreich

Formen, Körper und ihre Namen entdecken. Stufe für Stufe, wie in der
Schule.

Formenreich übt genau eine Kompetenz des Lehrplans 21: MA.2.A.1
(Begriffe und Symbole zu Form und Raum, Ausgabe Kanton Bern). Die
zwölf Stufen a bis l sind die offiziellen Kompetenzstufen dieser
Kompetenz; die Grundansprüche der drei Zyklen sind als Abzeichen
markiert. Zeichnen-Anteile sind als Erkennen von Bildern umgesetzt.

## Benutzen

Die App ist eine statische Seite, online unter der GitHub-Pages-Adresse
des Repos (`formenreich/`). Lokal genügt ein einfacher Webserver, da
die App ES-Module nutzt:

```bash
cd formenreich
python3 -m http.server 8000
# http://localhost:8000
```

- Stufe wählen und eine Runde mit 8 Aufgaben spielen: vom Erkennen
  von Kreis und Würfel über Raumlagen, Koordinaten und
  Kreis-Begriffe bis zu Vierecksarten, Kegel, Prisma und Tetraeder.
- Figuren werden als Bilder gezeigt; Auswahl-Antworten werten beim
  Antippen, getippte Antworten beim letzten Zeichen (oder mit Enter).
- XP, Levels und Medaillen belohnen Übung, nie Tempo. Nach fünf
  fehlerfreien Runden schlägt die App die nächste Stufe vor.
- Der Fortschritt bleibt auf dem Gerät (localStorage). Keine Konten,
  keine Cookies, keine externen Anfragen.

## Tests

```bash
cd formenreich/tests
npm install
node e2e.test.mjs
```

Die Suite prüft zuerst die Aufgaben-Generatoren mit gesätem Zufall
gegen ein Geometrie-Orakel, das jede Figur unabhängig aus dem
SVG-Markup klassifiziert, und fährt dann die App-Abläufe in Chromium
ab. Screenshots landen in `tests/screenshots/`.
