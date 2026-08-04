// gen.js — Aufgaben für Wordbau. Reine Funktionen ohne DOM. Die
// regelmässige Mehrzahl und die he-Form werden generiert und von der
// e2e-Suite unabhängig nachgerechnet (eigene Regel-Tabelle in der
// Suite, unregelmässige Formen zuerst). Die übrigen Formen liegen in
// festen Aufgaben-Pools. Jede Aufgabe:
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

// Regelmässige Nomen (Mehrzahl mit -s).
export const NOMEN = ['dog', 'cat', 'book', 'car', 'tree', 'ball', 'girl', 'boy'];

// Verben mit regelmässiger he-Form (nur -s, kein -es).
export const VERBEN = ['play', 'sing', 'drink', 'read', 'jump', 'cook', 'eat', 'walk'];

// Pool-Einträge: [kind, 'mc', expr, richtig, [falsch...]] oder
// [kind, 'typed', expr, antwort].
export const POOLS = {
  a: [
    ['baustein', 'mc', 'a oder an: ... apple?', 'an', ['a']],
    ['baustein', 'mc', 'a oder an: ... orange?', 'an', ['a']],
    ['baustein', 'mc', 'a oder an: ... egg?', 'an', ['a']],
    ['baustein', 'mc', 'a oder an: ... umbrella?', 'an', ['a']],
    ['baustein', 'mc', 'a oder an: ... dog?', 'a', ['an']],
    ['baustein', 'mc', 'a oder an: ... house?', 'a', ['an']],
    ['baustein', 'mc', 'a oder an: ... banana?', 'a', ['an']],
    ['baustein', 'mc', 'Wie sagst du «Ich heisse Ben» auf Englisch?', 'My name is Ben.', ['Me name Ben is.', 'I name Ben.']],
    ['baustein', 'mc', 'Wie sagst du «Guten Morgen»?', 'Good morning', ['Good night', 'Goodbye']],
    ['baustein', 'mc', '«Danke» heisst auf Englisch ...?', 'thank you', ['please', 'hello']],
    ['baustein', 'mc', 'Wie fragst du «Wie geht es dir?»?', 'How are you?', ['How old are you?', 'Who are you?']],
  ],
  b: [
    ['verbform', 'typed', 'be: I ...', 'am'],
    ['verbform', 'typed', 'be: you ...', 'are'],
    ['verbform', 'typed', 'be: he ...', 'is'],
    ['verbform', 'typed', 'be: we ...', 'are'],
    ['verbform', 'typed', 'be: they ...', 'are'],
    ['verbform', 'typed', 'have: I ...', 'have'],
    ['verbform', 'typed', 'have: she ...', 'has'],
    ['verbform', 'typed', 'have: he ...', 'has'],
    ['verbform', 'typed', 'have: we ...', 'have'],
    ['verbform', 'mc', 'Ben ist ein Junge: ... is happy.', 'He', ['She', 'It']],
    ['verbform', 'mc', 'Mia ist ein Mädchen: ... is happy.', 'She', ['He', 'It']],
    ['verbform', 'mc', 'Der Hund: ... is small.', 'It', ['He', 'She']],
    ['verbform', 'mc', 'Ben und ich: ... are friends.', 'We', ['They', 'You']],
    ['verbform', 'mc', 'Ben und Mia: ... are friends.', 'They', ['We', 'It']],
    ['verbform', 'mc', 'Fragewort «Wo»: ... do you live?', 'Where', ['When', 'Who']],
    ['verbform', 'mc', 'Fragewort «Wann»: ... is your birthday?', 'When', ['Where', 'What']],
    ['verbform', 'mc', 'Fragewort «Wer»: ... is that?', 'Who', ['Why', 'Where']],
    ['verbform', 'mc', 'Fragewort «Was»: ... is this?', 'What', ['Who', 'When']],
    ['verbform', 'mc', 'Fragewort «Warum»: ... are you sad?', 'Why', ['What', 'How old']],
    ['verbform', 'mc', 'Fragewort «Wie alt»: ... are you?', 'How old', ['How much', 'Who']],
  ],
  c: [
    ['satzform', 'typed', 'Plural: one man, two ...', 'men'],
    ['satzform', 'typed', 'Plural: one woman, two ...', 'women'],
    ['satzform', 'typed', 'Plural: one child, two ...', 'children'],
    ['satzform', 'typed', 'Plural: one foot, two ...', 'feet'],
    ['satzform', 'typed', 'Plural: one tooth, two ...', 'teeth'],
    ['satzform', 'typed', 'Plural: one mouse, two ...', 'mice'],
    ['satzform', 'mc', 'he-Form von «watch»?', 'watches', ['watchs', 'watch']],
    ['satzform', 'mc', 'he-Form von «go»?', 'goes', ['gos', 'go']],
    ['satzform', 'mc', 'he-Form von «do»?', 'does', ['dos', 'do']],
    ['satzform', 'mc', 'The book is ... the table. (auf)', 'on', ['in', 'under']],
    ['satzform', 'mc', 'The cat is ... the box. (in)', 'in', ['on', 'at']],
    ['satzform', 'mc', 'The ball is ... the bed. (unter)', 'under', ['on', 'at']],
    ['satzform', 'mc', 'We are ... school. (in der Schule)', 'at', ['on', 'under']],
    ['satzform', 'mc', '... Monday (am Montag)', 'on', ['in', 'at']],
    ['satzform', 'mc', '... July (im Juli)', 'in', ['on', 'at']],
    ['satzform', 'mc', 'Welcher Satz ist richtig gebaut?', 'I play football every day.', ['I football play every day.', 'Every day play I football.']],
    ['satzform', 'mc', 'Welche Frage ist richtig gebaut?', 'Where do you live?', ['Where you do live?', 'You live where do?']],
  ],
  d: [
    ['feinform', 'typed', 'Ich mag keinen Tee: I ... like tea.', "don't"],
    ['feinform', 'typed', 'Sie mag keinen Tee: She ... like tea.', "doesn't"],
    ['feinform', 'mc', 'Verneine «I am happy»:', 'I am not happy.', ['I not am happy.', "I don't am happy."]],
    ['feinform', 'mc', 'Ich kann schwimmen: I ... swim.', 'can', ['must', 'am']],
    ['feinform', 'mc', 'Ich muss gehen: I ... go.', 'must', ['can', 'is']],
    ['feinform', 'mc', 'Kannst du helfen? ... you help?', 'Can', ['Must', 'Is']],
    ['feinform', 'mc', 'this oder these: ... book?', 'this', ['these']],
    ['feinform', 'mc', 'this oder these: ... books?', 'these', ['this']],
    ['feinform', 'mc', 'that oder those: ... tree there?', 'that', ['those']],
    ['feinform', 'mc', 'that oder those: ... trees there?', 'those', ['that']],
  ],
};

// Mehrzahl (a) und he-Form (c) werden generiert.
export function genTask(rng, stufe) {
  if (stufe.id === 'a' && rng() < 0.4) {
    const wort = pick(rng, NOMEN);
    return {
      kind: 'baustein', type: 'typed',
      expr: `Plural: one ${wort}, two ...`,
      answer: `${wort}s`,
    };
  }
  if (stufe.id === 'c' && rng() < 0.4) {
    const verb = pick(rng, VERBEN);
    return {
      kind: 'satzform', type: 'typed',
      expr: `Setze die he-Form ein: ${verb} → he ...`,
      answer: `${verb}s`,
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
