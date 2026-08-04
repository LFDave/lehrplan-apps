// gen.js — Aufgaben-Generatoren für Zahlenwissen. Reine Funktionen ohne
// DOM; die e2e-Suite importiert sie direkt und prüft jede Aufgabe mit
// einem eigenen Orakel nach (Zahlwort-Parser, Teilbarkeit, Primzahlen,
// Bruchwerte). Jede Aufgabe:
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

const SUPS = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];
export function sup(n) {
  return String(n).split('').map((d) => (d === '-' ? '⁻' : SUPS[Number(d)])).join('');
}

/* ── Zahlwörter (Schweizer Schreibweise: dreissig, nie ß) ────────── */

const ONES = ['null', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun',
  'zehn', 'elf', 'zwölf', 'dreizehn', 'vierzehn', 'fünfzehn', 'sechzehn', 'siebzehn', 'achtzehn', 'neunzehn'];
const TENS = ['', 'zehn', 'zwanzig', 'dreissig', 'vierzig', 'fünfzig', 'sechzig', 'siebzig', 'achtzig', 'neunzig'];

function below100(n) {
  if (n < 20) return ONES[n];
  const t = Math.floor(n / 10);
  const o = n % 10;
  return o ? `${o === 1 ? 'ein' : ONES[o]}und${TENS[t]}` : TENS[t];
}

function below1000(n) {
  const h = Math.floor(n / 100);
  const r = n % 100;
  let s = '';
  if (h) s += `${h === 1 ? 'ein' : ONES[h]}hundert`;
  if (r) s += below100(r);
  return s || 'null';
}

export function zahlwort(n) {
  if (n < 1000) return below1000(n);
  const th = Math.floor(n / 1000);
  const r = n % 1000;
  let s = `${th === 1 ? 'ein' : below1000(th)}tausend`;
  if (r) s += below1000(r);
  return s;
}

/* ── Dezimal verschieben als Text (vermeidet Float-Rauschen) ─────── */

export function shiftDecimal(mantisse, exp) {
  // mantisse als String wie "2.5", exp ganzzahlig; Ergebnis als Zahl-String.
  let [int, frac = ''] = String(mantisse).split('.');
  let digits = int + frac;
  let point = int.length + exp;
  while (point > digits.length) digits += '0';
  while (point < 1) { digits = '0' + digits; point += 1; }
  const left = digits.slice(0, point).replace(/^0+(?=\d)/, '');
  const right = digits.slice(point).replace(/0+$/, '');
  return right ? `${left}.${right}` : left;
}

/* ── Wortlisten für Begriff-Aufgaben (auch fürs Orakel exportiert) ── */

export const TERM_QA = {
  opTerms: [
    ['Wie heisst das Ergebnis einer Addition?', 'Summe', ['Differenz', 'Produkt']],
    ['Wie heisst das Ergebnis einer Subtraktion?', 'Differenz', ['Summe', 'Quotient']],
    ['Wie heisst das Ergebnis einer Multiplikation?', 'Produkt', ['Summe', 'Quotient']],
    ['Wie heisst das Ergebnis einer Division?', 'Quotient', ['Produkt', 'Differenz']],
    ['Wie heissen die Zahlen, die man addiert?', 'Summanden', ['Faktoren', 'Quotienten']],
    ['Wie heissen die Zahlen, die man multipliziert?', 'Faktoren', ['Summanden', 'Differenzen']],
  ],
  fracTerms: [
    ['Wie heisst die Zahl über dem Bruchstrich?', 'Zähler', ['Nenner', 'Teiler']],
    ['Wie heisst die Zahl unter dem Bruchstrich?', 'Nenner', ['Zähler', 'Faktor']],
    ['Welches Zeichen steht für Prozent?', '%', ['≈', '<']],
    ['Welches Zeichen bedeutet «ungefähr gleich»?', '≈', ['%', '=']],
  ],
  powerTerms: [
    ['Wie heisst die 2 in 2⁵?', 'Basis', ['Exponent', 'Faktor']],
    ['Wie heisst die 5 in 2⁵?', 'Exponent', ['Basis', 'Produkt']],
    ['Wie heisst die 3 in 10³?', 'Exponent', ['Basis', 'Summand']],
    ['Wie heisst die 10 in 10³?', 'Basis', ['Exponent', 'Nenner']],
  ],
  symbolMeaning: [
    ['Welches Zeichen steht für die Quadratwurzel?', '√', ['≤', '≠']],
    ['Was bedeutet ≤?', 'kleiner oder gleich', ['grösser oder gleich', 'ungleich']],
    ['Was bedeutet ≥?', 'grösser oder gleich', ['kleiner oder gleich', 'ungefähr']],
    ['Was bedeutet ≠?', 'ungleich', ['gleich', 'kleiner']],
  ],
  numberSet: [
    ['Welche Zahl ist eine natürliche Zahl?', '7', ['-3', '2.5']],
    ['Welche Zahl ist eine ganze Zahl, aber keine natürliche Zahl?', '-4', ['6', '0.5']],
    ['Welche Zahl ist rational, aber keine ganze Zahl?', '2.5', ['-8', '12']],
  ],
};

