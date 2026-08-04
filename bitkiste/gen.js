// gen.js — Aufgaben für Bitkiste. Reine Funktionen ohne DOM. Die
// meisten Stufen sind feste Aufgaben-Pools; Geheimschrift, Prüfbit
// und Logik werden generiert und von der e2e-Suite unabhängig
// nachgerechnet (eigene Caesar-Entschlüsselung, eigene Paritäts- und
// Logik-Auswertung). Jede Aufgabe:
//   { type: 'typed', expr, answer }               getippte Antwort
//   { type: 'mc', expr, options, answer }         Auswahl (Index)

export function formatNumber(n) {
  return String(n);
}

function randInt(rng, min, max) {
  return min + Math.floor(rng() * (max - min + 1));
}

function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}

function shuffled(rng, arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Wörter für die Geheimschrift (nur A-Z, ohne Umlaute).
export const SECRET_WORDS = ['HALLO', 'BUCH', 'KATZE', 'BLUME', 'SPIEL', 'MOND', 'STERN', 'WALD', 'HAUS', 'BROT'];

const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function caesarEncode(word, shift) {
  return word.split('').map((ch) => ALPHA[(ALPHA.indexOf(ch) + shift) % 26]).join('');
}

// Pool-Einträge: [kind, 'mc', expr, richtig, [falsch...]] oder
// [kind, 'typed', expr, antwort].
export const POOLS = {
  a: [
    ['ordnen', 'mc', 'Du willst den roten Stift schnell finden. Wonach ordnest du die Stifte?', 'nach der Farbe', ['nach dem Alter', 'gar nicht']],
    ['ordnen', 'mc', 'Du suchst das grösste Buch. Wonach ordnest du die Bücher?', 'nach der Grösse', ['nach der Farbe', 'nach dem Geruch']],
    ['ordnen', 'mc', 'Alle runden Knöpfe liegen zusammen. Wonach ist geordnet?', 'nach der Form', ['nach dem Preis', 'nach dem Alter']],
    ['ordnen', 'mc', 'Die Bauklötze sind in Rot, Blau und Gelb sortiert. Wonach ist geordnet?', 'nach der Farbe', ['nach der Grösse', 'nach der Form']],
    ['ordnen', 'mc', 'Du willst deine Socken paarweise schneller finden. Was hilft?', 'gleiche Socken zusammenlegen', ['alle in einen Sack werfen', 'die Socken verstecken']],
    ['ordnen', 'mc', 'Die Bibliothek ordnet Bücher nach dem ABC. Was findest du so schneller?', 'ein Buch mit bekanntem Titel', ['das schwerste Buch', 'das älteste Buch']],
    ['ordnen', 'mc', 'Warum ordnet man Dinge?', 'um sie schneller zu finden', ['damit es mehr wird', 'weil es Pflicht ist']],
    ['ordnen', 'mc', 'Du sortierst Muscheln nach klein und gross. Wonach ordnest du?', 'nach der Grösse', ['nach dem Fundort', 'nach dem Gewicht']],
  ],
  b: [
    ['darstellung', 'mc', 'Der Stundenplan hat Zeilen und Spalten. Welche Darstellung ist das?', 'eine Tabelle', ['ein Symbol', 'eine Tonaufnahme']],
    ['darstellung', 'mc', 'Ein Herz bedeutet «Das mag ich». Was ist das Herz?', 'ein Symbol', ['eine Tabelle', 'ein Diagramm']],
    ['darstellung', 'mc', 'Balken zeigen, wie viele Kinder welches Hobby haben. Was ist das?', 'ein Diagramm', ['ein Symbol', 'eine Geheimschrift']],
    ['darstellung', 'mc', 'Das WC-Schild am Bahnhof ist ...?', 'ein Symbol', ['eine Tabelle', 'ein Diagramm']],
    ['darstellung', 'mc', 'Die Klassenliste mit Name und Geburtstag ist ...?', 'eine Tabelle', ['ein Symbol', 'ein Lied']],
    ['darstellung', 'mc', 'Wofür eignet sich ein Diagramm besonders gut?', 'Anzahlen vergleichen', ['Musik hören', 'Geschichten erzählen']],
    ['darstellung', 'mc', 'Ein Piktogramm auf dem Wanderweg zeigt einen Wanderer. Was ist das?', 'ein Symbol', ['eine Tabelle', 'ein Foto-Album']],
    ['darstellung', 'mc', 'Du zählst Vögel und schreibst pro Art einen Strich. Was machst du?', 'Daten sammeln', ['Daten löschen', 'Musik machen']],
  ],
  d: [
    ['dateityp', 'mc', 'Die Endung .jpg gehört zu welcher Datenart?', 'Bild', ['Ton', 'Text']],
    ['dateityp', 'mc', 'Die Endung .png gehört zu welcher Datenart?', 'Bild', ['Ton', 'Zahl']],
    ['dateityp', 'mc', 'Die Endung .mp3 gehört zu welcher Datenart?', 'Ton', ['Bild', 'Text']],
    ['dateityp', 'mc', 'Die Endung .wav gehört zu welcher Datenart?', 'Ton', ['Text', 'Bild']],
    ['dateityp', 'mc', 'Die Endung .txt gehört zu welcher Datenart?', 'Text', ['Bild', 'Ton']],
    ['dateityp', 'mc', 'Eine Tabellendatei (.xlsx) speichert vor allem ...?', 'Zahlen', ['Töne', 'Filme']],
    ['dateityp', 'mc', 'Ein Foto auf dem Handy ist gespeichert als ...?', 'Bilddatei', ['Tondatei', 'Textdatei']],
    ['dateityp', 'mc', 'Eine Sprachnachricht ist gespeichert als ...?', 'Tondatei', ['Bilddatei', 'Textdatei']],
  ],
  e: [
    ['dokument', 'mc', 'Womit schreibst du einen Brief am Computer?', 'mit einem Textdokument', ['mit einer Tondatei', 'mit einer Bilddatei']],
    ['dokument', 'mc', 'Ein Vortrag mit Folien ist ...?', 'eine Präsentation', ['eine Tabelle', 'eine Tonaufnahme']],
    ['dokument', 'mc', 'Die Klassenliste mit Spalten führst du in ...?', 'einer Tabelle', ['einer Präsentation', 'einem Bild']],
    ['dokument', 'mc', 'Ein gescannter Elternbrief, den niemand mehr ändern soll, ist oft ...?', 'ein PDF', ['eine Tonaufnahme', 'ein Spiel']],
    ['dokument', 'mc', 'Dein Aufsatz am Computer ist ...?', 'ein Textdokument', ['eine Bilddatei', 'eine Tabelle']],
    ['dokument', 'mc', 'Das Lied der Klasse nimmst du auf als ...?', 'Tonaufnahme', ['Textdokument', 'Tabelle']],
    ['dokument', 'mc', 'Das Plakatfoto vom Sporttag ist ...?', 'eine Bilddatei', ['ein Textdokument', 'eine Präsentation']],
    ['dokument', 'mc', 'Wozu dient der Dateiname?', 'die Datei wiederzufinden', ['die Datei schwerer zu machen', 'nichts']],
  ],
  f: [
    ['struktur', 'mc', 'Die Ordner auf dem Computer bilden eine ...?', 'Baumstruktur', ['Netzstruktur', 'Warteschlange']],
    ['struktur', 'mc', 'Verlinkte Internetseiten bilden eine ...?', 'Netzstruktur', ['Baumstruktur', 'Tabelle']],
    ['struktur', 'mc', 'Ein Stammbaum der Familie ist eine ...?', 'Baumstruktur', ['Netzstruktur', 'Liste']],
    ['struktur', 'mc', 'Eine Mindmap mit einem Thema in der Mitte und Ästen ist eine ...?', 'Baumstruktur', ['Warteschlange', 'Tabelle']],
    ['struktur', 'mc', 'Strassen, die viele Orte kreuz und quer verbinden, bilden eine ...?', 'Netzstruktur', ['Baumstruktur', 'Treppe']],
    ['struktur', 'mc', 'Im Ordner «Schule» liegt der Ordner «Deutsch», darin «Aufsätze». Was ist das?', 'eine Baumstruktur', ['eine Netzstruktur', 'ein Kreis']],
    ['struktur', 'mc', 'Was ist der oberste Punkt einer Baumstruktur?', 'die Wurzel', ['das Blatt', 'der Rand']],
    ['struktur', 'mc', 'Freundschaften in einer Klasse, kreuz und quer: Welche Struktur?', 'eine Netzstruktur', ['eine Baumstruktur', 'eine Leiter']],
  ],
  h: [
    ['ablegen', 'mc', 'Die Klasse sucht das Foto vom Sporttag. Welcher Ablageort ist am besten?', 'Klasse/Fotos/Sporttag', ['Neuer Ordner (3)', 'irgendwo auf dem Desktop']],
    ['ablegen', 'mc', 'Welcher Dateiname hilft am meisten?', 'Aufsatz-Fruehling-Mai', ['Dokument1', 'asdf']],
    ['ablegen', 'mc', 'Wohin gehört das Arbeitsblatt für Mathematik?', 'Schule/Mathematik/Arbeitsblaetter', ['Downloads', 'Papierkorb']],
    ['ablegen', 'mc', 'Warum sind gute Ordnernamen wichtig?', 'damit auch andere die Dateien finden', ['damit der Computer schneller startet', 'sie sind egal']],
    ['ablegen', 'mc', 'Du speicherst jede Woche ein Foto. Welche Ordnung hilft?', 'ein Ordner pro Monat', ['alles in einen Ordner ohne Namen', 'jedes Foto doppelt speichern']],
    ['ablegen', 'mc', 'Was gehört in den Ordner «Deutsch/Aufsätze»?', 'dein Aufsatz über die Ferien', ['das Matheblatt', 'ein Spiel']],
    ['ablegen', 'mc', 'Welcher Name sagt am meisten über den Inhalt?', 'Einladung-Geburtstag-Juni', ['Datei-final-final2', 'Unbenannt']],
    ['ablegen', 'mc', 'Wie findet man eine gut abgelegte Datei wieder?', 'dem Pfad durch die Ordner folgen', ['alle Dateien löschen', 'den Computer schütteln']],
  ],
  j: [
    ['datenbank', 'mc', 'Du willst alle Kinder mit Geburtstag im Mai finden. Was nutzt du?', 'eine Abfrage mit Filter', ['das Löschen der Tabelle', 'ein neues Passwort']],
    ['datenbank', 'mc', 'In der Klassentabelle: Jede Zeile ist ...?', 'ein Kind (ein Datensatz)', ['eine Farbe', 'ein Programm']],
    ['datenbank', 'mc', 'In der Klassentabelle: Jede Spalte ist ...?', 'ein Merkmal, z.B. der Name', ['ein Kind', 'ein Fehler']],
    ['datenbank', 'mc', 'Damit der Computer sortieren kann, müssen die Daten ...?', 'strukturiert erfasst sein', ['gelöscht sein', 'ausgedruckt sein']],
    ['datenbank', 'mc', 'Die Bibliothek findet jedes Buch in Sekunden. Was steckt dahinter?', 'eine Datenbank', ['Zufall', 'ein Radiergummi']],
    ['datenbank', 'mc', 'Was macht eine Abfrage?', 'sie sucht passende Datensätze heraus', ['sie malt ein Bild', 'sie druckt alles aus']],
    ['datenbank', 'mc', 'Alle Kinder, sortiert nach Nachname: Was hat der Computer gemacht?', 'die Datensätze sortiert', ['die Namen erfunden', 'die Tabelle gelöscht']],
    ['datenbank', 'mc', 'Was gehört als Merkmal in eine Bücher-Datenbank?', 'der Titel', ['das Wetter', 'dein Lieblingsessen']],
  ],
  k: [
    ['replikation', 'mc', 'Eine Sicherheitskopie auf einer zweiten Festplatte heisst ...?', 'Backup', ['Synchronisation', 'Versionierung']],
    ['replikation', 'mc', 'Handy und Computer zeigen automatisch dieselben Fotos. Das heisst ...?', 'Synchronisation', ['Backup', 'Versionierung']],
    ['replikation', 'mc', 'Du kannst eine ältere Fassung deines Textes zurückholen. Das heisst ...?', 'Versionierung', ['Backup', 'Synchronisation']],
    ['replikation', 'mc', 'Wozu macht man ein Backup?', 'damit bei einem Defekt nichts verloren geht', ['damit die Datei schöner wird', 'zum Spass']],
    ['replikation', 'mc', 'Die Festplatte ist kaputt, die Daten sind trotzdem da. Was hat geholfen?', 'das Backup', ['der Papierkorb', 'der Bildschirmschoner']],
    ['replikation', 'mc', 'Zwei Geräte gleichen ihre Daten laufend ab. Wie heisst das?', 'Synchronisation', ['Versionierung', 'Formatierung']],
    ['replikation', 'mc', 'Du speicherst «Aufsatz-V1», dann «Aufsatz-V2». Was machst du von Hand?', 'Versionierung', ['Synchronisation', 'ein Spiel']],
    ['replikation', 'mc', 'Wie oft sollte man wichtige Daten sichern?', 'regelmässig', ['nie', 'nur bei Vollmond']],
  ],
};

// Geheimschrift (Stufe c), Prüfbit (g) und Logik (i) werden generiert.
export function genTask(rng, stufe) {
  if (stufe.id === 'c') {
    const word = pick(rng, SECRET_WORDS);
    const shift = randInt(rng, 1, 3);
    const coded = caesarEncode(word, shift);
    return {
      kind: 'geheimschrift', type: 'typed',
      expr: `Geheimschrift: Jeder Buchstabe wurde im ABC um ${shift} nach hinten verschoben (A wird ${ALPHA[shift]}). Entschlüssle: ${coded}`,
      answer: word,
    };
  }
  if (stufe.id === 'g') {
    const bits = Array.from({ length: 4 }, () => randInt(rng, 0, 1)).join('');
    const ones = bits.split('').filter((b) => b === '1').length;
    if (rng() < 0.5) {
      return {
        kind: 'pruefbit', type: 'mc',
        expr: `Zähle die Einsen in ${bits}. Ist ihre Anzahl gerade oder ungerade?`,
        ...buildMc(rng, ones % 2 === 0 ? 'gerade' : 'ungerade', [ones % 2 === 0 ? 'ungerade' : 'gerade']),
      };
    }
    return {
      kind: 'pruefbit', type: 'typed',
      expr: `Welches Prüfbit ergänzt ${bits}, damit die Anzahl Einsen gerade wird? (0 oder 1)`,
      answer: String(ones % 2),
    };
  }
  if (stufe.id === 'i') {
    const A = rng() < 0.5;
    const B = rng() < 0.5;
    const variant = pick(rng, ['UND', 'ODER', 'NICHT']);
    if (variant === 'NICHT') {
      return {
        kind: 'logik', type: 'mc',
        expr: `A ist ${A ? 'wahr' : 'falsch'}. Was ist NICHT A?`,
        ...buildMc(rng, !A ? 'wahr' : 'falsch', [!A ? 'falsch' : 'wahr']),
      };
    }
    const result = variant === 'UND' ? (A && B) : (A || B);
    return {
      kind: 'logik', type: 'mc',
      expr: `A ist ${A ? 'wahr' : 'falsch'}, B ist ${B ? 'wahr' : 'falsch'}. Was ist A ${variant} B?`,
      ...buildMc(rng, result ? 'wahr' : 'falsch', [result ? 'falsch' : 'wahr']),
    };
  }
  const entry = pick(rng, POOLS[stufe.id]);
  const [kind, type, expr, correctOrAnswer, wrongs] = entry;
  if (type === 'typed') return { kind, type, expr, answer: correctOrAnswer };
  return { kind, type, expr, ...buildMc(rng, correctOrAnswer, wrongs) };
}

function buildMc(rng, correct, wrongs) {
  const options = shuffled(rng, [correct, ...wrongs]);
  return { options, answer: options.indexOf(correct) };
}

export function genRound(rng, stufe, length = 8) {
  const tasks = [];
  const seen = new Set();
  let guard = 0;
  while (tasks.length < length && guard++ < 300) {
    const task = genTask(rng, stufe);
    const key = task.expr + '|' + (task.options ? [...task.options].sort().join('|') : '');
    if (seen.has(key)) continue;
    seen.add(key);
    tasks.push(task);
  }
  return tasks;
}
