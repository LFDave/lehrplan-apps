# Körperatlas

Den eigenen Körper kennen: Knochen, Organe, Kreislauf.

Körperatlas übt genau eine Kompetenz des Lehrplans 21: NMG.1.4
(Ausgabe Kanton Bern, Stand 01.08.2022). Die Stufen a bis f sind die
offiziellen Kompetenzstufen; die Grundansprüche sind als Abzeichen
markiert (b = Grundanspruch Zyklus 1, e = Zyklus 2).

## Benutzen

```bash
cd koerperatlas
python3 -m http.server 8000
# http://localhost:8000
```

- Stufe wählen und eine Runde mit 8 Aufgaben spielen.
- Getippte Antworten prüfen sich beim letzten Zeichen von selbst; mit
  Enter geht es auch früher.
- XP, Levels und Medaillen belohnen Übung, nie Tempo.
- Der Fortschritt bleibt auf dem Gerät (localStorage). Keine Konten,
  keine Cookies, keine externen Anfragen.

## Tests

```bash
cd koerperatlas/tests
npm install
node e2e.test.mjs
```
