// gen.js — Aufgaben-Generatoren für Figurenmass. Reine Funktionen ohne
// DOM; SVG-Figuren werden als Markup-Strings erzeugt und von der
// e2e-Suite direkt aus dem Markup nachgemessen (Strecken-Koordinaten,
// Zellen zählen, Polylinien-Längen). Jede Aufgabe:
//   { type: 'typed', expr, answer, svg? }
//   { type: 'mc', expr, options, answer, svg? }

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

function typed(expr, answer, svg) {
  return svg ? { type: 'typed', expr, answer, svg } : { type: 'typed', expr, answer };
}

function shuffled(rng, arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function mc(rng, expr, correct, wrongs, svg) {
  const options = shuffled(rng, [correct, ...wrongs]);
  const task = { type: 'mc', expr, options, answer: options.indexOf(correct) };
  if (svg) task.svg = svg;
  return task;
}

/* ── SVG-Bausteine (Zelle = 20 Einheiten) ────────────────────────── */

const CELL = 20;

function svgOpen(w, h) {
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-hidden="false" focusable="false">`;
}

// Raster-Linien als Hintergrund.
function grid(w, h) {
  let s = '';
  for (let x = 0; x <= w; x++) s += `<line x1="${x * CELL}" y1="0" x2="${x * CELL}" y2="${h * CELL}" class="grid-line" />`;
  for (let y = 0; y <= h; y++) s += `<line x1="0" y1="${y * CELL}" x2="${w * CELL}" y2="${y * CELL}" class="grid-line" />`;
  return s;
}

// Strecke über einem Zentimeter-Raster.
export function rasterLineSvg(n) {
  const w = (n + 1) * CELL;
  let s = svgOpen(w, 50);
  for (let x = 0; x <= n + 1; x++) {
    s += `<line x1="${x * CELL}" y1="34" x2="${x * CELL}" y2="44" class="grid-line" />`;
  }
  s += `<line x1="0" y1="39" x2="${w}" y2="39" class="grid-line" />`;
  s += `<line class="strecke" x1="${CELL / 2}" y1="16" x2="${CELL / 2 + n * CELL}" y2="16" />`;
  s += `<line x1="${CELL / 2}" y1="10" x2="${CELL / 2}" y2="22" class="strecke" />`;
  s += `<line x1="${CELL / 2 + n * CELL}" y1="10" x2="${CELL / 2 + n * CELL}" y2="22" class="strecke" />`;
  return s + '</svg>';
}

// Rechteck aus Einheitsquadraten.
export function cellRectSvg(w, h) {
  let s = svgOpen(w * CELL, h * CELL);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      s += `<rect class="cell" x="${x * CELL}" y="${y * CELL}" width="${CELL}" height="${CELL}" />`;
    }
  }
  return s + '</svg>';
}

// Unregelmässige Figur: gefüllte Zellen in einem Raster.
export function filledCellsSvg(w, h, cells) {
  let s = svgOpen(w * CELL, h * CELL);
  s += grid(w, h);
  for (const [x, y] of cells) {
    s += `<rect class="fill" x="${x * CELL}" y="${y * CELL}" width="${CELL}" height="${CELL}" />`;
  }
  return s + '</svg>';
}

// Zwei Wege als Polylinien auf einem Raster.
export function pathsSvg(w, h, pathA, pathB) {
  const pts = (path) => path.map(([x, y]) => `${x * CELL + 10},${y * CELL + 10}`).join(' ');
  let s = svgOpen(w * CELL + CELL, h * CELL + CELL);
  s += grid(w + 1, h + 1);
  s += `<polyline data-weg="A" class="weg weg-a" points="${pts(pathA)}" />`;
  s += `<polyline data-weg="B" class="weg weg-b" points="${pts(pathB)}" />`;
  s += `<text x="${pathA[0][0] * CELL + 2}" y="${pathA[0][1] * CELL + 6}" class="weg-label">A</text>`;
  s += `<text x="${pathB[0][0] * CELL + 2}" y="${pathB[0][1] * CELL + 6}" class="weg-label">B</text>`;
  return s + '</svg>';
}

// Achsenparalleler Zufallsweg mit gegebener Segmentzahl.
function randomPath(rng, segments, startX, startY) {
  const path = [[startX, startY]];
  let [x, y] = [startX, startY];
  let horizontal = true;
  let dir = 1;
  for (let i = 0; i < segments; i++) {
    if (horizontal) {
      if (x + dir < 0 || x + dir > 6) dir = -dir;
      x += dir;
    } else {
      y = y >= 4 ? y - 1 : y + 1;
    }
    path.push([x, y]);
    horizontal = !horizontal;
  }
  return path;
}

const KINDS = {
  /* Stufe a: Wege vergleichen, Konstanz der Länge */
  pathCompare(rng) {
    const lenA = randInt(rng, 4, 7);
    let lenB = randInt(rng, 4, 6);
    if (lenB >= lenA) lenB += 1;
    const pathA = randomPath(rng, lenA, 0, 1);
    const pathB = randomPath(rng, lenB, 0, 3);
    const svg = pathsSvg(7, 5, pathA, pathB);
    return mc(rng, 'Beide Wege bestehen aus gleich langen Stücken. Welcher Weg ist länger?',
      lenA > lenB ? 'Weg A' : 'Weg B', [lenA > lenB ? 'Weg B' : 'Weg A'], svg);
  },
  wireConstancy(rng) {
    const QA = [
      ['Ein Draht wird zu einem Ring gebogen. Wird er länger, kürzer oder bleibt er gleich lang?', 'gleich lang', ['länger', 'kürzer']],
      ['Eine Schnur wird zu einer Schlange gelegt. Wie lang ist sie jetzt?', 'gleich lang wie vorher', ['länger als vorher', 'kürzer als vorher']],
      ['Knete wird von einer Kugel zu einer Wurst gerollt. Wie viel Knete ist es jetzt?', 'gleich viel', ['mehr', 'weniger']],
      ['Wasser wird vom breiten ins schmale Glas gegossen. Wie viel Wasser ist es jetzt?', 'gleich viel', ['mehr', 'weniger']],
      ['Ein Blatt wird gefaltet. Wie schwer ist es jetzt?', 'gleich schwer', ['schwerer', 'leichter']],
      ['Ein Seil wird aufgerollt. Wie lang ist es jetzt?', 'gleich lang', ['kürzer', 'länger']],
      ['Ein Teig wird flachgedrückt. Wie viel Teig ist es jetzt?', 'gleich viel', ['weniger', 'mehr']],
      ['Eine Kette wird im Kreis gelegt statt gerade. Wie lang ist sie?', 'gleich lang', ['länger', 'kürzer']],
    ];
    const [q, correct, wrongs] = pick(rng, QA);
    return mc(rng, q, correct, wrongs);
  },

  /* Stufe b: messen auf 1 cm, Becher */
  rasterLine(rng) {
    const n = randInt(rng, 3, 12);
    return typed('Wie viele Kästchen (je 1 cm) lang ist die Strecke? Antwort in cm.', String(n), rasterLineSvg(n));
  },
  cupMeasure(rng) {
    const cup = randInt(rng, 2, 4);
    const total = cup * randInt(rng, 2, 6);
    return typed(`Ein Becher fasst ${cup} dl. Wie viele Becher füllen ${total} dl?`, String(total / cup));
  },

  /* Stufe c: Flächen und Würfelbauten vergleichen */
  compareRects(rng) {
    const a1 = randInt(rng, 2, 5);
    const a2 = randInt(rng, 2, 6);
    let b1 = randInt(rng, 2, 5);
    let b2 = randInt(rng, 2, 6);
    if (a1 * a2 === b1 * b2) b2 += 1;
    if (a1 * a2 === b1 * b2) { b1 += 1; b2 -= 1; }
    if (a1 * a2 === b1 * b2) b2 += 1;
    const options = [`Rechteck A: ${a1} auf ${a2} Quadrate`, `Rechteck B: ${b1} auf ${b2} Quadrate`];
    return { type: 'mc', expr: 'Welches Rechteck bedeckt mehr Quadrate?', options, answer: a1 * a2 > b1 * b2 ? 0 : 1 };
  },
  compareCubes(rng) {
    const a = [randInt(rng, 2, 3), randInt(rng, 2, 3), randInt(rng, 2, 3)];
    const b = [randInt(rng, 2, 3), randInt(rng, 2, 3), randInt(rng, 2, 4)];
    const va = a[0] * a[1] * a[2];
    let vb = b[0] * b[1] * b[2];
    if (va === vb) { b[2] += 1; vb = b[0] * b[1] * b[2]; }
    const options = [`Bau A: ${a[0]} · ${a[1]} · ${a[2]} Würfel`, `Bau B: ${b[0]} · ${b[1]} · ${b[2]} Würfel`];
    return { type: 'mc', expr: 'Welcher Würfelbau braucht mehr Würfel?', options, answer: va > vb ? 0 : 1 };
  },

  /* Stufe d: Einheitsquadrate auszählen */
  countSquares(rng) {
    const w = randInt(rng, 3, 8);
    const h = randInt(rng, 2, 5);
    return typed('Wie viele Einheitsquadrate bedecken das Rechteck?', String(w * h), cellRectSvg(w, h));
  },

  /* Stufe e: Umfang, Fläche, Würfelbauten */
  umfangRect(rng) {
    const a = randInt(rng, 2, 12);
    let b = randInt(rng, 2, 9);
    if (b === a) b += 1;
    return typed(`Rechteck: ${a} cm auf ${b} cm. Umfang = ? cm`, String(2 * (a + b)));
  },
  flaecheRect(rng) {
    if (rng() < 0.3) {
      const s = randInt(rng, 3, 12);
      return typed(`Quadrat: Seite ${s} cm. Fläche = ? cm²`, String(s * s));
    }
    const a = randInt(rng, 2, 12);
    const b = randInt(rng, 2, 9);
    return typed(`Rechteck: ${a} cm auf ${b} cm. Fläche = ? cm²`, String(a * b));
  },
  quaderWuerfel(rng) {
    const a = randInt(rng, 2, 4);
    const b = randInt(rng, 2, 4);
    const c = randInt(rng, 2, 5);
    return typed(`Ein Quader ist ${a} auf ${b} auf ${c} Würfel gross. Wie viele Würfel sind es?`, String(a * b * c));
  },

  /* Stufe f: Quader-Volumen, Flächen annähern */
  volumeQuader(rng) {
    const a = randInt(rng, 2, 8);
    const b = randInt(rng, 2, 6);
    const c = randInt(rng, 2, 5);
    return typed(`Quader: ${a} cm auf ${b} cm auf ${c} cm. Volumen = ? cm³`, String(a * b * c));
  },
  areaApprox(rng) {
    const w = 6;
    const h = 4;
    const cells = [];
    const centerX = randInt(rng, 2, 3);
    for (let y = 0; y < h; y++) {
      const halfWidth = y === 0 || y === h - 1 ? randInt(rng, 1, 2) : randInt(rng, 2, 3);
      for (let x = centerX - halfWidth + 1; x <= centerX + halfWidth - 1; x++) {
        if (x >= 0 && x < w) cells.push([x, y]);
      }
    }
    return typed('Wie viele ganze Quadrate sind gefärbt?', String(cells.length), filledCellsSvg(w, h, cells));
  },

  /* Stufe g: Dreiecke, Quader-Kanten und -Oberfläche */
  triangleArea(rng) {
    const g = randInt(rng, 2, 12) * 2;
    const hh = randInt(rng, 3, 9);
    return typed(`Dreieck: Grundlinie ${g} cm, Höhe ${hh} cm. Fläche = ? cm²`, String((g * hh) / 2));
  },
  quaderEdges(rng) {
    const a = randInt(rng, 2, 9);
    const b = randInt(rng, 2, 8);
    const c = randInt(rng, 2, 7);
    return typed(`Quader: ${a} cm auf ${b} cm auf ${c} cm. Alle 12 Kanten zusammen = ? cm`, String(4 * (a + b + c)));
  },
  quaderSurface(rng) {
    const a = randInt(rng, 2, 7);
    const b = randInt(rng, 2, 6);
    const c = randInt(rng, 2, 5);
    return typed(`Quader: ${a} cm auf ${b} cm auf ${c} cm. Oberfläche = ? cm²`, String(2 * (a * b + b * c + a * c)));
  },

  /* Stufe h: Pythagoras (pythagoreische Tripel) */
  pythagoras(rng) {
    const [a, b, c] = pick(rng, [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20], [7, 24, 25]]);
    return typed(`Rechtwinkliges Dreieck: Katheten ${a} cm und ${b} cm. Hypotenuse = ? cm`, String(c));
  },
  pythagorasLeg(rng) {
    const [a, b, c] = pick(rng, [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20]]);
    return typed(`Rechtwinkliges Dreieck: Hypotenuse ${c} cm, eine Kathete ${a} cm. Andere Kathete = ? cm`, String(b));
  },

  /* Stufe i: Kreis mit π ≈ 3.14, Prisma und Zylinder */
  circleCalc(rng) {
    const TABLE = [
      ['Kreis: Radius 10 cm. Umfang ≈ ? cm (π ≈ 3.14)', '62.8'],
      ['Kreis: Radius 10 cm. Fläche ≈ ? cm² (π ≈ 3.14)', '314'],
      ['Kreis: Radius 5 cm. Umfang ≈ ? cm (π ≈ 3.14)', '31.4'],
      ['Kreis: Radius 2 cm. Umfang ≈ ? cm (π ≈ 3.14)', '12.56'],
      ['Kreis: Radius 2 cm. Fläche ≈ ? cm² (π ≈ 3.14)', '12.56'],
      ['Kreis: Radius 1 cm. Fläche ≈ ? cm² (π ≈ 3.14)', '3.14'],
      ['Kreis: Durchmesser 10 cm. Umfang ≈ ? cm (π ≈ 3.14)', '31.4'],
      ['Kreis: Durchmesser 4 cm. Umfang ≈ ? cm (π ≈ 3.14)', '12.56'],
      ['Kreis: Radius 20 cm. Umfang ≈ ? cm (π ≈ 3.14)', '125.6'],
    ];
    const [expr, answer] = pick(rng, TABLE);
    return typed(expr, answer);
  },
  prismVolume(rng) {
    const G = randInt(rng, 3, 30);
    const hh = randInt(rng, 2, 9);
    const body = pick(rng, ['Prisma', 'Zylinder']);
    return typed(`${body}: Grundfläche ${G} cm², Höhe ${hh} cm. Volumen = ? cm³`, String(G * hh));
  },

  /* Stufe j: Pyramide, Winkelsumme, Thales */
  pyramidVolume(rng) {
    const G = randInt(rng, 2, 15) * 3;
    const hh = randInt(rng, 2, 9);
    const total = G * hh;
    if (total % 3 !== 0) return KINDS.pyramidVolume(rng);
    return typed(`Pyramide: Grundfläche ${G} cm², Höhe ${hh} cm. Volumen = ? cm³ (G · h : 3)`, String(total / 3));
  },
  angleSum(rng) {
    const a = randInt(rng, 3, 11) * 10;
    const b = randInt(rng, 2, Math.min(11, 16 - a / 10)) * 10;
    return typed(`Dreieck: Winkel ${a}° und ${b}°. Dritter Winkel = ?°`, String(180 - a - b));
  },
  thalesMc(rng) {
    const QA = [
      ['Ein Dreieck hat seine Spitze auf dem Halbkreis über dem Durchmesser. Wie gross ist der Winkel an der Spitze (Satz von Thales)?', '90°', ['60°', '45°']],
      ['Wie gross ist die Winkelsumme im Dreieck?', '180°', ['90°', '360°']],
      ['Wie gross ist die Winkelsumme im Viereck?', '360°', ['180°', '270°']],
    ];
    const [q, correct, wrongs] = pick(rng, QA);
    return mc(rng, q, correct, wrongs);
  },

  /* Stufe k: Ähnlichkeit */
  similarLength(rng) {
    const f = randInt(rng, 2, 5);
    const l = randInt(rng, 2, 9);
    return typed(`Ähnliche Figur mit Streckfaktor ${f}: Aus ${l} cm werden ? cm`, String(f * l));
  },
  similarArea(rng) {
    const f = randInt(rng, 2, 5);
    return typed(`Streckfaktor ${f}: Die Fläche wird ?-mal so gross`, String(f * f));
  },
  similarVolume(rng) {
    const f = randInt(rng, 2, 4);
    return typed(`Streckfaktor ${f}: Das Volumen wird ?-mal so gross`, String(f * f * f));
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
    const key = task.expr + '|' + (task.options ? [...task.options].sort().join('|') : '') + '|' + (task.svg || '');
    if (seen.has(key)) continue;
    seen.add(key);
    tasks.push(task);
  }
  return tasks;
}
