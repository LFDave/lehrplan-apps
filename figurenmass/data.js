// data.js — Figurenmass Stufen-Konfiguration.
//
// Die App setzt genau eine Kompetenz des Lehrplans 21 um: MA.2.A.3
// "Die Schülerinnen und Schüler können Längen, Flächen und Volumen
// vergleichen, messen und berechnen" (Ausgabe Kanton Bern). Die
// Stufen a bis k sind die offiziellen Kompetenzstufen dieser
// Kompetenz; `ga` markiert den Grundanspruch des Zyklus.
//
// Messen mit echten Gegenständen ist als Messen am Bildschirm-Raster
// umgesetzt (SVG-Strecken und Einheitsquadrate zum Abzählen); die
// Berechnungs-Stufen nennen alle Masse im Aufgabentext.

export const COMPETENCY = 'MA.2.A.3';

export const STUFEN = [
  {
    id: 'a', cycle: 1, ga: false,
    title: 'Wege vergleichen',
    desc: 'Vergleiche Linienwege auf dem Raster und denk an den gebogenen Draht.',
    kinds: ['pathCompare', 'wireConstancy'],
  },
  {
    id: 'b', cycle: 1, ga: true,
    title: 'Messen auf dem Raster',
    desc: 'Miss Strecken auf 1 cm genau und fülle Gefässe mit dem Becher.',
    kinds: ['rasterLine', 'cupMeasure'],
  },
  {
    id: 'c', cycle: [1, 2], ga: false,
    title: 'Flächen und Bauten vergleichen',
    desc: 'Vergleiche Rechtecke und Würfelbauten miteinander.',
    kinds: ['compareRects', 'compareCubes'],
  },
  {
    id: 'd', cycle: 2, ga: false,
    title: 'Quadrate auszählen',
    desc: 'Zähle, wie viele Einheitsquadrate eine Fläche bedecken.',
    kinds: ['countSquares'],
  },
  {
    id: 'e', cycle: 2, ga: true,
    title: 'Umfang und Fläche',
    desc: 'Berechne Umfang und Fläche von Rechtecken und zähle Würfelbauten.',
    kinds: ['umfangRect', 'flaecheRect', 'quaderWuerfel'],
  },
  {
    id: 'f', cycle: [2, 3], ga: false,
    title: 'Volumen und krumme Flächen',
    desc: 'Berechne Quader-Volumen und zähle gefärbte Quadrate in Figuren.',
    kinds: ['volumeQuader', 'areaApprox'],
  },
  {
    id: 'g', cycle: 3, ga: false,
    title: 'Dreiecke und Quader',
    desc: 'Berechne Dreiecksflächen, Kantenlängen und Oberflächen.',
    kinds: ['triangleArea', 'quaderEdges', 'quaderSurface'],
  },
  {
    id: 'h', cycle: 3, ga: false,
    title: 'Satz des Pythagoras',
    desc: 'Berechne Hypotenusen und Katheten im rechtwinkligen Dreieck.',
    kinds: ['pythagoras', 'pythagorasLeg'],
  },
  {
    id: 'i', cycle: 3, ga: true,
    title: 'Kreis, Prisma und Zylinder',
    desc: 'Berechne Kreisumfang und -fläche mit π ≈ 3.14 und Volumen von Prismen.',
    kinds: ['circleCalc', 'prismVolume'],
  },
  {
    id: 'j', cycle: 3, ga: false,
    title: 'Pyramide und Winkel',
    desc: 'Berechne Pyramiden-Volumen, Winkelsummen und kenne den Satz von Thales.',
    kinds: ['pyramidVolume', 'angleSum', 'thalesMc'],
  },
  {
    id: 'k', cycle: 3, ga: false,
    title: 'Ähnliche Figuren',
    desc: 'Rechne mit Streckfaktoren für Längen, Flächen und Volumen.',
    kinds: ['similarLength', 'similarArea', 'similarVolume'],
  },
];

export function stufeById(id) {
  return STUFEN.find((s) => s.id === id) || null;
}

export function stufeIndex(id) {
  return STUFEN.findIndex((s) => s.id === id);
}

export function nextStufe(id) {
  const i = stufeIndex(id);
  return i >= 0 && i + 1 < STUFEN.length ? STUFEN[i + 1] : null;
}

export function cycleLabel(cycle) {
  return Array.isArray(cycle) ? cycle.map((c) => `Zyklus ${c}`).join(' und ') : `Zyklus ${cycle}`;
}
