# Spellwerk

Englisch richtig schreiben: abschreiben, ergänzen, prüfen.

Spellwerk übt genau eine Kompetenz des Lehrplans 21: FS2E.5.E.1
(Englisch, Rechtschreibung; Ausgabe Kanton Bern, Stand 01.08.2022).
Die Stufen a bis d sind die offiziellen Kompetenzstufen; die
Grundansprüche sind als Abzeichen markiert (b = Grundanspruch
Zyklus 2, c = Zyklus 3).

## Benutzen

```bash
cd spellwerk
python3 -m http.server 8000
# http://localhost:8000
```

- Stufe wählen und eine Runde mit 8 Aufgaben spielen.
- Getippte Antworten prüfen sich beim letzten Zeichen von selbst; mit
  Enter geht es auch früher. Gross und klein zählt: das englische
  «I» schreibt man immer gross.
- XP, Levels und Medaillen belohnen Übung, nie Tempo.
- Der Fortschritt bleibt auf dem Gerät (localStorage). Keine Konten,
  keine Cookies, keine externen Anfragen.

## Tests

```bash
cd spellwerk/tests
npm install
node e2e.test.mjs
```
