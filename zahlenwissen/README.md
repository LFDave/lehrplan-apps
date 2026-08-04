# Zahlenwissen

Zahlen lesen, schreiben und ihre Namen kennen. Stufe für Stufe, wie in
der Schule.

Zahlenwissen übt genau eine Kompetenz des Lehrplans 21: MA.1.A.1
("arithmetische Begriffe und Symbole verstehen, Zahlen lesen und
schreiben", Ausgabe Kanton Bern). Die zwölf Stufen a bis l sind die
offiziellen Kompetenzstufen dieser Kompetenz; die Grundansprüche der
drei Zyklen sind als Abzeichen markiert.

## Benutzen

Die App ist eine statische Seite, online unter der GitHub-Pages-Adresse
des Repos (`zahlenwissen/`). Lokal genügt ein einfacher Webserver, da
die App ES-Module nutzt:

```bash
cd zahlenwissen
python3 -m http.server 8000
# http://localhost:8000
```

- Stufe wählen und eine Runde mit 8 Aufgaben spielen: von
  Punktmengen-Vergleichen über Zahlwörter, Fachbegriffe und
  Umwandlungen bis zu wissenschaftlicher Schreibweise und
  irrationalen Zahlen.
- Getippte Antworten prüfen sich beim letzten Zeichen von selbst; mit
  Enter geht es auch früher.
- XP, Levels und Medaillen belohnen Übung, nie Tempo. Nach fünf
  fehlerfreien Runden schlägt die App die nächste Stufe vor.
- Der Fortschritt bleibt auf dem Gerät (localStorage). Keine Konten,
  keine Cookies, keine externen Anfragen.

## Tests

```bash
cd zahlenwissen/tests
npm install
node e2e.test.mjs
```

Die Suite prüft zuerst die Aufgaben-Generatoren mit gesätem Zufall
gegen ein unabhängiges Orakel (eigener Zahlwort-Parser) und fährt dann
die App-Abläufe in Chromium ab. Screenshots landen in
`tests/screenshots/`.
