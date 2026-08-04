# Wertepfad

Folgen, Tabellen und Funktionen Schritt für Schritt. Wie in der Schule.

Wertepfad übt genau eine Kompetenz des Lehrplans 21: MA.3.A.3
(Zahlenfolgen, Wertetabellen, Proportionalität und Funktionen, Ausgabe
Kanton Bern). Die elf Stufen a bis k sind die offiziellen
Kompetenzstufen dieser Kompetenz; die Grundansprüche der drei Zyklen
sind als Abzeichen markiert. Graph-Zeichnen ist als Berechnen von
Funktionswerten umgesetzt.

## Benutzen

Die App ist eine statische Seite, online unter der GitHub-Pages-Adresse
des Repos (`wertepfad/`). Lokal genügt ein einfacher Webserver, da die
App ES-Module nutzt:

```bash
cd wertepfad
python3 -m http.server 8000
# http://localhost:8000
```

- Stufe wählen und eine Runde mit 8 Aufgaben spielen: von einfachen
  Wertetabellen über Zahlenfolgen, Proportionalität und Prozente bis
  zu Funktionsgleichungen, Schnittpunkten und Nullstellen.
- Getippte Antworten prüfen sich beim letzten Zeichen von selbst; mit
  Enter geht es auch früher.
- XP, Levels und Medaillen belohnen Übung, nie Tempo. Nach fünf
  fehlerfreien Runden schlägt die App die nächste Stufe vor.
- Der Fortschritt bleibt auf dem Gerät (localStorage). Keine Konten,
  keine Cookies, keine externen Anfragen.

## Tests

```bash
cd wertepfad/tests
npm install
node e2e.test.mjs
```

Die Suite prüft zuerst die Aufgaben-Generatoren mit gesätem Zufall
gegen ein unabhängiges Orakel (generischer Folgen-Löser über
Differenzen) und fährt dann die App-Abläufe in Chromium ab.
Screenshots landen in `tests/screenshots/`.
