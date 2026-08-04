# Ortho

Französisch richtig schreiben: abschreiben, ergänzen, prüfen.

Ortho übt genau eine Kompetenz des Lehrplans 21: FS1F.5.E.1
(Französisch, Rechtschreibung; Ausgabe Kanton Bern, Stand
01.08.2022). Die Stufen a bis d sind die offiziellen
Kompetenzstufen; die Grundansprüche sind als Abzeichen markiert
(b = Grundanspruch Zyklus 2, c = Zyklus 3).

## Benutzen

```bash
cd ortho
python3 -m http.server 8000
# http://localhost:8000
```

- Stufe wählen und eine Runde mit 8 Aufgaben spielen.
- Getippte Antworten prüfen sich beim letzten Zeichen von selbst; mit
  Enter geht es auch früher. Accents zählen: é, è und à tippst du
  direkt auf der Schweizer Tastatur.
- XP, Levels und Medaillen belohnen Übung, nie Tempo.
- Der Fortschritt bleibt auf dem Gerät (localStorage). Keine Konten,
  keine Cookies, keine externen Anfragen.

## Tests

```bash
cd ortho/tests
npm install
node e2e.test.mjs
```
