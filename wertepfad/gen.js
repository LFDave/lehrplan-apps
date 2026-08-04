// gen.js — Aufgaben-Generatoren für Wertepfad. Reine Funktionen ohne
// DOM; die e2e-Suite importiert sie direkt und rechnet jede Aufgabe mit
// einem eigenen Orakel nach (generischer Folgen-Löser über
// Differenzen, Bruchvergleich, lineare Gleichungen). Jede Aufgabe:
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

const KINDS = {
  /* Stufe a: einfache Wertetabellen */
  tableSimple(rng) {
    const p = randInt(rng, 2, 9);
    const n = randInt(rng, 3, 4);
    return typed(`1 Flasche → ${p} Fr. 2 Flaschen → ${2 * p} Fr. ${n} Flaschen → ? Fr.`, String(n * p));
  },

  /* Stufe b: lineare Folgen und Tabellen */
  linSeq(rng) {
    const a = randInt(rng, 0, 20);
    const d = randInt(rng, 2, 12);
    const back = rng() < 0.3;
    if (back) {
      const start = a + 4 * d;
      return typed(`${start}, ${start - d}, ${start - 2 * d}, ${start - 3 * d}, ?`, String(start - 4 * d));
    }
    return typed(`${a}, ${a + d}, ${a + 2 * d}, ${a + 3 * d}, ?`, String(a + 4 * d));
  },
  tableLinear(rng) {
    const p = randInt(rng, 3, 12);
    const n = randInt(rng, 3, 6);
    return typed(`1 m → ${p} Fr. 2 m → ${2 * p} Fr. ${n} m → ? Fr.`, String(n * p));
  },

  /* Stufe c: nichtlineare Folgen */
  squareSeq(rng) {
    const k = randInt(rng, 1, 4);
    const sq = (x) => x * x;
    return typed(`${sq(k)}, ${sq(k + 1)}, ${sq(k + 2)}, ${sq(k + 3)}, ?`, String(sq(k + 4)));
  },
  triangleSeq(rng) {
    const t = (x) => (x * (x + 1)) / 2;
    const k = randInt(rng, 1, 3);
    return typed(`${t(k)}, ${t(k + 1)}, ${t(k + 2)}, ${t(k + 3)}, ?`, String(t(k + 4)));
  },
  fallingSeq(rng) {
    const start = randInt(rng, 60, 120);
    const d0 = randInt(rng, 5, 9);
    const dd = randInt(rng, 2, 3);
    const seq = [start];
    for (let i = 0; i < 4; i++) seq.push(seq[i] - (d0 + i * dd));
    return typed(`${seq[0]}, ${seq[1]}, ${seq[2]}, ${seq[3]}, ?`, String(seq[4]));
  },

  /* Stufe d: Preistabellen mit Rappen */
  tableMoney(rng) {
    const fr = randInt(rng, 2, 9);
    const rp = pick(rng, [20, 40, 60, 80]);
    const cents = fr * 100 + rp;
    const n = randInt(rng, 3, 5);
    const show = (c) => formatNumber(c / 100, 2);
    return typed(`100 g → ${show(cents)} Fr. 200 g → ${show(2 * cents)} Fr. ${n}00 g → ? Fr.`, show(n * cents));
  },

  /* Stufe e: proportional rechnen */
  propUnit(rng) {
    const g = pick(rng, [200, 300, 400, 500]);
    const fr = randInt(rng, 1, 4) * 10;
    return typed(`${g} g Käse. 1 kg kostet ${fr} Fr. Preis = ? Fr.`, String((fr * g) / 1000));
  },
  speedDist(rng) {
    const TABLE = [
      ['3', 20, '1'], ['3', 40, '2'], ['4.5', 20, '1.5'], ['4.5', 40, '3'],
      ['6', 10, '1'], ['6', 30, '3'], ['4.5', 60, '4.5'], ['5', 30, '2.5'], ['6', 20, '2'],
    ];
    const [v, min, ans] = pick(rng, TABLE);
    return typed(`${v} km/h. Nach ${min} min = ? km`, ans);
  },
  fuel(rng) {
    const per100 = randInt(rng, 4, 9);
    const km = randInt(rng, 2, 7) * 100;
    return typed(`${per100} l auf 100 km. Für ${formatNumber(km)} km = ? l`, String((per100 * km) / 100));
  },

  /* Stufe f: Anteile */
  sharePercent(rng) {
    const whole = pick(rng, [20, 40, 50, 60, 80, 200]);
    const p = pick(rng, [10, 20, 25, 50, 75]);
    const part = (whole * p) / 100;
    if (!Number.isInteger(part)) return KINDS.sharePercent(rng);
    return typed(`${part} von ${whole} = ? %`, String(p));
  },
  shareCompare(rng) {
    const b = pick(rng, [40, 50, 60, 80]);
    const d = pick(rng, [20, 25, 100]);
    const a = randInt(rng, 1, b - 1);
    let c = randInt(rng, 1, d - 1);
    while (a * d === c * b) c = randInt(rng, 1, d - 1);
    const options = [`${a} von ${b}`, `${c} von ${d}`];
    return { type: 'mc', expr: 'Wo ist der Anteil grösser?', options, answer: a / b > c / d ? 0 : 1 };
  },

  /* Stufe g: indirekt proportional, Prozent */
  indirectProp(rng) {
    const n = pick(rng, [3, 4, 6, 8]);
    const each = randInt(rng, 4, 13);
    return typed(`${n * each} Karten für ${n} Personen. Jede Person bekommt ? Karten`, String(each));
  },
  workers(rng) {
    const w1 = pick(rng, [4, 6, 8, 10]);
    const d1 = randInt(rng, 2, 6);
    const w2 = pick(rng, [2, w1 / 2].filter((x) => Number.isInteger(x) && x >= 1 && x !== w1));
    return typed(`${w1} Arbeiter brauchen ${d1} Tage. ${w2} Arbeiter brauchen ? Tage`, String((w1 * d1) / w2));
  },
  percentOf(rng) {
    const p = pick(rng, [5, 7, 10, 12, 20, 25]);
    const base = randInt(rng, 2, 9) * 100;
    return typed(`${p} % von ${base} = ?`, String((p * base) / 100));
  },

  /* Stufe h: Funktionswerte, Massstab */
  funcValue(rng) {
    const m = randInt(rng, 2, 6);
    const b = randInt(rng, 1, 9) * (rng() < 0.4 ? -1 : 1);
    const x = randInt(rng, 2, 9);
    const bTxt = b < 0 ? `- ${-b}` : `+ ${b}`;
    return typed(`y = ${m}x ${bTxt}. x = ${x} → y = ?`, String(m * x + b));
  },
  mapScale(rng) {
    const TABLE = [
      [4, "25'000", '1'], [8, "25'000", '2'], [12, "25'000", '3'],
      [2, "50'000", '1'], [6, "50'000", '3'], [10, "50'000", '5'],
      [3, "100'000", '3'], [5, "100'000", '5'],
    ];
    const [cm, scale, ans] = pick(rng, TABLE);
    return typed(`Massstab 1:${scale}. ${cm} cm auf der Karte = ? km`, ans);
  },

  /* Stufe i: Funktionen anwenden */
  funcValueEq(rng) {
    const m = randInt(rng, 2, 5);
    const b = randInt(rng, 1, 8) * (rng() < 0.5 ? -1 : 1);
    const x = randInt(rng, 3, 9);
    const bTxt = b < 0 ? `- ${-b}` : `+ ${b}`;
    return typed(`y = ${m}x ${bTxt}. x = ${x} → y = ?`, String(m * x + b));
  },
  tableLookup(rng) {
    const m = randInt(rng, 2, 5);
    const c = randInt(rng, 1, 9);
    const y = (x) => m * x + c;
    return typed(`x 2 → y ${y(2)}, x 4 → y ${y(4)}, x 6 → y ${y(6)}. x = 8 → y = ?`, String(y(8)));
  },
  steigung(rng) {
    const run = pick(rng, [50, 100, 200]);
    const p = randInt(rng, 4, 24);
    const up = (run * p) / 100;
    if (!Number.isInteger(up)) return KINDS.steigung(rng);
    return typed(`${up} m hinauf auf ${run} m vorwärts. Steigung = ? %`, String(p));
  },
  zins(rng) {
    const K = randInt(rng, 5, 80) * 100;
    const p = randInt(rng, 1, 5);
    return typed(`Kapital ${formatNumber(K)} Fr., Zinssatz ${p} %. Zins in einem Jahr = ? Fr.`, String((K * p) / 100));
  },

  /* Stufe j: Schnittpunkt zweier Geraden */
  intersect(rng) {
    const m1 = randInt(rng, 2, 5);
    let m2 = randInt(rng, 1, 4);
    if (m2 >= m1) m2 += 1;
    const x = randInt(rng, 2, 8);
    const c1 = randInt(rng, 1, 9);
    const c2 = (m1 - m2) * x + c1;
    return typed(`y = ${m1}x + ${c1} und y = ${m2}x + ${c2}. Schnittpunkt bei x = ?`, String(x));
  },

  /* Stufe k: Steigung, Achsenabschnitt, Nullstelle */
  slope(rng) {
    const m = randInt(rng, 2, 9);
    const b = randInt(rng, 1, 9);
    return typed(`y = ${m}x + ${b}. Steigung = ?`, String(m));
  },
  intercept(rng) {
    const m = randInt(rng, 2, 9);
    const b = randInt(rng, 1, 9) * (rng() < 0.5 ? -1 : 1);
    const bTxt = b < 0 ? `- ${-b}` : `+ ${b}`;
    return typed(`y = ${m}x ${bTxt}. y-Achsenabschnitt = ?`, String(b));
  },
  zero(rng) {
    const m = randInt(rng, 2, 6);
    const x0 = randInt(rng, 2, 9);
    return typed(`y = ${m}x - ${m * x0}. Nullstelle bei x = ?`, String(x0));
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
