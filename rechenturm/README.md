# Rechenturm

Plus, minus, mal, geteilt und Potenzen. Stufe für Stufe, wie in der
Schule.

Rechenturm übt genau eine Kompetenz des Lehrplans 21: MA.1.A.3
("addieren, subtrahieren, multiplizieren, dividieren und potenzieren",
Ausgabe Kanton Bern). Die zehn Stufen a bis j sind die offiziellen
Kompetenzstufen dieser Kompetenz; die Grundansprüche der Zyklen 1 und 2
sind als Abzeichen markiert. Für den 3. Zyklus setzt der Lehrplan hier
keinen Grundanspruch; dafür gibt es die Medaille "Turmspitze" für die
oberste Stufe.

## Benutzen

Die App ist eine statische Seite, online unter der GitHub-Pages-Adresse
des Repos (`rechenturm/`). Lokal genügt ein einfacher Webserver, da die
App ES-Module nutzt:

```bash
cd rechenturm
python3 -m http.server 8000
# http://localhost:8000
```

- Stufe wählen und eine Runde mit 8 Aufgaben spielen: vom Rechnen bis
  20 über das Einmaleins und Dezimalzahlen bis zu Potenzregeln und
  wissenschaftlicher Schreibweise.
- Getippte Antworten prüfen sich beim letzten Zeichen von selbst.
- XP, Levels und Medaillen belohnen Übung, nie Tempo. Nach fünf
  fehlerfreien Runden schlägt die App die nächste Stufe vor.
- Der Fortschritt bleibt auf dem Gerät (localStorage). Keine Konten,
  keine Cookies, keine externen Anfragen.

## Tests

```bash
cd rechenturm/tests
npm install
node e2e.test.mjs
```

Die Suite prüft zuerst die Aufgaben-Generatoren mit gesätem Zufall
gegen ein unabhängiges Rechen-Orakel und fährt dann die App-Abläufe in
Chromium ab. Screenshots landen in `tests/screenshots/`.
