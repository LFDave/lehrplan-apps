# Wortbau

Wortarten, Zeitformen und Satzglieder erkennen. Wie in der Schule.

Wortbau übt genau eine Kompetenz des Lehrplans 21: D.5.D.1 (Ausgabe
Kanton Bern, Stand 01.08.2022). Die Stufen a bis g sind die
offiziellen Kompetenzstufen; die Grundansprüche sind als Abzeichen
markiert (a = Grundanspruch Zyklus 1, c = Zyklus 2, e = Zyklus 3).

## Benutzen

```bash
cd wortbau
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
cd wortbau/tests
npm install
node e2e.test.mjs
```
