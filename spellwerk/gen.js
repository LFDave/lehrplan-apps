// gen.js — Aufgaben für Spellwerk. Reine Funktionen ohne DOM. Das
// Abschreiben von Wörtern und Sätzen wird generiert (die Vorlage
// steht in der Aufgabe, die Suite prüft die Identität unabhängig);
// Formen, Lücken und Fehlerjagd liegen in festen Aufgaben-Pools.
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

// Vorlagen zum Abschreiben.
export const WOERTER = [
  'the dog', 'the cat', 'a book', 'the school', 'hello', 'apple',
  'house', 'water', 'friend', 'family', 'birthday', 'garden',
];
export const SAETZE = [
  'My name is Ben.', 'I like apples.', 'How are you?',
  'I am nine years old.', 'The dog is small.', 'We are friends.',
  'Good morning, Mia.', 'Thank you very much.',
];

// Pool-Einträge: [kind, 'mc', expr, richtig, [falsch...]] oder
// [kind, 'typed', expr, antwort].
export const POOLS = {
  b: [
    ['satzschrift', 'mc', 'Welches Zeichen fehlt am Ende: How are you', '?', ['.', ',']],
    ['satzschrift', 'mc', 'Welches Zeichen fehlt am Ende: I like apples', '.', ['?', ',']],
    ['satzschrift', 'mc', 'Was fehlt in «Im nine»?', "der Apostroph: I'm", ['ein Komma: I,m', 'nichts']],
    ['satzschrift', 'mc', 'Wie schreibt man das Wort «ich» auf Englisch, mitten im Satz?', 'gross: I', ['klein: i', 'mal so, mal so']],
  ],
  c: [
    ['hochform', 'typed', '«ich bin» auf Englisch:', 'I am'],
    ['hochform', 'typed', '«sie sind» (mehrere Personen) auf Englisch:', 'they are'],
    ['hochform', 'typed', '«wir sind» auf Englisch:', 'we are'],
    ['hochform', 'typed', '«es ist» auf Englisch:', 'it is'],
    ['hochform', 'typed', '«du bist» auf Englisch:', 'you are'],
    ['hochform', 'typed', '«ich bin», kurz mit Apostroph:', "I'm"],
    ['hochform', 'mc', 'Richtig geschrieben ist ...? (die Schule)', 'school', ['shool', 'scool']],
    ['hochform', 'mc', 'Richtig geschrieben ist ...? (das Haus)', 'house', ['hous', 'hause']],
    ['hochform', 'mc', 'Richtig geschrieben ist ...? (der Freund)', 'friend', ['freind', 'frend']],
    ['hochform', 'mc', 'Richtig geschrieben ist ...? (das Wasser)', 'water', ['watter', 'wather']],
    ['hochform', 'typed', 'Ergänze den fehlenden Buchstaben: hou·e (das Haus)', 's'],
    ['hochform', 'typed', 'Ergänze den fehlenden Buchstaben: scho·l (die Schule)', 'o'],
    ['hochform', 'typed', 'Ergänze den fehlenden Buchstaben: fri·nd (der Freund)', 'e'],
    ['hochform', 'typed', 'Ergänze den fehlenden Buchstaben: wat·r (das Wasser)', 'e'],
  ],
  d: [
    ['fehlerjagd', 'mc', 'Welches Wort ist falsch geschrieben? «I am hapy.»', 'hapy', ['I', 'am']],
    ['fehlerjagd', 'mc', 'Welches Wort ist falsch geschrieben? «The dogg is small.»', 'dogg', ['The', 'small']],
    ['fehlerjagd', 'mc', 'Welches Wort ist falsch geschrieben? «I lik apples.»', 'lik', ['I', 'apples']],
    ['fehlerjagd', 'mc', 'Welches Wort ist falsch geschrieben? «We are frends.»', 'frends', ['We', 'are']],
    ['fehlerjagd', 'mc', 'Welches Wort ist falsch geschrieben? «Good moring, Ben.»', 'moring', ['Good', 'Ben']],
    ['fehlerjagd', 'mc', 'Welches Wort ist falsch geschrieben? «Thank you wery much.»', 'wery', ['Thank', 'much']],
    ['fehlerjagd', 'typed', 'Schreibe das ganze Wort: rabb… (das Kaninchen)', 'rabbit'],
    ['fehlerjagd', 'typed', 'Schreibe das ganze Wort: summ… (der Sommer)', 'summer'],
    ['fehlerjagd', 'typed', 'Schreibe das ganze Wort: swimm… (schwimmen)', 'swimming'],
    ['fehlerjagd', 'typed', 'Schreibe das ganze Wort: Wedn… (Mittwoch)', 'Wednesday'],
    ['fehlerjagd', 'typed', 'Schreibe das ganze Wort: becau… (weil)', 'because'],
    ['fehlerjagd', 'typed', 'Schreibe das ganze Wort: beaut… (schön)', 'beautiful'],
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
