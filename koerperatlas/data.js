// data.js — Körperatlas Stufen-Konfiguration.
//
// Die App setzt genau eine Kompetenz des Lehrplans 21 um: NMG.1.4
// "Die Schülerinnen und Schüler können den Körper und dessen
// Funktionen erklären" (Ausgabe Kanton Bern, Stand 01.08.2022).
// Die Stufen a bis f sind die offiziellen Kompetenzstufen. Eigenes
// Beobachten am Körper ist als Wissen über Bau und Funktion
// umgesetzt.

export const COMPETENCY = 'NMG.1.4';

export const STUFEN = [
  {
    id: 'a', cycle: 1, ga: false,
    title: 'Körperteile kennen',
    desc: 'Kenne Körperteile, ihre Lage und ihre Aufgabe.',
    kinds: ['koerperteil'],
  },
  {
    id: 'b', cycle: 1, ga: true,
    title: 'Eigenschaften zuordnen',
    desc: 'Ordne Eigenschaften zu: Gelenke bewegen, Knochen schützen.',
    kinds: ['eigenschaft'],
  },
  {
    id: 'c', cycle: [1, 2], ga: false,
    title: 'Organsysteme',
    desc: 'Verstehe Bewegung, Atmung und Verdauung im Zusammenhang.',
    kinds: ['organsystem'],
  },
  {
    id: 'd', cycle: 2, ga: false,
    title: 'Die Haut reagiert',
    desc: 'Erkläre Schwitzen, Erröten und Schutz vor der Sonne.',
    kinds: ['hautreaktion'],
  },
  {
    id: 'e', cycle: 2, ga: true,
    title: 'Bau und Funktion',
    desc: 'Erkläre Skelett, Muskeln und den Blutkreislauf.',
    kinds: ['kreislauf'],
  },
  {
    id: 'f', cycle: [2, 3], ga: false,
    title: 'Gesund bleiben',
    desc: 'Kenne Grundlagen für einen gesunden Körper.',
    kinds: ['gesundheit'],
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
