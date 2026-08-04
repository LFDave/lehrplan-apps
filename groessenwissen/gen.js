// gen.js — Aufgaben-Generatoren für Grössenwissen. Reine Funktionen
// ohne DOM; die e2e-Suite importiert sie direkt und prüft jede Aufgabe
// mit einem eigenen Orakel nach (eigene Umrechnungstabelle, neu
// aufgeschriebene Begriff-Tabellen). Jede Aufgabe:
//   { type: 'typed', expr, answer }               getippte Antwort
//   { type: 'mc', expr, options, answer }         Auswahl (Index)

export function formatNumber(n, decimals = 0) {
  const fixed = Math.abs(n).toFixed(decimals);
  const [intPart, frac] = fixed.split('.');
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  const sign = n < 0 ? '-' : '';
  return sign + grouped + (frac ? '.' + frac : '');
}

function randInt(rng, min, max) {
  return min + Math.floor(rng() * (max - min + 1));
}

function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}

function typed(expr, answer) {
  return { type: 'typed', expr, answer };
}

function shuffled(rng, arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function mc(rng, expr, correct, wrongs) {
  const options = shuffled(rng, [correct, ...wrongs]);
  return { type: 'mc', expr, options, answer: options.indexOf(correct) };
}

/* ── Begriff-Tabellen (auch fürs Orakel exportiert) ──────────────── */

export const GW_QA = {
  oppositeMc: [
    ['Was ist das Gegenteil von schwer?', 'leicht', ['dünn', 'kurz']],
    ['Was ist das Gegenteil von leicht?', 'schwer', ['breit', 'gross']],
    ['Was ist das Gegenteil von lang?', 'kurz', ['schmal', 'leicht']],
    ['Was ist das Gegenteil von kurz?', 'lang', ['dick', 'schwer']],
    ['Was ist das Gegenteil von schnell?', 'langsam', ['leise', 'klein']],
    ['Was ist das Gegenteil von langsam?', 'schnell', ['laut', 'gross']],
    ['Was ist das Gegenteil von breit?', 'schmal', ['kurz', 'leicht']],
    ['Was ist das Gegenteil von schmal?', 'breit', ['lang', 'schwer']],
    ['Was ist das Gegenteil von dick?', 'dünn', ['klein', 'kurz']],
    ['Was ist das Gegenteil von dünn?', 'dick', ['gross', 'lang']],
    ['Was ist das Gegenteil von gross?', 'klein', ['schmal', 'dünn']],
    ['Was ist das Gegenteil von vorher?', 'nachher', ['niemals', 'oben']],
  ],
  abbrevMc: [
    ['Wofür steht die Abkürzung cm?', 'Zentimeter', ['Meter', 'Rappen']],
    ['Wofür steht die Abkürzung m?', 'Meter', ['Minute', 'Zentimeter']],
    ['Wofür steht die Abkürzung Fr.?', 'Franken', ['Rappen', 'Freitag']],
    ['Wofür steht die Abkürzung Rp.?', 'Rappen', ['Franken', 'Rezept']],
    ['Welche Abkürzung hat der Zentimeter?', 'cm', ['m', 'Rp.']],
    ['Welche Abkürzung hat der Franken?', 'Fr.', ['Rp.', 'F.']],
    ['Welche Einheit misst die Zeit?', 'Minuten', ['Zentimeter', 'Rappen']],
    ['Welche Einheit misst die Länge?', 'Meter', ['Franken', 'Minuten']],
  ],
  referenceMc: [
    ['Was wiegt etwa 1 kg?', 'eine Packung Mehl', ['ein Auto', 'eine Feder']],
    ['Was wiegt etwa 100 g?', 'eine Tafel Schokolade', ['ein Fahrrad', 'ein Reiskorn']],
    ['Was ist etwa 1 km lang?', 'ein Spaziergang von 12 Minuten ist länger', ['ein Bleistift', 'ein Fussballfeld ist 10 km lang']],
    ['Was fasst etwa 1 l?', 'eine grosse Milchpackung', ['ein Fingerhut', 'eine Badewanne']],
    ['Was fasst etwa 1 dl?', 'ein kleines Glas', ['ein Eimer', 'ein Schwimmbecken']],
    ['Wie lang ist etwa 1 dm?', 'eine Handbreite', ['ein Schulweg', 'ein Auto']],
    ['Wie lang dauert etwa 1 min?', '60 Sekunden', ['eine Schulstunde', 'ein Wimpernschlag']],
    ['Wie lang ist etwa 1 mm?', 'die Dicke einer Münze', ['ein Schreibtisch', 'ein Daumen']],
  ],
  prefixMc: [
    ['Was bedeutet der Vorsatz Kilo?', 'das Tausendfache', ['ein Zehntel', 'ein Hundertstel']],
    ['Was bedeutet der Vorsatz Dezi?', 'ein Zehntel', ['das Tausendfache', 'ein Tausendstel']],
    ['Was bedeutet der Vorsatz Centi?', 'ein Hundertstel', ['ein Zehntel', 'das Hundertfache']],
    ['Was bedeutet der Vorsatz Milli?', 'ein Tausendstel', ['das Tausendfache', 'ein Hundertstel']],
  ],
  probTerm: [
    ['Ein Würfel zeigt eine 7. Wie nennt man das?', 'unmöglich', ['sicher', 'wahrscheinlich']],
    ['Morgen geht die Sonne auf. Wie nennt man das?', 'sicher', ['unmöglich', 'unwahrscheinlich']],
    ['Beim Würfeln kommt eine 6. Wie nennt man das?', 'möglich', ['unmöglich', 'sicher']],
    ['Eine Woche hat 8 Tage. Wie nennt man das?', 'unmöglich', ['möglich', 'sicher']],
    ['Nach dem Winter kommt der Frühling. Wie nennt man das?', 'sicher', ['unmöglich', 'unwahrscheinlich']],
    ['Beim Münzwurf kommt Kopf. Wie nennt man das?', 'möglich', ['sicher', 'unmöglich']],
    ['Du ziehst aus einem Sack mit nur roten Kugeln eine rote Kugel. Wie nennt man das?', 'sicher', ['möglich', 'unmöglich']],
    ['Du ziehst aus einem Sack mit nur roten Kugeln eine blaue Kugel. Wie nennt man das?', 'unmöglich', ['möglich', 'sicher']],
    ['Es regnet am nächsten Mittwoch. Wie nennt man das?', 'möglich', ['sicher', 'unmöglich']],
  ],
  diagramMc: [
    ['Welches Diagramm zeigt Anteile von einem Ganzen?', 'Kreisdiagramm', ['Säulendiagramm', 'Liniendiagramm']],
    ['Welches Diagramm zeigt eine Entwicklung über die Zeit?', 'Liniendiagramm', ['Kreisdiagramm', 'Säulendiagramm']],
    ['Welches Diagramm vergleicht Werte nebeneinander?', 'Säulendiagramm', ['Kreisdiagramm', 'Liniendiagramm']],
    ['Wie nennt man die Zahl, die angibt, wie oft etwas vorkommt?', 'Häufigkeit', ['Mittelwert', 'Zufall']],
  ],
  bigPrefixMc: [
    ['Was ist das Tausendfache von Kilo?', 'Mega', ['Giga', 'Milli']],
    ['Was ist das Tausendfache von Mega?', 'Giga', ['Tera', 'Kilo']],
    ['Was ist das Tausendfache von Giga?', 'Tera', ['Mega', 'Nano']],
    ['Was ist grösser: Mega oder Giga?', 'Giga', ['Mega']],
    ['Was ist grösser: Giga oder Tera?', 'Tera', ['Giga']],
    ['Was ist grösser: Kilo oder Mega?', 'Mega', ['Kilo']],
  ],
  currencyMc: [
    ['Welches Zeichen steht für den Euro?', '€', ['$', 'CHF']],
    ['Welches Zeichen steht für den Dollar?', '$', ['€', 'Rp.']],
    ['Für welche Währung steht CHF?', 'Schweizer Franken', ['Euro', 'Dollar']],
    ['Welche Währung gilt in der Schweiz?', 'der Franken', ['der Euro', 'der Dollar']],
    ['Welches Zeichen steht für das britische Pfund?', '£', ['€', '$']],
  ],
  unitPickMc: [
    ['Welche Einheit misst Geschwindigkeit?', 'km/h', ['kg', 'm²']],
    ['Welche Einheit misst die Datenrate?', 'kB/s', ['km/h', 'cm²']],
    ['Wie heisst die waagrechte Achse im Koordinatensystem?', 'x-Achse', ['y-Achse', 'Einheitsstrecke']],
    ['Wie heisst die senkrechte Achse im Koordinatensystem?', 'y-Achse', ['x-Achse', 'Nullachse']],
  ],
  finTermMc: [
    ['Wie heisst das Geld, das du bei der Bank anlegst?', 'Kapital', ['Zins', 'Rabatt']],
    ['Wie heisst die jährliche Vergütung der Bank?', 'Zins', ['Kapital', 'Netto']],
    ['Wie heisst der Prozentsatz, mit dem verzinst wird?', 'Zinssatz', ['Rabatt', 'Brutto']],
    ['Was bedeutet Brutto?', 'vor den Abzügen', ['nach den Abzügen', 'ohne Steuern']],
    ['Was bedeutet Netto?', 'nach den Abzügen', ['vor den Abzügen', 'mit Verpackung']],
    ['Was bedeutet 10 % Rabatt?', '10 % günstiger', ['10 % teurer', '10 Fr. günstiger']],
  ],
  microPrefixMc: [
    ['Was bedeutet der Vorsatz Mikro?', 'ein Millionstel', ['ein Tausendstel', 'ein Milliardstel']],
    ['Was bedeutet der Vorsatz Nano?', 'ein Milliardstel', ['ein Millionstel', 'ein Hundertstel']],
    ['Welche Einheit hat die Dichte?', 'kg/dm³', ['km/h', 'm²']],
  ],
};

// Echte Schweizer Münzen und Noten (für coinReal, auch fürs Orakel).
export const REAL_MONEY = ['5 Rappen', '10 Rappen', '20 Rappen', '50 Rappen', '1 Franken', '2 Franken', '5 Franken', '10 Franken (Note)', '20 Franken (Note)'];
const FAKE_MONEY = ['3 Franken', '4 Franken', '6 Franken', '7 Franken', '15 Rappen', '25 Rappen', '30 Rappen', '75 Rappen'];

// Einheiten-Fakten: [Ausdruck, Antwort] — die Orakel-Tabelle ist eine
// unabhängige zweite Aufschreibung in der Test-Suite.
const UNIT_FACTS = {
  unitFact: [
    ['1 m = ? cm', '100'],
    ['1 Fr. = ? Rp.', '100'],
    ['1 h = ? min', '60'],
  ],
  unitFact2: [
    ['1 kg = ? g', "1'000"],
    ['1 km = ? m', "1'000"],
    ['1 l = ? dl', '10'],
    ['1 dm = ? cm', '10'],
    ['1 cm = ? mm', '10'],
  ],
  smallUnitFact: [
    ['1 l = ? cl', '100'],
    ['1 l = ? ml', "1'000"],
    ['1 t = ? kg', "1'000"],
    ['1 min = ? s', '60'],
    ['1 g = ? mg', "1'000"],
  ],
  areaFact: [
    ['1 dm² = ? cm²', '100'],
    ['1 m² = ? dm²', '100'],
    ['1 cm² = ? mm²', '100'],
    ['1 km² = ? m²', "1'000'000"],
    ['1 kB = ? Byte', "1'000"],
    ['1 d = ? h', '24'],
  ],
  volumeFact: [
    ['1 m³ = ? dm³', "1'000"],
    ['1 dm³ = ? cm³', "1'000"],
    ['1 m³ = ? l', "1'000"],
  ],
  haFact: [
    ['1 ha = ? a', '100'],
    ['1 a = ? m²', '100'],
    ['1 ha = ? m²', "10'000"],
    ['1 km² = ? ha', '100'],
  ],
};

function qaTask(rng, key) {
  const [q, correct, wrongs] = pick(rng, GW_QA[key]);
  return mc(rng, q, correct, wrongs);
}

function factTask(rng, key) {
  const [expr, answer] = pick(rng, UNIT_FACTS[key]);
  return typed(expr, answer);
}

const KINDS = {
  oppositeMc(rng) { return qaTask(rng, 'oppositeMc'); },

  coinReal(rng) {
    const correct = pick(rng, REAL_MONEY);
    const wrongs = shuffled(rng, FAKE_MONEY).slice(0, 2);
    return mc(rng, 'Welches Geldstück gibt es wirklich?', correct, wrongs);
  },
  superlative(rng) {
    const [comp, sup] = pick(rng, [['schwerer', 'schwersten'], ['länger', 'längsten'], ['teurer', 'teuersten'], ['schneller', 'schnellsten']]);
    const [x1, x2, x3] = shuffled(rng, ['A', 'B', 'C']);
    return mc(rng, `${x1} ist ${comp} als ${x2}. ${x3} ist ${comp} als ${x1}. Was ist am ${sup}?`, x3, [x1, x2]);
  },

  abbrevMc(rng) { return qaTask(rng, 'abbrevMc'); },
  unitFact(rng) { return factTask(rng, 'unitFact'); },

  legenAmount(rng) {
    const n1 = randInt(rng, 1, 3);
    const v1 = pick(rng, [10, 20]);
    const n2 = randInt(rng, 1, 2);
    const v2 = pick(rng, [5, 10, 20, 50]);
    if (n1 * v1 + n2 * v2 > 100) return KINDS.legenAmount(rng);
    const noun = (n, v) => `${n} ${v >= 10 ? (n === 1 ? 'Note' : 'Noten') : (n === 1 ? 'Münze' : 'Münzen')} à ${v} Fr.`;
    return typed(`${noun(n1, v1)} und ${noun(n2, v2)} = ? Fr.`, String(n1 * v1 + n2 * v2));
  },

  referenceMc(rng) { return qaTask(rng, 'referenceMc'); },
  unitFact2(rng) { return factTask(rng, 'unitFact2'); },

  prefixMc(rng) { return qaTask(rng, 'prefixMc'); },
  smallUnitFact(rng) { return factTask(rng, 'smallUnitFact'); },

  probTerm(rng) { return qaTask(rng, 'probTerm'); },

  diagramMc(rng) { return qaTask(rng, 'diagramMc'); },
  areaFact(rng) { return factTask(rng, 'areaFact'); },
  mittelwert(rng) {
    const mean = randInt(rng, 5, 20);
    const d = randInt(rng, 1, 4);
    const values = shuffled(rng, [mean - d, mean, mean + d]);
    return typed(`Mittelwert von ${values[0]}, ${values[1]} und ${values[2]} = ?`, String(mean));
  },

  volumeFact(rng) { return factTask(rng, 'volumeFact'); },
  bigPrefixMc(rng) { return qaTask(rng, 'bigPrefixMc'); },

  currencyMc(rng) { return qaTask(rng, 'currencyMc'); },
  haFact(rng) { return factTask(rng, 'haFact'); },

  relFreq(rng) {
    const whole = pick(rng, [20, 25, 50, 100]);
    const p = pick(rng, [4, 5, 10, 20, 25, 40, 50, 60, 75]);
    const part = (whole * p) / 100;
    if (!Number.isInteger(part) || part < 1 || part >= whole) return KINDS.relFreq(rng);
    return typed(`Von ${whole} Würfen sind ${part} Treffer. Relative Häufigkeit = ? %`, String(p));
  },
  unitPickMc(rng) { return qaTask(rng, 'unitPickMc'); },

  finTermMc(rng) { return qaTask(rng, 'finTermMc'); },
  microPrefixMc(rng) { return qaTask(rng, 'microPrefixMc'); },
  rabatt(rng) {
    const p = pick(rng, [10, 20, 25, 50]);
    const price = randInt(rng, 2, 24) * pick(rng, [10, 20]);
    const saved = (price * p) / 100;
    if (!Number.isInteger(saved)) return KINDS.rabatt(rng);
    return typed(`${p} % Rabatt auf ${price} Fr. Du sparst ? Fr.`, String(saved));
  },
};

export function genTask(rng, stufe) {
  const kind = pick(rng, stufe.kinds);
  return { kind, ...KINDS[kind](rng) };
}

export function genRound(rng, stufe, length = 8) {
  const tasks = [];
  const seen = new Set();
  let guard = 0;
  while (tasks.length < length && guard++ < 300) {
    const task = genTask(rng, stufe);
    // Sortierte Optionen im Schlüssel: dieselbe Frage nur neu gemischt
    // zählt als Duplikat, echt andere Optionssätze bleiben erlaubt.
    const key = task.expr + '|' + (task.options ? [...task.options].sort().join('|') : '');
    if (seen.has(key)) continue;
    seen.add(key);
    tasks.push(task);
  }
  return tasks;
}
