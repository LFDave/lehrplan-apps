// gen.js — Aufgaben für Demokratielabor. Reine Funktionen ohne DOM;
// Staatskunde ist Faktenwissen und liegt in festen Aufgaben-Pools.
// Die e2e-Suite prüft jede Aufgabe gegen eine unabhängig neu
// aufgeschriebene Antwort-Tabelle. Jede Aufgabe:
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
    ['staatsform', 'mc', 'Wo entstand die Demokratie der Antike?', 'im alten Griechenland (Athen)', ['im alten Rom', 'in Ägypten']],
    ['staatsform', 'mc', 'Demokratie heisst wörtlich ...?', 'Herrschaft des Volkes', ['Herrschaft des Königs', 'Herrschaft der Reichen']],
    ['staatsform', 'mc', 'In einer Diktatur ...?', 'herrscht eine Person oder Gruppe ohne freie Wahlen', ['wählt das Volk frei', 'gibt es keine Regierung']],
    ['staatsform', 'mc', 'In einer Monarchie steht an der Spitze ...?', 'ein König oder eine Königin', ['ein gewähltes Parlament', 'ein Gericht']],
    ['staatsform', 'mc', 'Volkssouveränität bedeutet ...?', 'die höchste Macht liegt beim Volk', ['die Armee bestimmt', 'die Zeitungen bestimmen']],
    ['staatsform', 'mc', 'Wozu begrenzt eine Verfassung die Macht?', 'damit niemand allein zu viel Macht hat', ['damit alles langsamer geht', 'damit niemand wählen muss']],
    ['staatsform', 'typed', 'In welchem Jahr entstand der Schweizer Bundesstaat?', '1848'],
    ['staatsform', 'mc', 'Das Bürgerrecht gibt dir in der Demokratie ...?', 'Rechte wie Wählen und Abstimmen', ['einen Adelstitel', 'ein eigenes Gericht']],
    ['staatsform', 'mc', 'Freie und geheime Wahlen gehören zu ...?', 'einer Demokratie', ['einer Diktatur', 'keiner Staatsform']],
  ],
  b: [
    ['gewalt', 'mc', 'Wer macht auf Bundesebene die Gesetze?', 'das Parlament (National- und Ständerat)', ['der Bundesrat', 'die Gerichte']],
    ['gewalt', 'mc', 'Wer regiert auf Bundesebene?', 'der Bundesrat', ['der Nationalrat allein', 'die Kantonspolizei']],
    ['gewalt', 'mc', 'Wer spricht Recht?', 'die Gerichte', ['das Parlament', 'die Parteien']],
    ['gewalt', 'typed', 'Wie viele Mitglieder hat der Bundesrat?', '7'],
    ['gewalt', 'typed', 'Wie viele Mitglieder hat der Nationalrat?', '200'],
    ['gewalt', 'typed', 'Wie viele Mitglieder hat der Ständerat?', '46'],
    ['gewalt', 'mc', 'Die drei Gewalten heissen ...?', 'Legislative, Exekutive, Judikative', ['Bund, Kanton, Gemeinde', 'Partei, Verband, Verein']],
    ['gewalt', 'mc', 'Die drei Staatsebenen der Schweiz sind ...?', 'Gemeinde, Kanton, Bund', ['Dorf, Stadt, Land', 'Schule, Betrieb, Amt']],
    ['gewalt', 'mc', 'Warum sind die Gewalten getrennt?', 'damit sich Macht gegenseitig kontrolliert', ['damit es mehr Ämter gibt', 'aus Tradition ohne Grund']],
    ['gewalt', 'mc', 'Die Verfassung ist ...?', 'das oberste Regelwerk des Staates', ['ein Parteiprogramm', 'eine Zeitung']],
  ],
  c: [
    ['mitbestimmung', 'mc', 'Mit einer Volksinitiative kann das Volk ...?', 'eine Änderung der Verfassung vorschlagen', ['den Bundesrat entlassen', 'Steuern abschaffen ohne Abstimmung']],
    ['mitbestimmung', 'mc', 'Mit einem Referendum kann das Volk ...?', 'über ein beschlossenes Gesetz abstimmen', ['Richter wählen', 'die Armee befehligen']],
    ['mitbestimmung', 'typed', 'Wie viele Unterschriften braucht eine Volksinitiative?', '100000'],
    ['mitbestimmung', 'typed', 'Wie viele Unterschriften braucht ein fakultatives Referendum?', '50000'],
    ['mitbestimmung', 'mc', 'Föderalismus heisst ...?', 'die Kantone haben eigene Aufgaben und Rechte', ['der Bund entscheidet alles', 'jede Gemeinde ist ein Staat']],
    ['mitbestimmung', 'typed', 'Ab welchem Alter darf man national abstimmen?', '18'],
    ['mitbestimmung', 'typed', 'Seit welchem Jahr gilt das Frauenstimmrecht auf Bundesebene?', '1971'],
    ['mitbestimmung', 'mc', 'Parteien sind ...?', 'Gruppen mit ähnlichen politischen Zielen', ['staatliche Ämter', 'Gerichte']],
    ['mitbestimmung', 'mc', 'Direkte Demokratie bedeutet ...?', 'das Volk stimmt selbst über Sachfragen ab', ['nur das Parlament entscheidet', 'niemand stimmt ab']],
    ['mitbestimmung', 'mc', 'Zu den Pflichten in der Demokratie gehört ...?', 'Gesetze und Regeln einhalten', ['immer gleicher Meinung sein', 'einer Partei beitreten']],
  ],
  d: [
    ['debatte', 'mc', 'Was ist ein Argument?', 'eine Begründung für eine Meinung', ['ein lautes Wort', 'eine Beleidigung']],
    ['debatte', 'mc', 'Eine faire Debatte braucht ...?', 'zuhören und ausreden lassen', ['die lauteste Stimme', 'nur eine Meinung']],
    ['debatte', 'mc', 'Pro- und Kontra-Punkte sammeln hilft ...?', 'eine eigene Position zu begründen', ['den Streit zu vergrössern', 'die Abstimmung zu umgehen']],
    ['debatte', 'mc', 'Verlässliche Informationen kommen ...?', 'aus mehreren geprüften Quellen', ['aus einem einzigen Gerücht', 'nur aus Werbung']],
    ['debatte', 'mc', 'Ein Kompromiss ist ...?', 'eine Lösung, die beide Seiten tragen können', ['ein Sieg einer Seite', 'ein Abbruch des Gesprächs']],
    ['debatte', 'mc', 'Jemand ist anderer Meinung als du. Was gilt?', 'respektvoll bleiben und Argumente austauschen', ['die Person auslachen', 'nicht mehr zuhören']],
    ['debatte', 'mc', 'Eine gute Stellungnahme enthält ...?', 'eine klare Meinung mit Begründungen', ['nur Gefühle ohne Gründe', 'möglichst viele Fremdwörter']],
    ['debatte', 'mc', 'Warum hören Politikerinnen und Politiker Betroffene an?', 'um verschiedene Sichtweisen zu kennen', ['aus Langeweile', 'weil es Pflicht zum Zustimmen gibt']],
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
