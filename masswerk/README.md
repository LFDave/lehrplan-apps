# Masswerk

Geld, Längen, Gewichte und Zeit. Stufe für Stufe, wie in der Schule.

Masswerk übt genau eine Kompetenz des Lehrplans 21: MA.3.A.2 ("Grössen
schätzen, messen, umwandeln, runden und mit ihnen rechnen", Ausgabe
Kanton Bern). Die Stufen sind die offiziellen Kompetenzstufen dieser
Kompetenz; die Grundansprüche der drei Zyklen sind als Abzeichen
markiert. Die Stufen a und f üben Schätzen und Messen mit echten
Dingen; das übt man draussen, nicht in der App, und die Übersicht sagt
das auch.

## Benutzen

Die App ist eine statische Seite, online unter der GitHub-Pages-Adresse
des Repos (`masswerk/`). Lokal genügt ein einfacher Webserver, da die
App ES-Module nutzt:

```bash
cd masswerk
python3 -m http.server 8000
# http://localhost:8000
```

- Stufe wählen und eine Runde mit 8 Aufgaben spielen: von Franken und
  halben Stunden über Einheiten-Umwandlungen bis zu SI-Vorsätzen und
  Geschwindigkeiten.
- Getippte Antworten prüfen sich beim letzten Zeichen von selbst; mit
  Enter geht es auch früher.
- XP, Levels und Medaillen belohnen Übung, nie Tempo. Nach fünf
  fehlerfreien Runden schlägt die App die nächste Stufe vor.
- Der Fortschritt bleibt auf dem Gerät (localStorage). Keine Konten,
  keine Cookies, keine externen Anfragen.

## Tests

```bash
cd masswerk/tests
npm install
node e2e.test.mjs
```

Die Suite prüft zuerst die Aufgaben-Generatoren mit gesätem Zufall
gegen ein unabhängiges, einheiten-bewusstes Orakel und fährt dann die
App-Abläufe in Chromium ab. Screenshots landen in
`tests/screenshots/`.