function termTask(rng, key) {
  const [q, correct, wrongs] = pick(rng, TERM_QA[key]);
  return mc(rng, q, correct, wrongs);
}

const KINDS = {
  /* Stufe a: Anzahlen vergleichen */
  moreDots(rng) {
    const a = randInt(rng, 3, 9);
    let b = randInt(rng, 3, 8);
    if (b >= a) b += 1;
    const dots = (n) => '●'.repeat(n).replace(/(●{5})(?=●)/g, '$1 ');
    const options = [dots(a), dots(b)];
    return { type: 'mc', expr: 'Wo sind mehr Punkte?', options, answer: a > b ? 0 : 1 };
  },
  fewerDots(rng) {
    const a = randInt(rng, 3, 9);
    let b = randInt(rng, 3, 8);
    if (b >= a) b += 1;
    const dots = (n) => '●'.repeat(n).replace(/(●{5})(?=●)/g, '$1 ');
    const options = [dots(a), dots(b)];
    return { type: 'mc', expr: 'Wo sind weniger Punkte?', options, answer: a < b ? 0 : 1 };
  },

  /* Stufe b: Zeichen +, -, = */
  opSymbol(rng) {
    const plus = rng() < 0.5;
    const a = randInt(rng, 2, 9);
    const b = randInt(rng, 1, plus ? 10 : a - 1);
    const result = plus ? a + b : a - b;
    return mc(rng, `${a} ? ${b} = ${result}`, plus ? '+' : '-', [plus ? '-' : '+']);
  },
  trueEquation(rng) {
    const a = randInt(rng, 2, 9);
    const b = randInt(rng, 1, 9);
    const correct = `${a} + ${b} = ${a + b}`;
    const off1 = `${a} + ${b} = ${a + b + randInt(rng, 1, 2)}`;
    const off2 = `${a} + ${b} = ${a + b - randInt(rng, 1, 2)}`;
    return mc(rng, 'Welche Rechnung stimmt?', correct, [off1, off2]);
  },

  /* Stufe c: Zahlen bis 100 */
  numberWord100(rng) {
    const n = randInt(rng, 13, 99);
    return typed(`Schreibe als Zahl: ${zahlwort(n)}`, String(n));
  },
  evenOdd(rng) {
    const n = randInt(rng, 10, 99);
    return mc(rng, `Ist ${n} gerade oder ungerade?`, n % 2 === 0 ? 'gerade' : 'ungerade', [n % 2 === 0 ? 'ungerade' : 'gerade']);
  },
  compareSign(rng) {
    const a = randInt(rng, 10, 99);
    let b = randInt(rng, 10, 98);
    if (b >= a) b += 1;
    return mc(rng, `${a} ? ${b}`, a < b ? '<' : '>', [a < b ? '>' : '<']);
  },
  tensOnes(rng) {
    const n = randInt(rng, 21, 99);
    const zehner = rng() < 0.5;
    return typed(
      zehner ? `Wie viele Zehner hat ${n}?` : `Wie viele Einer hat ${n}?`,
      String(zehner ? Math.floor(n / 10) : n % 10),
    );
  },

  /* Stufe d: das Zeichen : */
  divSymbol(rng) {
    let b = randInt(rng, 2, 9);
    let q = randInt(rng, 2, 9);
    // 4 ? 2 = 2 wäre doppeldeutig (4 : 2 und 4 - 2 stimmen beide)
    if (b === 2 && q === 2) q = 3;
    const a = b * q;
    return mc(rng, `${a} ? ${b} = ${q}`, ':', ['·', '-']);
  },

  /* Stufe e: Zahlen bis 1000 */
  numberWord1000(rng) {
    const n = randInt(rng, 101, 999);
    return typed(`Schreibe als Zahl: ${zahlwort(n)}`, String(n));
  },
  squareNumber(rng) {
    const k = randInt(rng, 4, 9);
    const s = k * k;
    const isSquare = (x) => Number.isInteger(Math.sqrt(x));
    const wrongs = [];
    for (const cand of [s + 2, s - 3, s + 5, s - 7, s + 3]) {
      if (!isSquare(cand) && cand > 1 && wrongs.length < 2 && !wrongs.includes(cand)) wrongs.push(cand);
    }
    return mc(rng, 'Welche Zahl ist eine Quadratzahl?', String(s), wrongs.map(String));
  },
  placeValue(rng) {
    // Ziffern alle verschieden, keine 0, damit die gefragte Ziffer eindeutig ist.
    const digits = shuffled(rng, [1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4);
    const n = digits[0] * 1000 + digits[1] * 100 + digits[2] * 10 + digits[3];
    const pos = randInt(rng, 0, 3);
    const place = [1000, 100, 10, 1][pos];
    return typed(`Welchen Wert hat die Ziffer ${digits[pos]} in ${formatNumber(n)}?`, formatNumber(digits[pos] * place));
  },
  remainder(rng) {
    const b = randInt(rng, 3, 9);
    const q = randInt(rng, 3, 9);
    const r = randInt(rng, 1, b - 1);
    return typed(`${b * q + r} : ${b} = ${q} Rest ?`, String(r));
  },

  /* Stufe f: Fachwörter, Zahlen bis 1 Million */
  opTerms(rng) { return termTask(rng, 'opTerms'); },
  numberWordBig(rng) {
    const th = randInt(rng, 21, 999);
    const n = th * 1000;
    return typed(`Schreibe als Zahl: ${zahlwort(n)}`, formatNumber(n));
  },

  /* Stufe g: Brüche, Teiler, Vielfache, Dezimalzahlen */
  fracTerms(rng) { return termTask(rng, 'fracTerms'); },
  teilerMc(rng) {
    const n = pick(rng, [24, 36, 40, 48, 60]);
    const divisors = [];
    for (let d = 3; d < n; d++) if (n % d === 0) divisors.push(d);
    const correct = pick(rng, divisors);
    const wrongs = [];
    let cand = correct + 1;
    while (wrongs.length < 2) {
      if (n % cand !== 0 && cand !== correct) wrongs.push(cand);
      cand += 1;
    }
    return mc(rng, `Welche Zahl ist ein Teiler von ${n}?`, String(correct), wrongs.map(String));
  },
  vielfacheMc(rng) {
    const k = randInt(rng, 3, 9);
    const correct = k * randInt(rng, 3, 9);
    const wrongs = [correct + 1, correct + (k > 2 ? 2 : 3)].map((x) => (x % k === 0 ? x + 1 : x));
    return mc(rng, `Welche Zahl ist ein Vielfaches von ${k}?`, String(correct), wrongs.map(String));
  },
  decimalWord(rng) {
    const int = randInt(rng, 1, 20);
    const dec = randInt(rng, 1, 9);
    return typed(`Schreibe als Zahl: ${zahlwort(int)} Komma ${zahlwort(dec)}`, `${int}.${dec}`);
  },

  /* Stufe h: Bruch, Dezimalzahl, Prozent umwandeln; Primzahlen */
  fracToPercent(rng) {
    const [p, q] = pick(rng, [[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 10], [3, 10], [7, 10], [1, 20], [1, 50]]);
    return typed(`${p}/${q} = ? %`, String((100 * p) / q));
  },
  percentToDec(rng) {
    const p = randInt(rng, 1, 19) * 5;
    return typed(`${p} % = ? (Dezimalzahl)`, shiftDecimal(String(p), -2));
  },
  decToFrac(rng) {
    const TABLE = [['0.5', '1/2'], ['0.25', '1/4'], ['0.75', '3/4'], ['0.2', '1/5'], ['0.4', '2/5'], ['0.1', '1/10']];
    const [d, f] = pick(rng, TABLE);
    const wrongs = shuffled(rng, TABLE.filter(([x]) => x !== d)).slice(0, 2).map(([, fr]) => fr);
    return mc(rng, `${d} = ?`, f, wrongs);
  },
  primeMc(rng) {
    const primes = [13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
    const composites = [15, 21, 25, 27, 33, 35, 39, 45, 49];
    const correct = pick(rng, primes);
    const wrongs = shuffled(rng, composites).slice(0, 2);
    return mc(rng, 'Welche Zahl ist eine Primzahl?', String(correct), wrongs.map(String));
  },

  /* Stufe i: Potenzen benennen, Symbole, Zahlen bis 1 Milliarde */
  powerTerms(rng) { return termTask(rng, 'powerTerms'); },
  symbolMeaning(rng) { return termTask(rng, 'symbolMeaning'); },
  bigRead(rng) {
    if (rng() < 0.2) {
      return typed('Schreibe als Zahl: eine Milliarde', formatNumber(1e9));
    }
    const m = pick(rng, [2, 5, 8, 20, 40, 80, 200, 400, 700]);
    return typed(`Schreibe als Zahl: ${zahlwort(m)} Millionen`, formatNumber(m * 1e6));
  },

  /* Stufe j: wissenschaftliche Schreibweise */
  sciRead(rng) {
    const m = pick(rng, ['1.32', '2.5', '4.8', '7.05', '3.6', '9.1']);
    const e = randInt(rng, 3, 8);
    return typed(`${m} · 10${sup(e)} = ?`, formatNumber(Number(shiftDecimal(m, e))));
  },
  sciWrite(rng) {
    const m = pick(rng, ['4.5', '2.8', '6.2', '1.9', '8.4']);
    const e = randInt(rng, 3, 7);
    return typed(`${formatNumber(Number(shiftDecimal(m, e)))} = ${m} · 10^?`, String(e));
  },
  ratPower(rng) {
    const TABLE = [['0.5', '0.25'], ['1.5', '2.25'], ['0.2', '0.04'], ['0.3', '0.09'], ['2.5', '6.25'], ['0.1', '0.01'], ['1.2', '1.44']];
    const [b, sq] = pick(rng, TABLE);
    return typed(`${b}² = ?`, sq);
  },

  /* Stufe k: Kehrwert, negative Exponenten, dritte Wurzel */
  kehrwert(rng) {
    const n = randInt(rng, 2, 9);
    return mc(rng, `Was ist der Kehrwert von ${n}?`, `1/${n}`, [`-${n}`, `${n}/1`]);
  },
  negExp(rng) {
    const m = pick(rng, ['2', '4', '7', '1.5', '2.5', '9']);
    const e = randInt(rng, 1, 4);
    return typed(`${m} · 10${sup(-e)} = ?`, shiftDecimal(m, -e));
  },
  cubeRoot(rng) {
    const k = randInt(rng, 2, 10);
    return typed(`∛${formatNumber(k ** 3)} = ?`, String(k));
  },
  numberSet(rng) { return termTask(rng, 'numberSet'); },

  /* Stufe l: rational und irrational */
  irrationalPick(rng) {
    const p = pick(rng, [2, 3, 5, 7, 8, 10]);
    const wrongs = shuffled(rng, ['0.5', '3/4', '√9', '√16', '1/3']).slice(0, 2);
    return mc(rng, 'Welche Zahl ist irrational?', `√${p}`, wrongs);
  },
  rationalCheck(rng) {
    const TABLE = [['√2', false], ['√5', false], ['√9', true], ['√16', true], ['0.75', true], ['1/3', true], ['√7', false]];
    const [x, rational] = pick(rng, TABLE);
    return mc(rng, `Ist ${x} rational oder irrational?`, rational ? 'rational' : 'irrational', [rational ? 'irrational' : 'rational']);
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
