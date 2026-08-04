// gen.js — Aufgaben-Generatoren für Formenreich. Reine Funktionen ohne
// DOM. SVG-Figuren werden als Markup-Strings erzeugt; die e2e-Suite
// klassifiziert die Figuren unabhängig aus der Geometrie des Markups
// (Element-Signaturen, Parallelität, Seitenlängen), sie kennt die
// Generator-Schlüssel nicht. Jede Aufgabe:
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

/* ── SVG-Figurenbibliothek ───────────────────────────────────────── */
// Signatur-Kontrakt fürs Test-Orakel: Kreis = 1 circle; Kugel =
// circle + ellipse; 2D-Vielecke = 1 polygon; Quadrat/Rechteck =
// 1 rect; Würfel/Quader = 2 rects + 4 Linien; Zylinder = 2 ellipses +
// 2 Linien; Kegel = 1 ellipse + 1 polygon; Pyramide = 2 polygons;
// Prisma = 2 polygons + 3 Linien.

function svgOpen(w = 120, h = 100) {
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-hidden="false" focusable="false">`;
}

export const SHAPES = {
  kreis(rng) {
    const r = randInt(rng, 26, 42);
    return `${svgOpen()}<circle class="shape" cx="60" cy="50" r="${r}" /></svg>`;
  },
  kugel(rng) {
    const r = randInt(rng, 28, 40);
    return `${svgOpen()}<circle class="shape" cx="60" cy="50" r="${r}" />`
      + `<ellipse class="shape-soft" cx="60" cy="50" rx="${r}" ry="${Math.round(r / 3)}" /></svg>`;
  },
  dreieck(rng) {
    const w = randInt(rng, 60, 90);
    const h = randInt(rng, 50, 70);
    const apex = 60 + randInt(rng, -12, 12);
    return `${svgOpen()}<polygon class="shape" points="${60 - w / 2},${20 + h} ${60 + w / 2},${20 + h} ${apex},20" /></svg>`;
  },
  quadrat(rng) {
    const s = randInt(rng, 44, 66);
    return `${svgOpen()}<rect class="shape" x="${60 - s / 2}" y="${50 - s / 2}" width="${s}" height="${s}" /></svg>`;
  },
  rechteck(rng) {
    const w = randInt(rng, 70, 100);
    const h = randInt(rng, 34, Math.round(w * 0.6));
    return `${svgOpen()}<rect class="shape" x="${60 - w / 2}" y="${50 - h / 2}" width="${w}" height="${h}" /></svg>`;
  },
  wuerfel(rng) {
    const s = randInt(rng, 40, 52);
    const o = 14;
    const x = 24;
    const y = 90 - s;
    return `${svgOpen()}<rect class="shape" x="${x}" y="${y}" width="${s}" height="${s}" />`
      + `<rect class="shape-soft" x="${x + o}" y="${y - o}" width="${s}" height="${s}" />`
      + `<line class="shape" x1="${x}" y1="${y}" x2="${x + o}" y2="${y - o}" />`
      + `<line class="shape" x1="${x + s}" y1="${y}" x2="${x + o + s}" y2="${y - o}" />`
      + `<line class="shape" x1="${x}" y1="${y + s}" x2="${x + o}" y2="${y - o + s}" />`
      + `<line class="shape" x1="${x + s}" y1="${y + s}" x2="${x + o + s}" y2="${y - o + s}" /></svg>`;
  },
  quader(rng) {
    const w = randInt(rng, 60, 78);
    const h = randInt(rng, 30, 42);
    const o = 14;
    const x = 16;
    const y = 84 - h;
    return `${svgOpen()}<rect class="shape" x="${x}" y="${y}" width="${w}" height="${h}" />`
      + `<rect class="shape-soft" x="${x + o}" y="${y - o}" width="${w}" height="${h}" />`
      + `<line class="shape" x1="${x}" y1="${y}" x2="${x + o}" y2="${y - o}" />`
      + `<line class="shape" x1="${x + w}" y1="${y}" x2="${x + o + w}" y2="${y - o}" />`
      + `<line class="shape" x1="${x}" y1="${y + h}" x2="${x + o}" y2="${y - o + h}" />`
      + `<line class="shape" x1="${x + w}" y1="${y + h}" x2="${x + o + w}" y2="${y - o + h}" /></svg>`;
  },
  zylinder(rng) {
    const rx = randInt(rng, 24, 34);
    const ry = Math.round(rx / 3);
    const top = 24;
    const bottom = 78;
    return `${svgOpen()}<ellipse class="shape" cx="60" cy="${top}" rx="${rx}" ry="${ry}" />`
      + `<ellipse class="shape" cx="60" cy="${bottom}" rx="${rx}" ry="${ry}" />`
      + `<line class="shape" x1="${60 - rx}" y1="${top}" x2="${60 - rx}" y2="${bottom}" />`
      + `<line class="shape" x1="${60 + rx}" y1="${top}" x2="${60 + rx}" y2="${bottom}" /></svg>`;
  },
  kegel(rng) {
    const rx = randInt(rng, 26, 36);
    const ry = Math.round(rx / 3);
    const base = 78;
    return `${svgOpen()}<ellipse class="shape" cx="60" cy="${base}" rx="${rx}" ry="${ry}" />`
      + `<polygon class="shape" points="${60 - rx},${base} ${60 + rx},${base} 60,16" /></svg>`;
  },
  pyramide(rng) {
    const w = randInt(rng, 64, 84);
    const apex = 16;
    const base = 82;
    const mid = 60 + randInt(rng, 6, 14);
    return `${svgOpen()}<polygon class="shape" points="${60 - w / 2},${base} ${mid},${base + 6} 60,${apex}" />`
      + `<polygon class="shape-soft" points="${mid},${base + 6} ${60 + w / 2},${base - 4} 60,${apex}" /></svg>`;
  },
  prisma(rng) {
    const s = randInt(rng, 34, 44);
    const o = 30;
    const x = 20;
    const y = 76;
    const front = `${x},${y} ${x + s},${y} ${x + s / 2},${y - s}`;
    const back = `${x + o},${y - 12} ${x + s + o},${y - 12} ${x + s / 2 + o},${y - 12 - s}`;
    return `${svgOpen(140, 100)}<polygon class="shape" points="${front}" />`
      + `<polygon class="shape-soft" points="${back}" />`
      + `<line class="shape" x1="${x}" y1="${y}" x2="${x + o}" y2="${y - 12}" />`
      + `<line class="shape" x1="${x + s}" y1="${y}" x2="${x + s + o}" y2="${y - 12}" />`
      + `<line class="shape" x1="${x + s / 2}" y1="${y - s}" x2="${x + s / 2 + o}" y2="${y - 12 - s}" /></svg>`;
  },
  parallelogramm(rng) {
    const w = randInt(rng, 56, 72);
    const h = randInt(rng, 34, 48);
    const sl = randInt(rng, 14, 24);
    const x = 14;
    const y = 76;
    return `${svgOpen()}<polygon class="shape" points="${x},${y} ${x + w},${y} ${x + w + sl},${y - h} ${x + sl},${y - h}" /></svg>`;
  },
  trapez(rng) {
    const w = randInt(rng, 76, 96);
    const topw = randInt(rng, 34, w - 26);
    const off = randInt(rng, 10, w - topw - 8);
    const h = randInt(rng, 38, 52);
    const x = 12;
    const y = 78;
    return `${svgOpen()}<polygon class="shape" points="${x},${y} ${x + w},${y} ${x + off + topw},${y - h} ${x + off},${y - h}" /></svg>`;
  },
  rhombus(rng) {
    const w = randInt(rng, 34, 44);
    let h = randInt(rng, 22, 30);
    if (h === w) h -= 2;
    return `${svgOpen()}<polygon class="shape" points="60,${50 - h} ${60 + w},50 60,${50 + h} ${60 - w},50" /></svg>`;
  },
  drachen(rng) {
    const w = randInt(rng, 26, 36);
    const a = randInt(rng, 18, 26);
    const b = a + randInt(rng, 14, 24);
    return `${svgOpen()}<polygon class="shape" points="60,${50 - a} ${60 + w},50 60,${50 + b} ${60 - w},50" /></svg>`;
  },
};

const NAMES = {
  kreis: 'Kreis', kugel: 'Kugel', dreieck: 'Dreieck', quadrat: 'Quadrat', rechteck: 'Rechteck',
  wuerfel: 'Würfel', quader: 'Quader', zylinder: 'Zylinder', kegel: 'Kegel',
  pyramide: 'Pyramide', prisma: 'Prisma',
  parallelogramm: 'Parallelogramm', trapez: 'Trapez', rhombus: 'Rhombus', drachen: 'Drachenviereck',
};

function nameTask(rng, keys, question) {
  const key = pick(rng, keys);
  const wrongs = shuffled(rng, keys.filter((k) => k !== key)).slice(0, 2).map((k) => NAMES[k]);
  return mc(rng, question, NAMES[key], wrongs, SHAPES[key](rng));
}

/* ── Begriff-Tabellen (auch fürs Orakel exportiert) ──────────────── */

export const FR_QA = {
  raumlageQA: [
    ['Der Ball liegt im Schrank. Wo ist er?', 'innerhalb', ['ausserhalb', 'darüber']],
    ['Der Ball liegt neben dem Schrank. Wo ist er?', 'ausserhalb', ['innerhalb', 'darin']],
    ['In der Reihe A B C: Was liegt zwischen A und C?', 'B', ['A', 'C']],
    ['Du schaust auf dein Blatt. Wo ist die Seite mit dem Herz (bei den meisten Menschen)?', 'links', ['rechts', 'oben']],
    ['Der Keller ist ... dem Haus.', 'unter', ['über', 'neben']],
    ['Das Dach ist ... dem Haus.', 'auf', ['unter', 'hinter']],
  ],
  begriffQA: [
    ['Ist ein Würfel eine Figur oder ein Körper?', 'ein Körper', ['eine Figur', 'eine Linie']],
    ['Ist ein Quadrat eine Figur oder ein Körper?', 'eine Figur', ['ein Körper', 'eine Kante']],
    ['Ist eine Kugel eine Figur oder ein Körper?', 'ein Körper', ['eine Figur', 'eine Fläche']],
    ['Ist ein Kreis eine Figur oder ein Körper?', 'eine Figur', ['ein Körper', 'eine Ecke']],
    ['Eine Figur klappt über eine Achse auf die andere Seite. Wie heisst das?', 'spiegeln', ['verschieben', 'drehen']],
    ['Eine Figur rutscht ohne Drehung an einen anderen Ort. Wie heisst das?', 'verschieben', ['spiegeln', 'falten']],
    ['Wie heisst der Platz, den eine Figur bedeckt?', 'Fläche', ['Länge', 'Kante']],
    ['Wie breit eine Figur ist, nennt man ihre ...', 'Breite', ['Länge', 'Höhe']],
  ],
  kreisTerms: [
    ['Wie heisst die Strecke vom Mittelpunkt zum Kreisrand?', 'Radius', ['Durchmesser', 'Umfang']],
    ['Wie heisst die Strecke quer durch den Kreis durch den Mittelpunkt?', 'Durchmesser', ['Radius', 'Sehne']],
    ['Wie heisst der Punkt, in dem sich zwei Geraden treffen?', 'Schnittpunkt', ['Mittelpunkt', 'Eckpunkt']],
    ['Wie nennt man einen Winkel von 90 Grad?', 'rechter Winkel', ['spitzer Winkel', 'stumpfer Winkel']],
    ['Wie heisst die Linie um eine Figur herum?', 'Umfang', ['Fläche', 'Diagonale']],
    ['Wie heisst die Strecke von Ecke zu Ecke durch das Viereck?', 'Diagonale', ['Seite', 'Kante']],
  ],
  ansichtQA: [
    ['Wie heisst der Blick von oben auf einen Körper?', 'Aufsicht', ['Vorderansicht', 'Seitenansicht']],
    ['Wie heisst der Blick von vorne auf einen Körper?', 'Vorderansicht', ['Aufsicht', 'Seitenansicht']],
    ['Wie heisst der Blick von der Seite auf einen Körper?', 'Seitenansicht', ['Aufsicht', 'Vorderansicht']],
  ],
  triangleTypeQA: [
    ['Wie heisst ein Dreieck mit zwei gleich langen Seiten?', 'gleichschenklig', ['gleichseitig', 'stumpfwinklig']],
    ['Wie heisst ein Dreieck mit drei gleich langen Seiten?', 'gleichseitig', ['gleichschenklig', 'spitzwinklig']],
    ['Wie heisst ein Dreieck mit einem Winkel über 90 Grad?', 'stumpfwinklig', ['spitzwinklig', 'rechtwinklig']],
    ['Wie heisst ein Dreieck, dessen Winkel alle unter 90 Grad sind?', 'spitzwinklig', ['stumpfwinklig', 'gleichseitig']],
  ],
  charakterisierenQA: [
    ['Welches Viereck hat vier rechte Winkel und vier gleich lange Seiten?', 'Quadrat', ['Rechteck', 'Rhombus']],
    ['Welches Viereck hat vier rechte Winkel, aber nicht vier gleich lange Seiten?', 'Rechteck', ['Quadrat', 'Trapez']],
    ['Welches Viereck hat zwei Paar parallele Seiten, aber keine rechten Winkel?', 'Parallelogramm', ['Rechteck', 'Drachenviereck']],
    ['Welches Viereck hat genau ein Paar parallele Seiten?', 'Trapez', ['Parallelogramm', 'Rhombus']],
    ['Welches Viereck hat vier gleich lange Seiten, aber keine rechten Winkel?', 'Rhombus', ['Quadrat', 'Trapez']],
    ['Welches Viereck hat zwei Paare gleich langer Nachbarseiten?', 'Drachenviereck', ['Parallelogramm', 'Rechteck']],
    ['Wie heisst die waagrechte Achse im Koordinatensystem?', 'x-Achse', ['y-Achse', 'Diagonale']],
    ['Wie heisst die senkrechte Achse im Koordinatensystem?', 'y-Achse', ['x-Achse', 'Grundlinie']],
  ],
  kongruenzQA: [
    ['Zwei Figuren sind deckungsgleich. Wie nennt man sie?', 'kongruent', ['ähnlich', 'parallel']],
    ['Wie heisst die Fläche, auf der eine Pyramide steht?', 'Grundfläche (Basis)', ['Mantelfläche', 'Seitenkante']],
    ['Wie heisst eine Abbildung, die Längen und Winkel unverändert lässt?', 'Kongruenzabbildung', ['Streckung', 'Verzerrung']],
  ],
  kreisLineQA: [
    ['Wie heisst die längste Seite im rechtwinkligen Dreieck?', 'Hypotenuse', ['Kathete', 'Diagonale']],
    ['Wie heissen die beiden kürzeren Seiten im rechtwinkligen Dreieck?', 'Katheten', ['Hypotenusen', 'Tangenten']],
    ['Wie heisst die Gerade, die den Kreis in genau einem Punkt berührt?', 'Tangente', ['Sehne', 'Diagonale']],
    ['Wie heisst die Strecke zwischen zwei Punkten auf dem Kreis?', 'Sehne', ['Tangente', 'Radius']],
    ['Wie heisst das «Kuchenstück» zwischen zwei Radien?', 'Kreissektor', ['Kreisring', 'Halbkreis']],
  ],
};

function qaTask(rng, key) {
  const [q, correct, wrongs] = pick(rng, FR_QA[key]);
  return mc(rng, q, correct, wrongs);
}

// Ecken/Kanten/Flächen als Fakten (Antwort = Zahl).
const COUNT_FACTS = [
  ['Wie viele Ecken hat ein Würfel?', '8'],
  ['Wie viele Kanten hat ein Würfel?', '12'],
  ['Wie viele Seitenflächen hat ein Würfel?', '6'],
  ['Wie viele Ecken hat ein Quader?', '8'],
  ['Wie viele Kanten hat ein Quader?', '12'],
  ['Wie viele Seitenflächen hat ein Quader?', '6'],
  ['Wie viele Ecken hat ein Dreieck?', '3'],
  ['Wie viele Ecken hat ein Quadrat?', '4'],
];

const TETRAEDER_FACTS = [
  ['Wie viele Seitenflächen hat ein Tetraeder?', '4'],
  ['Wie viele Ecken hat ein Tetraeder?', '4'],
  ['Wie viele Kanten hat ein Tetraeder?', '6'],
];

const KINDS = {
  /* Stufe a: Grundformen */
  nameBasic2D(rng) {
    return nameTask(rng, ['kreis', 'dreieck', 'quadrat', 'rechteck'], 'Wie heisst diese Form?');
  },
  nameBasic3D(rng) {
    return nameTask(rng, ['wuerfel', 'kugel'], 'Wie heisst dieser Körper?');
  },

  /* Stufe b: Strecken vergleichen */
  longestLine(rng) {
    const longest = rng() < 0.5;
    const lens = shuffled(rng, [randInt(rng, 30, 44), randInt(rng, 54, 68), randInt(rng, 78, 100)]);
    let svg = svgOpen(120, 80);
    ['A', 'B', 'C'].forEach((label, i) => {
      const y = 18 + i * 24;
      svg += `<line class="strecke" data-strecke="${label}" x1="10" y1="${y}" x2="${10 + lens[i]}" y2="${y}" />`;
      svg += `<text class="weg-label" x="2" y="${y + 4}">${label}</text>`;
    });
    svg += '</svg>';
    const target = longest ? Math.max(...lens) : Math.min(...lens);
    const correct = ['A', 'B', 'C'][lens.indexOf(target)];
    return mc(rng, longest ? 'Welche Strecke ist am längsten?' : 'Welche Strecke ist am kürzesten?',
      correct, ['A', 'B', 'C'].filter((x) => x !== correct), svg);
  },

  /* Stufe c: Raumlagen */
  dotPosition(rng) {
    const POS = {
      'über dem Quadrat': [60, 12],
      'unter dem Quadrat': [60, 88],
      'links vom Quadrat': [18, 50],
      'rechts vom Quadrat': [102, 50],
      'in der Mitte des Quadrats': [60, 50],
    };
    const correct = pick(rng, Object.keys(POS));
    const [cx, cy] = POS[correct];
    const svg = `${svgOpen()}<rect class="shape" x="40" y="30" width="40" height="40" />`
      + `<circle class="punkt" cx="${cx}" cy="${cy}" r="5" /></svg>`;
    const wrongs = shuffled(rng, Object.keys(POS).filter((k) => k !== correct)).slice(0, 2);
    return mc(rng, 'Wo liegt der Punkt?', correct, wrongs, svg);
  },
  raumlageQA(rng) { return qaTask(rng, 'raumlageQA'); },

  /* Stufe d: Figur oder Körper */
  begriffQA(rng) { return qaTask(rng, 'begriffQA'); },

  /* Stufe e: Ecken, Kanten, Seitenflächen */
  countFacts(rng) {
    const [q, a] = pick(rng, COUNT_FACTS);
    return typed(q, a);
  },

  /* Stufe f: Körper erkennen */
  nameBody3D(rng) {
    return nameTask(rng, ['wuerfel', 'quader', 'kugel', 'zylinder', 'pyramide'], 'Wie heisst dieser Körper?');
  },

  /* Stufe g: Kreis-Begriffe, Geraden */
  kreisTerms(rng) {
    if (rng() < 0.2) {
      return typed('Der Durchmesser ist ?-mal so lang wie der Radius.', '2');
    }
    return qaTask(rng, 'kreisTerms');
  },
  lineRelation(rng) {
    const kind = pick(rng, ['parallel', 'senkrecht', 'schräg']);
    let l1;
    let l2;
    if (kind === 'parallel') {
      const y1 = randInt(rng, 20, 34);
      const gap = randInt(rng, 24, 40);
      const dy = randInt(rng, -14, 14);
      l1 = [14, y1, 106, y1 + dy];
      l2 = [14, y1 + gap, 106, y1 + gap + dy];
    } else if (kind === 'senkrecht') {
      const cx = randInt(rng, 46, 74);
      l1 = [10, 50, 110, 50];
      l2 = [cx, 8, cx, 92];
    } else {
      l1 = [10, randInt(rng, 60, 80), 110, randInt(rng, 52, 72)];
      l2 = [16, 86, randInt(rng, 80, 106), randInt(rng, 8, 24)];
    }
    const svg = `${svgOpen()}<line class="gerade" x1="${l1[0]}" y1="${l1[1]}" x2="${l1[2]}" y2="${l1[3]}" />`
      + `<line class="gerade" x1="${l2[0]}" y1="${l2[1]}" x2="${l2[2]}" y2="${l2[3]}" /></svg>`;
    return mc(rng, 'Wie liegen die beiden Geraden zueinander?', kind,
      ['parallel', 'senkrecht', 'schräg'].filter((x) => x !== kind), svg);
  },

  /* Stufe h: Koordinaten, Ansichten */
  koordinaten(rng) {
    const coords = [];
    while (coords.length < 3) {
      const c = [randInt(rng, 1, 5), randInt(rng, 1, 4)];
      if (!coords.some(([x, y]) => x === c[0] && y === c[1])) coords.push(c);
    }
    const labels = ['A', 'B', 'C'];
    let svg = svgOpen(140, 120);
    for (let x = 0; x <= 6; x++) svg += `<line class="grid-line" x1="${10 + x * 20}" y1="10" x2="${10 + x * 20}" y2="110" />`;
    for (let y = 0; y <= 5; y++) svg += `<line class="grid-line" x1="10" y1="${110 - y * 20}" x2="130" y2="${110 - y * 20}" />`;
    coords.forEach(([gx, gy], i) => {
      svg += `<circle class="punkt" data-punkt="${labels[i]}" cx="${10 + gx * 20}" cy="${110 - gy * 20}" r="5" />`;
      svg += `<text class="weg-label" x="${10 + gx * 20 + 7}" y="${110 - gy * 20 - 6}">${labels[i]}</text>`;
    });
    svg += '</svg>';
    const target = randInt(rng, 0, 2);
    return mc(rng, `Welcher Punkt liegt bei (${coords[target][0]}|${coords[target][1]})? Der Nullpunkt ist unten links, ein Kästchen ist 1.`,
      labels[target], labels.filter((x) => x !== labels[target]), svg);
  },
  ansichtQA(rng) { return qaTask(rng, 'ansichtQA'); },

  /* Stufe i: Vierecke und Dreiecksarten */
  nameQuad(rng) {
    return nameTask(rng, ['parallelogramm', 'trapez', 'rhombus', 'drachen'], 'Wie heisst dieses Viereck?');
  },
  triangleTypeQA(rng) { return qaTask(rng, 'triangleTypeQA'); },

  /* Stufe j: Vierecke charakterisieren */
  charakterisierenQA(rng) { return qaTask(rng, 'charakterisierenQA'); },

  /* Stufe k: Körper des 3. Zyklus */
  nameBodyGA(rng) {
    return nameTask(rng, ['kegel', 'prisma', 'pyramide', 'zylinder'], 'Wie heisst dieser Körper?');
  },
  kongruenzQA(rng) { return qaTask(rng, 'kongruenzQA'); },

  /* Stufe l: Kreis-Linien und Tetraeder */
  kreisLineQA(rng) { return qaTask(rng, 'kreisLineQA'); },
  tetraederFacts(rng) {
    const [q, a] = pick(rng, TETRAEDER_FACTS);
    return typed(q, a);
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
