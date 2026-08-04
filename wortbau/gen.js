// gen.js — Aufgaben für Wortbau. Reine Funktionen ohne DOM; der
// Inhalt liegt in festen Aufgaben-Pools pro Stufe (Grammatik ist
// Faktenwissen). Jede Frage ist eindeutig formuliert, damit die
// e2e-Suite sie gegen eine unabhängig neu aufgeschriebene
// Antwort-Tabelle prüfen kann. Jede Aufgabe:
//   { type: 'typed', expr, answer }               getippte Antwort
//   { type: 'mc', expr, options, answer }         Auswahl (Index)

export function formatNumber(n) {
  return String(n);
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

// Pool-Einträge: [kind, 'mc', expr, richtig, [falsch...]] oder
// [kind, 'typed', expr, antwort].
export const POOLS = {
  a: [
    ['wortart', 'mc', 'Was für ein Wort ist «Hund»?', 'Nomen', ['Verb', 'Adjektiv']],
    ['wortart', 'mc', 'Was für ein Wort ist «Blume»?', 'Nomen', ['Verb', 'Adjektiv']],
    ['wortart', 'mc', 'Was für ein Wort ist «Tisch»?', 'Nomen', ['Verb', 'Adjektiv']],
    ['wortart', 'mc', 'Was für ein Wort ist «rennen»?', 'Verb', ['Nomen', 'Adjektiv']],
    ['wortart', 'mc', 'Was für ein Wort ist «lachen»?', 'Verb', ['Nomen', 'Adjektiv']],
    ['wortart', 'mc', 'Was für ein Wort ist «singen»?', 'Verb', ['Nomen', 'Adjektiv']],
    ['wortart', 'mc', 'Was für ein Wort ist «schnell»?', 'Adjektiv', ['Nomen', 'Verb']],
    ['wortart', 'mc', 'Was für ein Wort ist «gross»?', 'Adjektiv', ['Nomen', 'Verb']],
    ['wortart', 'mc', 'Was für ein Wort ist «rot»?', 'Adjektiv', ['Nomen', 'Verb']],
    ['wortart', 'mc', 'Was für ein Wort ist «leise»?', 'Adjektiv', ['Nomen', 'Verb']],
  ],
  b: [
    ['zeitform', 'mc', 'Welche Zeitform ist «ich spiele»?', 'Präsens', ['Präteritum', 'Perfekt']],
    ['zeitform', 'mc', 'Welche Zeitform ist «ich spielte»?', 'Präteritum', ['Präsens', 'Perfekt']],
    ['zeitform', 'mc', 'Welche Zeitform ist «ich habe gespielt»?', 'Perfekt', ['Präsens', 'Präteritum']],
    ['zeitform', 'mc', 'Welche Zeitform ist «wir lachen»?', 'Präsens', ['Präteritum', 'Perfekt']],
    ['zusammengesetzt', 'typed', 'Haustür = Haus + ?', 'Tür'],
    ['zusammengesetzt', 'typed', 'Fussball = Fuss + ?', 'Ball'],
    ['zusammengesetzt', 'typed', 'Schulweg = Schule + ?', 'Weg'],
    ['wortstamm', 'typed', 'Wie heisst der Wortstamm von «spielen»?', 'spiel'],
    ['wortstamm', 'typed', 'Wie heisst der Wortstamm von «fahren»?', 'fahr'],
    ['wortfamilie', 'mc', 'Welches Wort gehört zur Wortfamilie von «fahren»?', 'Fahrrad', ['Farbe', 'Feder']],
    ['wortfamilie', 'mc', 'Welches Wort gehört zur Wortfamilie von «spielen»?', 'Spielplatz', ['Spinne', 'Spiegel']],
  ],
  c: [
    ['infinitiv', 'typed', 'Wie heisst der Infinitiv von «läuft»?', 'laufen'],
    ['infinitiv', 'typed', 'Wie heisst der Infinitiv von «gibt»?', 'geben'],
    ['infinitiv', 'typed', 'Wie heisst der Infinitiv von «isst»?', 'essen'],
    ['personalform', 'mc', 'Personalform oder Infinitiv: «gehst»?', 'Personalform', ['Infinitiv']],
    ['personalform', 'mc', 'Personalform oder Infinitiv: «schwimmen»?', 'Infinitiv', ['Personalform']],
    ['personalform', 'mc', 'Personalform oder Infinitiv: «liest»?', 'Personalform', ['Infinitiv']],
    ['morphem', 'mc', 'Was ist das Vormorphem in «verlaufen»?', 'ver', ['lauf', 'en']],
    ['morphem', 'mc', 'Was ist das Stammmorphem in «verkaufen»?', 'kauf', ['ver', 'en']],
    ['morphem', 'typed', 'Verkäufer = ver + käuf + ?', 'er'],
  ],
  d: [
    ['pronomen', 'mc', 'Was für ein Wort ist «sie»?', 'Pronomen', ['Nomen', 'Verb']],
    ['pronomen', 'mc', 'Was für ein Wort ist «wir»?', 'Pronomen', ['Nomen', 'Adjektiv']],
    ['pronomen', 'mc', 'Was für ein Wort ist «und»?', 'Partikel', ['Nomen', 'Adjektiv']],
    ['pronomen', 'mc', 'Was für ein Wort ist «oder»?', 'Partikel', ['Pronomen', 'Verb']],
    ['futur', 'mc', 'Welche Zeitform ist «ich werde spielen»?', 'Futur', ['Präsens', 'Perfekt']],
    ['futur', 'mc', 'Welche Zeitform ist «ich hatte gespielt»?', 'Plusquamperfekt', ['Perfekt', 'Futur']],
    ['faelleIntro', 'typed', 'Wie viele Fälle hat das Deutsche?', '4'],
    ['faelleIntro', 'mc', 'Wie heisst der Wer-Fall?', 'Nominativ', ['Akkusativ', 'Dativ']],
    ['faelleIntro', 'mc', 'Wie heisst der Wen-Fall?', 'Akkusativ', ['Nominativ', 'Genitiv']],
    ['faelleIntro', 'mc', 'Wie heisst der Wem-Fall?', 'Dativ', ['Nominativ', 'Akkusativ']],
  ],
  e: [
    ['praeposition', 'mc', 'Was für ein Wort ist «unter»?', 'Präposition', ['Pronomen', 'Nomen']],
    ['praeposition', 'mc', 'Was für ein Wort ist «auf»?', 'Präposition', ['Pronomen', 'Adjektiv']],
    ['fallBestimmen', 'mc', 'Welcher Fall ist «den Hund» in «Ich sehe den Hund.»?', 'Akkusativ', ['Nominativ', 'Dativ']],
    ['fallBestimmen', 'mc', 'Welcher Fall ist «dem Kind» in «Ich helfe dem Kind.»?', 'Dativ', ['Akkusativ', 'Genitiv']],
    ['fallBestimmen', 'mc', 'Welcher Fall ist «der Hund» in «Der Hund bellt.»?', 'Nominativ', ['Akkusativ', 'Dativ']],
    ['morphemZerlegen', 'typed', 'Freiheit = frei + ?', 'heit'],
    ['morphemZerlegen', 'typed', 'Entdeckung = ent + deck + ?', 'ung'],
    ['satzglied', 'mc', 'Nominalgruppe oder Präpositionalgruppe: «auf dem Tisch»?', 'Präpositionalgruppe', ['Nominalgruppe']],
    ['satzglied', 'mc', 'Nominalgruppe oder Präpositionalgruppe: «der grosse Hund»?', 'Nominalgruppe', ['Präpositionalgruppe']],
  ],
  f: [
    ['konjunktion', 'mc', 'Was für ein Wort ist «weil»?', 'Konjunktion', ['Präposition', 'Pronomen']],
    ['konjunktion', 'mc', 'Was für ein Wort ist «dass»?', 'Konjunktion', ['Präposition', 'Nomen']],
    ['konjunktion', 'mc', 'Was für ein Wort ist «mit»?', 'Präposition', ['Konjunktion', 'Pronomen']],
    ['konjunktion', 'mc', 'Was für ein Wort ist «hinter»?', 'Präposition', ['Konjunktion', 'Adjektiv']],
    ['zeitformAlle', 'mc', 'Welche Zeitform ist «sie wird lesen»?', 'Futur', ['Präsens', 'Präteritum']],
    ['zeitformAlle', 'mc', 'Welche Zeitform ist «er las»?', 'Präteritum', ['Perfekt', 'Präsens']],
    ['zeitformAlle', 'mc', 'Welche Zeitform ist «wir haben gegessen»?', 'Perfekt', ['Präteritum', 'Futur']],
    ['zeitformAlle', 'mc', 'Welche Zeitform ist «du liest»?', 'Präsens', ['Futur', 'Perfekt']],
  ],
  g: [
    ['modus', 'mc', 'Welcher Modus ist «Geh nach Hause!»?', 'Imperativ', ['Indikativ', 'Konjunktiv']],
    ['modus', 'mc', 'Welcher Modus ist «Er sagt, er sei krank.»?', 'Konjunktiv', ['Imperativ', 'Indikativ']],
    ['modus', 'mc', 'Welcher Modus ist «Wir lesen ein Buch.»?', 'Indikativ', ['Imperativ', 'Konjunktiv']],
    ['aktivPassiv', 'mc', 'Aktiv oder Passiv: «Der Kuchen wird gebacken.»?', 'Passiv', ['Aktiv']],
    ['aktivPassiv', 'mc', 'Aktiv oder Passiv: «Anna backt einen Kuchen.»?', 'Aktiv', ['Passiv']],
    ['subjektObjekt', 'mc', 'Was ist das Subjekt in «Der Hund jagt die Katze.»?', 'der Hund', ['die Katze', 'jagt']],
    ['subjektObjekt', 'mc', 'Was ist das Objekt in «Der Hund jagt die Katze.»?', 'die Katze', ['der Hund', 'jagt']],
    ['satzart', 'mc', 'Einfach oder zusammengesetzt: «Ich lese, weil es regnet.»?', 'zusammengesetzt', ['einfach']],
    ['satzart', 'mc', 'Einfach oder zusammengesetzt: «Ich lese.»?', 'einfach', ['zusammengesetzt']],
  ],
};

function build(rng, entry) {
  const [kind, type, expr, correctOrAnswer, wrongs] = entry;
  if (type === 'typed') return { kind, type, expr, answer: correctOrAnswer };
  const options = shuffled(rng, [correctOrAnswer, ...wrongs]);
  return { kind, type, expr, options, answer: options.indexOf(correctOrAnswer) };
}

export function genTask(rng, stufe) {
  return build(rng, pick(rng, POOLS[stufe.id]));
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
