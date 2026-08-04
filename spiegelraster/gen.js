// gen.js — Aufgaben-Generatoren für Spiegelraster. Reine Funktionen
// ohne DOM. Figuren sind Zellmengen in einem Raster; das Test-Orakel
// liest die Zellen aus dem SVG-Markup und rechnet die Abbildungen mit
// eigenen Transformationen nach. Alle Spielfiguren sind chirale
// Polyominos ohne Dreh- und Spiegelsymmetrie, damit gespiegelt,
// gedreht und verschoben nie zusammenfallen. Jede Aufgabe:
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

/* ── Zellgeometrie ───────────────────────────────────────────────── */

const CELL = 20;

// Chirale Polyominos ohne jede Symmetrie (L4, P5, F5, Y5).
export const PIECES = [
  [[0, 0], [0, 1], [0, 2], [1, 2]],
  [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2]],
  [[1, 0], [2, 0], [0, 1], [1, 1], [1, 2]],
  [[0, 1], [1, 0], [1, 1], [1, 2], [1, 3]],
];

export function normalize(cells) {
  const minX = Math.min(...cells.map(([x]) => x));
  const minY = Math.min(...cells.map(([, y]) => y));
  return cells.map(([x, y]) => [x - minX, y - minY])
    .sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

export function mirror(cells) {
  const maxX = Math.max(...cells.map(([x]) => x));
  return normalize(cells.map(([x, y]) => [maxX - x, y]));
}

// Drehung im Uhrzeigersinn.
export function rot90(cells) {
  const maxY = Math.max(...cells.map(([, y]) => y));
  return normalize(cells.map(([x, y]) => [maxY - y, x]));
}

export function rot180(cells) {
  return rot90(rot90(cells));
}

export function rot270(cells) {
  return rot90(rot180(cells));
}

function sameCells(a, b) {
  return JSON.stringify(normalize(a)) === JSON.stringify(normalize(b));
}

/* ── SVG-Bausteine ───────────────────────────────────────────────── */

function svgOpen(w, h) {
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-hidden="false" focusable="false">`;
}

function gridLines(x0, y0, w, h) {
  let s = '';
  for (let x = 0; x <= w; x++) s += `<line class="grid-line" x1="${x0 + x * CELL}" y1="${y0}" x2="${x0 + x * CELL}" y2="${y0 + h * CELL}" />`;
  for (let y = 0; y <= h; y++) s += `<line class="grid-line" x1="${x0}" y1="${y0 + y * CELL}" x2="${x0 + w * CELL}" y2="${y0 + y * CELL}" />`;
  return s;
}

function cellRects(cells, x0, y0, cls, group = '') {
  const rects = cells.map(([x, y]) =>
    `<rect class="${cls}" x="${x0 + x * CELL}" y="${y0 + y * CELL}" width="${CELL}" height="${CELL}" />`).join('');
  return group ? `<g data-kand="${group}">${rects}</g>` : rects;
}

// Original links, drei Kandidaten rechts, alle in eigenen Rastern.
function candidatesSvg(original, candidates) {
  const boxW = 4 * CELL;
  const gap = 14;
  const labels = ['A', 'B', 'C'];
  const width = boxW * 4 + gap * 3 + 8;
  let s = svgOpen(width, 5 * CELL + 18);
  s += gridLines(0, 14, 4, 4) + cellRects(original, 0, 14, 'cell orig');
  s += `<text class="fig-label" x="${boxW / 2 - 4}" y="10">Original</text>`;
  candidates.forEach((cells, i) => {
    const x0 = (boxW + gap) * (i + 1) + 8;
    s += gridLines(x0, 14, 4, 4);
    s += cellRects(cells, x0, 14, 'cell kand', labels[i]);
    s += `<text class="fig-label" x="${x0 + boxW / 2 - 4}" y="10">${labels[i]}</text>`;
  });
  return s + '</svg>';
}

// Zwei Figuren in einem gemeinsamen Raster (links Original, rechts Bild).
function pairSvg(orig, trans, w = 10, h = 5) {
  let s = svgOpen(w * CELL, h * CELL);
  s += gridLines(0, 0, w, h);
  s += cellRects(orig, 0, 0, 'cell orig');
  s += cellRects(trans, 0, 0, 'cell trans');
  return s + '</svg>';
}

function place(cells, dx, dy) {
  return cells.map(([x, y]) => [x + dx, y + dy]);
}

/* ── Aufgabenformen ──────────────────────────────────────────────── */

const MINI = {
  Kreis: (x) => `<circle class="mini" cx="${x + 9}" cy="14" r="8" />`,
  Dreieck: (x) => `<polygon class="mini" points="${x + 1},22 ${x + 17},22 ${x + 9},6" />`,
  Quadrat: (x) => `<rect class="mini" x="${x + 1}" y="6" width="16" height="16" />`,
};

function sequenceSvg(seq) {
  let s = svgOpen(seq.length * 24 + 30, 28);
  seq.forEach((shape, i) => { s += MINI[shape](i * 24 + 2); });
  s += `<text class="fig-label" x="${seq.length * 24 + 8}" y="19">?</text>`;
  return s + '</svg>';
}

function patternTask(rng, periodChoices) {
  const shapes = shuffled(rng, ['Kreis', 'Dreieck', 'Quadrat']);
  const period = pick(rng, periodChoices);
  const base = shapes.slice(0, period);
  const len = period === 2 ? 6 : 6;
  const seq = Array.from({ length: len }, (_, i) => base[i % period]);
  const next = base[len % period];
  const options = shuffled(rng, ['Kreis', 'Dreieck', 'Quadrat']);
  return { type: 'mc', expr: 'Wie geht das Muster weiter?', options, answer: options.indexOf(next), svg: sequenceSvg(seq) };
}

const KINDS = {
  /* Stufe a: Muster */
  patternNext(rng) { return patternTask(rng, [2, 3]); },

  /* Stufe b: aus Dreiecken zusammengesetzt */
  countParts(rng) {
    const n = randInt(rng, 2, 6);
    const fan = rng() < 0.5;
    let s = svgOpen(140, 80);
    if (fan) {
      for (let i = 0; i < n; i++) {
        const x1 = 10 + i * 20;
        const x2 = 30 + i * 20;
        s += `<polygon class="part" points="70,10 ${x1},70 ${x2},70" />`;
      }
    } else {
      for (let i = 0; i < n; i++) {
        const x = 10 + i * 20;
        const up = i % 2 === 0;
        s += up
          ? `<polygon class="part" points="${x},70 ${x + 20},70 ${x + 10},20" />`
          : `<polygon class="part" points="${x - 10},20 ${x + 10},20 ${x},70" />`;
      }
    }
    s += '</svg>';
    return typed('Aus wie vielen Dreiecken besteht die Figur?', String(n), s);
  },

  /* Stufe c: Symmetrie */
  symmetryCheck(rng) {
    const w = 4;
    const h = 4;
    const half = [];
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < 2; x++) if (rng() < 0.55) half.push([x, y]);
    }
    if (half.length < 3) half.push([0, 1], [1, 2]);
    let cells = [...half, ...half.map(([x, y]) => [w - 1 - x, y])];
    cells = [...new Map(cells.map((c) => [c.join(','), c])).values()];
    const symmetric = rng() < 0.5;
    if (!symmetric) {
      // Eine Zelle entfernen: ihr Spiegelpartner bleibt allein zurück,
      // die Figur ist sicher unsymmetrisch (bei w = 4 spiegelt keine
      // Zelle auf sich selbst).
      const victim = pick(rng, cells);
      cells = cells.filter((c) => c !== victim);
      const stillSym = cells.every(([x, y]) => cells.some(([cx, cy]) => cx === w - 1 - x && cy === y));
      if (stillSym) return KINDS.symmetryCheck(rng);
    }
    let s = svgOpen(w * CELL + 2, h * CELL + 2);
    s += gridLines(1, 1, w, h);
    s += cellRects(cells, 1, 1, 'cell orig');
    s += `<line class="achse" x1="${1 + (w / 2) * CELL}" y1="0" x2="${1 + (w / 2) * CELL}" y2="${h * CELL + 2}" />`;
    s += '</svg>';
    const options = ['Ja', 'Nein'];
    return { type: 'mc', expr: 'Ist die Figur symmetrisch zur eingezeichneten Achse?', options, answer: symmetric ? 0 : 1, svg: s };
  },
  axesCount(rng) {
    const TABLE = [
      ['Wie viele Symmetrieachsen hat ein Quadrat?', '4'],
      ['Wie viele Symmetrieachsen hat ein Rechteck (kein Quadrat)?', '2'],
      ['Wie viele Symmetrieachsen hat ein gleichseitiges Dreieck?', '3'],
    ];
    const [q, a] = pick(rng, TABLE);
    return typed(q, a);
  },
  ornamentNext(rng) { return patternTask(rng, [3]); },

  /* Stufe d: vergrössern, zerlegen */
  growGrid(rng) {
    const w = randInt(rng, 2, 5);
    const h = randInt(rng, 2, 4);
    const f = randInt(rng, 2, 3);
    const dim = rng() < 0.5;
    return typed(
      dim
        ? `Ein Rechteck ist ${w} auf ${h} Kästchen. Es wird mit Faktor ${f} vergrössert. Wie viele Kästchen breit ist es dann?`
        : `Ein Rechteck ist ${w} auf ${h} Kästchen. Es wird mit Faktor ${f} vergrössert. Wie viele Kästchen hoch ist es dann?`,
      String(dim ? w * f : h * f),
    );
  },
  zerlegeFacts(rng) {
    const TABLE = [
      ['Ein Viereck zerlegst du von einer Ecke aus in Dreiecke. Wie viele entstehen?', '2'],
      ['Ein Fünfeck zerlegst du von einer Ecke aus in Dreiecke. Wie viele entstehen?', '3'],
      ['Ein Sechseck zerlegst du von einer Ecke aus in Dreiecke. Wie viele entstehen?', '4'],
      ['Ein Achteck zerlegst du von einer Ecke aus in Dreiecke. Wie viele entstehen?', '6'],
    ];
    const [q, a] = pick(rng, TABLE);
    return typed(q, a);
  },

  /* Stufe e: Spiegelbild finden */
  mirrorPick(rng) {
    const piece = normalize(pick(rng, PIECES));
    const candidates = shuffled(rng, [
      { cells: mirror(piece), correct: true },
      { cells: piece, correct: false },
      { cells: rot180(piece), correct: false },
    ]);
    const svg = candidatesSvg(piece, candidates.map((c) => c.cells));
    const answer = candidates.findIndex((c) => c.correct);
    return { type: 'mc', expr: 'Welches Bild zeigt die Spiegelung des Originals an einer senkrechten Achse?', options: ['A', 'B', 'C'], answer, svg };
  },
  mirrorCheck(rng) {
    const piece = normalize(pick(rng, PIECES));
    const isMirror = rng() < 0.5;
    const other = isMirror ? mirror(piece) : pick(rng, [piece, rot180(piece)]);
    const svg = pairSvg(place(piece, 1, 1), place(other, 6, 1));
    const options = ['Ja', 'Nein'];
    return { type: 'mc', expr: 'Rechts steht ein zweites Bild. Ist es das Spiegelbild der linken Figur (senkrechte Achse)?', options, answer: isMirror ? 0 : 1, svg };
  },

  /* Stufen f und g: Abbildung erkennen */
  transformRecognize(rng) {
    const piece = normalize(pick(rng, PIECES));
    const kind = pick(rng, ['verschoben', 'gespiegelt', 'gedreht']);
    const trans = kind === 'verschoben' ? piece
      : kind === 'gespiegelt' ? mirror(piece)
        : pick(rng, [rot90, rot270])(piece);
    const svg = pairSvg(place(piece, 1, 1), place(trans, 6, 1));
    const options = shuffled(rng, ['verschoben', 'gespiegelt', 'gedreht']);
    return { type: 'mc', expr: 'Links das Original, rechts das Bild. Wie wurde die Figur abgebildet?', options, answer: options.indexOf(kind), svg };
  },

  /* Stufe g: Streckfaktor ablesen */
  scaleFactor(rng) {
    const piece = normalize(pick(rng, PIECES).slice(0, 4));
    const f = randInt(rng, 2, 3);
    const scaled = piece.flatMap(([x, y]) => {
      const block = [];
      for (let dy = 0; dy < f; dy++) for (let dx = 0; dx < f; dx++) block.push([x * f + dx, y * f + dy]);
      return block;
    });
    const svg = pairSvg(place(piece, 0, 1), place(scaled, 4, 0), 14, 9);
    return typed('Die rechte Figur ist die Vergrösserung der linken. Mit welchem Faktor?', String(f), svg);
  },

  /* Stufe h: Drehwinkel bestimmen */
  rotateAngle(rng) {
    const piece = normalize(pick(rng, PIECES));
    const angle = pick(rng, [90, 180, 270]);
    const fn = angle === 90 ? rot90 : angle === 180 ? rot180 : rot270;
    const svg = pairSvg(place(piece, 1, 1), place(fn(piece), 6, 1));
    return typed('Links das Original, rechts das Bild. Um wie viel Grad wurde im Uhrzeigersinn gedreht?', String(angle), svg);
  },

  /* Stufe i: Punktspiegelung */
  pointMirrorPick(rng) {
    const piece = normalize(pick(rng, PIECES));
    const candidates = shuffled(rng, [
      { cells: rot180(piece), correct: true },
      { cells: mirror(piece), correct: false },
      { cells: piece, correct: false },
    ]);
    const svg = candidatesSvg(piece, candidates.map((c) => c.cells));
    const answer = candidates.findIndex((c) => c.correct);
    return { type: 'mc', expr: 'Welches Bild zeigt die Punktspiegelung (Drehung um 180 Grad) des Originals?', options: ['A', 'B', 'C'], answer, svg };
  },

  /* Stufe j: Koordinaten */
  streckFactor(rng) {
    const f = randInt(rng, 2, 4);
    const x = randInt(rng, 1, 5);
    const y = randInt(rng, 1, 4);
    return typed(`A(${x}|${y}) wird vom Nullpunkt aus gestreckt zu A'(${f * x}|${f * y}). Streckfaktor = ?`, String(f));
  },
  coordTransform(rng) {
    const x = randInt(rng, 1, 8);
    const y = randInt(rng, 1, 8);
    const double = rng() < 0.5;
    return typed(
      double
        ? `P(${x}|${y}). Die y-Koordinate wird verdoppelt. P' = (${x}|?)`
        : `P(${x}|${y}). Die x-Koordinate wird verdoppelt. P' = (?|${y})`,
      String(double ? 2 * y : 2 * x),
    );
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
    // zählt als Duplikat; bei Figuren-Aufgaben zählt die Figur mit.
    const key = task.expr + '|' + (task.options ? [...task.options].sort().join('|') : '') + '|' + (task.svg || '');
    if (seen.has(key)) continue;
    seen.add(key);
    tasks.push(task);
  }
  return tasks;
}
