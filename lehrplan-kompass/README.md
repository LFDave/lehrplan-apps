# Lehrplan-Kompass

Entdecke, was du in der Schule lernst, und hake ab, was du schon kannst.

Der Lehrplan-Kompass zeigt die Fachbereiche des Lehrplans 21 (Ausgabe Kanton
Bern) für alle drei Zyklen der Volksschule. Kinder und Eltern wählen den
Zyklus, öffnen ein Fach und haken Kompetenzen ab: "Das kann ich schon." Jede
Kompetenz hat pro Zyklus einen eigenen, kindgerechten Text auf dem Niveau
dieses Zyklus; der offizielle Lehrplan-Code steht neben jedem Eintrag.

## Benutzen

Die App ist eine statische Seite, online unter der GitHub-Pages-Adresse des
Repos (`lehrplan-kompass/`). Lokal genügt ein einfacher Webserver, da die App
ES-Module nutzt:

```bash
cd lehrplan-kompass
python3 -m http.server 8000
# http://localhost:8000
```

- Zyklus wählen (Zyklus 1 bis 3), Fach öffnen, Kompetenz antippen zum
  Abhaken. Häkchen gelten pro Zyklus.
- Der Fortschritt bleibt auf dem Gerät gespeichert (localStorage). Keine
  Konten, keine Cookies, keine externen Anfragen.
- "Alles zurücksetzen" im Fuss der Startansicht löscht alle Häkchen nach
  Bestätigung.

## Tests

```bash
cd lehrplan-kompass/tests
npm install
node e2e.test.mjs
```

Die Suite startet einen eigenen lokalen Server, fährt die Abläufe in Chromium
ab und legt Screenshots in `tests/screenshots/` ab.
