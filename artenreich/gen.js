// gen.js — Aufgaben für Artenreich. Reine Funktionen ohne DOM. Die
// Zuordnungen (Laub-/Nadelbaum, Wild-/Nutz-/Heimtier) werden aus
// festen Merkmal-Tabellen generiert und von der e2e-Suite mit einer
// eigenen, neu aufgeschriebenen Tabelle unabhängig geprüft; alles
// andere liegt in festen Aufgaben-Pools. Jede Aufgabe:
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
export const BAEUME = [
  ['die Buche', 'ein Laubbaum'], ['die Eiche', 'ein Laubbaum'],
  ['der Ahorn', 'ein Laubbaum'], ['die Birke', 'ein Laubbaum'],
  ['die Linde', 'ein Laubbaum'], ['die Tanne', 'ein Nadelbaum'],
  ['die Fichte', 'ein Nadelbaum'], ['die Föhre', 'ein Nadelbaum'],
  ['die Lärche', 'ein Nadelbaum'],
];
export const TIERE = [
  ['der Fuchs', 'ein Wildtier'], ['das Reh', 'ein Wildtier'],
  ['der Igel', 'ein Wildtier'], ['das Eichhörnchen', 'ein Wildtier'],
  ['die Kuh', 'ein Nutztier'], ['das Huhn', 'ein Nutztier'],
  ['das Schaf', 'ein Nutztier'], ['das Schwein', 'ein Nutztier'],
  ['die Katze', 'ein Heimtier'], ['der Hund', 'ein Heimtier'],
  ['das Meerschweinchen', 'ein Heimtier'], ['der Wellensittich', 'ein Heimtier'],
];
const BAUM_KATEGORIEN = ['ein Laubbaum', 'ein Nadelbaum'];
const TIER_KATEGORIEN = ['ein Wildtier', 'ein Nutztier', 'ein Heimtier'];

