// gen.js — Aufgaben für Motbau. Reine Funktionen ohne DOM. Die
// regelmässige Mehrzahl und die Konjugation der Verben auf -er werden
// generiert und von der e2e-Suite unabhängig nachgerechnet (eigene
// Endungs-Tabelle und Mehrzahl-Regel in der Suite). Die übrigen
// Formen liegen in festen Aufgaben-Pools. Jede Aufgabe:
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

// Regelmässige Nomen (Mehrzahl mit -s, keine Wörter auf -al).
export const NOMEN = [
  ['le', 'chien'], ['le', 'chat'], ['la', 'maison'], ['le', 'livre'],
  ['la', 'fleur'], ['la', 'table'], ['la', 'pomme'], ['le', 'vélo'],
];

// Verben auf -er ohne Elision (kein Vokal am Anfang).
export const VERBEN = ['parler', 'jouer', 'danser', 'chanter', 'regarder'];
export const PRONOMEN = ['je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles'];
const ENDUNGEN = { je: 'e', tu: 'es', il: 'e', elle: 'e', nous: 'ons', vous: 'ez', ils: 'ent', elles: 'ent' };

// Pool-Einträge: [kind, 'mc', expr, richtig, [falsch...]] oder
// [kind, 'typed', expr, antwort].
export const POOLS = {
  a: [
    ['baustein', 'mc', 'le oder la: ... maison (das Haus)?', 'la', ['le']],
    ['baustein', 'mc', 'le oder la: ... chien (der Hund)?', 'le', ['la']],
    ['baustein', 'mc', 'le oder la: ... fleur (die Blume)?', 'la', ['le']],
    ['baustein', 'mc', 'le oder la: ... livre (das Buch)?', 'le', ['la']],
    ['baustein', 'mc', 'le oder la: ... table (der Tisch)?', 'la', ['le']],
    ['baustein', 'mc', 'le oder la: ... vélo (das Velo)?', 'le', ['la']],
    ['baustein', 'mc', 'un oder une: ... fille (ein Mädchen)?', 'une', ['un']],
    ['baustein', 'mc', 'un oder une: ... garçon (ein Junge)?', 'un', ['une']],
    ['baustein', 'mc', 'Wie sagst du «Ich heisse Anna» auf Französisch?', "Je m'appelle Anna.", ['Je suis Anna la.', 'Anna appelle je.']],
    ['baustein', 'mc', 'Wie sagst du «Guten Tag»?', 'Bonjour', ['Merci', 'Au revoir']],
    ['baustein', 'mc', '«Danke» heisst auf Französisch ...?', 'merci', ['bonjour', 'pardon']],
    ['baustein', 'mc', '«Auf Wiedersehen» heisst ...?', 'au revoir', ['à table', 'voilà']],
  ],
  b: [
    ['verbform', 'mc', 'Marie singt: ... chante.', 'elle', ['il', 'nous']],
    ['verbform', 'mc', 'Paul tanzt: ... danse.', 'il', ['elle', 'vous']],
    ['verbform', 'mc', 'Paul und Marie spielen: ... jouent.', 'ils', ['elles', 'nous']],
    ['verbform', 'mc', 'Marie und Anna singen: ... chantent.', 'elles', ['ils', 'vous']],
    ['verbform', 'mc', 'Du und ich, wir spielen: ... jouons.', 'nous', ['vous', 'ils']],
    ['verbform', 'mc', 'Fragewort «Wer»: ... est-ce?', 'Qui', ['Où', 'Quand']],
    ['verbform', 'mc', 'Fragewort «Wo»: ... habites-tu?', 'Où', ['Qui', 'Que']],
    ['verbform', 'mc', 'Fragewort «Wann»: ... viens-tu?', 'Quand', ['Comment', 'Où']],
    ['verbform', 'mc', 'Fragewort «Warum»: ... pleures-tu?', 'Pourquoi', ['Quand', 'Qui']],
    ['verbform', 'mc', 'Fragewort «Wie»: ... ça va?', 'Comment', ['Pourquoi', 'Que']],
    ['verbform', 'mc', 'Fragewort «Was»: ... fais-tu?', 'Que', ['Qui', 'Où']],
  ],
  c: [
    ['satzform', 'typed', 'être: je ...', 'suis'],
    ['satzform', 'typed', 'être: tu ...', 'es'],
    ['satzform', 'typed', 'être: il ...', 'est'],
    ['satzform', 'typed', 'être: nous ...', 'sommes'],
    ['satzform', 'typed', 'être: ils ...', 'sont'],
    ['satzform', 'mc', 'être: vous ...?', 'êtes', ['être', 'est']],
    ['satzform', 'typed', "avoir: j' ...", 'ai'],
    ['satzform', 'typed', 'avoir: tu ...', 'as'],
    ['satzform', 'typed', 'avoir: il ...', 'a'],
    ['satzform', 'typed', 'avoir: nous ...', 'avons'],
    ['satzform', 'typed', 'avoir: vous ...', 'avez'],
    ['satzform', 'typed', 'avoir: ils ...', 'ont'],
    ['satzform', 'typed', 'Mehrzahl: le journal → les ...', 'journaux'],
    ['satzform', 'typed', "Mehrzahl: l'animal → les ...", 'animaux'],
    ['satzform', 'typed', 'Mehrzahl: le cheval → les ...', 'chevaux'],
    ['satzform', 'mc', "Mehrzahl von «l'œil» (das Auge)?", 'les yeux', ["les œils", 'les œufs']],
    ['satzform', 'mc', 'Je vais ... école. (in die Schule)', "à l'", ['au', 'à la']],
    ['satzform', 'mc', 'Je vais ... cinéma. (ins Kino)', 'au', ["à l'", 'à la']],
    ['satzform', 'mc', 'Je vais ... piscine. (ins Schwimmbad)', 'à la', ['au', "à l'"]],
    ['satzform', 'mc', 'Il habite ... Suisse. (in der Schweiz)', 'en', ['au', 'à la']],
    ['satzform', 'mc', 'Welcher Satz ist richtig gebaut?', 'Je mange une pomme.', ['Je une pomme mange.', 'Mange je une pomme.']],
    ['satzform', 'mc', 'Welche Frage ist richtig gebaut?', 'Où habites-tu?', ['Habites où tu?', 'Tu où habites?']],
  ],
  d: [
    ['feinform', 'mc', 'Verneine «Je chante»:', 'Je ne chante pas.', ['Je chante ne pas.', 'Ne je chante pas.']],
    ['feinform', 'mc', 'Verneine «Il joue»:', 'Il ne joue pas.', ['Il joue ne pas.', 'Ne il joue pas.']],
    ['feinform', 'typed', 'Je ... sais pas. Welches Wort fehlt?', 'ne'],
    ['feinform', 'typed', 'pouvoir (können): je ...', 'peux'],
    ['feinform', 'typed', 'pouvoir: il ...', 'peut'],
    ['feinform', 'typed', 'vouloir (wollen): je ...', 'veux'],
    ['feinform', 'typed', 'vouloir: il ...', 'veut'],
    ['feinform', 'mc', 'Ich will spielen: Je ... jouer.', 'veux', ['veut', 'voulons']],
    ['feinform', 'mc', 'ce, cette oder ces: ... livre (dieses Buch)?', 'ce', ['cette', 'ces']],
    ['feinform', 'mc', 'ce, cette oder ces: ... maison (dieses Haus)?', 'cette', ['ce', 'ces']],
    ['feinform', 'mc', 'ce, cette oder ces: ... enfants (diese Kinder)?', 'ces', ['ce', 'cette']],
    ['feinform', 'mc', 'Je ... lave. (ich wasche mich)', 'me', ['te', 'se']],
    ['feinform', 'mc', 'Tu ... laves. (du wäschst dich)', 'te', ['me', 'se']],
    ['feinform', 'mc', 'Il ... lave. (er wäscht sich)', 'se', ['me', 'te']],
  ],
};

// Mehrzahl (a) und -er-Konjugation (b) werden generiert.
export function genTask(rng, stufe) {
  if (stufe.id === 'a' && rng() < 0.4) {
    const [artikel, wort] = pick(rng, NOMEN);
    return {
      kind: 'baustein', type: 'typed',
      expr: `Mehrzahl: ${artikel} ${wort} → les ...`,
      answer: `${wort}s`,
    };
  }
  if (stufe.id === 'b' && rng() < 0.5) {
    const verb = pick(rng, VERBEN);
    const pronomen = pick(rng, PRONOMEN);
    return {
      kind: 'verbform', type: 'typed',
      expr: `Konjugiere ${verb}: ${pronomen} ...`,
      answer: verb.slice(0, -2) + ENDUNGEN[pronomen],
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
