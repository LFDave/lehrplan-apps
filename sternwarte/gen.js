// gen.js — Aufgaben für Sternwarte. Reine Funktionen ohne DOM; der
// Inhalt liegt in festen Aufgaben-Pools pro Stufe (Astronomie ist
// Faktenwissen). Die e2e-Suite prüft jede Aufgabe gegen eine
// unabhängig neu aufgeschriebene Antwort-Tabelle. Jede Aufgabe:
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
    ['himmel', 'mc', 'Was leuchtet am Taghimmel am hellsten?', 'die Sonne', ['der Mond', 'ein Flugzeug']],
    ['himmel', 'mc', 'Was siehst du in einer klaren Nacht am Himmel?', 'Sterne und oft den Mond', ['die Sonne', 'einen Regenbogen']],
    ['himmel', 'mc', 'Was ist das Weltall?', 'der riesige Raum mit Sternen und Planeten', ['ein grosses Meer', 'ein Land weit weg']],
    ['himmel', 'mc', 'Kannst du die Sterne am Tag sehen?', 'kaum, der Himmel ist zu hell', ['ja, genau wie in der Nacht', 'ja, aber nur im Sommer']],
    ['himmel', 'mc', 'Was ist weiter weg?', 'die Sterne', ['die Wolken']],
    ['himmel', 'mc', 'Womit kannst du weit entfernte Himmelskörper besser sehen?', 'mit einem Fernrohr', ['mit einer Lupe', 'mit einer Taschenlampe']],
    ['himmel', 'mc', 'Der Mond ist in der Nacht oft gut sichtbar. Warum siehst du ihn manchmal auch am Tag?', 'er steht auch am Tag manchmal am Himmel', ['das ist ein Spiegelbild', 'das ist ein anderer Planet']],
    ['himmel', 'mc', 'Wie sehen die Sterne von der Erde aus?', 'wie kleine helle Punkte', ['wie grosse Kugeln', 'wie bunte Wolken']],
    ['himmel', 'mc', 'Die Sonne, der Mond und die Sterne sind ...?', 'Himmelskörper', ['Wolken', 'Flugzeuge']],
  ],
  b: [
    ['sonnenlauf', 'mc', 'Wo geht die Sonne am Morgen auf?', 'im Osten', ['im Westen', 'im Norden']],
    ['sonnenlauf', 'mc', 'Wo geht die Sonne am Abend unter?', 'im Westen', ['im Osten', 'im Norden']],
    ['sonnenlauf', 'mc', 'Wo steht die Sonne bei uns am Mittag am höchsten?', 'im Süden', ['im Norden', 'im Westen']],
    ['sonnenlauf', 'mc', 'Warum ist es in der Nacht dunkel?', 'unsere Seite der Erde ist von der Sonne abgewandt', ['die Sonne ist ausgeschaltet', 'der Mond deckt die Sonne jede Nacht zu']],
    ['sonnenlauf', 'mc', 'Der Mond sieht nicht jede Nacht gleich aus. Wie heisst das?', 'die Mondphasen', ['die Jahreszeiten', 'die Sternbilder']],
    ['sonnenlauf', 'mc', 'Was ist die Sonne?', 'ein Stern', ['ein Planet', 'ein Mond']],
    ['sonnenlauf', 'mc', 'Leuchtet der Mond selbst?', 'Nein, er wird von der Sonne angestrahlt', ['Ja, er brennt wie die Sonne']],
    ['sonnenlauf', 'mc', 'Wann siehst du die Sterne am besten?', 'in einer klaren, dunklen Nacht', ['am Mittag', 'bei dichtem Nebel']],
    ['sonnenlauf', 'mc', 'Die Sonne wandert im Lauf des Tages ...?', 'von Osten über Süden nach Westen', ['von Westen nach Osten', 'gar nicht']],
  ],
  c: [
    ['erde', 'mc', 'Welche Form hat die Erde?', 'ungefähr die Form einer Kugel', ['die Form einer Scheibe', 'die Form eines Würfels']],
    ['erde', 'typed', 'In wie vielen Stunden dreht sich die Erde einmal um sich selbst?', '24'],
    ['erde', 'mc', 'Wie lange braucht die Erde für eine Runde um die Sonne?', 'ungefähr ein Jahr', ['einen Tag', 'eine Woche']],
    ['erde', 'mc', 'Warum gibt es Tag und Nacht?', 'weil sich die Erde um sich selbst dreht', ['weil die Sonne um die Erde kreist', 'weil der Mond die Sonne verdeckt']],
    ['erde', 'mc', 'Wenn bei uns Tag ist, ist auf der anderen Seite der Erde ...?', 'Nacht', ['auch Tag', 'immer Winter']],
    ['erde', 'mc', 'Die Erde ist ...?', 'ein Planet', ['ein Stern', 'ein Komet']],
    ['erde', 'mc', 'Was umkreist die Erde?', 'der Mond', ['die Sonne', 'der Mars']],
    ['erde', 'mc', 'Wie heisst unser Stern?', 'die Sonne', ['der Polarstern', 'der Mond']],
  ],
  d: [
    ['beobachtung', 'mc', 'Der ganze Mond ist rund und hell. Wie heisst diese Phase?', 'Vollmond', ['Neumond', 'Halbmond']],
    ['beobachtung', 'mc', 'Der Mond ist gar nicht zu sehen. Wie heisst diese Phase?', 'Neumond', ['Vollmond', 'Halbmond']],
    ['beobachtung', 'mc', 'Wie lange dauert es etwa von Vollmond zu Vollmond?', 'ungefähr einen Monat', ['einen Tag', 'ein Jahr']],
    ['beobachtung', 'mc', 'Warum gibt es Jahreszeiten?', 'weil die Erdachse geneigt ist', ['weil die Sonne im Winter weniger brennt', 'weil der Mond die Erde wärmt']],
    ['beobachtung', 'mc', 'Im Winter sind die Tage bei uns ...?', 'kürzer als im Sommer', ['länger als im Sommer', 'genau gleich lang']],
    ['beobachtung', 'mc', 'Im Sommer steht die Mittagssonne ...?', 'höher als im Winter', ['tiefer als im Winter', 'genau gleich hoch']],
    ['beobachtung', 'mc', 'Du beobachtest den Mond jeden Abend. Was verändert sich?', 'seine sichtbare Form', ['seine Farbe zu Grün', 'seine Grösse wie ein Ballon']],
    ['beobachtung', 'mc', 'Der Schatten des Stabs wandert im Lauf des Tages. Warum?', 'weil die Sonne über den Himmel wandert', ['weil der Stab wächst', 'weil der Boden sich bewegt']],
  ],
  e: [
    ['sonnensystem', 'typed', 'Wie viele Planeten hat unser Sonnensystem?', '8'],
    ['sonnensystem', 'mc', 'Was steht im Zentrum unseres Sonnensystems?', 'die Sonne', ['die Erde', 'der Jupiter']],
    ['sonnensystem', 'mc', 'Welcher Planet ist der Sonne am nächsten?', 'Merkur', ['Erde', 'Neptun']],
    ['sonnensystem', 'mc', 'Welcher Planet ist der grösste?', 'Jupiter', ['Merkur', 'Mars']],
    ['sonnensystem', 'mc', 'Auf welchem Planeten leben wir?', 'auf der Erde', ['auf dem Mars', 'auf der Venus']],
    ['sonnensystem', 'mc', 'Welcher Planet ist für seine Ringe bekannt?', 'Saturn', ['Merkur', 'Erde']],
    ['sonnensystem', 'mc', 'Was zeigt ein Modell des Sonnensystems?', 'wie die Planeten um die Sonne kreisen', ['wie das Wetter morgen wird', 'wie tief das Meer ist']],
    ['sonnensystem', 'mc', 'Der rote Planet heisst ...?', 'Mars', ['Venus', 'Saturn']],
    ['sonnensystem', 'mc', 'Was ist näher bei der Erde?', 'der Mond', ['die Sonne']],
  ],
  f: [
    ['weltall', 'mc', 'Wie heisst unsere Galaxie?', 'Milchstrasse', ['Sonnenstrasse', 'Sternenweg']],
    ['weltall', 'mc', 'Was ist eine Galaxie?', 'eine riesige Ansammlung von Sternen', ['ein einzelner heller Stern', 'eine Wolke auf der Erde']],
    ['weltall', 'mc', 'Was ist ein Sternbild?', 'eine Gruppe von Sternen, die eine Figur bildet', ['ein Foto vom Mond', 'ein einzelner Planet']],
    ['weltall', 'mc', 'Welches bekannte Sternbild hilft, den Polarstern zu finden?', 'der Grosse Wagen', ['der Kleine Delfin', 'die Grosse Glocke']],
    ['weltall', 'mc', 'Was hat einen leuchtenden Schweif?', 'ein Komet', ['ein Planet', 'der Polarstern']],
    ['weltall', 'mc', 'Was ist eine Sternschnuppe?', 'ein kleines Teilchen, das in der Lufthülle verglüht', ['ein fallender Stern aus Gas', 'ein startendes Flugzeug']],
    ['weltall', 'mc', 'Der Polarstern zeigt ungefähr nach ...?', 'Norden', ['Süden', 'Westen']],
    ['weltall', 'mc', 'Womit erforschen Fachleute weit entfernte Galaxien?', 'mit grossen Teleskopen', ['mit Ferngläsern für Vögel', 'mit Mikroskopen']],
  ],
};

export function genTask(rng, stufe) {
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
