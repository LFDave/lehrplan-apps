// gen.js — Aufgaben-Generatoren für Rechenkniff. Reine Funktionen ohne
// DOM; die e2e-Suite importiert sie direkt und rechnet jede Aufgabe mit
// einem eigenen Orakel nach. Jede Aufgabe:
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

// Binomische Formeln als feste Tabelle (auch fürs Orakel exportiert).
export const BINOM_QA = [
  ['(a + b)² = ?', 'a² + 2ab + b²', ['a² + b²', 'a² + 2ab - b²']],
  ['(a - b)² = ?', 'a² - 2ab + b²', ['a² - b²', 'a² + 2ab + b²']],
  ['(a + b) · (a - b) = ?', 'a² - b²', ['a² + b²', 'a² - 2ab + b²']],
];

const KINDS = {
  /* Stufe a: Mengen angleichen */
  equalize(rng) {
    const half = randInt(rng, 3, 9);
    const diff = randInt(rng, 1, Math.min(3, half - 1));
    const a = half + diff;
    const b = half - diff;
    return typed(`${a} und ${b} Knöpfe. Verteile gleich: ? und ?`, String(half));
  },

  /* Stufe b: zerlegen, Kommutativgesetz */
  decompose(rng) {
    const n = randInt(rng, 5, 20);
    const p = randInt(rng, 1, n - 1);
    return typed(`${n} = ${p} + ?`, String(n - p));
  },
  commuteAdd(rng) {
    const a = randInt(rng, 2, 9);
    let b = randInt(rng, 2, 9);
    if (b === a) b = a === 9 ? 8 : a + 1;
    return typed(`${a} + ${b} = ${b} + ?`, String(a));
  },

  /* Stufe c: Umkehroperation, Assoziativgesetz über den Zehner */
  inverseAdd(rng) {
    const b = randInt(rng, 11, 17);
    const d = randInt(rng, 1, 4);
    const a = b + d;
    return typed(`${a} - ${b} = ? (denn ${b} + ? = ${a})`, String(d));
  },
  assocSplit(rng) {
    const a = randInt(rng, 12, 28);
    const ones = a % 10 === 0 ? 0 : a % 10;
    const c = ones === 0 ? 10 : 10 - ones;
    const rest = randInt(rng, 2, 9);
    const b = c + rest;
    return typed(`${a} + ${b} = ${a} + ${c} + ?`, String(rest));
  },

  /* Stufe d: Beziehungen zwischen Produkten */
  prodNeighbor(rng) {
    const b = randInt(rng, 3, 9);
    const f = randInt(rng, 3, 9);
    return typed(`${f} · ${b} = ${f - 1} · ${b} + ?`, String(b));
  },
  commuteMul(rng) {
    const a = randInt(rng, 2, 9);
    let b = randInt(rng, 2, 9);
    if (b === a) b = a === 9 ? 8 : a + 1;
    return typed(`${a} · ${b} = ${b} · ?`, String(a));
  },

  /* Stufe e: Division als Umkehrung, Zehnereinmaleins */
  inverseDiv(rng) {
    const b = randInt(rng, 3, 9);
    const q = randInt(rng, 3, 9);
    return typed(`${b * q} : ${b} = ? (denn ? · ${b} = ${b * q})`, String(q));
  },
  tensEinmaleins(rng) {
    const a = randInt(rng, 2, 9);
    const b = randInt(rng, 2, 9);
    const tensFirst = rng() < 0.5;
    return typed(
      tensFirst
        ? `${a} · ${b} = ${a * b}. Also: ${a * 10} · ${b} = ?`
        : `${a} · ${b} = ${a * b}. Also: ${a} · ${b * 10} = ?`,
      String(a * b * 10),
    );
  },

  /* Stufe f: verdoppeln/halbieren, Assoziativgesetz, runden */
  doubleHalf(rng) {
    const b = randInt(rng, 13, 49) * 2;
    const a = randInt(rng, 2, 4) * 2;
    return typed(`${a} · ${b / 2} = ${a / 2} · ?`, String(b));
  },
  assocSum(rng) {
    const a = randInt(rng, 101, 399);
    const target = pick(rng, [60, 80, 100, 120]);
    const b = randInt(rng, 11, target - 11);
    const c = target - b;
    return typed(`${a} + ${b} + ${c} = ${a} + ?`, String(target));
  },
  assocProd(rng) {
    const a = randInt(rng, 13, 79);
    const [p, q] = pick(rng, [[4, 25], [2, 50], [5, 20], [2, 5]]);
    return typed(`${a} · ${p} · ${q} = ${a} · ?`, String(p * q));
  },
  roundNat(rng) {
    const n = randInt(rng, 1201, 98999);
    const place = pick(rng, [10, 100, 1000]);
    const label = place === 10 ? '10er' : place === 100 ? '100er' : "1'000er";
    return typed(`Runde ${formatNumber(n)} auf ${label}: ?`, formatNumber(Math.round(n / place) * place));
  },

  /* Stufe g: Teilbarkeit, Dezimalzahlen runden */
  divisibleMc(rng) {
    const d = pick(rng, [2, 5, 10, 100]);
    const base = randInt(rng, 3, 80);
    const correct = base * d;
    const wrongs = [];
    let cand = correct + 1;
    while (wrongs.length < 2) {
      if (cand % d !== 0) wrongs.push(cand);
      cand += 1;
    }
    return mc(rng, `Welche Zahl ist durch ${d} teilbar?`, formatNumber(correct), wrongs.map((x) => formatNumber(x)));
  },
  roundDec(rng) {
    const whole = randInt(rng, 1, 40);
    const frac = randInt(rng, 11, 99);
    if (frac % 10 === 0) return KINDS.roundDec(rng);
    const value = `${whole}.${String(frac).padStart(2, '0')}`;
    const rounded = (whole * 100 + frac + 5 - ((whole * 100 + frac + 5) % 10)) / 100;
    // Antworten wie "12.0" vermeiden: ein Kind tippt "12" und die
    // Längen-Autoprüfung würde nie auslösen.
    if (rounded.toFixed(1).endsWith('.0')) return KINDS.roundDec(rng);
    return typed(`Runde ${value} auf Zehntel: ?`, rounded.toFixed(1));
  },

  /* Stufe h: Punkt vor Strich, Klammern, einfache Gleichungen */
  dotBeforeDash(rng) {
    const a = randInt(rng, 2, 9);
    const b = randInt(rng, 2, 9);
    const c = randInt(rng, 2, 5);
    const d = randInt(rng, 2, 4);
    return typed(`${a} + ${b} · ${c} - ${d} = ?`, String(a + b * c - d));
  },
  brackets(rng) {
    const a = randInt(rng, 2, 9);
    const b = randInt(rng, 3, 9);
    const c = randInt(rng, 2, b - 1);
    const d = randInt(rng, 2, 4);
    const variant = rng() < 0.5;
    return variant
      ? typed(`(${a} + ${b} - ${c}) · ${d} = ?`, String((a + b - c) * d))
      : typed(`${a} + (${b} - ${c}) · ${d} = ?`, String(a + (b - c) * d));
  },
  solveSimple(rng) {
    if (rng() < 0.5) {
      const x = randInt(rng, 5, 48);
      const a = randInt(rng, 11, 49);
      return typed(`x + ${a} = ${x + a}. x = ?`, String(x));
    }
    const x = randInt(rng, 3, 9);
    const a = randInt(rng, 3, 9);
    return typed(`${a} · x = ${a * x}. x = ?`, String(x));
  },
  divisible39Mc(rng) {
    const d = pick(rng, [3, 9]);
    const correct = d * randInt(rng, 5, 40);
    const wrongs = [];
    let cand = correct + 1;
    while (wrongs.length < 2) {
      if (cand % d !== 0) wrongs.push(cand);
      cand += 1;
    }
    return mc(rng, `Welche Zahl ist durch ${d} teilbar?`, String(correct), wrongs.map(String));
  },

  /* Stufe i: Potenzschreibweise, Distributivgesetz, sinnvoll runden */
  powerWrite(rng) {
    const b = pick(rng, [2, 3, 5, 10, 15]);
    const e = randInt(rng, 2, 4);
    return typed(`${Array(e).fill(b).join(' · ')} = ${b}^?`, String(e));
  },
  distributive(rng) {
    const f = randInt(rng, 3, 9);
    const tens = randInt(rng, 2, 9) * 10;
    const ones = randInt(rng, 2, 9);
    return typed(`${f} · (${tens} + ${ones}) = ${f} · ${tens} + ${f} · ?`, String(ones));
  },
  roundSensible(rng) {
    const int = randInt(rng, 1, 9);
    const frac = randInt(rng, 1001, 9899);
    if (frac % 100 === 0) return KINDS.roundSensible(rng);
    const value = `${int}.${String(frac).padStart(4, '0')}`;
    const scaled = int * 10000 + frac;
    const rounded = (scaled + 50 - ((scaled + 50) % 100)) / 10000;
    if (rounded.toFixed(2).endsWith('0')) return KINDS.roundSensible(rng);
    return typed(`Runde ${value} auf Hundertstel: ?`, rounded.toFixed(2));
  },

  /* Stufe j (Erweiterung): lineare Gleichungen, einfache Terme */
  linearEq(rng) {
    const x = randInt(rng, 2, 9);
    const a = randInt(rng, 2, 9);
    const b = randInt(rng, 1, 9);
    return typed(`${a}x + ${b} = ${a * x + b}. x = ?`, String(x));
  },
  addTermsSimple(rng) {
    const v = pick(rng, ['a', 'b', 'x']);
    const p = randInt(rng, 2, 9);
    const q = randInt(rng, 1, 9);
    const plus = rng() < 0.5 || q >= p;
    return plus
      ? typed(`${p}${v} + ${q}${v} = ?`, `${p + q}${v}`)
      : typed(`${p}${v} - ${q}${v} = ?`, `${p - q === 1 ? '' : p - q}${v}`);
  },

  /* Stufe k: Terme mit zwei Variablen zusammenfassen */
  combineTerms(rng) {
    const a1 = randInt(rng, 2, 6);
    const a2 = randInt(rng, 1, 6);
    const b1 = randInt(rng, 2, 6);
    const minus = rng() < 0.4 && a1 > a2;
    const expr = minus
      ? `${a1}a + ${b1}b - ${a2}a = ?`
      : `${a1}a + ${b1}b + ${a2}a = ?`;
    const aSum = minus ? a1 - a2 : a1 + a2;
    return typed(expr, `${aSum === 1 ? '' : aSum}a + ${b1}b`);
  },

  /* Stufe l: quadratische Gleichungen, Potenz vor Punkt, Binome */
  quadSolve(rng) {
    const x = randInt(rng, 2, 12);
    return typed(`x² - ${x * x} = 0. x = ? (positive Lösung)`, String(x));
  },
  powerFirst(rng) {
    const a = randInt(rng, 2, 5);
    const b = randInt(rng, 2, 4);
    const variant = rng() < 0.5;
    return variant
      ? typed(`${a} · ${b}² = ?`, String(a * b * b))
      : typed(`(${a} · ${b})² = ?`, String(a * b * a * b));
  },
  binomMc(rng) {
    const [q, correct, wrongs] = pick(rng, BINOM_QA);
    return mc(rng, q, correct, wrongs);
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
