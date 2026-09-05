// gen.js — Aufgaben für Zeitreise. Reine Funktionen ohne DOM. Der
// Inhalt liegt in Aufgaben-Pools pro Stufe: feste Einträge für
// Faktenwissen (Uhr, Dauer, Geschichte) und Generatoren für die Reihen
// der Wochentage, Monate und Jahreszeiten (NMG.9.1.a und b), damit
// keine Runde der anderen gleicht. Die e2e-Suite prüft jede Aufgabe
// gegen einen unabhängig neu aufgeschriebenen Löser. Jede Aufgabe:
//   { kind, type: 'typed', expr, answer }          getippte Antwort
//   { kind, type: 'mc', expr, options, answer }    Auswahl (Index)

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

function others(rng, arr, exclude, n) {
  return shuffled(rng, arr.filter((x) => !exclude.includes(x))).slice(0, n);
}

// Zugriff im Kreis: nach dem Sonntag kommt der Montag, nach dem
// Dezember der Januar, nach dem Winter der Frühling.
function cyc(arr, i) {
  return arr[((i % arr.length) + arr.length) % arr.length];
}

/* ── Reihen (NMG.9.1.a) und Jahreskreis (NMG.9.1.b) ───────────── */

export const DAYS = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
export const MONTHS = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

// Jahreskreis wie im Merkblatt: die meteorologischen Jahreszeiten der
// Nordhalbkugel, je drei volle Monate. Die Aufgaben sagen darum
// «bei uns»; südlich des Äquators liegt der Kreis ein halbes Jahr
// versetzt.
export const SEASONS = [
  { name: 'Frühling', months: ['März', 'April', 'Mai'] },
  { name: 'Sommer', months: ['Juni', 'Juli', 'August'] },
  { name: 'Herbst', months: ['September', 'Oktober', 'November'] },
  { name: 'Winter', months: ['Dezember', 'Januar', 'Februar'] },
];

const DAY = { kind: 'wochentag', items: DAYS, noun: 'Tag', group: 'den Wochentagen', foreign: MONTHS };
const MONTH = { kind: 'monat', items: MONTHS, noun: 'Monat', group: 'den Monaten', foreign: DAYS };

function typed(kind, expr, answer) {
  return { kind, type: 'typed', expr, answer };
}

function choice(rng, kind, expr, correct, wrongs) {
  const options = shuffled(rng, [correct, ...wrongs]);
  return { kind, type: 'mc', expr, options, answer: options.indexOf(correct) };
}

// Je zur Hälfte getippt (Schreiben der Namen) oder als Auswahl.
function typedOrChoice(rng, kind, expr, correct, pool, exclude) {
  if (rng() < 0.5) return typed(kind, expr, correct);
  return choice(rng, kind, expr, correct, others(rng, pool, [correct, ...exclude], 2));
}

// Vorgänger und Nachfolger, im Kreis.
function neighbour(rng, spec, dir) {
  const i = Math.floor(rng() * spec.items.length);
  const from = spec.items[i];
  const correct = cyc(spec.items, i + dir);
  const expr = `Welcher ${spec.noun} kommt ${dir > 0 ? 'nach' : 'vor'} ${from}?`;
  return typedOrChoice(rng, spec.kind, expr, correct, spec.items, [from]);
}

// Was liegt dazwischen: drei aufeinanderfolgende Einträge, ohne Umbruch.
function between(rng, spec) {
  const i = Math.floor(rng() * (spec.items.length - 2));
  const [a, b, c] = spec.items.slice(i, i + 3);
  const expr = `Welcher ${spec.noun} liegt zwischen ${a} und ${c}?`;
  return choice(rng, spec.kind, expr, b, others(rng, spec.items, [a, b, c], 2));
}

// Lücke in einer Viererreihe, ohne Umbruch.
function gap(rng, spec) {
  const i = Math.floor(rng() * (spec.items.length - 3));
  const seq = spec.items.slice(i, i + 4);
  const g = Math.floor(rng() * 4);
  const shown = seq.map((x, k) => (k === g ? '?' : x)).join(', ');
  const expr = `${shown}. Welcher ${spec.noun} fehlt?`;
  return typedOrChoice(rng, spec.kind, expr, seq[g], spec.items, seq);
}

// Was gehört nicht dazu: zwei echte Einträge und ein Fremdling.
function intruder(rng, spec) {
  const correct = pick(rng, spec.foreign);
  return choice(rng, spec.kind, `Was gehört nicht zu ${spec.group}?`, correct, others(rng, spec.items, [], 2));
}

