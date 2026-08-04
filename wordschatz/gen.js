// gen.js — Aufgaben für Wordschatz. Reine Funktionen ohne DOM; der
// Inhalt liegt in festen Vokabel-Pools pro Stufe (Grundwortschatz ist
// Faktenwissen). Die e2e-Suite prüft jede Aufgabe gegen eine
// unabhängig neu aufgeschriebene Übersetzungs-Tabelle. Jede Aufgabe:
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

// Vokabeln pro Stufe: [englisch, deutsch, tippbar].
export const VOCAB = {
  a: [
    ['hello', 'hallo', true],
    ['thank you', 'danke', true],
    ['yes', 'ja', true],
    ['no', 'nein', true],
    ['goodbye', 'auf Wiedersehen', true],
    ['one', 'eins', true],
    ['two', 'zwei', true],
    ['three', 'drei', true],
    ['red', 'rot', true],
    ['blue', 'blau', true],
    ['the cat', 'die Katze', false],
    ['the dog', 'der Hund', false],
  ],
  b: [
    ['the mother', 'die Mutter', false],
    ['the father', 'der Vater', false],
    ['the school', 'die Schule', false],
    ['the book', 'das Buch', false],
    ['the pencil', 'der Bleistift', false],
    ['the bread', 'das Brot', false],
    ['the milk', 'die Milch', false],
    ['the apple', 'der Apfel', false],
    ['Monday', 'Montag', true],
    ['Tuesday', 'Dienstag', true],
    ['green', 'grün', true],
    ['black', 'schwarz', true],
    ['ten', 'zehn', true],
  ],
  c: [
    ['it is raining', 'es regnet', false],
    ['the sun', 'die Sonne', false],
    ['today', 'heute', true],
    ['tomorrow', 'morgen', true],
    ['yesterday', 'gestern', true],
    ['to eat', 'essen', false],
    ['to drink', 'trinken', false],
    ['to play', 'spielen', false],
    ['big', 'gross', true],
    ['small', 'klein', true],
    ['the week', 'die Woche', false],
  ],
  d: [
    ['I like', 'ich mag', false],
    ['I would like', 'ich möchte', false],
    ['the weekend', 'das Wochenende', false],
    ['the homework', 'die Hausaufgaben', false],
    ['the family', 'die Familie', false],
    ['the holidays', 'die Ferien', false],
    ['to work', 'arbeiten', false],
    ['to live', 'wohnen', false],
    ['to buy', 'kaufen', false],
    ['the city', 'die Stadt', false],
    ['the morning', 'der Morgen', false],
  ],
};

// Kurze Wendungen für die Stufen c und d: [englisch, deutsch].
export const PHRASES = {
  c: [
    ['How are you?', 'Wie geht es dir?'],
    ["I don't understand.", 'Ich verstehe nicht.'],
    ['What time is it?', 'Wie spät ist es?'],
  ],
  d: [
    ['I live in Berne.', 'Ich wohne in Bern.'],
    ['I like playing football.', 'Ich spiele gern Fussball.'],
    ['See you tomorrow.', 'Wir sehen uns morgen.'],
  ],
};

// Aufgaben werden aus dem Stufen-Pool gebaut: EN→DE als Auswahl,
// DE→EN als Auswahl oder (bei tippbaren Wörtern) getippt.
export function genTask(rng, stufe) {
  const words = VOCAB[stufe.id];
  const phrases = PHRASES[stufe.id] || [];
  const usePhrase = phrases.length > 0 && rng() < 0.25;
  if (usePhrase) {
    const [en, de] = pick(rng, phrases);
    const wrongs = shuffled(rng, phrases.filter((p) => p[0] !== en)).slice(0, 2).map((p) => p[1]);
    const options = shuffled(rng, [de, ...wrongs]);
    return { kind: 'wendung', type: 'mc', pair: en, expr: `Was heisst «${en}» auf Deutsch?`, options, answer: options.indexOf(de) };
  }
  const [en, de, typable] = pick(rng, words);
  const toGerman = rng() < 0.5;
  if (toGerman) {
    const wrongs = shuffled(rng, words.filter((w) => w[0] !== en)).slice(0, 2).map((w) => w[1]);
    const options = shuffled(rng, [de, ...wrongs]);
    return { kind: 'vokabel', type: 'mc', pair: en, expr: `Was heisst «${en}» auf Deutsch?`, options, answer: options.indexOf(de) };
  }
  if (typable && rng() < 0.5) {
    return { kind: 'vokabel', type: 'typed', pair: en, expr: `Übersetze auf Englisch: ${de}`, answer: en };
  }
  const wrongs = shuffled(rng, words.filter((w) => w[0] !== en)).slice(0, 2).map((w) => w[0]);
  const options = shuffled(rng, [en, ...wrongs]);
  return { kind: 'vokabel', type: 'mc', pair: en, expr: `Wie heisst «${de}» auf Englisch?`, options, answer: options.indexOf(en) };
}

export function genRound(rng, stufe, length = 8) {
  const tasks = [];
  const seen = new Set();
  let guard = 0;
  while (tasks.length < length && guard++ < 300) {
    const task = genTask(rng, stufe);
    // Ein Wortpaar pro Runde nur einmal, egal in welcher Richtung.
    const key = task.pair;
    if (seen.has(key)) continue;
    seen.add(key);
    tasks.push(task);
  }
  return tasks;
}
