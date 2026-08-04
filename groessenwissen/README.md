# Grössenwissen

Einheiten, Referenzen und Fachwörter rund um Grössen. Stufe für Stufe,
wie in der Schule.

Grössenwissen übt genau eine Kompetenz des Lehrplans 21: MA.3.A.1
(Begriffe, Symbole und Referenzgrössen zu Grössen, Funktionen, Daten
und Zufall, Ausgabe Kanton Bern). Die zwölf Stufen a bis l sind die
offiziellen Kompetenzstufen dieser Kompetenz; die Grundansprüche der
drei Zyklen sind als Abzeichen markiert. Das Rechnen mit Grössen übt
die Schwester-App Masswerk.

## Benutzen

Die App ist eine statische Seite, online unter der GitHub-Pages-Adresse
des Repos (`groessenwissen/`). Lokal genügt ein einfacher Webserver, da
die App ES-Module nutzt:

```bash
cd groessenwissen
python3 -m http.server 8000
# http://localhost:8000
```

- Stufe wählen und eine Runde mit 8 Aufgaben spielen: von Gegenteilen
  und echten Schweizer Münzen über Einheiten, Vorsätze und
  Referenzgrössen bis zu Diagrammen, Zins und Rabatt.
- Getippte Antworten prüfen sich beim letzten Zeichen von selbst; mit
  Enter geht es auch früher.
- XP, Levels und Medaillen belohnen Übung, nie Tempo. Nach fünf
  fehlerfreien Runden schlägt die App die nächste Stufe vor.
- Der Fortschritt bleibt auf dem Gerät (localStorage). Keine Konten,
  keine Cookies, keine externen Anfragen.

## Tests

```bash
cd groessenwissen/tests
npm install
node e2e.test.mjs
```

Die Suite prüft zuerst die Aufgaben-Generatoren mit gesätem Zufall
gegen ein unabhängiges Orakel (eigene Umrechnungstabelle, offizielles
Münzsortiment) und fährt dann die App-Abläufe in Chromium ab.
Screenshots landen in `tests/screenshots/`.