// Position im Jahr, nur für Monate.
function monthAt(rng) {
  const n = 1 + Math.floor(rng() * 12);
  return typedOrChoice(rng, 'monat', `Welcher Monat ist der ${n}. Monat im Jahr?`, MONTHS[n - 1], MONTHS, []);
}

function positionOf(rng) {
  const n = 1 + Math.floor(rng() * 12);
  return typed('monat', `An welcher Stelle im Jahr steht der ${MONTHS[n - 1]}? (1 bis 12)`, String(n));
}

// Jahreszeiten: Reihenfolge im Kreis.
function seasonNeighbour(rng, dir) {
  const i = Math.floor(rng() * SEASONS.length);
  const from = SEASONS[i].name;
  const correct = cyc(SEASONS, i + dir).name;
  const names = SEASONS.map((s) => s.name);
  const expr = `Welche Jahreszeit kommt ${dir > 0 ? 'nach' : 'vor'} dem ${from}?`;
  return choice(rng, 'jahreszeit', expr, correct, others(rng, names, [from, correct], 2));
}

// Jahreskreis: Monate und Jahreszeiten.
function seasonOfMonth(rng) {
  const s = pick(rng, SEASONS);
  const m = pick(rng, s.months);
  const names = SEASONS.map((x) => x.name);
  return choice(rng, 'jahreskreis', `Zu welcher Jahreszeit gehört bei uns der ${m}?`, s.name, others(rng, names, [s.name], 2));
}

function monthsOfSeason(rng) {
  const s = pick(rng, SEASONS);
  const label = (x) => x.months.join(', ');
  const wrongs = others(rng, SEASONS.filter((x) => x !== s), [], 2).map(label);
  return choice(rng, 'jahreskreis', `Welche drei Monate gehören bei uns zum ${s.name}?`, label(s), wrongs);
}

function oddMonth(rng) {
  const s = pick(rng, SEASONS);
  const other = pick(rng, SEASONS.filter((x) => x !== s));
  const correct = pick(rng, other.months);
  return choice(rng, 'jahreskreis', `Welcher Monat gehört bei uns nicht zum ${s.name}?`, correct, others(rng, s.months, [], 2));
}

/* ── Pools ────────────────────────────────────────────────────── */

