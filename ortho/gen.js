// gen.js — Aufgaben für Ortho. Reine Funktionen ohne DOM. Das
// Abschreiben von Wörtern und Sätzen wird generiert (die Vorlage
// steht in der Aufgabe, die Suite prüft die Identität unabhängig);
// Formen, Lücken und Fehlerjagd liegen in festen Aufgaben-Pools.
// Getippte Antworten nutzen nur Zeichen der Schweizer Tastatur.
// Jede Aufgabe:
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

// Vorlagen zum Abschreiben (nur Schweizer-Tastatur-Zeichen).
export const WOERTER = [
  'le chien', 'la maison', 'le livre', 'la fleur', 'bonjour', 'merci',
  'la pomme', 'le vélo', 'la table', 'au revoir', 'le chat', "l'école",
];
export const SAETZE = [
  "Je m'appelle Marie.", "J'ai neuf ans.", 'Voilà le chat.',
  'Le chien est petit.', 'La maison est grande.', "C'est ma mère.",
  'Nous sommes amis.', 'Merci beaucoup.',
];

// Pool-Einträge: [kind, 'mc', expr, richtig, [falsch...]] oder
// [kind, 'typed', expr, antwort].
export const POOLS = {
  b: [
    ['satzschrift', 'mc', 'Welches Zeichen fehlt am Ende: Comment ça va', '?', ['.', ',']],
    ['satzschrift', 'mc', 'Welches Zeichen fehlt am Ende: Je joue au foot', '.', ['?', ',']],
    ['satzschrift', 'mc', 'Was fehlt in «Jai neuf ans»?', "der Apostroph: J'ai", ['ein Komma: J,ai', 'nichts']],
    ['satzschrift', 'mc', 'Wie beginnt ein Satz?', 'mit einem Grossbuchstaben', ['mit einem Kleinbuchstaben', 'mit einer Zahl']],
  ],
  c: [
    ['hochform', 'typed', '«ich habe» auf Französisch:', "j'ai"],
    ['hochform', 'typed', '«das ist» auf Französisch:', "c'est"],
    ['hochform', 'typed', '«es gibt» auf Französisch:', 'il y a'],
    ['hochform', 'typed', '«ich bin» auf Französisch:', 'je suis'],
    ['hochform', 'typed', '«wir sind» auf Französisch:', 'nous sommes'],
    ['hochform', 'typed', '«ich heisse» auf Französisch:', "je m'appelle"],
    ['hochform', 'mc', 'Richtig geschrieben ist ...? (die Schule)', "l'école", ["l'ecole", 'lécole']],
    ['hochform', 'mc', 'Richtig geschrieben ist ...? (der Junge)', 'le garçon', ['le garcon', 'le garsson']],
    ['hochform', 'mc', 'Richtig geschrieben ist ...? (danke)', 'merci', ['mersi', 'mercie']],
    ['hochform', 'mc', 'Richtig geschrieben ist ...? (Guten Tag)', 'bonjour', ['bonjur', 'bounjour']],
    ['hochform', 'typed', 'Ergänze den fehlenden Buchstaben: la ma·son (das Haus)', 'i'],
    ['hochform', 'typed', 'Ergänze den fehlenden Buchstaben: m·rci (danke)', 'e'],
    ['hochform', 'typed', 'Ergänze den fehlenden Buchstaben: bonj·ur (Guten Tag)', 'o'],
    ['hochform', 'typed', 'Ergänze den fehlenden Buchstaben: le ch·en (der Hund)', 'i'],
  ],
  d: [
    ['fehlerjagd', 'mc', 'Welches Wort ist falsch geschrieben? «Je swi content.»', 'swi', ['Je', 'content']],
    ['fehlerjagd', 'mc', 'Welches Wort ist falsch geschrieben? «La mason est grande.»', 'mason', ['La', 'grande']],
    ['fehlerjagd', 'mc', 'Welches Wort ist falsch geschrieben? «Nous somes amis.»', 'somes', ['Nous', 'amis']],
    ['fehlerjagd', 'mc', "Welches Wort ist falsch geschrieben? «J'ai nef ans.»", 'nef', ["J'ai", 'ans']],
    ['fehlerjagd', 'mc', 'Welches Wort ist falsch geschrieben? «Merci bocoup.»', 'bocoup', ['Merci']],
    ['fehlerjagd', 'mc', 'père oder pére (der Vater)?', 'père', ['pére']],
    ['fehlerjagd', 'mc', 'mère oder mére (die Mutter)?', 'mère', ['mére']],
    ['fehlerjagd', 'mc', 'école oder ècole (die Schule)?', 'école', ['ècole']],
    ['fehlerjagd', 'mc', 'très oder trés (sehr)?', 'très', ['trés']],
    ['fehlerjagd', 'typed', 'Schreibe das ganze Wort: beauc… (viel)', 'beaucoup'],
    ['fehlerjagd', 'typed', 'Schreibe das ganze Wort: aujourd… (heute)', "aujourd'hui"],
  ],
};

// Abschreiben (a: Wörter, b: Sätze) wird generiert; die Vorlage steht
// in der Aufgabe.
export function genTask(rng, stufe) {
  if (stufe.id === 'a') {
    const wort = pick(rng, WOERTER);
    return {
      kind: 'abschreiben', type: 'typed',
      expr: `Schreibe genau ab: ${wort}`,
      answer: wort,
    };
  }
  if (stufe.id === 'b' && rng() < 0.6) {
    const satz = pick(rng, SAETZE);
    return {
      kind: 'satzschrift', type: 'typed',
      expr: `Schreibe genau ab: ${satz}`,
      answer: satz,
    };
  }
  const entry = pick(rng, POOLS[stufe.id]);
  const [kind, type, expr, correctOrAnswer, wrongs] = entry;
  if (type === 'typed') return { kind, type, expr, answer: correctOrAnswer };
  const options = shuffled(rng, [correctOrAnswer, ...wrongs]);
  return { kind, type, expr, options, answer: options.indexOf(correctOrAnswer) };
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