// Pool-Einträge: [kind, 'mc', expr, richtig, [falsch...]] oder
// [kind, 'typed', expr, antwort].
export const POOLS = {
  a: [
    ['merkmal', 'mc', 'Vögel haben ...?', 'ein Gefieder aus Federn', ['ein Fell', 'Hornschuppen']],
    ['merkmal', 'mc', 'Fische atmen mit ...?', 'Kiemen', ['einer Lunge', 'der Haut allein']],
    ['merkmal', 'mc', 'Reptilien haben ...?', 'eine Haut aus Hornschuppen', ['Federn', 'ein dichtes Fell']],
    ['merkmal', 'mc', 'Säugetiere säugen ...?', 'ihre Jungen mit Milch', ['ihre Jungen mit Nektar', 'gar nie']],
    ['merkmal', 'mc', 'Insekten haben ...?', 'sechs Beine', ['acht Beine', 'vier Beine']],
    ['merkmal', 'mc', 'Amphibien wie der Frosch leben ...?', 'im Wasser und an Land', ['nur in der Luft', 'nur im Sand']],
    ['merkmal', 'mc', 'Die meisten Vögel können ...?', 'fliegen', ['unter Wasser atmen', 'Milch geben']],
    ['merkmal', 'mc', 'Fische leben ...?', 'im Wasser', ['auf Bäumen', 'unter der Erde']],
  ],
  c: [
    ['vogel', 'mc', 'Die Amsel gehört zu den ...?', 'Singvögeln', ['Greifvögeln', 'Wasservögeln']],
    ['vogel', 'mc', 'Der Mäusebussard ist ein ...?', 'Greifvogel', ['Singvogel', 'Wasservogel']],
    ['vogel', 'mc', 'Die Stockente ist ein ...?', 'Wasservogel', ['Greifvogel', 'Singvogel']],
    ['vogel', 'mc', 'Was machen Zugvögel im Herbst?', 'sie fliegen in den Süden', ['sie halten Winterschlaf', 'sie verlieren alle Federn']],
    ['vogel', 'mc', 'Was machen Standvögel im Winter?', 'sie bleiben das ganze Jahr hier', ['sie fliegen nach Afrika', 'sie schlafen bis im Mai']],
    ['vogel', 'mc', 'Die Rauchschwalbe ist ein ...?', 'Zugvogel', ['Standvogel']],
    ['vogel', 'mc', 'Die Kohlmeise ist ein ...?', 'Standvogel', ['Zugvogel']],
    ['vogel', 'mc', 'Womit bestimmst du einen unbekannten Vogel?', 'mit einem Bestimmungsbuch', ['mit einem Massstab', 'mit einem Kompass']],
    ['vogel', 'mc', 'Wozu dient ein Feldstecher?', 'Vögel aus der Distanz gross zu sehen', ['Vögel anzulocken', 'Nester zu bauen']],
    ['vogel', 'mc', 'Die Eule jagt vor allem ...?', 'in der Nacht', ['am Mittag', 'nie']],
  ],
  d: [
    ['anpassung', 'mc', 'Das Fell des Maulwurfs ...?', 'passt zum Leben in Grabgängen', ['leuchtet in der Nacht', 'schützt vor Sonnenbrand']],
    ['anpassung', 'mc', 'Die Schwimmhäute der Ente ...?', 'helfen beim Schwimmen', ['wärmen die Eier', 'dienen zum Graben']],
    ['anpassung', 'mc', 'Der Specht hat einen kräftigen Schnabel, um ...?', 'in Holz zu hämmern', ['Wasser zu filtern', 'Nüsse zu tragen']],
    ['anpassung', 'mc', 'Der Igel schützt sich mit ...?', 'seinen Stacheln', ['lautem Bellen', 'seinem Gift']],
    ['anpassung', 'mc', 'Das weisse Winterfell des Schneehasen ...?', 'tarnt ihn im Schnee', ['macht ihn schneller', 'wärmt die Jungen']],
    ['anpassung', 'mc', 'Fische sind stromlinienförmig, damit ...?', 'sie leicht durchs Wasser gleiten', ['sie besser hören', 'sie bunter sind']],
    ['anpassung', 'mc', 'Die langen Wurzeln mancher Pflanzen ...?', 'holen Wasser aus der Tiefe', ['fangen Insekten', 'tragen die Samen fort']],
    ['anpassung', 'mc', 'Der Biber hat einen flachen Schwanz, der ...?', 'beim Schwimmen steuert', ['Honig sammelt', 'Nüsse knackt']],
  ],
  e: [
    ['kriterium', 'mc', 'Welches Merkmal hilft beim Ordnen von Bäumen?', 'die Blattform', ['die Anzahl Vögel im Baum', 'das Wetter']],
    ['kriterium', 'mc', 'Was unterscheidet Gehölze von Kräutern?', 'Gehölze haben verholzte Stängel', ['Gehölze haben Wurzeln', 'Kräuter sind immer grösser']],
    ['kriterium', 'mc', 'Wozu dient ein Ordnungssystem?', 'Lebewesen nach Merkmalen zu gruppieren', ['Lebewesen zu zählen', 'Lebewesen zu füttern']],
    ['kriterium', 'mc', 'Die Blüte dient der Pflanze ...?', 'zur Fortpflanzung', ['zum Atmen', 'als Wurzel']],
    ['kriterium', 'mc', 'Amsel, Meise und Fink bilden eine Gruppe, weil ...?', 'sie Singvögel sind', ['sie gleich gross sind', 'sie im Wasser leben']],
    ['kriterium', 'mc', 'Ein gutes Kriterium zum Ordnen ist ...?', 'ein Merkmal, das man klar erkennt', ['die Lieblingsfarbe', 'der Zufall']],
    ['kriterium', 'mc', 'Ein anatomisches Merkmal der Säugetiere ist ...?', 'das Fell', ['das Gefieder', 'die Hornschuppen']],
    ['kriterium', 'mc', 'Pilze sind ...?', 'weder Pflanzen noch Tiere', ['Pflanzen', 'Tiere']],
  ],
  f: [
    ['system', 'mc', 'Zu welcher Insektengruppe gehört der Marienkäfer?', 'zu den Käfern', ['zu den Fliegen', 'zu den Wespen']],
    ['system', 'mc', 'Das Tagpfauenauge gehört zu den ...?', 'Schmetterlingen', ['Libellen', 'Ameisen']],
    ['system', 'mc', 'Ist die Spinne ein Insekt?', 'Nein, sie hat acht Beine', ['Ja, sie hat sechs Beine']],
    ['system', 'mc', 'Die Heuschrecke erkennt man an ...?', 'den kräftigen Sprungbeinen', ['dem Panzer wie beim Käfer', 'den Schuppenflügeln']],
    ['system', 'mc', 'Libellen jagen ...?', 'im Flug über Wasser und Wiese', ['unter der Erde', 'im Dunkeln im Keller']],
    ['system', 'mc', 'Ist der Löwenzahn krautig oder holzig?', 'krautig', ['holzig']],
    ['system', 'mc', 'Ist der Haselstrauch krautig oder holzig?', 'holzig', ['krautig']],
    ['system', 'mc', 'Ameisen leben ...?', 'in Staaten mit vielen Tieren', ['immer allein', 'nur im Wasser']],
    ['system', 'mc', 'Die Biene gehört wie die Wespe zu den ...?', 'Hautflüglern', ['Käfern', 'Schmetterlingen']],
  ],
};

// Die Zuordnungen (b) werden aus den Tabellen generiert.
export function genTask(rng, stufe) {
  if (stufe.id === 'b') {
    if (rng() < 0.45) {
      const [baum, kategorie] = pick(rng, BAEUME);
      return {
        kind: 'zuordnung', type: 'mc',
        expr: `Ist ${baum} ein Laubbaum oder ein Nadelbaum?`,
        ...buildMc(rng, kategorie, BAUM_KATEGORIEN.filter((k) => k !== kategorie)),
      };
    }
    const [tier, kategorie] = pick(rng, TIERE);
    return {
      kind: 'zuordnung', type: 'mc',
      expr: `Ist ${tier} ein Wildtier, ein Nutztier oder ein Heimtier?`,
      ...buildMc(rng, kategorie, TIER_KATEGORIEN.filter((k) => k !== kategorie)),
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