// Pool-Einträge: [kind, 'mc', expr, richtig, [falsch...]],
// [kind, 'typed', expr, antwort] oder [kind, 'gen', fn(rng)].
export const POOLS = {
  a: [
    ['zeitwort', 'mc', 'Was war zuerst: gestern, heute oder morgen?', 'gestern', ['heute', 'morgen']],
    ['zeitwort', 'mc', 'Was kommt als Letztes: gestern, heute oder morgen?', 'morgen', ['gestern', 'heute']],
    ['wochentag', 'typed', 'Wie viele Tage hat eine Woche?', '7'],
    ['wochentag', 'gen', (rng) => neighbour(rng, DAY, 1)],
    ['wochentag', 'gen', (rng) => neighbour(rng, DAY, -1)],
    ['wochentag', 'gen', (rng) => between(rng, DAY)],
    ['wochentag', 'gen', (rng) => gap(rng, DAY)],
    ['wochentag', 'gen', (rng) => intruder(rng, DAY)],
    ['monat', 'typed', 'Wie viele Monate hat ein Jahr?', '12'],
    ['monat', 'gen', (rng) => neighbour(rng, MONTH, 1)],
    ['monat', 'gen', (rng) => neighbour(rng, MONTH, -1)],
    ['monat', 'gen', (rng) => between(rng, MONTH)],
    ['monat', 'gen', (rng) => gap(rng, MONTH)],
    ['monat', 'gen', (rng) => intruder(rng, MONTH)],
    ['monat', 'gen', monthAt],
    ['monat', 'gen', positionOf],
  ],
  b: [
    ['jahreszeit', 'gen', (rng) => seasonNeighbour(rng, 1)],
    ['jahreszeit', 'gen', (rng) => seasonNeighbour(rng, -1)],
    ['jahreszeit', 'mc', 'In welcher Jahreszeit fällt am ehesten Schnee?', 'Winter', ['Sommer', 'Frühling']],
    ['jahreszeit', 'typed', 'Wie viele Jahreszeiten hat ein Jahr?', '4'],
    ['jahreskreis', 'gen', seasonOfMonth],
    ['jahreskreis', 'gen', monthsOfSeason],
    ['jahreskreis', 'gen', oddMonth],
    ['jahreskreis', 'typed', 'Wie viele Monate hat eine Jahreszeit?', '3'],
    ['uhr', 'typed', 'Der kleine Zeiger zeigt auf die 3, der grosse auf die 12. Wie spät ist es? (? Uhr)', '3'],
    ['uhr', 'typed', 'Der kleine Zeiger zeigt auf die 8, der grosse auf die 12. Wie spät ist es? (? Uhr)', '8'],
    ['uhr', 'typed', 'Wie viele Stunden hat ein ganzer Tag?', '24'],
    ['uhr', 'typed', 'Wie viele Minuten hat eine Stunde?', '60'],
    ['uhr', 'typed', 'Wie viele Sekunden hat eine Minute?', '60'],
  ],
  c: [
    ['abfolge', 'mc', 'Zähneputzen: Was kommt zuerst?', 'Zahnpasta auf die Bürste geben', ['den Mund ausspülen', 'die Bürste versorgen']],
    ['abfolge', 'mc', 'Kuchen backen: Was kommt zuerst?', 'den Teig mischen', ['den Kuchen backen', 'den Kuchen essen']],
    ['abfolge', 'mc', 'Einen Brief schicken: Was kommt zuletzt?', 'den Brief einwerfen', ['den Brief schreiben', 'das Couvert zukleben']],
    ['abfolge', 'mc', 'Schuhe anziehen: Was kommt zuerst?', 'in die Schuhe schlüpfen', ['die Schuhe binden', 'losrennen']],
    ['dauer', 'mc', 'Was dauert etwa eine Minute?', 'einmal das ABC aufsagen', ['eine Nacht schlafen', 'ein ganzer Schultag']],
    ['dauer', 'mc', 'Was dauert etwa eine Stunde?', 'eine Schullektion mit Pause', ['einmal blinzeln', 'eine ganze Woche']],
    ['dauer', 'mc', 'Was dauert länger?', 'eine Stunde', ['eine Minute']],
    ['dauer', 'mc', 'Was ist kürzer?', 'eine Sekunde', ['eine Minute']],
    ['dauer', 'mc', 'Was dauert etwa eine Sekunde?', 'einmal klatschen', ['ein Mittagessen', 'ein Fussballspiel']],
  ],
  d: [
    ['tagesstruktur', 'mc', 'Die Sonne geht jeden Tag auf. Ist das immer gleich oder verschieden?', 'immer gleich', ['je nach Tag verschieden']],
    ['tagesstruktur', 'mc', 'Am Mittwoch hast du Turnen. Ist das an allen Tagen gleich?', 'je nach Tag verschieden', ['immer gleich']],
    ['tagesstruktur', 'mc', 'Nach dem Tag kommt die Nacht. Ist das immer gleich oder verschieden?', 'immer gleich', ['je nach Tag verschieden']],
    ['tagesstruktur', 'mc', 'Was du zum Zmittag isst: Ist das jeden Tag gleich?', 'je nach Tag verschieden', ['immer gleich']],
    ['tagesstruktur', 'mc', 'Zuerst Morgen, dann Mittag, dann Abend. Ist diese Reihenfolge immer gleich?', 'immer gleich', ['je nach Tag verschieden']],
    ['tagesstruktur', 'mc', 'Ob du am Nachmittag Schule hast: Ist das jeden Tag gleich?', 'je nach Tag verschieden', ['immer gleich']],
    ['tagesstruktur', 'mc', 'Was kommt in jedem Tageslauf vor?', 'aufwachen', ['eine Geburtstagsparty', 'ein Ausflug']],
    ['tagesstruktur', 'mc', 'Was gehört nicht zu jedem Tag?', 'ein Zoobesuch', ['schlafen', 'essen']],
  ],
  e: [
    ['zeitstrahl', 'mc', 'Was liegt auf dem Zeitstrahl weiter links (früher): 1950 oder 1990?', '1950', ['1990']],
    ['zeitstrahl', 'mc', 'Was liegt auf dem Zeitstrahl weiter rechts (später): 1800 oder 1900?', '1900', ['1800']],
    ['zeitstrahl', 'mc', 'Deine Grossmutter wurde 1960 geboren, deine Mutter 1990. Wer kommt auf dem Zeitstrahl zuerst?', 'die Grossmutter', ['die Mutter']],
    ['zeitstrahl', 'typed', 'Wie viele Jahre liegen zwischen 1950 und 1990?', '40'],
    ['zeitstrahl', 'typed', 'Wie viele Jahre liegen zwischen 1900 und 2000?', '100'],
    ['dauerRechnen', 'typed', 'Die Pause beginnt um 10:00 Uhr und endet um 10:20 Uhr. Wie viele Minuten dauert sie?', '20'],
    ['dauerRechnen', 'typed', 'Der Film beginnt um 14:00 Uhr und endet um 15:30 Uhr. Wie viele Minuten dauert er?', '90'],
    ['dauerRechnen', 'typed', 'Du schläfst von 20:00 Uhr bis 06:00 Uhr. Wie viele Stunden sind das?', '10'],
  ],
  f: [
    ['generation', 'mc', 'Wer ist in der Regel am ältesten?', 'die Grossmutter', ['die Mutter', 'das Kind']],
    ['generation', 'mc', 'Wer wurde zuerst geboren?', 'der Urgrossvater', ['der Grossvater', 'der Vater']],
    ['generation', 'typed', 'Die Mutter deiner Mutter ist deine ...?', 'Grossmutter'],
    ['generation', 'typed', 'Der Vater deines Vaters ist dein ...?', 'Grossvater'],
    ['generation', 'mc', 'Kind, Eltern, Grosseltern: Wie viele Generationen sind das?', '3', ['2', '4']],
    ['generation', 'mc', 'Wer kommt auf dem Familien-Zeitstrahl zuletzt?', 'das Kind', ['die Grossmutter', 'die Mutter']],
    ['generation', 'mc', 'Deine Eltern waren einmal so alt wie du. Stimmt das?', 'Ja', ['Nein']],
    ['generation', 'mc', 'Wer hat die längste Lebensgeschichte hinter sich?', 'die Urgrossmutter', ['die Mutter', 'das Kind']],
  ],
  g: [
    ['epoche', 'mc', 'Welche Epoche kam zuerst?', 'die Steinzeit', ['die Antike', 'das Mittelalter']],
    ['epoche', 'mc', 'Welche Epoche kam direkt nach der Antike?', 'das Mittelalter', ['die Steinzeit', 'die Neuzeit']],
    ['epoche', 'mc', 'Welche Epoche kam direkt nach dem Mittelalter?', 'die Neuzeit', ['die Antike', 'die Steinzeit']],
    ['epoche', 'mc', 'In welcher Epoche leben wir heute?', 'in der Neuzeit', ['im Mittelalter', 'in der Steinzeit']],
    ['epoche', 'mc', 'Ritter und Burgen gehören vor allem zu welcher Epoche?', 'zum Mittelalter', ['zur Steinzeit', 'zur Neuzeit']],
    ['epoche', 'mc', 'Womit jagten die Menschen in der Steinzeit?', 'mit Speer und Pfeilbogen', ['mit dem Gewehr', 'mit dem Auto']],
    ['epoche', 'mc', 'Die alten Römer und Griechen gehören zu welcher Epoche?', 'zur Antike', ['zum Mittelalter', 'zur Steinzeit']],
    ['epoche', 'mc', 'Was ist die richtige Reihenfolge?', 'Steinzeit, Antike, Mittelalter, Neuzeit', ['Antike, Steinzeit, Neuzeit, Mittelalter', 'Mittelalter, Steinzeit, Antike, Neuzeit']],
  ],
  h: [
    ['ereignis', 'mc', 'Was war früher?', 'die Erfindung der Schrift', ['der Bundesbrief von 1291']],
    ['ereignis', 'mc', 'Was war früher: die Höhlenmalerei der Steinzeit oder der Buchdruck?', 'die Höhlenmalerei', ['der Buchdruck']],
    ['ereignis', 'mc', 'Der Bundesbrief stammt von 1291. Welche Epoche war das?', 'das Mittelalter', ['die Antike', 'die Steinzeit']],
    ['jahrhundert', 'typed', 'Der Bundesbrief stammt von 1291. In welchem Jahrhundert war das? (?. Jahrhundert)', '13'],
    ['jahrhundert', 'typed', 'Der Schweizer Bundesstaat entstand 1848. In welchem Jahrhundert war das? (?. Jahrhundert)', '19'],
    ['jahrhundert', 'typed', 'Der Buchdruck wurde um 1450 erfunden. In welchem Jahrhundert war das? (?. Jahrhundert)', '15'],
    ['jahrhundert', 'typed', 'Wie viele Jahre hat ein Jahrhundert?', '100'],
    ['jahrhundert', 'typed', 'Wie viele Jahre hat ein Jahrzehnt?', '10'],
  ],
};

function build(rng, entry) {
  const [kind, type, expr, correctOrAnswer, wrongs] = entry;
  if (type === 'gen') return expr(rng);
  if (type === 'typed') return typed(kind, expr, correctOrAnswer);
  return choice(rng, kind, expr, correctOrAnswer, wrongs);
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
