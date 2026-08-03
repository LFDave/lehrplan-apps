# Zahlensprung

Zählen, ordnen und überschlagen. Stufe für Stufe, wie in der Schule.

Zahlensprung übt genau eine Kompetenz des Lehrplans 21: MA.1.A.2
("flexibel zählen, Zahlen ordnen, Ergebnisse überschlagen", Ausgabe Kanton
Bern). Die zehn Stufen a bis j sind die offiziellen Kompetenzstufen dieser
Kompetenz; die Grundansprüche der drei Zyklen sind als Abzeichen markiert.

## Benutzen

Die App ist eine statische Seite, online unter der GitHub-Pages-Adresse des
Repos (`zahlensprung/`). Lokal genügt ein einfacher Webserver, da die App
ES-Module nutzt:

```bash
cd zahlensprung
python3 -m http.server 8000
# http://localhost:8000
```

- Stufe wählen und eine Runde mit 8 Aufgaben spielen: Punkte zählen,
  Zahlenfolgen fortsetzen, Zahlen ordnen, Ergebnisse überschlagen.
- Getippte Antworten prüfen sich beim letzten Zeichen von selbst.
- XP, Levels und Medaillen belohnen Übung, nie Tempo. Nach fünf
  fehlerfreien Runden schlägt die App die nächste Stufe vor.
- Der Fortschritt bleibt auf dem Gerät (localStorage). Keine Konten, keine
  Cookies, keine externen Anfragen.

## Tests

```bash
cd zahlensprung/tests
npm install
node e2e.test.mjs
```

Die Suite prüft zuerst die Aufgaben-Generatoren mit gesätem Zufall und
fährt dann die App-Abläufe in Chromium ab. Screenshots landen in
`tests/screenshots/`.
