// data.js — Stromkreis Stufen-Konfiguration.
//
// Die App setzt genau eine Kompetenz des Lehrplans 21 um: NT.5.2
// "Die Schülerinnen und Schüler können Grundlagen der Elektrik
// verstehen und anwenden" (Ausgabe Kanton Bern, Stand 01.08.2022).
// Die Stufen a bis e sind die offiziellen Kompetenzstufen.
// Experimente am Stromkreis sind als Regeln, Rechnungen und
// Vorhersagen umgesetzt.

export const COMPETENCY = 'NT.5.2';

export const STUFEN = [
  {
    id: 'a', cycle: 3, ga: false,
    title: 'Wirkungen des Stroms',
    desc: 'Kenne Licht-, Wärme-, magnetische und chemische Wirkung.',
    kinds: ['wirkung'],
  },
  {
    id: 'b', cycle: 3, ga: false,
    title: 'Serie und parallel',
    desc: 'Sage voraus, was in Serie- und Parallelschaltungen passiert.',
    kinds: ['schaltung'],
    merkblatt: { id: 'schaltungen', name: 'Schaltungen' },
  },
  {
    id: 'c', cycle: 3, ga: true,
    title: 'Das Ohmsche Gesetz',
    desc: 'Rechne mit Spannung, Stromstärke und Widerstand.',
    kinds: ['ohm'],
  },
  {
    id: 'd', cycle: 3, ga: false,
    title: 'Verzweigte Kreise',
    desc: 'Wende Knoten- und Maschenregel an.',
    kinds: ['knoten'],
  },
  {
    id: 'e', cycle: 3, ga: false,
    title: 'Motor und Generator',
    desc: 'Verstehe, wie Elektromotor und Generator arbeiten.',
    kinds: ['maschine'],
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
