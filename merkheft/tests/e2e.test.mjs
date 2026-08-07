// e2e.test.mjs — Playwright end-to-end tests for Merkheft.
//
// Run:
//   cd merkheft/tests && npm install && node e2e.test.mjs
//
// Spawns its own static server and drives the real flows in Chromium:
// the index list, every Merkblatt as its own page, the interactive
// visuals (circuit states, globe slider, orbit toggle), the Dazu-üben
// links, back navigation, print styles, layout, console and network
// hygiene. The expectations are restated here independently of the
// pages themselves.

import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { mkdirSync, existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const TESTS_DIR = dirname(fileURLToPath(import.meta.url));
const APP_DIR = join(TESTS_DIR, "..");
const ROOT_DIR = join(APP_DIR, "..");
const SHOTS_DIR = join(TESTS_DIR, "screenshots");
const PORT = 8547;
const BASE = `http://localhost:${PORT}/merkheft`;

// Independent restatement of the full Merkheft contents (wave 3,
// complete coverage): one HTML page per concept, its group, title,
// practice links and codes. Every Stufe of every practice app maps
// to exactly one Merkblatt.
// ueben hrefs deep-link into the Stufe (?stufe=<id>). Mixed official
// Stufen are split in the app into topic-pure sub-Stufen (masswerk
// b-geld/b-zeit/d-geld/d-zeit), so no topic parameter is needed and
// the app cleans the query from the address after entry.
const BLAETTER = [
  { id: "zahlenstrahl", gruppe: "Zahlen und Rechnen", title: "Der Zahlenstrahl",
    ueben: [{ href: "../zahlenwissen/?stufe=a", stufe: "a" },
      { href: "../zahlensprung/?stufe=a", stufe: "a" },
      { href: "../zahlensprung/?stufe=b", stufe: "b" },
      { href: "../zahlensprung/?stufe=c", stufe: "c" },
      { href: "../zahlensprung/?stufe=d", stufe: "d" },
      { href: "../zahlensprung/?stufe=j", stufe: "j" }],
    codes: ["MA.1.A.1.a", "MA.1.A.2.a", "MA.1.A.2.b", "MA.1.A.2.c", "MA.1.A.2.d", "MA.1.A.2.j"], interactive: false },
  { id: "stellenwert", gruppe: "Zahlen und Rechnen", title: "Die Stellenwerttafel",
    ueben: [{ href: "../zahlenwissen/?stufe=c", stufe: "c" },
      { href: "../zahlenwissen/?stufe=e", stufe: "e" },
      { href: "../zahlensprung/?stufe=e", stufe: "e" },
      { href: "../zahlensprung/?stufe=f", stufe: "f" }],
    codes: ["MA.1.A.1.c", "MA.1.A.1.e", "MA.1.A.2.e", "MA.1.A.2.f"], interactive: false },
  { id: "rechenwoerter", gruppe: "Zahlen und Rechnen", title: "Die Rechenwörter",
    ueben: [{ href: "../zahlenwissen/?stufe=b", stufe: "b" },
      { href: "../zahlenwissen/?stufe=d", stufe: "d" },
      { href: "../zahlenwissen/?stufe=f", stufe: "f" }],
    codes: ["MA.1.A.1.b", "MA.1.A.1.d", "MA.1.A.1.f"], interactive: false },
  { id: "plus-minus", gruppe: "Zahlen und Rechnen", title: "Plus und minus im Kopf",
    ueben: [{ href: "../rechenturm/?stufe=a", stufe: "a" },
      { href: "../rechenturm/?stufe=b", stufe: "b" },
      { href: "../rechenkniff/?stufe=a", stufe: "a" },
      { href: "../rechenkniff/?stufe=b", stufe: "b" }],
    codes: ["MA.1.A.3.a", "MA.1.A.3.b", "MA.1.A.4.a", "MA.1.A.4.b"], interactive: false },
  { id: "einmaleins", gruppe: "Zahlen und Rechnen", title: "Das Einmaleins",
    ueben: [{ href: "../rechenturm/?stufe=c", stufe: "c" },
      { href: "../rechenkniff/?stufe=d", stufe: "d" },
      { href: "../rechenkniff/?stufe=e", stufe: "e" }],
    codes: ["MA.1.A.3.c", "MA.1.A.4.d", "MA.1.A.4.e"], interactive: false },
  { id: "schriftlich-rechnen", gruppe: "Zahlen und Rechnen", title: "Schriftlich rechnen",
    ueben: [{ href: "../rechenturm/?stufe=d", stufe: "d" }],
    codes: ["MA.1.A.3.d"], interactive: false },
  { id: "kopfrechnen", gruppe: "Zahlen und Rechnen", title: "Geschickt rechnen",
    ueben: [{ href: "../rechenturm/?stufe=e", stufe: "e" },
      { href: "../rechenkniff/?stufe=c", stufe: "c" },
      { href: "../rechenkniff/?stufe=f", stufe: "f" }],
    codes: ["MA.1.A.3.e", "MA.1.A.4.c", "MA.1.A.4.f"], interactive: false },
  { id: "dezimalzahlen", gruppe: "Zahlen und Rechnen", title: "Rechnen mit Dezimalzahlen",
    ueben: [{ href: "../rechenturm/?stufe=f", stufe: "f" },
      { href: "../rechenturm/?stufe=g", stufe: "g" }],
    codes: ["MA.1.A.3.f", "MA.1.A.3.g"], interactive: false },
  { id: "brueche", gruppe: "Zahlen und Rechnen", title: "Brüche, Dezimalzahlen, Prozente",
    ueben: [{ href: "../zahlenwissen/?stufe=g", stufe: "g" },
      { href: "../zahlenwissen/?stufe=h", stufe: "h" },
      { href: "../zahlensprung/?stufe=g", stufe: "g" },
      { href: "../rechenturm/?stufe=i", stufe: "i" },
      { href: "../wertepfad/?stufe=f", stufe: "f" }],
    codes: ["MA.1.A.1.g", "MA.1.A.1.h", "MA.1.A.2.g", "MA.1.A.3.i", "MA.3.A.3.f"], interactive: false },
  { id: "prozente", gruppe: "Zahlen und Rechnen", title: "Prozente berechnen",
    ueben: [{ href: "../rechenturm/?stufe=h", stufe: "h" },
      { href: "../groessenwissen/?stufe=l-geld", stufe: "l" }],
    codes: ["MA.1.A.3.h", "MA.3.A.1.l"], interactive: false },
  { id: "runden", gruppe: "Zahlen und Rechnen", title: "Runden und Überschlagen",
    ueben: [{ href: "../zahlensprung/?stufe=h", stufe: "h" },
      { href: "../zahlensprung/?stufe=i", stufe: "i" },
      { href: "../masswerk/?stufe=h", stufe: "h" }],
    codes: ["MA.1.A.2.h", "MA.1.A.2.i", "MA.3.A.2.h"], interactive: false },
  { id: "teilbarkeit", gruppe: "Zahlen und Rechnen", title: "Teilbarkeit und Primzahlen",
    ueben: [{ href: "../rechenkniff/?stufe=g", stufe: "g" }],
    codes: ["MA.1.A.4.g"], interactive: false },
  { id: "punkt-vor-strich", gruppe: "Zahlen und Rechnen", title: "Punkt vor Strich",
    ueben: [{ href: "../rechenkniff/?stufe=h", stufe: "h" },
      { href: "../rechenkniff/?stufe=i", stufe: "i" }],
    codes: ["MA.1.A.4.h", "MA.1.A.4.i"], interactive: false },
  { id: "potenzen", gruppe: "Zahlen und Rechnen", title: "Potenzen und Wurzeln",
    ueben: [{ href: "../zahlenwissen/?stufe=i", stufe: "i" },
      { href: "../zahlenwissen/?stufe=j", stufe: "j" },
      { href: "../zahlenwissen/?stufe=k", stufe: "k" },
      { href: "../zahlenwissen/?stufe=l", stufe: "l" },
      { href: "../rechenturm/?stufe=j", stufe: "j" }],
    codes: ["MA.1.A.1.i", "MA.1.A.1.j", "MA.1.A.1.k", "MA.1.A.1.l", "MA.1.A.3.j"], interactive: false },
  { id: "gleichungen", gruppe: "Zahlen und Rechnen", title: "Gleichungen lösen",
    ueben: [{ href: "../rechenkniff/?stufe=j", stufe: "j" },
      { href: "../rechenkniff/?stufe=k", stufe: "k" },
      { href: "../rechenkniff/?stufe=l", stufe: "l" }],
    codes: ["MA.1.A.4.j", "MA.1.A.4.k", "MA.1.A.4.l"], interactive: false },
  { id: "geld", gruppe: "Grössen und Masse", title: "Das Geld",
    ueben: [{ href: "../masswerk/?stufe=b-geld", stufe: "b" },
      { href: "../masswerk/?stufe=c-geld", stufe: "c" },
      { href: "../masswerk/?stufe=d-geld", stufe: "d" },
      { href: "../groessenwissen/?stufe=b-geld", stufe: "b" },
      { href: "../groessenwissen/?stufe=d", stufe: "d" }],
    codes: ["MA.3.A.2.b", "MA.3.A.2.c", "MA.3.A.2.d", "MA.3.A.1.b", "MA.3.A.1.d"], interactive: false },
  { id: "uhr", gruppe: "Grössen und Masse", title: "Die Uhr",
    ueben: [{ href: "../masswerk/?stufe=b-zeit", stufe: "b" },
      { href: "../masswerk/?stufe=d-zeit", stufe: "d" }],
    codes: ["MA.3.A.2.b", "MA.3.A.2.d"], interactive: false },
  { id: "laengen", gruppe: "Grössen und Masse", title: "Längen messen",
    ueben: [{ href: "../masswerk/?stufe=c-laengen", stufe: "c" },
      { href: "../groessenwissen/?stufe=c", stufe: "c" },
      { href: "../groessenwissen/?stufe=a", stufe: "a" },
      { href: "../groessenwissen/?stufe=b-vergleiche", stufe: "b" },
      { href: "../formenreich/?stufe=b", stufe: "b" }],
    codes: ["MA.3.A.2.c", "MA.3.A.1.c", "MA.3.A.1.a", "MA.3.A.1.b", "MA.2.A.1.b"], interactive: false },
  { id: "masseinheiten", gruppe: "Grössen und Masse", title: "Masseinheiten",
    ueben: [{ href: "../masswerk/?stufe=e", stufe: "e" },
      { href: "../masswerk/?stufe=g", stufe: "g" },
      { href: "../groessenwissen/?stufe=f", stufe: "f" }],
    codes: ["MA.3.A.2.e", "MA.3.A.2.g", "MA.3.A.1.f"], interactive: false },
  { id: "referenzgroessen", gruppe: "Grössen und Masse", title: "Referenzgrössen",
    ueben: [{ href: "../groessenwissen/?stufe=e", stufe: "e" }],
    codes: ["MA.3.A.1.e"], interactive: false },
  { id: "flaechenmasse", gruppe: "Grössen und Masse", title: "Flächen- und Raummasse",
    ueben: [{ href: "../masswerk/?stufe=i", stufe: "i" },
      { href: "../groessenwissen/?stufe=h-flaechen", stufe: "h" },
      { href: "../groessenwissen/?stufe=i", stufe: "i" },
      { href: "../groessenwissen/?stufe=j", stufe: "j" }],
    codes: ["MA.3.A.2.i", "MA.3.A.1.h", "MA.3.A.1.i", "MA.3.A.1.j"], interactive: false },
  { id: "si-vorsaetze", gruppe: "Grössen und Masse", title: "Die SI-Vorsätze",
    ueben: [{ href: "../masswerk/?stufe=j", stufe: "j" },
      { href: "../groessenwissen/?stufe=l-vorsaetze", stufe: "l" }],
    codes: ["MA.3.A.2.j", "MA.3.A.1.l"], interactive: false },
  { id: "geschwindigkeit", gruppe: "Grössen und Masse", title: "Die Geschwindigkeit",
    ueben: [{ href: "../masswerk/?stufe=k", stufe: "k" },
      { href: "../groessenwissen/?stufe=k-einheiten", stufe: "k" }],
    codes: ["MA.3.A.2.k", "MA.3.A.1.k"], interactive: false },
  { id: "formen-koerper", gruppe: "Form und Raum", title: "Formen und Körper",
    ueben: [{ href: "../formenreich/?stufe=a", stufe: "a" },
      { href: "../formenreich/?stufe=d", stufe: "d" },
      { href: "../formenreich/?stufe=e", stufe: "e" },
      { href: "../formenreich/?stufe=f", stufe: "f" },
      { href: "../formenreich/?stufe=k", stufe: "k" }],
    codes: ["MA.2.A.1.a", "MA.2.A.1.d", "MA.2.A.1.e", "MA.2.A.1.f", "MA.2.A.1.k"], interactive: false },
  { id: "lagewoerter", gruppe: "Form und Raum", title: "Die Lagewörter",
    ueben: [{ href: "../formenreich/?stufe=c", stufe: "c" }],
    codes: ["MA.2.A.1.c"], interactive: false },
  { id: "vierecke", gruppe: "Form und Raum", title: "Die Vierecke",
    ueben: [{ href: "../formenreich/?stufe=i", stufe: "i" },
      { href: "../formenreich/?stufe=j", stufe: "j" }],
    codes: ["MA.2.A.1.i", "MA.2.A.1.j"], interactive: false },
  { id: "kreis", gruppe: "Form und Raum", title: "Kreis und Geraden",
    ueben: [{ href: "../formenreich/?stufe=g", stufe: "g" },
      { href: "../formenreich/?stufe=l", stufe: "l" }],
    codes: ["MA.2.A.1.g", "MA.2.A.1.l"], interactive: false },
  { id: "koordinaten", gruppe: "Form und Raum", title: "Das Koordinatensystem",
    ueben: [{ href: "../formenreich/?stufe=h", stufe: "h" },
      { href: "../groessenwissen/?stufe=k-koordinaten", stufe: "k" },
      { href: "../spiegelraster/?stufe=j", stufe: "j" }],
    codes: ["MA.2.A.1.h", "MA.3.A.1.k", "MA.2.A.2.j"], interactive: false },
  { id: "symmetrie", gruppe: "Form und Raum", title: "Symmetrie und Muster",
    ueben: [{ href: "../spiegelraster/?stufe=a", stufe: "a" },
      { href: "../spiegelraster/?stufe=b", stufe: "b" },
      { href: "../spiegelraster/?stufe=c", stufe: "c" },
      { href: "../spiegelraster/?stufe=d", stufe: "d" },
      { href: "../spiegelraster/?stufe=e", stufe: "e" },
      { href: "../spiegelraster/?stufe=i", stufe: "i" }],
    codes: ["MA.2.A.2.a", "MA.2.A.2.b", "MA.2.A.2.c", "MA.2.A.2.d", "MA.2.A.2.e", "MA.2.A.2.i"], interactive: false },
  { id: "abbildungen", gruppe: "Form und Raum", title: "Drehen, Spiegeln, Verschieben",
    ueben: [{ href: "../spiegelraster/?stufe=f", stufe: "f" },
      { href: "../spiegelraster/?stufe=g", stufe: "g" },
      { href: "../spiegelraster/?stufe=h", stufe: "h" },
      { href: "../figurenmass/?stufe=k", stufe: "k" }],
    codes: ["MA.2.A.2.f", "MA.2.A.2.g", "MA.2.A.2.h", "MA.2.A.3.k"], interactive: false },
  { id: "umfang-flaeche", gruppe: "Form und Raum", title: "Umfang und Fläche",
    ueben: [{ href: "../figurenmass/?stufe=a", stufe: "a" },
      { href: "../figurenmass/?stufe=b", stufe: "b" },
      { href: "../figurenmass/?stufe=c", stufe: "c" },
      { href: "../figurenmass/?stufe=d", stufe: "d" },
      { href: "../figurenmass/?stufe=e", stufe: "e" },
      { href: "../figurenmass/?stufe=f", stufe: "f" }],
    codes: ["MA.2.A.3.a", "MA.2.A.3.b", "MA.2.A.3.c", "MA.2.A.3.d", "MA.2.A.3.e", "MA.2.A.3.f"], interactive: false },
  { id: "flaechenformeln", gruppe: "Form und Raum", title: "Flächen- und Volumenformeln",
    ueben: [{ href: "../figurenmass/?stufe=g", stufe: "g" },
      { href: "../figurenmass/?stufe=i", stufe: "i" },
      { href: "../figurenmass/?stufe=j-koerper", stufe: "j" }],
    codes: ["MA.2.A.3.g", "MA.2.A.3.i", "MA.2.A.3.j"], interactive: false },
  { id: "pythagoras", gruppe: "Form und Raum", title: "Der Satz des Pythagoras",
    ueben: [{ href: "../figurenmass/?stufe=h", stufe: "h" }],
    codes: ["MA.2.A.3.h"], interactive: false },
  { id: "winkel", gruppe: "Form und Raum", title: "Die Winkel",
    ueben: [{ href: "../figurenmass/?stufe=j-winkel", stufe: "j" }],
    codes: ["MA.2.A.3.j"], interactive: false },
  { id: "diagramme", gruppe: "Daten und Funktionen", title: "Diagramme und Mittelwert",
    ueben: [{ href: "../groessenwissen/?stufe=h-daten", stufe: "h" }],
    codes: ["MA.3.A.1.h"], interactive: false },
  { id: "wahrscheinlichkeit", gruppe: "Daten und Funktionen", title: "Sicher oder unmöglich",
    ueben: [{ href: "../groessenwissen/?stufe=g", stufe: "g" },
      { href: "../groessenwissen/?stufe=k-haeufigkeit", stufe: "k" }],
    codes: ["MA.3.A.1.g", "MA.3.A.1.k"], interactive: false },
  { id: "zahlenfolgen", gruppe: "Daten und Funktionen", title: "Zahlenfolgen",
    ueben: [{ href: "../wertepfad/?stufe=b", stufe: "b" },
      { href: "../wertepfad/?stufe=c", stufe: "c" }],
    codes: ["MA.3.A.3.b", "MA.3.A.3.c"], interactive: false },
  { id: "proportional", gruppe: "Daten und Funktionen", title: "Proportional rechnen",
    ueben: [{ href: "../wertepfad/?stufe=a", stufe: "a" },
      { href: "../wertepfad/?stufe=d", stufe: "d" },
      { href: "../wertepfad/?stufe=e", stufe: "e" },
      { href: "../wertepfad/?stufe=g", stufe: "g" }],
    codes: ["MA.3.A.3.a", "MA.3.A.3.d", "MA.3.A.3.e", "MA.3.A.3.g"], interactive: false },
  { id: "funktionen", gruppe: "Daten und Funktionen", title: "Funktionen und Graphen",
    ueben: [{ href: "../wertepfad/?stufe=h", stufe: "h" },
      { href: "../wertepfad/?stufe=i", stufe: "i" },
      { href: "../wertepfad/?stufe=j", stufe: "j" },
      { href: "../wertepfad/?stufe=k", stufe: "k" }],
    codes: ["MA.3.A.3.h", "MA.3.A.3.i", "MA.3.A.3.j", "MA.3.A.3.k"], interactive: false },
  { id: "abc-tabelle", gruppe: "Deutsch", title: "Die ABC-Tabelle",
    ueben: [{ href: "../buchstabenleiter/?stufe=a", stufe: "a" },
      { href: "../buchstabenleiter/?stufe=b-abc", stufe: "b" },
      { href: "../buchstabenleiter/?stufe=b-hoeren", stufe: "b" },
      { href: "../buchstabenleiter/?stufe=c-vokale", stufe: "c" },
      { href: "../buchstabenleiter/?stufe=c-gruppen", stufe: "c" },
      { href: "../buchstabenleiter/?stufe=d-nachschlagen", stufe: "d" },
      { href: "../buchstabenleiter/?stufe=g-nachschlagen", stufe: "g" }],
    codes: ["D.5.E.1.a", "D.5.E.1.b", "D.5.E.1.c", "D.5.E.1.d", "D.5.E.1.g"], interactive: false },
  { id: "satzzeichen", gruppe: "Deutsch", title: "Satzanfang und Satzzeichen",
    ueben: [{ href: "../schreibprobe/?stufe=a", stufe: "a" },
      { href: "../schreibprobe/?stufe=b", stufe: "b" },
      { href: "../schreibprobe/?stufe=c-kommas", stufe: "c" }],
    codes: ["D.4.F.1.a", "D.4.F.1.b", "D.4.F.1.c"], interactive: false },
  { id: "rechtschreib-regeln", gruppe: "Deutsch", title: "Die Rechtschreib-Regeln",
    ueben: [{ href: "../buchstabenleiter/?stufe=d-stammregel", stufe: "d" },
      { href: "../buchstabenleiter/?stufe=e", stufe: "e" },
      { href: "../buchstabenleiter/?stufe=f", stufe: "f" },
      { href: "../buchstabenleiter/?stufe=g-gross", stufe: "g" },
      { href: "../schreibprobe/?stufe=c-schreibung", stufe: "c" },
      { href: "../schreibprobe/?stufe=d", stufe: "d" },
      { href: "../schreibprobe/?stufe=e", stufe: "e" },
      { href: "../schreibprobe/?stufe=f", stufe: "f" },
      { href: "../schreibprobe/?stufe=g", stufe: "g" }],
    codes: ["D.5.E.1.d", "D.5.E.1.e", "D.5.E.1.f", "D.5.E.1.g", "D.4.F.1.c", "D.4.F.1.d", "D.4.F.1.e", "D.4.F.1.f", "D.4.F.1.g"], interactive: false },
  { id: "wortarten", gruppe: "Deutsch", title: "Die Wortarten",
    ueben: [{ href: "../wortbau/?stufe=a", stufe: "a" },
      { href: "../wortbau/?stufe=d", stufe: "d" },
      { href: "../wortbau/?stufe=f", stufe: "f" }],
    codes: ["D.5.D.1.a", "D.5.D.1.d", "D.5.D.1.f"], interactive: false },
  { id: "zeitformen", gruppe: "Deutsch", title: "Die Zeitformen",
    ueben: [{ href: "../wortbau/?stufe=b", stufe: "b" },
      { href: "../wortbau/?stufe=c", stufe: "c" },
      { href: "../wortbau/?stufe=g", stufe: "g" }],
    codes: ["D.5.D.1.b", "D.5.D.1.c", "D.5.D.1.g"], interactive: false },
  { id: "satzglieder", gruppe: "Deutsch", title: "Satzglieder und Fälle",
    ueben: [{ href: "../wortbau/?stufe=e", stufe: "e" }],
    codes: ["D.5.D.1.e"], interactive: false },
  { id: "franzoesisch-woerter", gruppe: "Französisch", title: "Französisch: die ersten Wörter",
    ueben: [{ href: "../motschatz/?stufe=a", stufe: "a" },
      { href: "../motschatz/?stufe=b", stufe: "b" },
      { href: "../motschatz/?stufe=c", stufe: "c" },
      { href: "../motschatz/?stufe=d", stufe: "d" }],
    codes: ["FS1F.5.B.1.a", "FS1F.5.B.1.b", "FS1F.5.B.1.c", "FS1F.5.B.1.d"], interactive: false },
  { id: "franzoesisch-saetze", gruppe: "Französisch", title: "Französisch: Sätze bauen",
    ueben: [{ href: "../motbau/?stufe=a", stufe: "a" },
      { href: "../motbau/?stufe=b", stufe: "b" },
      { href: "../motbau/?stufe=d", stufe: "d" }],
    codes: ["FS1F.5.D.1.a", "FS1F.5.D.1.b", "FS1F.5.D.1.d"], interactive: false },
  { id: "franzoesisch-schreiben", gruppe: "Französisch", title: "Französisch: richtig schreiben",
    ueben: [{ href: "../ortho/?stufe=a", stufe: "a" },
      { href: "../ortho/?stufe=b", stufe: "b" },
      { href: "../ortho/?stufe=c", stufe: "c" },
      { href: "../ortho/?stufe=d", stufe: "d" }],
    codes: ["FS1F.5.E.1.a", "FS1F.5.E.1.b", "FS1F.5.E.1.c", "FS1F.5.E.1.d"], interactive: false },
  { id: "englisch-woerter", gruppe: "Englisch", title: "Englisch: die ersten Wörter",
    ueben: [{ href: "../wordschatz/?stufe=a", stufe: "a" },
      { href: "../wordschatz/?stufe=b", stufe: "b" },
      { href: "../wordschatz/?stufe=c", stufe: "c" },
      { href: "../wordschatz/?stufe=d", stufe: "d" }],
    codes: ["FS2E.5.B.1.a", "FS2E.5.B.1.b", "FS2E.5.B.1.c", "FS2E.5.B.1.d"], interactive: false },
  { id: "englisch-saetze", gruppe: "Englisch", title: "Englisch: Sätze bauen",
    ueben: [{ href: "../wordbau/?stufe=a", stufe: "a" },
      { href: "../wordbau/?stufe=c", stufe: "c" },
      { href: "../wordbau/?stufe=d", stufe: "d" }],
    codes: ["FS2E.5.D.1.a", "FS2E.5.D.1.c", "FS2E.5.D.1.d"], interactive: false },
  { id: "verben-fr", gruppe: "Französisch", title: "Französische Verben: être und avoir",
    ueben: [{ href: "../motbau/?stufe=c", stufe: "c" }],
    codes: ["FS1F.5.D.1.c"], interactive: false },
  { id: "verben-en", gruppe: "Englisch", title: "Englische Verben: to be und to have",
    ueben: [{ href: "../wordbau/?stufe=b", stufe: "b" }],
    codes: ["FS2E.5.D.1.b"], interactive: false },
  { id: "englisch-schreiben", gruppe: "Englisch", title: "Englisch: richtig schreiben",
    ueben: [{ href: "../spellwerk/?stufe=a", stufe: "a" },
      { href: "../spellwerk/?stufe=b", stufe: "b" },
      { href: "../spellwerk/?stufe=c", stufe: "c" },
      { href: "../spellwerk/?stufe=d", stufe: "d" }],
    codes: ["FS2E.5.E.1.a", "FS2E.5.E.1.b", "FS2E.5.E.1.c", "FS2E.5.E.1.d"], interactive: false },
  { id: "skelett", gruppe: "Mensch und Körper", title: "Das Skelett",
    ueben: [{ href: "../koerperatlas/?stufe=a", stufe: "a" },
      { href: "../koerperatlas/?stufe=b", stufe: "b" }],
    codes: ["NMG.1.4.a", "NMG.1.4.b"], interactive: false },
  { id: "blutkreislauf", gruppe: "Mensch und Körper", title: "Der Blutkreislauf",
    ueben: [{ href: "../koerperatlas/?stufe=e", stufe: "e" }],
    codes: ["NMG.1.4.e"], interactive: false },
  { id: "organe", gruppe: "Mensch und Körper", title: "Die Organe",
    ueben: [{ href: "../koerperatlas/?stufe=c", stufe: "c" }],
    codes: ["NMG.1.4.c"], interactive: false },
  { id: "sinne", gruppe: "Mensch und Körper", title: "Die fünf Sinne",
    ueben: [{ href: "../koerperatlas/?stufe=d", stufe: "d" }],
    codes: ["NMG.1.4.d"], interactive: false },
  { id: "gesund-bleiben", gruppe: "Mensch und Körper", title: "Gesund bleiben",
    ueben: [{ href: "../koerperatlas/?stufe=f", stufe: "f" }],
    codes: ["NMG.1.4.f"], interactive: false },
  { id: "tiergruppen", gruppe: "Tiere und Pflanzen", title: "Die Tiergruppen",
    ueben: [{ href: "../artenreich/?stufe=a", stufe: "a" },
      { href: "../artenreich/?stufe=c", stufe: "c" }],
    codes: ["NMG.2.4.a", "NMG.2.4.c"], interactive: false },
  { id: "baeume", gruppe: "Tiere und Pflanzen", title: "Unsere Bäume",
    ueben: [{ href: "../artenreich/?stufe=b", stufe: "b" }],
    codes: ["NMG.2.4.b"], interactive: false },
  { id: "lebensraeume", gruppe: "Tiere und Pflanzen", title: "Lebensräume",
    ueben: [{ href: "../artenreich/?stufe=d", stufe: "d" }],
    codes: ["NMG.2.4.d"], interactive: false },
  { id: "bestimmen", gruppe: "Tiere und Pflanzen", title: "Bestimmen Schritt für Schritt",
    ueben: [{ href: "../artenreich/?stufe=e", stufe: "e" },
      { href: "../artenreich/?stufe=f", stufe: "f" }],
    codes: ["NMG.2.4.e", "NMG.2.4.f"], interactive: false },
  { id: "wasserkreislauf", gruppe: "Wetter und Natur", title: "Der Wasserkreislauf",
    ueben: [{ href: "../wetterwarte/?stufe=1g", stufe: "1g" }],
    codes: ["NMG.4.4.1g"], interactive: false },
  { id: "wetter-messen", gruppe: "Wetter und Natur", title: "Wetter beobachten und messen",
    ueben: [{ href: "../wetterwarte/?stufe=1a", stufe: "1a" },
      { href: "../wetterwarte/?stufe=1c", stufe: "1c" },
      { href: "../wetterwarte/?stufe=1e", stufe: "1e" }],
    codes: ["NMG.4.4.1a", "NMG.4.4.1c", "NMG.4.4.1e"], interactive: false },
  { id: "wetterbericht", gruppe: "Wetter und Natur", title: "Der Wetterbericht",
    ueben: [{ href: "../wetterwarte/?stufe=1b", stufe: "1b" },
      { href: "../wetterwarte/?stufe=1d", stufe: "1d" },
      { href: "../wetterwarte/?stufe=1f", stufe: "1f" }],
    codes: ["NMG.4.4.1b", "NMG.4.4.1d", "NMG.4.4.1f"], interactive: false },
  { id: "naturgefahren", gruppe: "Wetter und Natur", title: "Naturgefahren",
    ueben: [{ href: "../wetterwarte/?stufe=2a", stufe: "2a" },
      { href: "../wetterwarte/?stufe=2b", stufe: "2b" },
      { href: "../wetterwarte/?stufe=2c", stufe: "2c" },
      { href: "../wetterwarte/?stufe=2d", stufe: "2d" },
      { href: "../wetterwarte/?stufe=2e", stufe: "2e" }],
    codes: ["NMG.4.4.2a", "NMG.4.4.2b", "NMG.4.4.2c", "NMG.4.4.2d", "NMG.4.4.2e"], interactive: false },
  { id: "schaltungen", gruppe: "Natur und Technik", title: "Serie- und Parallelschaltung",
    ueben: [{ href: "../stromkreis/?stufe=b", stufe: "b" },
      { href: "../stromkreis/?stufe=d", stufe: "d" }],
    codes: ["NT.5.2.b", "NT.5.2.d"], interactive: true },
  { id: "ohmsches-gesetz", gruppe: "Natur und Technik", title: "Das Ohmsche Gesetz",
    ueben: [{ href: "../stromkreis/?stufe=c", stufe: "c" }],
    codes: ["NT.5.2.c"], interactive: false },
  { id: "strom-wirkungen", gruppe: "Natur und Technik", title: "Wirkungen des Stroms",
    ueben: [{ href: "../stromkreis/?stufe=a", stufe: "a" },
      { href: "../stromkreis/?stufe=e", stufe: "e" }],
    codes: ["NT.5.2.a", "NT.5.2.e"], interactive: false },
  { id: "speichereinheiten", gruppe: "Informatik", title: "Speichereinheiten",
    ueben: [{ href: "../rechnerraum/?stufe=f", stufe: "f" }],
    codes: ["MI.2.3.f"], interactive: false },
  { id: "daten-ordnen", gruppe: "Informatik", title: "Daten ordnen",
    ueben: [{ href: "../bitkiste/?stufe=a", stufe: "a" },
      { href: "../bitkiste/?stufe=b", stufe: "b" },
      { href: "../bitkiste/?stufe=f", stufe: "f" },
      { href: "../bitkiste/?stufe=h", stufe: "h" }],
    codes: ["MI.2.1.a", "MI.2.1.b", "MI.2.1.f", "MI.2.1.h"], interactive: false },
  { id: "codes", gruppe: "Informatik", title: "Codes und Geheimschriften",
    ueben: [{ href: "../bitkiste/?stufe=c", stufe: "c" },
      { href: "../bitkiste/?stufe=g", stufe: "g" }],
    codes: ["MI.2.1.c", "MI.2.1.g"], interactive: false },
  { id: "dateien", gruppe: "Informatik", title: "Dateien: Text, Bild, Ton",
    ueben: [{ href: "../bitkiste/?stufe=d", stufe: "d" },
      { href: "../bitkiste/?stufe=e", stufe: "e" }],
    codes: ["MI.2.1.d", "MI.2.1.e"], interactive: false },
  { id: "suchen", gruppe: "Informatik", title: "Suchen mit und, oder, nicht",
    ueben: [{ href: "../bitkiste/?stufe=i", stufe: "i" },
      { href: "../bitkiste/?stufe=j", stufe: "j" },
      { href: "../rechnerraum/?stufe=i", stufe: "i" }],
    codes: ["MI.2.1.i", "MI.2.1.j", "MI.2.3.i"], interactive: false },
  { id: "programm-bausteine", gruppe: "Informatik", title: "Die Programm-Bausteine",
    ueben: [{ href: "../schrittweise/?stufe=c", stufe: "c" },
      { href: "../schrittweise/?stufe=d", stufe: "d" },
      { href: "../schrittweise/?stufe=e", stufe: "e" },
      { href: "../schrittweise/?stufe=f", stufe: "f" },
      { href: "../schrittweise/?stufe=g", stufe: "g" },
      { href: "../schrittweise/?stufe=h", stufe: "h" }],
    codes: ["MI.2.2.c", "MI.2.2.d", "MI.2.2.e", "MI.2.2.f", "MI.2.2.g", "MI.2.2.h"], interactive: false },
  { id: "algorithmen", gruppe: "Informatik", title: "Schritt für Schritt",
    ueben: [{ href: "../schrittweise/?stufe=a", stufe: "a" },
      { href: "../schrittweise/?stufe=b", stufe: "b" },
      { href: "../schrittweise/?stufe=i", stufe: "i" }],
    codes: ["MI.2.2.a", "MI.2.2.b", "MI.2.2.i"], interactive: false },
  { id: "daten-sichern", gruppe: "Informatik", title: "Daten schützen und sichern",
    ueben: [{ href: "../bitkiste/?stufe=k", stufe: "k" },
      { href: "../rechnerraum/?stufe=b", stufe: "b" },
      { href: "../rechnerraum/?stufe=h", stufe: "h" },
      { href: "../rechnerraum/?stufe=j", stufe: "j" }],
    codes: ["MI.2.1.k", "MI.2.3.b", "MI.2.3.h", "MI.2.3.j"], interactive: false },
  { id: "computer-teile", gruppe: "Informatik", title: "Die Teile des Computers",
    ueben: [{ href: "../rechnerraum/?stufe=e", stufe: "e" },
      { href: "../rechnerraum/?stufe=k", stufe: "k" },
      { href: "../rechnerraum/?stufe=l", stufe: "l" }],
    codes: ["MI.2.3.e", "MI.2.3.k", "MI.2.3.l"], interactive: false },
  { id: "computer-bedienen", gruppe: "Informatik", title: "Den Computer bedienen",
    ueben: [{ href: "../rechnerraum/?stufe=a", stufe: "a" },
      { href: "../rechnerraum/?stufe=c", stufe: "c" },
      { href: "../rechnerraum/?stufe=d", stufe: "d" },
      { href: "../rechnerraum/?stufe=g", stufe: "g" }],
    codes: ["MI.2.3.a", "MI.2.3.c", "MI.2.3.d", "MI.2.3.g"], interactive: false },
  { id: "tag-und-nacht", gruppe: "Himmel und Weltall", title: "Tag und Nacht",
    ueben: [{ href: "../sternwarte/?stufe=a", stufe: "a" },
      { href: "../sternwarte/?stufe=b", stufe: "b" },
      { href: "../sternwarte/?stufe=c", stufe: "c" }],
    codes: ["NMG.4.5.a", "NMG.4.5.b", "NMG.4.5.c"], interactive: false },
  { id: "mondphasen", gruppe: "Himmel und Weltall", title: "Die Mondphasen",
    ueben: [{ href: "../sternwarte/?stufe=d", stufe: "d" }],
    codes: ["NMG.4.5.d"], interactive: false },
  { id: "sonnensystem", gruppe: "Himmel und Weltall", title: "Das Sonnensystem",
    ueben: [{ href: "../sternwarte/?stufe=e", stufe: "e" },
      { href: "../sternwarte/?stufe=f", stufe: "f" }],
    codes: ["NMG.4.5.e", "NMG.4.5.f"], interactive: true },
  { id: "kalender", gruppe: "Zeit und Geschichte", title: "Der Kalender",
    ueben: [{ href: "../zeitreise/?stufe=a", stufe: "a" },
      { href: "../zeitreise/?stufe=b", stufe: "b" },
      { href: "../zeitreise/?stufe=c", stufe: "c" },
      { href: "../zeitreise/?stufe=d", stufe: "d" }],
    codes: ["NMG.9.1.a", "NMG.9.1.b", "NMG.9.1.c", "NMG.9.1.d"], interactive: false },
  { id: "zeitstrahl", gruppe: "Zeit und Geschichte", title: "Zeitstrahl und Epochen",
    ueben: [{ href: "../zeitreise/?stufe=e", stufe: "e" },
      { href: "../zeitreise/?stufe=f", stufe: "f" },
      { href: "../zeitreise/?stufe=g", stufe: "g" },
      { href: "../zeitreise/?stufe=h", stufe: "h" }],
    codes: ["NMG.9.1.e", "NMG.9.1.f", "NMG.9.1.g", "NMG.9.1.h"], interactive: false },
  { id: "gradnetz", gruppe: "Raum und Erde", title: "Das Gradnetz der Erde",
    ueben: [{ href: "../weltatlas/?stufe=c", stufe: "c" }],
    codes: ["RZG.4.1.c"], interactive: true },
  { id: "himmelsrichtungen", gruppe: "Raum und Erde", title: "Die Himmelsrichtungen",
    ueben: [{ href: "../nordpfeil/?stufe=h-richtungen", stufe: "h" },
      { href: "../nordpfeil/?stufe=i", stufe: "i" }],
    codes: ["NMG.8.5.h", "NMG.8.5.i"], interactive: false },
  { id: "massstab", gruppe: "Raum und Erde", title: "Der Massstab",
    ueben: [{ href: "../nordpfeil/?stufe=e-massstab", stufe: "e" },
      { href: "../nordpfeil/?stufe=f", stufe: "f" }],
    codes: ["NMG.8.5.e", "NMG.8.5.f"], interactive: false },
  { id: "hoehenkurven", gruppe: "Raum und Erde", title: "Höhenkurven",
    ueben: [{ href: "../nordpfeil/?stufe=h-karte", stufe: "h" }],
    codes: ["NMG.8.5.h"], interactive: false },
  { id: "kartenzeichen", gruppe: "Raum und Erde", title: "Kartenzeichen und Pläne",
    ueben: [{ href: "../nordpfeil/?stufe=c", stufe: "c" },
      { href: "../nordpfeil/?stufe=d", stufe: "d" },
      { href: "../nordpfeil/?stufe=e-signaturen", stufe: "e" }],
    codes: ["NMG.8.5.c", "NMG.8.5.d", "NMG.8.5.e"], interactive: false },
  { id: "unterwegs", gruppe: "Raum und Erde", title: "Sicher unterwegs",
    ueben: [{ href: "../nordpfeil/?stufe=a", stufe: "a" },
      { href: "../nordpfeil/?stufe=b", stufe: "b" },
      { href: "../nordpfeil/?stufe=g", stufe: "g" }],
    codes: ["NMG.8.5.a", "NMG.8.5.b", "NMG.8.5.g"], interactive: false },
  { id: "kontinente", gruppe: "Raum und Erde", title: "Kontinente und Ozeane",
    ueben: [{ href: "../weltatlas/?stufe=a", stufe: "a" },
      { href: "../weltatlas/?stufe=b", stufe: "b" }],
    codes: ["RZG.4.1.a", "RZG.4.1.b"], interactive: false },
  { id: "gewaltenteilung", gruppe: "Zusammenleben", title: "Die Gewaltenteilung",
    ueben: [{ href: "../demokratielabor/?stufe=b", stufe: "b" }],
    codes: ["RZG.8.1.b"], interactive: false },
  { id: "abstimmen", gruppe: "Zusammenleben", title: "Abstimmen und Wählen",
    ueben: [{ href: "../demokratielabor/?stufe=a", stufe: "a" },
      { href: "../demokratielabor/?stufe=c", stufe: "c" }],
    codes: ["RZG.8.1.a", "RZG.8.1.c"], interactive: false },
  { id: "meinung", gruppe: "Zusammenleben", title: "Eine Meinung begründen",
    ueben: [{ href: "../demokratielabor/?stufe=d", stufe: "d" }],
    codes: ["RZG.8.1.d"], interactive: false },
];
const GRUPPEN = ["Zahlen und Rechnen", "Grössen und Masse", "Form und Raum", "Daten und Funktionen", "Deutsch", "Französisch", "Englisch", "Mensch und Körper", "Tiere und Pflanzen", "Wetter und Natur", "Natur und Technik", "Informatik", "Himmel und Weltall", "Zeit und Geschichte", "Raum und Erde", "Zusammenleben"];

const CHROMIUM = process.env.CHROMIUM_PATH
  || (existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined);

let failures = 0;
function check(name, condition, detail = "") {
  const ok = Boolean(condition);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok || !detail ? "" : ` — ${detail}`}`);
  if (!ok) failures++;
}

/* ── Static checks on the source files ────────────────────────────── */
{
  // Cache-busting: every local asset ref in every HTML page and JS
  // module carries the same ?v=N.
  const sources = [
    ["styles.css", readFileSync(join(APP_DIR, "styles.css"), "utf8")],
    ...readdirSync(APP_DIR).filter((f) => f.endsWith(".html") || f.endsWith(".js"))
      .map((f) => [f, readFileSync(join(APP_DIR, f), "utf8")]),
  ];
  const versions = new Set();
  const unversioned = [];
  for (const [file, text] of sources) {
    const refs = [
      ...text.matchAll(/(?:href="[^"]+?|src="[^"]+?|from '\.\/[^']+?|url\('fonts\/[^']+?)(\?v=(\d+))?["')]/g),
    ];
    for (const m of refs) {
      const whole = m[0];
      if (whole.includes("http") || whole.includes('"#') || whole.includes("${")
        || whole.includes("../") || /href="[a-z-]+\.html"/.test(whole)) continue;
      if (m[2]) versions.add(m[2]);
      else unversioned.push(`${file}: ${whole}`);
    }
  }
  check("cache-busting: every local asset ref carries ?v=", unversioned.length === 0, unversioned.join("; "));
  check("cache-busting: one single version everywhere", versions.size === 1, [...versions].join(","));

  // One file per Merkblatt, practice targets exist, no ß anywhere.
  const issues = [];
  for (const b of BLAETTER) {
    const file = join(APP_DIR, `${b.id}.html`);
    if (!existsSync(file)) { issues.push(`${b.id}.html missing`); continue; }
    const text = readFileSync(file, "utf8");
    if (text.includes("ß")) issues.push(`${b.id}: ß found`);
    for (const c of b.codes) if (!text.includes(c)) issues.push(`${b.id}: code ${c} missing`);
    for (const u of b.ueben) {
      if (!text.includes(`href="${u.href}"`)) issues.push(`${b.id}: ueben link ${u.href} missing`);
      if (!existsSync(join(ROOT_DIR, u.href.split("?")[0].replace("../", ""), "index.html")))
        issues.push(`${b.id}: ueben target missing ${u.href}`);
    }
  }
  check("pages: one file per Merkblatt, codes, valid Dazu-üben targets", issues.length === 0, issues.join("; "));

  // Print styles exist so every Merkblatt is printable as A4.
  const css = readFileSync(join(APP_DIR, "styles.css"), "utf8");
  check("print: @media print with light background and hidden chrome",
    /@media print/.test(css) && /\.illu-controls[^{}]*\{\s*display:\s*none/s.test(css.replace(/\n/g, " ")));
}

/* ── Static server ────────────────────────────────────────────────── */
const MIME = {
  ".html": "text/html", ".css": "text/css", ".js": "text/javascript",
  ".svg": "image/svg+xml", ".woff2": "font/woff2",
};
const server = createServer(async (req, res) => {
  const path = req.url.split("?")[0].replace(/^\//, "") || "index.html";
  try {
    const data = await readFile(join(ROOT_DIR, path));
    res.writeHead(200, { "Content-Type": MIME[extname(path)] || "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404); res.end("not found");
  }
});
await new Promise((r) => server.listen(PORT, r));
mkdirSync(SHOTS_DIR, { recursive: true });

const browser = await chromium.launch(CHROMIUM ? { executablePath: CHROMIUM } : {});
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

const consoleErrors = [];
page.on("console", (msg) => { if (msg.type() === "error") consoleErrors.push(msg.text()); });
page.on("pageerror", (err) => consoleErrors.push(String(err)));
const externalRequests = [];
page.on("request", (req) => { if (!req.url().startsWith(`http://localhost:${PORT}`)) externalRequests.push(req.url()); });

/* ── Index ────────────────────────────────────────────────────────── */
await page.goto(`${BASE}/index.html`);
await page.waitForSelector(".blatt-list");
check("index: title renders", (await page.textContent("h1")).includes("Merkheft"));
check("index: all pages listed in groups",
  await page.locator(".blatt").count() === BLAETTER.length
  && await page.locator(".gruppe").count() === GRUPPEN.length);
for (const b of BLAETTER) {
  check(`index: links ${b.id}.html`,
    await page.locator(`.blatt[href="${b.id}.html"]`).count() === 1);
}
await page.screenshot({ path: join(SHOTS_DIR, "01-home.png"), fullPage: true });

/* ── Every Merkblatt page ─────────────────────────────────────────── */
for (const b of BLAETTER) {
  await page.goto(`${BASE}/${b.id}.html`);
  await page.waitForSelector(".blatt-page");
  check(`page ${b.id}: title, group and visual render`,
    (await page.textContent("h1")).trim() === b.title
    && (await page.textContent(".blatt-gruppe")).trim() === b.gruppe
    && (await page.locator(".illu-stage svg, .illu-stage .orbits").count()) >= 1
    && (await page.title()).includes("Merkheft"));
  check(`page ${b.id}: Dazu-üben links present with icon and underlined name`,
    await page.locator(".ueben-link").count() === b.ueben.length
    && await page.locator(".ueben-link .ueben-icon").count() === b.ueben.length
    && await page.locator(".ueben-link .ueben-text").count() === b.ueben.length);
  check(`page ${b.id}: back link to index`,
    await page.locator('.back[href="index.html"]').count() === 1);
}

/* ── Interactivity: circuit ───────────────────────────────────────── */
await page.goto(`${BASE}/schaltungen.html`);
await page.waitForSelector("#illu-circuit");
const stat = async () => (await page.textContent("#illu-circuit-status")).trim();
check("circuit: open at start", (await stat()).includes("offen"));
await page.click("#illu-sw");
check("circuit: series both lit", (await stat()).includes("nacheinander"));
await page.check("#illu-broken");
check("circuit: series broken goes dark", (await stat()).includes("unterbricht"));
await page.click("#illu-mode");
check("circuit: parallel survives broken lamp", (await stat()).includes("leuchtet weiter"));
await page.screenshot({ path: join(SHOTS_DIR, "02-schaltungen.png"), fullPage: true });

/* ── Interactivity: globe and orbits ──────────────────────────────── */
await page.goto(`${BASE}/gradnetz.html`);
await page.waitForSelector("#illu-globe ellipse");
const rxBefore = await page.getAttribute("#illu-meridians ellipse", "rx");
await page.fill("#illu-spin", "90");
const rxAfter = await page.getAttribute("#illu-meridians ellipse", "rx");
check("globe: slider rotates meridians", rxBefore !== rxAfter);
await page.screenshot({ path: join(SHOTS_DIR, "03-gradnetz.png"), fullPage: true });

await page.goto(`${BASE}/sonnensystem.html`);
await page.waitForSelector("#illu-orbits");
check("orbits: paused by default", !(await page.locator("#illu-orbits.running").count()));
await page.click("#illu-orbit-play");
check("orbits: running after click", (await page.locator("#illu-orbits.running").count()) === 1);

/* ── Infographic: Masseinheiten ───────────────────────────────────── */
await page.goto(`${BASE}/masseinheiten.html`);
await page.waitForSelector("#ig-masseinheiten");
check("infographic: four unit ladders with 20 boxes and 16 factors",
  (await page.locator("#ig-masseinheiten .ig-box").count()) === 20
  && (await page.locator("#ig-masseinheiten .ig-factor").count()) === 16);
const igFactors = await page.locator("#ig-masseinheiten .ig-lane .ig-factor").allTextContents();
check("infographic: canonical conversion factors",
  JSON.stringify(igFactors) === JSON.stringify([
    "×1000", "×10", "×10", "×10",          // km m dm cm mm
    "×1000", "×1000", "×1000",             // t kg g mg
    "×100", "×10", "×10", "×10",           // hl l dl cl ml
    "×24", "×60", "×60",                   // Tag h min s
  ]), igFactors.join(" "));
await page.emulateMedia({ media: "print" });
const igPrint = await page.evaluate(() => ({
  box: getComputedStyle(document.querySelector(".ig-box")).fill,
  title: getComputedStyle(document.querySelector(".ig-title")).fill,
}));
check("infographic: print restyles boxes and text light",
  igPrint.box === "rgb(247, 244, 230)" && igPrint.title === "rgb(26, 34, 48)",
  JSON.stringify(igPrint));
await page.screenshot({ path: join(SHOTS_DIR, "06-print-masseinheiten.png"), fullPage: true });
await page.emulateMedia({ media: "screen" });
await page.screenshot({ path: join(SHOTS_DIR, "06-masseinheiten.png"), fullPage: true });

/* ── Infographics: Zyklus-1 pages ─────────────────────────────────── */
await page.goto(`${BASE}/uhr.html`);
await page.waitForSelector("#ig-uhr");
check("uhr: two clocks with hour and minute hands",
  (await page.locator("#ig-uhr .ig-hand-h").count()) === 2
  && (await page.locator("#ig-uhr .ig-hand-m").count()) === 2
  && (await page.locator("#ig-uhr .ig-tick").count()) === 24);
await page.goto(`${BASE}/geld.html`);
await page.waitForSelector("#ig-geld");
check("geld: seven coins and six notes",
  (await page.locator("#ig-geld .ig-coin").count()) === 7
  && (await page.locator("#ig-geld .ig-box").count()) === 6);
await page.goto(`${BASE}/laengen.html`);
await page.waitForSelector("#ig-laengen");
check("laengen: ruler with major and minor ticks",
  (await page.locator("#ig-laengen .ig-tick").count()) === 21);

/* ── Back navigation ──────────────────────────────────────────────── */
await page.click(".back");
await page.waitForSelector(".blatt-list");
check("nav: back returns to the list", (await page.locator(".blatt").count()) === BLAETTER.length);

/* ── Print rendering ──────────────────────────────────────────────── */
await page.goto(`${BASE}/wasserkreislauf.html`);
await page.waitForSelector(".blatt-page");
await page.emulateMedia({ media: "print" });
const printState = await page.evaluate(() => ({
  bodyBg: getComputedStyle(document.body).backgroundColor,
  navHidden: getComputedStyle(document.querySelector(".page-nav")).display === "none",
  faktenBreak: getComputedStyle(document.querySelector(".fakten div")).breakInside,
  labelBreak: getComputedStyle(document.querySelector(".section-label")).breakAfter,
}));
check("print: white background, chrome hidden",
  printState.bodyBg === "rgb(255, 255, 255)" && printState.navHidden,
  JSON.stringify(printState));
check("print: sections keep together across page breaks",
  printState.faktenBreak === "avoid" && printState.labelBreak === "avoid",
  JSON.stringify(printState));
await page.screenshot({ path: join(SHOTS_DIR, "04-print-wasserkreislauf.png"), fullPage: true });
await page.emulateMedia({ media: "screen" });

/* ── Layout, console, network ─────────────────────────────────────── */
await page.setViewportSize({ width: 320, height: 700 });
await page.goto(`${BASE}/gradnetz.html`);
await page.waitForSelector(".blatt-page");
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
check("layout: no horizontal scrolling at 320px", overflow <= 0, `overflow ${overflow}px`);
check("console: no errors", consoleErrors.length === 0, consoleErrors.join(" | "));
check("network: no external requests", externalRequests.length === 0, externalRequests.join(", "));

await browser.close();
server.close();
console.log(failures ? `\n${failures} check(s) failed.` : "\nAll tests passed.");
process.exit(failures ? 1 : 0);
