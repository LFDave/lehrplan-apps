// gen.js — Aufgaben-Generatoren für Masswerk. Reine Funktionen ohne
// DOM; die e2e-Suite importiert sie direkt und rechnet die Ausdrücke
// mit einem eigenen Einheiten-Parser nach. Jede Aufgabe:
//   { type: 'typed', expr, answer }               getippte Antwort
//   { type: 'mc', expr, options, answer }         Auswahl (Index)
// Grössen stehen als "Zahl Einheit"; das Ziel steht als "? Einheit".

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

function pad2(n) {
  return String(n).padStart(2, '0');
}

const KINDS = {
  /* Stufe b: ganze Franken bis 20, halbe Stunden */
  moneyAdd(rng) {
    const a = randInt(rng, 2, 15);
    const b = randInt(rng, 1, 20 - a);
    return typed(`${a} Fr. + ${b} Fr. = ? Fr.`, String(a + b));
  },
  moneySub(rng) {
    const a = randInt(rng, 5, 20);
    const b = randInt(rng, 1, a - 1);
    return typed(`${a} Fr. - ${b} Fr. = ? Fr.`, String(a - b));
  },
  halfHour(rng) {
    const h = randInt(rng, 6, 17);
    const half = rng() < 0.5;
    const endH = half ? h : h;
    const answer = half ? `${pad2(h + 1)}:00` : `${pad2(endH)}:30`;
    const start = half ? `${pad2(h)}:30` : `${pad2(h)}:00`;
    return typed(`Eine halbe Stunde nach ${start} = ?`, answer);
  },

  /* Stufe c: Längen bis 1 m, Meter teilen, Geld halbieren */
  lenAdd(rng) {
    const a = randInt(rng, 10, 70);
    const b = randInt(rng, 5, 100 - a);
    return typed(`${a} cm + ${b} cm = ? cm`, String(a + b));
  },
  doubleLen(rng) {
    const a = randInt(rng, 6, 50);
    return typed(`Das Doppelte von ${a} cm = ? cm`, String(2 * a));
  },
  halfMoney(rng) {
    const a = randInt(rng, 2, 10) * 2;
    return typed(`Die Hälfte von ${a} Fr. = ? Fr.`, String(a / 2));
  },
  meterParts(rng) {
    const parts = pick(rng, [2, 5, 10]);
    return typed(`1 m in ${parts} gleiche Teile = ? cm`, String(100 / parts));
  },

  /* Stufe d: Franken und Rappen, Zeitdauern */
  moneyRp(rng) {
    const aF = randInt(rng, 4, 30);
    const aR = randInt(rng, 1, 8) * 10;
    const bF = randInt(rng, 3, 25);
    const bR = randInt(rng, 1, 9 - aR / 10) * 10;
    const total = (aF + bF) * 100 + aR + bR;
    return typed(
      `${aF} Fr. ${aR} Rp. + ${bF} Fr. ${bR} Rp. = ? Fr.`,
      formatNumber(total / 100, 2),
    );
  },
  duration(rng) {
    const h = randInt(rng, 7, 16);
    const m1 = randInt(rng, 1, 5) * 10;
    const dur = randInt(rng, 2, 9) * 5;
    const total = m1 + dur;
    const endH = h + Math.floor(total / 60);
    const endM = total % 60;
    return typed(`Von ${pad2(h)}:${pad2(m1)} bis ${pad2(endH)}:${pad2(endM)} = ? min`, String(dur));
  },

  /* Stufe e: benachbarte Einheiten */
  convertNeighbor(rng) {
    const variants = [
      () => { const a = randInt(rng, 1, 9); return [`${a * 1000} g = ? kg`, String(a)]; },
      () => { const a = randInt(rng, 2, 9); return [`${a} kg = ? g`, formatNumber(a * 1000)]; },
      () => { const a = randInt(rng, 2, 9); return [`${a} m = ? cm`, String(a * 100)]; },
      () => { const a = randInt(rng, 2, 9); return [`${a * 10} mm = ? cm`, String(a)]; },
      () => { const a = randInt(rng, 2, 9); return [`${a} l = ? dl`, String(a * 10)]; },
      () => { const a = randInt(rng, 2, 9); return [`${a * 10} dl = ? l`, String(a)]; },
    ];
    const [expr, answer] = pick(rng, variants)();
    return typed(expr, answer);
  },
  addUnits(rng) {
    const m = randInt(rng, 1, 4);
    const cm = randInt(rng, 2, 9) * 10;
    return typed(`${m} m + ${cm} cm = ? cm`, String(m * 100 + cm));
  },

  /* Stufe g: rechnen über Einheitsgrenzen, Zeit umwandeln */
  calcUnits(rng) {
    const variants = [
      () => { const g = randInt(rng, 1, 8) * 100; return [`1 kg - ${g} g = ? g`, String(1000 - g)]; },
      () => { const cm = randInt(rng, 1, 8) * 10; return [`1 m - ${cm} cm = ? cm`, String(100 - cm)]; },
      () => { const dl = randInt(rng, 1, 8); return [`1 l - ${dl} dl = ? dl`, String(10 - dl)]; },
    ];
    const [expr, answer] = pick(rng, variants)();
    return typed(expr, answer);
  },
  timeToMin(rng) {
    const h = randInt(rng, 1, 3);
    const m = randInt(rng, 1, 11) * 5;
    return typed(`${h} h ${m} min = ? min`, String(h * 60 + m));
  },
  minToH(rng) {
    const h = randInt(rng, 2, 5);
    return typed(`${h * 60} min = ? h`, String(h));
  },

  /* Stufe h: vergleichen, zweifach benannt, runden */
  compare(rng) {
    const variants = [
      () => {
        const dl = randInt(rng, 8, 25);
        const l = (dl + pick(rng, [-2, -1, 1, 2, 3])) / 10;
        return [`${formatNumber(l, 1)} l`, `${dl} dl`, l * 100, dl * 10];
      },
      () => {
        const g = randInt(rng, 800, 3200);
        const kg = (g + pick(rng, [-300, -200, 200, 300])) / 1000;
        return [`${formatNumber(kg, 1)} kg`, `${formatNumber(g)} g`, kg * 1000, g];
      },
      () => {
        const cm = randInt(rng, 90, 320);
        const m = (cm + pick(rng, [-30, -20, 20, 30])) / 100;
        return [`${formatNumber(m, 1)} m`, `${cm} cm`, m * 100, cm];
      },
    ];
    const [optA, optB, valA, valB] = pick(rng, variants)();
    return {
      type: 'mc',
      expr: 'Was ist mehr?',
      options: [optA, optB],
      answer: valA > valB ? 0 : 1,
    };
  },
  twoUnit(rng) {
    const variants = [
      () => { const m = randInt(rng, 1, 4); const cm = randInt(rng, 5, 95); return [`${m} m ${cm} cm = ? cm`, String(m * 100 + cm)]; },
      () => { const kg = randInt(rng, 1, 5); const g = randInt(rng, 1, 9) * 100; return [`${kg} kg ${g} g = ? g`, formatNumber(kg * 1000 + g)]; },
    ];
    const [expr, answer] = pick(rng, variants)();
    return typed(expr, answer);
  },
  roundUnit(rng) {
    const whole = randInt(rng, 2, 18);
    const frac = pick(rng, [0.08, 0.17, 0.29, 0.31, 0.42, 0.58, 0.66, 0.71, 0.84, 0.93]);
    const value = whole + frac;
    const unit = pick(rng, ['kg', 'm', 'l']);
    return typed(`Runde ${formatNumber(value, 2)} ${unit} auf ganze ${unit} = ? ${unit}`, String(Math.round(value)));
  },

  /* Stufe i: Flächen, Volumen, relativ vergleichen */
  areaVol(rng) {
    const variants = [
      () => { const a = randInt(rng, 2, 9); return [`${a} m² = ? dm²`, String(a * 100)]; },
      () => { const a = randInt(rng, 2, 9); return [`${a * 100} dm² = ? m²`, String(a)]; },
      () => { const a = randInt(rng, 2, 9); return [`${a} m³ = ? l`, formatNumber(a * 1000)]; },
      () => { const a = randInt(rng, 2, 9); return [`${a} dm³ = ? l`, String(a)]; },
    ];
    const [expr, answer] = pick(rng, variants)();
    return typed(expr, answer);
  },
  relPercent(rng) {
    const base = pick(rng, [20, 40, 60, 80, 200]); // alle durch 20 teilbar, damit der Anteil ganzzahlig ist
    const p = pick(rng, [10, 25, 50, 75]);
    const part = base * p / 100;
    const wrongs = [p / 5, p * 2, p + 15].filter((x) => x !== p && x > 0 && x <= 100);
    const options = [String(p), String(wrongs[0]), String(wrongs[1] ?? p + 5)].map((x) => `${x}%`);
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    return {
      type: 'mc',
      expr: `${formatNumber(part)} von ${formatNumber(base)} = ? %`,
      options,
      answer: options.indexOf(`${p}%`),
    };
  },

  /* Stufe j: SI-Vorsätze */
  prefix(rng) {
    const PREFIXES = [
      ['Mega', '10⁶'], ['Kilo', '10³'], ['Dezi', '10⁻¹'], ['Centi', '10⁻²'], ['Milli', '10⁻³'],
    ];
    const [name, power] = pick(rng, PREFIXES);
    const others = PREFIXES.filter(([n]) => n !== name);
    const wrong = [pick(rng, others)[1]];
    let second = pick(rng, others)[1];
    let guard = 0;
    while ((second === wrong[0] || second === power) && guard++ < 20) second = pick(rng, others)[1];
    const options = [power, wrong[0], second];
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    return {
      type: 'mc',
      expr: `Welche Zehnerpotenz gehört zu ${name}?`,
      options,
      answer: options.indexOf(power),
    };
  },

  /* Stufe k: Geschwindigkeiten */
  speedToKmh(rng) {
    const ms = pick(rng, [5, 10, 15, 20, 25, 30]);
    const s = pick(rng, [5, 10, 20]);
    const m = ms * s;
    return typed(`${formatNumber(m)} m in ${s} s = ? km/h`, formatNumber(ms * 3.6, ms * 3.6 % 1 === 0 ? 0 : 1));
  },
  speedToMs(rng) {
    const ms = pick(rng, [5, 10, 15, 20, 25]);
    return typed(`${formatNumber(ms * 3.6, 0)} km/h = ? m/s`, String(ms));
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
    const key = task.expr + (task.options ? task.options.join('|') : '');
    if (seen.has(key)) continue;
    seen.add(key);
    tasks.push(task);
  }
  return tasks;
}
