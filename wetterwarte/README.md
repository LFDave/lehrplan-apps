# Wetterwarte

Wetter, Messgeräte und Naturereignisse verstehen.

Wetterwarte übt genau eine Kompetenz des Lehrplans 21: NMG.4.4
(Ausgabe Kanton Bern, Stand 01.08.2022). Die Kompetenz hat zwei
offizielle Stufenreihen: 1a bis 1g (Wetter) und 2a bis 2e
(Naturereignisse). Die Grundansprüche sind als Abzeichen markiert
(1b und 2b = Zyklus 1, 1f und 2e = Zyklus 2).

## Benutzen

```bash
cd wetterwarte
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
cd wetterwarte/tests
npm install
node e2e.test.mjs
```
