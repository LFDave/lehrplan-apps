# Rechenkniff

Zerlegen, umformen und mit Rechengesetzen tricksen. Stufe für Stufe,
wie in der Schule.

Rechenkniff übt genau eine Kompetenz des Lehrplans 21: MA.1.A.4
("Zahlen zerlegen, umformen und Rechengesetze nutzen", Ausgabe Kanton
Bern). Die zwölf Stufen a bis l sind die offiziellen Kompetenzstufen
dieser Kompetenz; die Grundansprüche der drei Zyklen sind als
Abzeichen markiert, die reine Erweiterungs-Stufe j ist als solche
gekennzeichnet.

## Benutzen

Die App ist eine statische Seite, online unter der GitHub-Pages-Adresse
des Repos (`rechenkniff/`). Lokal genügt ein einfacher Webserver, da
die App ES-Module nutzt:

```bash
cd rechenkniff
python3 -m http.server 8000
# http://localhost:8000
```

- Stufe wählen und eine Runde mit 8 Aufgaben spielen: vom
  Mengen-Angleichen über Umkehraufgaben, Rechengesetze und
  Teilbarkeit bis zu Gleichungen, Termen und binomischen Formeln.
- Getippte Antworten prüfen sich beim letzten Zeichen von selbst; mit
  Enter geht es auch früher.
- XP, Levels und Medaillen belohnen Übung, nie Tempo. Nach fünf
  fehlerfreien Runden schlägt die App die nächste Stufe vor.
- Der Fortschritt bleibt auf dem Gerät (localStorage). Keine Konten,
  keine Cookies, keine externen Anfragen.

## Tests

```bash
cd rechenkniff/tests
npm install
node e2e.test.mjs
```

Die Suite prüft zuerst die Aufgaben-Generatoren mit gesätem Zufall
gegen ein unabhängiges Rechen-Orakel und fährt dann die App-Abläufe in
Chromium ab. Screenshots landen in `tests/screenshots/`.
