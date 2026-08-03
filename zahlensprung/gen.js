// gen.js — Aufgaben-Generatoren für Zahlensprung. Reine Funktionen ohne
// DOM; die e2e-Suite importiert sie direkt. Alle Zahlen einer Aufgabe,
// auch das Ergebnis, bleiben im Zahlenraum der Stufe.
//
// Jede Aufgabe: { type, ... , answer }. `answer` ist beim Tippen die
// erwartete Zeichenkette, beim Ordnen die aufsteigende Reihenfolge der
// Werte, bei der Auswahl der Index der richtigen Option.

// Schweizer Tausendertrennung mit Apostroph, Dezimalpunkt wie im Lehrplan.
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

function round(n, decimals) {
  const f = 10 ** decimals;
  return Math.round(n * f) / f;
}

/* ── Punkte zählen ────────────────────────────────────────────── */

export function genCount(rng, params) {
  const n = randInt(rng, 5, params.countMax);
  return { type: 'count', dots: n, answer: String(n) };
}

/* ── Zahlenfolgen ─────────────────────────────────────────────── */

export function genSequence(rng, params) {
  const decimals = params.decimals || 0;
  const step = pick(rng, params.steps);
  const dir = params.backward && rng() < 0.5 ? -1 : 1;
  const shown = 4;
  const span = step * shown; // 4 gezeigte plus die Antwort
  let start;
  if (dir === 1) {
    start = round(rng() * (params.max - span), decimals);
  } else {
    start = round(span + rng() * (params.max - span), decimals);
  }
  if (decimals === 0) start = Math.round(start);
  // Bei ganzzahligen Schritten auf ein Vielfaches des Schritts setzen,
  // damit die Folge natürlich wirkt (z.B. 35, 40, 45 statt 33, 38, 43).
  if (decimals === 0 && step >= 5) start = Math.round(start / step) * step;
  if (dir === 1 && start + span > params.max) start = params.max - span;
  if (dir === -1 && start - span < 0) start = span;
  const terms = [];
  for (let i = 0; i < shown; i++) terms.push(round(start + dir * step * i, decimals));
  const answer = round(start + dir * step * shown, decimals);
  return {
    type: 'sequence',
    terms: terms.map((t) => formatNumber(t, decimals)),
    answer: formatNumber(answer, decimals),
  };
}

/* ── Zahlen ordnen ────────────────────────────────────────────── */

function distinctValues(rng, count, make) {
  const values = new Set();
  let guard = 0;
  while (values.size < count && guard++ < 200) values.add(make());
  return [...values];
}

export function genOrder(rng, params) {
  const count = params.orderCount;
  let values;
  let decimals = 0;
  if (params.orderKind === 'decimals') {
    decimals = randInt(rng, 1, 3);
    // Ähnliche Ziffern, verschiedene Stellen: 1.043, 1.43, 1.05 ...
    const base = randInt(rng, 0, 8);
    values = distinctValues(rng, count, () => round(base + rng(), decimals));
  } else if (params.orderKind === 'negatives') {
    decimals = rng() < 0.5 ? 1 : 0;
    values = distinctValues(rng, count, () => round(-20 + rng() * 40, decimals));
  } else {
    values = distinctValues(rng, count, () => randInt(rng, 0, params.orderMax));
  }
  const sorted = [...values].sort((a, b) => a - b);
  return {
    type: 'order',
    items: values.map((v) => formatNumber(v, decimals)),
    answer: sorted.map((v) => formatNumber(v, decimals)),
  };
}

/* ── Überschlagen ─────────────────────────────────────────────── */

function estimateOptions(rng, correct) {
  // Zwei Ablenker in anderer Grössenordnung bzw. deutlich daneben.
  const factor = pick(rng, [10, 0.1]);
  const wrong1 = correct * factor;
  const wrong2 = correct * pick(rng, [2, 0.5, 5]);
  const options = [correct, wrong1, wrong2];
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return { options, answer: options.indexOf(correct) };
}

