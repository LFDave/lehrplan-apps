// gen.js — Aufgaben für Motschatz. Reine Funktionen ohne DOM; der
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

// Vokabeln pro Stufe: [franzoesisch, deutsch, tippbar].
// `tippbar` erlaubt getippte Aufgaben DE→FR (nur einfache Schreibungen).
export const VOCAB = {
  a: [
    ['bonjour', 'guten Tag', true],
    ['merci', 'danke', true],
    ['oui', 'ja', true],
    ['non', 'nein', true],
    ['au revoir', 'auf Wiedersehen', false],
    ['un', 'eins', true],
    ['deux', 'zwei', true],
    ['trois', 'drei', true],
    ['rouge', 'rot', true],
    ['bleu', 'blau', true],
    ['le chat', 'die Katze', false],
    ['le chien', 'der Hund', false],
  ],
  b: [
    ['la mère', 'die Mutter', false],
    ['le père', 'der Vater', false],
    ["l'école", 'die Schule', false],
    ['le livre', 'das Buch', false],
    ['le crayon', 'der Bleistift', false],
    ['le pain', 'das Brot', false],
    ['le lait', 'die Milch', false],
    ['la pomme', 'der Apfel', false],
    ['lundi', 'Montag', true],
    ['mardi', 'Dienstag', true],
    ['vert', 'grün', true],
    ['noir', 'schwarz', true],
    ['dix', 'zehn', true],
  ],
  c: [
    ['il pleut', 'es regnet', false],
    ['le soleil', 'die Sonne', false],
    ["aujourd'hui", 'heute', false],
    ['demain', 'morgen', true],
    ['hier', 'gestern', true],
    ['manger', 'essen', true],
    ['boire', 'trinken', true],
    ['jouer', 'spielen', true],
    ['grand', 'gross', true],
    ['petit', 'klein', true],
    ['la semaine', 'die Woche', false],
  ],
  d: [
    ["j'aime", 'ich mag', false],
    ['je voudrais', 'ich möchte', false],
    ['le week-end', 'das Wochenende', false],
    ['les devoirs', 'die Hausaufgaben', false],
    ['la famille', 'die Familie', false],
    ['les vacances', 'die Ferien', false],
    ['travailler', 'arbeiten', true],
    ['habiter', 'wohnen', true],
    ['acheter', 'kaufen', true],
    ['la ville', 'die Stadt', false],
    ['le matin', 'der Morgen', false],
  ],
};

// Kurze Wendungen für die Stufen c und d: [franzoesisch, deutsch].
export const PHRASES = {
  c: [
    ['Comment ça va?', 'Wie geht es dir?'],
    ['Je ne comprends pas.', 'Ich verstehe nicht.'],
    ['Quelle heure est-il?', 'Wie spät ist es?'],
  ],
  d: [
    ["J'habite à Berne.", 'Ich wohne in Bern.'],
    ["J'aime jouer au foot.", 'Ich spiele gern Fussball.'],
    ['On se voit demain.', 'Wir sehen uns morgen.'],
  ],
};

// Aufgaben werden aus dem Stufen-Pool gebaut: FR→DE als Auswahl,
// DE→FR als Auswahl oder (bei tippbaren Wörtern) getippt.
export function genTask(rng, stufe) {
  const words = VOCAB[stufe.id];
  const phrases = PHRASES[stufe.id] || [];
  const usePhrase = phrases.length > 0 && rng() < 0.25;
  if (usePhrase) {
    const [fr, de] = pick(rng, phrases);
    const wrongs = shuffled(rng, phrases.filter((p) => p[0] !== fr)).slice(0, 2).map((p) => p[1]);
    const options = shuffled(rng, [de, ...wrongs]);
    return { kind: 'wendung', type: 'mc', pair: fr, expr: `Was heisst «${fr}» auf Deutsch?`, options, answer: options.indexOf(de) };
  }
  const [fr, de, typable] = pick(rng, words);
  const toGerman = rng() < 0.5;
  if (toGerman) {
    const wrongs = shuffled(rng, words.filter((w) => w[0] !== fr)).slice(0, 2).map((w) => w[1]);
    const options = shuffled(rng, [de, ...wrongs]);
    return { kind: 'vokabel', type: 'mc', pair: fr, expr: `Was heisst «${fr}» auf Deutsch?`, options, answer: options.indexOf(de) };
  }
  if (typable && rng() < 0.5) {
    return { kind: 'vokabel', type: 'typed', pair: fr, expr: `Übersetze auf Französisch: ${de}`, answer: fr };
  }
  const wrongs = shuffled(rng, words.filter((w) => w[0] !== fr)).slice(0, 2).map((w) => w[0]);
  const options = shuffled(rng, [fr, ...wrongs]);
  return { kind: 'vokabel', type: 'mc', pair: fr, expr: `Wie heisst «${de}» auf Französisch?`, options, answer: options.indexOf(fr) };
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
