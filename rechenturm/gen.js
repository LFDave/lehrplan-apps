// gen.js — Aufgaben-Generatoren für Rechenturm. Reine Funktionen ohne
// DOM; die e2e-Suite importiert sie direkt und rechnet die Ausdrücke
// mit einem eigenen Parser nach. Jede Aufgabe:
//   { type: 'typed', expr, answer }               getippte Antwort
//   { type: 'mc', expr, options, answer }         Auswahl (Index)
// Ausdrücke verwenden · und -, Potenzen als Unicode-Hochzahlen und die
// Schweizer Tausendertrennung mit Apostroph.

export function formatNumber(n, decimals = 0) {
  const fixed = Math.abs(n).toFixed(decimals);
  const [intPart, frac] = fixed.split('.');
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  const sign = n < 0 ? '-' : '';
  return sign + grouped + (frac ? '.' + frac : '');
}

const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
export function sup(n) {
  return String(n).split('').map((d) => SUP[d]).join('');
}

function randInt(rng, min, max) {
  return min + Math.floor(rng() * (max - min + 1));
}

function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}

function round(n, d) {
  const f = 10 ** d;
  return Math.round(n * f) / f;
}

function typed(expr, answer) {
  return { type: 'typed', expr, answer };
}

const KINDS = {
  /* Stufe a: Zahlenraum 20 */
  add20(rng) {
    const a = randInt(rng, 2, 18);
    const b = randInt(rng, 1, 20 - a);
    return typed(`${a} + ${b}`, String(a + b));
  },
  sub20(rng) {
    const a = randInt(rng, 3, 20);
    const b = randInt(rng, 1, a - 1);
    return typed(`${a} - ${b}`, String(a - b));
  },
  double20(rng) {
    const a = randInt(rng, 2, 10);
    return typed(`Das Doppelte von ${a}`, String(2 * a));
  },
  half20(rng) {
    const a = randInt(rng, 1, 10) * 2;
    return typed(`Die Hälfte von ${a}`, String(a / 2));
  },

  /* Stufe b: bis 100 ohne Zehnerübergang, ergänzen, verdoppeln */
  addNoCarry(rng) {
    const at = randInt(rng, 1, 8);
    const ae = randInt(rng, 1, 8);
    const a = at * 10 + ae;
    const b = randInt(rng, 1, 9 - at) * 10 + randInt(rng, 1, 9 - ae);
    return typed(`${a} + ${b}`, String(a + b));
  },
  subNoCarry(rng) {
    const at = randInt(rng, 2, 9);
    const ae = randInt(rng, 2, 9);
    const a = at * 10 + ae;
    const b = randInt(rng, 1, at - 1) * 10 + randInt(rng, 1, ae - 1);
    return typed(`${a} - ${b}`, String(a - b));
  },
  fillToTen(rng) {
    const a = randInt(rng, 1, 9) * 10 + randInt(rng, 1, 9);
    const target = Math.ceil(a / 10) * 10;
    return typed(`${a} + ? = ${target}`, String(target - a));
  },
  doubleRound(rng) {
    const a = pick(rng, [5, 10, 15, 20, 25, 30, 35, 40, 45, 50]);
    return typed(`Das Doppelte von ${a}`, String(2 * a));
  },
  halfRound(rng) {
    const a = randInt(rng, 1, 5) * 20;
    return typed(`Die Hälfte von ${a}`, String(a / 2));
  },

  /* Stufe c: bis 100 mit Übergang, Einmaleins 2/5/10 */
  add100(rng) {
    const a = randInt(rng, 15, 85);
    const b = randInt(rng, 6, Math.max(7, 100 - a));
    return typed(`${a} + ${b}`, String(a + b));
  },
  sub100(rng) {
    const a = randInt(rng, 30, 100);
    const b = randInt(rng, 6, a - 4);
    return typed(`${a} - ${b}`, String(a - b));
  },
  double100(rng) {
    const a = randInt(rng, 11, 50);
    return typed(`Das Doppelte von ${a}`, String(2 * a));
  },
  half100(rng) {
    const a = randInt(rng, 11, 50) * 2;
    return typed(`Die Hälfte von ${a}`, String(a / 2));
  },
  mul2510(rng) {
    const f = pick(rng, [2, 5, 10]);
    const b = randInt(rng, 2, 10);
    return typed(`${f} · ${b}`, String(f * b));
  },

  /* Stufe d: schriftlich, ganzes Einmaleins */
  addWritten(rng) {
    const a = randInt(rng, 124, 640);
    const b = randInt(rng, 113, 999 - a);
    return typed(`${a} + ${b}`, String(a + b));
  },
  subWritten(rng) {
    const a = randInt(rng, 342, 998);
    const b = randInt(rng, 118, a - 100);
    return typed(`${a} - ${b}`, String(a - b));
  },
  einmaleins(rng) {
    const a = randInt(rng, 3, 9);
    const b = randInt(rng, 3, 9);
    return typed(`${a} · ${b}`, String(a * b));
  },

  /* Stufe e: grosse Zahlen im Kopf */
  addBig(rng) {
    const a = randInt(rng, 12, 78) * 10000;
    const b = randInt(rng, 11, 98) * 1000;
    return typed(`${formatNumber(a)} + ${formatNumber(b)}`, formatNumber(a + b));
  },
  subBig(rng) {
    const a = randInt(rng, 40, 95) * 10000;
    const b = randInt(rng, 12, 38) * 1000;
    return typed(`${formatNumber(a)} - ${formatNumber(b)}`, formatNumber(a - b));
  },
  mulTens(rng) {
    const a = randInt(rng, 12, 45);
    const b = pick(rng, [20, 30, 40, 200, 300]);
    return typed(`${a} · ${b}`, formatNumber(a * b));
  },

  /* Stufe f: Dezimalzahlen plus/minus. Die Zehntel dürfen sich nicht
     aufheben: sonst hiesse die erwartete Antwort "36.0", ein Kind
     tippt aber "36" und die Längen-Autoprüfung löst nie aus. */
  addDec(rng) {
    const t1 = randInt(rng, 1, 9);
    let t2 = randInt(rng, 1, 8);
    if (t2 >= 10 - t1) t2++;
    const a = round(randInt(rng, 10, 60) + t1 / 10, 1);
    const b = round(randInt(rng, 2, 30) + t2 / 10, 1);
    return typed(`${formatNumber(a, 1)} + ${formatNumber(b, 1)}`, formatNumber(round(a + b, 1), 1));
  },
  subDec(rng) {
    const t1 = randInt(rng, 1, 9);
    let t2 = randInt(rng, 1, 8);
    if (t2 >= t1) t2++;
    const a = round(randInt(rng, 30, 90) + t1 / 10, 1);
    const b = round(randInt(rng, 2, 25) + t2 / 10, 1);
    return typed(`${formatNumber(a, 1)} - ${formatNumber(b, 1)}`, formatNumber(round(a - b, 1), 1));
  },

  /* Stufe g: Dezimalzahlen mal, grosse Produkte */
  mulDec(rng) {
    const a = randInt(rng, 3, 24);
    const b = pick(rng, [0.2, 0.3, 0.5, 1.5, 2.5]);
    const result = round(a * b, 2);
    const decimals = Number.isInteger(result) ? 0 : Number.isInteger(result * 10) ? 1 : 2;
    return typed(`${a} · ${formatNumber(b, 1)}`, formatNumber(result, decimals));
  },
  mulBig(rng) {
    const a = randInt(rng, 12, 48);
    const b = randInt(rng, 11, 52);
    return typed(`${a} · ${b}`, formatNumber(a * b));
  },

  /* Stufe h: Prozente, Primfaktoren (Erweiterung) */
  percent(rng) {
    const p = pick(rng, [10, 20, 25, 50, 75]);
    const base = randInt(rng, 2, 24) * 20;
    return typed(`${p}% von ${formatNumber(base)}`, formatNumber(base * p / 100));
  },
  primeFactors(rng) {
    const sets = [
      [2, 2, 3], [2, 3, 3], [2, 2, 5], [2, 3, 5], [2, 2, 7], [3, 3, 5], [2, 5, 5], [2, 2, 2, 3],
    ];
    const factors = pick(rng, sets);
    const n = factors.reduce((x, y) => x * y, 1);
    const correct = factors.join(' · ');
    // Ablenker mit demselben Produkt, aber keine reine Primzerlegung
    const wrong1 = `${factors[0]} · ${n / factors[0]}`;
    const wrong2 = `1 · ${n}`;
    const options = [correct, wrong1, wrong2];
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    return { type: 'mc', expr: `${n} als Produkt von Primfaktoren`, options, answer: options.indexOf(correct) };
  },

  /* Stufe i: negative Zahlen, Brüche, Potenzen, Wurzeln */
  negAdd(rng) {
    const a = -randInt(rng, 2, 15);
    const b = randInt(rng, 1, 12);
    return typed(`${a} + ${b}`, String(a + b));
  },
  negMul(rng) {
    const a = -randInt(rng, 2, 9);
    const b = randInt(rng, 2, 9);
    return typed(`${a} · ${b}`, String(a * b));
  },
  fracAdd(rng) {
    const den = pick(rng, [5, 6, 7, 8, 9, 10]);
    const a = randInt(rng, 1, den - 2);
    const b = randInt(rng, 1, den - a - 1);
    return typed(`${a}/${den} + ${b}/${den}`, `${a + b}/${den}`);
  },
  powerEval(rng) {
    const base = randInt(rng, 2, 9);
    const exp = base <= 3 ? randInt(rng, 2, 4) : 2;
    return typed(`${base}${sup(exp)}`, formatNumber(base ** exp));
  },
  rootEval(rng) {
    const r = randInt(rng, 2, 12);
    return typed(`√${formatNumber(r * r)}`, String(r));
  },

  /* Stufe j: Potenzregeln, wissenschaftliche Schreibweise */
  powerRule(rng) {
    const base = pick(rng, [2, 3, 5, 10]);
    const e1 = randInt(rng, 2, 5);
    const e2 = randInt(rng, 2, 5);
    return typed(`${base}${sup(e1)} · ${base}${sup(e2)} = ${base}^?`, String(e1 + e2));
  },
  sciConvert(rng) {
    const m = pick(rng, [2, 3, 5, 7, 1.5, 2.5]);
    const exp = randInt(rng, 3, 6);
    const value = m * 10 ** exp;
    return typed(`${formatNumber(m, Number.isInteger(m) ? 0 : 1)} · 10${sup(exp)}`, formatNumber(value));
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
    if (seen.has(task.expr)) continue;
    seen.add(task.expr);
    tasks.push(task);
  }
  return tasks;
}
