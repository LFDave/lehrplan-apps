# PRD — Nachfragen mit KI

Version: 1.0. Dieses Dokument ist die massgebende Spezifikation der
Seite. Verhalten und PRD werden immer in derselben Änderung angepasst.

## Zweck

Eltern, Kinder und Jugendliche sollen einen KI-Dienst, den sie schon
nutzen, sinnvoll zum Lehrplan 21 befragen können. Die Seite liefert
dafür fertige, gut gestellte Fragen: den Lehrplan erklären lassen, die
Ziele des eigenen Zyklus kennen, eine faire Einschätzung zu einem
offiziellen Marker bauen, passendes Lernmaterial aus dieser Sammlung
finden. Sie ersetzt keine App und keine Lehrperson und speichert
nichts über das Kind.

## Prinzipien

- **Knöpfe statt Formular.** Antwortsprache, Zyklus und Zeitpunkt sind
  Auswahlknöpfe. Das einzige Textfeld ist der Name einer weiteren
  Antwortsprache hinter dem Knopf «Andere» (zum Beispiel Ukrainisch);
  er fliesst nur in die Schlusszeile «Antworte auf …». Was der Dienst
  über das Kind wissen muss (Fächer, Stärken, Schwächen, Zeit), fragt
  er im Gespräch selbst nach. Namen gehören nicht in den Chat; die
  Seite sagt das.
- **Nur echte Marker.** Eine Einschätzung gibt es nur für Zeitpunkte,
  die der Lehrplan kennt: Grundanspruch am Ende der 2., 6. und 9.
  Klasse und die Orientierungspunkte Ende 4. Klasse und Mitte 8.
  Klasse. Bei einem Orientierungspunkt verlangt die Frage Vorsicht
  («bearbeitet», nicht «erreicht»), weil er kein Grundanspruch ist.
- **Eine Quelle.** Jede Frage endet mit demselben Block: einzige Quelle
  ist das offizielle PDF (be.lehrplan.ch, Gesamtausgabe), kein anderes
  Internet, Kompetenz-Codes nennen, keine Stufen erfinden, Unsicheres
  mit (?) markieren, Antwort in der gewählten Sprache.
- **Sichtbarer Text.** Der vollständige Text jeder Frage steht auf der
  Seite (aufklappbar, offen), bevor jemand klickt. Was den Dienst
  erreicht, ist genau dieser Text.
- **Nur Dienste mit Link-Übergabe.** ChatGPT, Claude, Perplexity und
  Le Chat nehmen den Text als URL-Parameter an. Dienste ohne solche
  Übergabe werden nicht gelistet; dafür gibt es «Kopieren».

## Inhalt

1. Antwortsprache: Deutsch, Français, Italiano, Rumantsch, English,
   Andere. Die Frage bleibt deutsch, die Schlusszeile verlangt die
   Antwort in der gewählten Sprache. «Andere» zeigt ein Textfeld für
   den Sprachnamen (eine Zeile, höchstens 40 Zeichen, Steuerzeichen
   entfernt); leer heisst Deutsch. Standard Deutsch, gespeichert unter
   `nachfragen.lang` und `nachfragen.langOther`.
2. Karte «Den Lehrplan erklären lassen» (Eltern): Aufbau, Zyklen,
   Begriffe, woran man erkennt, ob das Kind auf Kurs ist, fünf
   Merksätze.
3. Karte «Was soll ich können?» (Kind, Zyklus-Wahl): Grundanspruch des
   eigenen Zyklus in Mathematik und Deutsch als Liste mit Beispielen,
   dann Rückfrage und Übungsvorschlag. Zyklus gespeichert unter
   `nachfragen.zyklus`, Standard 2.
4. Karte «Eine Einschätzung bauen» (Eltern, Zeitpunkt-Wahl): der
   Dienst fragt zuerst nach Fächern, Stärken, Schwächen und Zeit,
   dann sechs bis acht Aufgaben pro Fach mit Code, Erwartung und
   Lösung, Tabelle zum Ausfüllen, Gesprächshilfe für die Lehrperson.
   Zeitpunkt gespeichert unter `nachfragen.check`, Standard Ende
   6. Klasse.
5. Karte «Lernmaterial finden» (Eltern und Kind, Zyklus-Wahl): die
   31 Übungs-Apps mit Code und Kurzbeschreibung und die 16
   Merkheft-Themen stehen in der Frage; der Dienst fragt nach den
   schwierigen Themen und schlägt höchstens drei Apps vor.

Jede Karte: Titel, ein Satz für wen und wozu, Auswahlknöpfe, der
Text, «Kopieren» (Hauptknopf) und die vier Dienste als Sekundärknöpfe.
Nach dem Kopieren erscheint eine Statuszeile (`role="status"`), die
bis zur nächsten Auswahl stehen bleibt.

## Grenzen

- Die Seite sendet selbst nichts. Erst der Klick auf einen Dienst
  öffnet ihn in einem neuen Tab mit dem Text in der Adresse
  (`rel="noopener noreferrer"`, `referrerpolicy="no-referrer"`).
- Der Text jeder Frage bleibt unter 4000 Zeichen, die Adresse unter
  7000 Zeichen, damit jeder Browser und Dienst sie annimmt.
- Die Fusszeile sagt, dass KI sich irren kann und dass die geprüften
  Stufen in den Übungs-Apps stehen.

## Tests

Root-Suite `tests/e2e.test.mjs`: fünfter Eintrag auf der Startseite,
Pfad, Sprach- und Zeitpunkt-Wahl ändern den Text, «Andere» zeigt das
Feld und der bereinigte Sprachname landet in der Schlusszeile, Links tragen genau
den angezeigten Text URL-kodiert, Kopieren schreibt in die
Zwischenablage, Auswahl überlebt ein Neuladen, `APPS` entspricht der
Übungs-Apps-Liste, Längenlimits, kein ß, keine externen Anfragen vor
dem Klick, Fokus und Layout bei 320 px.
