// data.js — Spiegelraster Stufen-Konfiguration.
//
// Die App setzt genau eine Kompetenz des Lehrplans 21 um: MA.2.A.2
// "Die Schülerinnen und Schüler können Figuren und Körper abbilden,
// zerlegen und zusammensetzen" (Ausgabe Kanton Bern). Die Stufen a
// bis j sind die offiziellen Kompetenzstufen dieser Kompetenz; `ga`
// markiert den Grundanspruch des Zyklus.
//
// Zeichnen mit Geodreieck und Zirkel sowie das Kippen realer Körper
// sind als Erkennen der entsprechenden Abbildungen im Raster
// umgesetzt; die App prüft das Verständnis der Abbildung, nicht die
// Zeichen- oder Bastelfertigkeit.

export const COMPETENCY = 'MA.2.A.2';

export const STUFEN = [
  {
    id: 'a', cycle: 1, ga: false,
    title: 'Muster fortsetzen',
    desc: 'Führe Muster aus Kreis, Dreieck und Quadrat weiter.',
    kinds: ['patternNext'],
  },
  {
    id: 'b', cycle: 1, ga: false,
    title: 'Aus Teilen gebaut',
    desc: 'Zähle, aus wie vielen Dreiecken eine Figur zusammengesetzt ist.',
    kinds: ['countParts'],
  },
  {
    id: 'c', cycle: 1, ga: true,
    title: 'Symmetrie',
    desc: 'Erkenne symmetrische Figuren, zähle Achsen und führe Bandornamente fort.',
    kinds: ['symmetryCheck', 'axesCount', 'ornamentNext'],
  },
  {
    id: 'd', cycle: 2, ga: false,
    title: 'Vergrössern und zerlegen',
    desc: 'Vergrössere Figuren im Raster und zerlege Vielecke in Dreiecke.',
    kinds: ['growGrid', 'zerlegeFacts'],
  },
  {
    id: 'e', cycle: 2, ga: false,
    title: 'Spiegeln an der Achse',
    desc: 'Finde das richtige Spiegelbild einer Rasterfigur.',
    kinds: ['mirrorPick', 'mirrorCheck'],
  },
  {
    id: 'f', cycle: 2, ga: true,
    title: 'Gedreht, gespiegelt oder verschoben?',
    desc: 'Erkenne, welche Abbildung eine Figur verändert hat.',
    kinds: ['transformRecognize'],
  },
  {
    id: 'g', cycle: [2, 3], ga: false,
    title: 'Strecken im Raster',
    desc: 'Bestimme Vergrösserungs-Faktoren und erkenne Abbildungen.',
    kinds: ['scaleFactor', 'transformRecognize'],
  },
  {
    id: 'h', cycle: 3, ga: false,
    title: 'Drehen um 90, 180, 270 Grad',
    desc: 'Bestimme, um wie viel Grad eine Figur gedreht wurde.',
    kinds: ['rotateAngle'],
  },
  {
    id: 'i', cycle: 3, ga: true,
    title: 'Achsen- und Punktspiegelung',
    desc: 'Finde Spiegelbild und punktgespiegeltes Bild einer Figur.',
    kinds: ['mirrorPick', 'pointMirrorPick'],
  },
  {
    id: 'j', cycle: 3, ga: false,
    title: 'Strecken mit Koordinaten',
    desc: 'Berechne Streckfaktoren und veränderte Koordinaten.',
    kinds: ['streckFactor', 'coordTransform'],
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
