// gen.js — Aufgaben für Weltatlas. Reine Funktionen ohne DOM. Die
// Kontinent- und Hauptstadt-Zuordnungen werden aus festen Tabellen
// generiert und von der e2e-Suite mit einer eigenen, neu
// aufgeschriebenen Tabelle unabhängig geprüft; alles andere liegt in
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

// Zuordnungs-Tabellen (gesichertes Grundwissen).
export const LAENDER = [
  ['Ägypten', 'Afrika'], ['Kenia', 'Afrika'], ['Brasilien', 'Südamerika'],
  ['Argentinien', 'Südamerika'], ['China', 'Asien'], ['Indien', 'Asien'],
  ['Japan', 'Asien'], ['Frankreich', 'Europa'], ['Spanien', 'Europa'],
  ['Kanada', 'Nordamerika'], ['Mexiko', 'Nordamerika'], ['Australien', 'Ozeanien'],
];
export const KONTINENTE = ['Afrika', 'Südamerika', 'Asien', 'Europa', 'Nordamerika', 'Ozeanien'];
export const HAUPTSTAEDTE = [
  ['der Schweiz', 'Bern'], ['von Frankreich', 'Paris'], ['von Italien', 'Rom'],
  ['von Deutschland', 'Berlin'], ['von Österreich', 'Wien'], ['von Spanien', 'Madrid'],
];

// Pool-Einträge: [kind, 'mc', expr, richtig, [falsch...]] oder
// [kind, 'typed', expr, antwort].
export const POOLS = {
  a: [
    ['ort', 'mc', 'Welcher Ozean liegt zwischen Europa und Amerika?', 'der Atlantik', ['der Pazifik', 'der Indische Ozean']],
    ['ort', 'mc', 'Welcher Ozean ist der grösste?', 'der Pazifik', ['der Atlantik', 'der Indische Ozean']],
    ['ort', 'mc', 'Der längste Fluss Afrikas ist ...?', 'der Nil', ['der Amazonas', 'der Rhein']],
    ['ort', 'mc', 'Der Amazonas fliesst durch ...?', 'Südamerika', ['Afrika', 'Asien']],
    ['ort', 'mc', 'Der Rhein mündet in ...?', 'die Nordsee', ['das Mittelmeer', 'den Atlantik']],
    ['ort', 'mc', 'Das höchste Gebirge der Erde ist ...?', 'der Himalaja', ['die Alpen', 'die Anden']],
    ['ort', 'mc', 'Die Anden liegen in ...?', 'Südamerika', ['Europa', 'Australien']],
    ['ort', 'mc', 'Wie viele Kontinente zählt man üblicherweise?', 'sieben', ['fünf', 'neun']],
  ],
  b: [
    ['lage', 'mc', 'Ein Land ohne Zugang zum Meer heisst ...?', 'Binnenland', ['Inselstaat', 'Küstenland']],
    ['lage', 'mc', 'Die Schweiz liegt ...?', 'im Alpenraum, ohne Meeranstoss', ['am Atlantik', 'in den Tropen']],
    ['lage', 'mc', 'Ägypten liegt grösstenteils ...?', 'in einem trockenen (ariden) Gebiet', ['im Regenwald', 'in der Polarzone']],
    ['lage', 'mc', 'Norwegen liegt ...?', 'am Meer im Norden Europas', ['mitten in Afrika', 'am Äquator']],
    ['lage', 'mc', 'Japan ist ...?', 'ein Inselstaat', ['ein Binnenland', 'eine Wüste']],
    ['lage', 'mc', 'Das Mittelland der Schweiz liegt ...?', 'zwischen Jura und Alpen', ['am Meer', 'auf einer Insel']],
    ['lage', 'mc', '«Am Meer gelegen» bedeutet für ein Land oft ...?', 'Häfen und Handel über das Wasser', ['keinen Handel', 'nur Bergbau']],
    ['lage', 'mc', 'Eine Oase liegt ...?', 'an einer Wasserstelle in der Wüste', ['im Packeis', 'im Hochgebirge']],
  ],
  c: [
    ['raster', 'mc', 'Der Äquator teilt die Erde in ...?', 'Nord- und Südhalbkugel', ['Ost- und Westeuropa', 'Tag und Nacht']],
    ['raster', 'mc', 'Die Linien von Pol zu Pol heissen ...?', 'Längengrade (Meridiane)', ['Breitengrade', 'Höhenkurven']],
    ['raster', 'mc', 'Die Breitengrade verlaufen ...?', 'parallel zum Äquator', ['von Pol zu Pol', 'kreuz und quer']],
    ['raster', 'mc', 'Auf welcher Halbkugel liegt die Schweiz?', 'auf der Nordhalbkugel', ['auf der Südhalbkugel']],
    ['raster', 'mc', 'Der Nullmeridian läuft durch ...?', 'Greenwich bei London', ['Bern', 'New York']],
    ['raster', 'mc', 'Am Äquator wächst häufig ...?', 'tropischer Regenwald', ['Tundra', 'Nadelwald']],
    ['raster', 'mc', 'Die baumlose Kältezone im hohen Norden heisst ...?', 'Tundra', ['Savanne', 'Steppe']],
    ['raster', 'mc', 'Erdbeben und Vulkane häufen sich ...?', 'an den Plattengrenzen', ['in der Mitte der Platten', 'nur am Äquator']],
    ['raster', 'mc', 'Die Erdkruste besteht aus ...?', 'grossen Platten, die sich langsam bewegen', ['einem einzigen festen Stück', 'flüssigem Wasser']],
    ['raster', 'mc', 'Mit dem Gradnetz kann man ...?', 'jeden Ort der Erde genau angeben', ['das Wetter vorhersagen', 'die Zeit anhalten']],
  ],
};

// Kontinent- und Hauptstadt-Zuordnungen (a) werden generiert.
export function genTask(rng, stufe) {
  if (stufe.id === 'a' && rng() < 0.5) {
    if (rng() < 0.6) {
      const [land, kontinent] = pick(rng, LAENDER);
      const wrong = shuffled(rng, KONTINENTE.filter((k) => k !== kontinent)).slice(0, 2);
      return {
        kind: 'ort', type: 'mc',
        expr: `Auf welchem Kontinent liegt ${land}?`,
        ...buildMc(rng, kontinent, wrong),
      };
    }
    const [land, stadt] = pick(rng, HAUPTSTAEDTE);
    return {
      kind: 'ort', type: 'typed',
      expr: `Wie heisst die Hauptstadt ${land}?`,
      answer: stadt,
    };
  }
  const entry = pick(rng, POOLS[stufe.id]);
  const [kind, type, expr, correctOrAnswer, wrongs] = entry;
  if (type === 'typed') return { kind, type, expr, answer: correctOrAnswer };
  return { kind, type, expr, ...buildMc(rng, correctOrAnswer, wrongs) };
}

function buildMc(rng, correct, wrongs) {
  const options = shuffled(rng, [correct, ...wrongs]);
  return { options, answer: options.indexOf(correct) };
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