export function genEstimate(rng, params) {
  let expr;
  let correct;
  if (params.estimateKind === 'natural') {
    const kind = pick(rng, ['+', '-', '×', ':']);
    if (kind === '+') {
      const a = randInt(rng, 10, 45) * 1000 + randInt(rng, 0, 999);
      const b = randInt(rng, 10, 45) * 1000 + randInt(rng, 0, 999);
      correct = Math.round((a + b) / 10000) * 10000;
      expr = `${formatNumber(a)} + ${formatNumber(b)}`;
    } else if (kind === '-') {
      const b = randInt(rng, 10, 40) * 1000 + randInt(rng, 0, 999);
      const a = b + randInt(rng, 10, 40) * 1000;
      correct = Math.round((a - b) / 10000) * 10000;
      expr = `${formatNumber(a)} - ${formatNumber(b)}`;
    } else if (kind === '×') {
      const a = randInt(rng, 18, 52);
      const b = randInt(rng, 180, 520);
      correct = Math.round(a / 10) * 10 * (Math.round(b / 100) * 100);
      expr = `${formatNumber(a)} · ${formatNumber(b)}`;
    } else {
      // a : d ≈ q, wobei d auf Hunderter gerundet aufgeht (592'000 : 195 ≈ 3'000)
      const d = randInt(rng, 15, 45) * 10;
      const dRounded = Math.round(d / 100) * 100;
      const q = randInt(rng, 2, 9) * 100;
      const a = q * dRounded + randInt(rng, -5, 5) * 100;
      correct = q;
      expr = `${formatNumber(a)} : ${formatNumber(d)}`;
    }
  } else if (params.estimateKind === 'decimal-percent') {
    if (rng() < 0.5) {
      const a = round(randInt(rng, 1, 40) + rng(), 2);
      const b = round(randInt(rng, 1, 40) + rng(), 2);
      correct = Math.round(a + b);
      expr = `${formatNumber(a, 2)} + ${formatNumber(b, 2)}`;
    } else {
      const pct = pick(rng, [10, 20, 25, 50]);
      const base = randInt(rng, 2, 90) * 100;
      correct = base * pct / 100;
      expr = `${pct}% von ${formatNumber(base)}`;
    }
  } else {
    // decimal-multiply
    if (rng() < 0.5) {
      // 3.9 · 15 ≈ 4 · 15: nur der Dezimalfaktor wird gerundet
      const a = round(pick(rng, [1.8, 2.9, 3.8, 4.9, 9.7]) + rng() * 0.2, 1);
      const b = randInt(rng, 11, 39);
      correct = Math.round(a) * b;
      expr = `${formatNumber(a, 1)} · ${formatNumber(b)}`;
    } else {
      const d = pick(rng, [0.1, 0.5, 2, 4]);
      const q = pick(rng, [30, 60, 90, 300]);
      const a = round(q * d * (1 + (rng() - 0.5) * 0.1), 1);
      correct = q;
      expr = `${formatNumber(a, 1)} : ${formatNumber(d, d < 1 ? 1 : 0)}`;
    }
  }
  const { options, answer } = estimateOptions(rng, correct);
  return {
    type: 'estimate',
    expr,
    options: options.map((o) => formatNumber(round(o, 2), Number.isInteger(o) ? 0 : 2)),
    answer,
  };
}

/* ── Runden ───────────────────────────────────────────────────── */

const GENERATORS = { count: genCount, sequence: genSequence, order: genOrder, estimate: genEstimate };

export function genTask(rng, stufe) {
  const type = pick(rng, stufe.tasks);
  return GENERATORS[type](rng, stufe.params);
}

export function genRound(rng, stufe, length = 8) {
  const tasks = [];
  const seen = new Set();
  let guard = 0;
  while (tasks.length < length && guard++ < 200) {
    const task = genTask(rng, stufe);
    const key = JSON.stringify([task.type, task.terms, task.items, task.expr, task.dots]);
    if (seen.has(key)) continue;
    seen.add(key);
    tasks.push(task);
  }
  return tasks;
}
