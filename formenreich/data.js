// data.js — Formenreich Stufen-Konfiguration.
//
// Die App setzt genau eine Kompetenz des Lehrplans 21 um: MA.2.A.1
// "Die Schülerinnen und Schüler verstehen und verwenden Begriffe und
// Symbole zu Form und Raum" (Ausgabe Kanton Bern). Die Stufen a bis l
// sind die offiziellen Kompetenzstufen dieser Kompetenz; `ga`
// markiert den Grundanspruch des Zyklus.
//
// Zeichnen-Anteile (aufzeichnen, beschriften) sind als Erkennen und
// Benennen von SVG-Figuren umgesetzt.

export const COMPETENCY = 'MA.2.A.1';

export const STUFEN = [
  {
    id: 'a', cycle: 1, ga: false,
    title: 'Erste Formen',
    desc: 'Erkenne Kreis, Dreieck, Rechteck, Quadrat, Würfel und Kugel.',
    kinds: ['nameBasic2D', 'nameBasic3D'],
  },
  {
    id: 'b', cycle: 1, ga: false,
    title: 'Länger oder kürzer',
    desc: 'Vergleiche Strecken: am längsten, am kürzesten.',
    kinds: ['longestLine'],
  },
  {
    id: 'c', cycle: 1, ga: true,
    title: 'Wo liegt es?',
    desc: 'Beschreibe Lagen mit über, unter, links, rechts und in der Mitte.',
    kinds: ['dotPosition', 'raumlageQA'],
  },
  {
    id: 'd', cycle: [1, 2], ga: false,
    title: 'Figur oder Körper',
    desc: 'Unterscheide Figuren und Körper, spiegeln und verschieben.',
    kinds: ['begriffQA'],
  },
  {
    id: 'e', cycle: 2, ga: false,
    title: 'Ecken und Kanten',
    desc: 'Zähle Ecken, Kanten und Seitenflächen von Würfel und Quader.',
    kinds: ['countFacts'],
  },
  {
    id: 'f', cycle: 2, ga: false,
    title: 'Körper erkennen',
    desc: 'Erkenne Würfel, Quader, Kugel, Zylinder und Pyramide.',
    kinds: ['nameBody3D'],
  },
  {
    id: 'g', cycle: 2, ga: true,
    title: 'Kreis und Geraden',
    desc: 'Kenne Radius und Durchmesser und erkenne parallele und senkrechte Geraden.',
    kinds: ['kreisTerms', 'lineRelation'],
  },
  {
    id: 'h', cycle: [2, 3], ga: false,
    title: 'Koordinaten und Ansichten',
    desc: 'Finde Punkte im Koordinatenraster und kenne Auf- und Seitenansicht.',
    kinds: ['koordinaten', 'ansichtQA'],
  },
  {
    id: 'i', cycle: 3, ga: false,
    title: 'Vierecke und Dreiecke',
    desc: 'Erkenne Parallelogramm, Trapez, Rhombus und die Dreiecksarten.',
    kinds: ['nameQuad', 'triangleTypeQA'],
  },
  {
    id: 'j', cycle: 3, ga: false,
    title: 'Vierecke charakterisieren',
    desc: 'Beschreibe Vierecke nach Winkeln, Seiten und Parallelität.',
    kinds: ['charakterisierenQA'],
  },
  {
    id: 'k', cycle: 3, ga: true,
    title: 'Kegel, Prisma, Pyramide',
    desc: 'Erkenne die Körper des 3. Zyklus und kenne Kongruenz und Basis.',
    kinds: ['nameBodyGA', 'kongruenzQA'],
  },
  {
    id: 'l', cycle: 3, ga: false,
    title: 'Kreis und Tetraeder',
    desc: 'Kenne Hypotenuse, Katheten, Tangente, Sehne und den Tetraeder.',
    kinds: ['kreisLineQA', 'tetraederFacts'],
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
