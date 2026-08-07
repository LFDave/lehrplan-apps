// data.js — Sternwarte Stufen-Konfiguration.
//
// Die App setzt genau eine Kompetenz des Lehrplans 21 um: NMG.4.5
// "Die Schülerinnen und Schüler können astronomische Phänomene und
// Sachverhalte erklären" (Ausgabe Kanton Bern, Stand 01.08.2022).
// Die Stufen a bis f sind die offiziellen Kompetenzstufen. Eigenes
// Beobachten am Himmel und Modellbau sind als Wissen über die
// beobachtbaren Phänomene und Modelle umgesetzt.

export const COMPETENCY = 'NMG.4.5';

export const STUFEN = [
  {
    id: 'a', cycle: 1, ga: false,
    title: 'Blick zum Himmel',
    desc: 'Beschreibe, was du am Himmel sehen kannst.',
    kinds: ['himmel'],
    merkblatt: { id: 'tag-und-nacht', name: 'Tag und Nacht' },
  },
  {
    id: 'b', cycle: 1, ga: true,
    title: 'Sonne, Mond und Sterne',
    desc: 'Erkläre Sonnenlauf, Mond und Sterne am Tag- und Nachthimmel.',
    kinds: ['sonnenlauf'],
    merkblatt: { id: 'tag-und-nacht', name: 'Tag und Nacht' },
  },
  {
    id: 'c', cycle: 2, ga: false,
    title: 'Die Erde als Planet',
    desc: 'Beantworte Fragen zur Erde als Planet.',
    kinds: ['erde'],
    merkblatt: { id: 'tag-und-nacht', name: 'Tag und Nacht' },
  },
  {
    id: 'd', cycle: 2, ga: false,
    title: 'Beobachten über Zeit',
    desc: 'Ordne Mondphasen, Jahreszeiten und Schattenlauf.',
    kinds: ['beobachtung'],
    merkblatt: { id: 'mondphasen', name: 'Mondphasen' },
  },
  {
    id: 'e', cycle: 2, ga: true,
    title: 'Das Sonnensystem',
    desc: 'Kenne die Sonne, die Planeten und ihre Bewegungen.',
    kinds: ['sonnensystem'],
    merkblatt: { id: 'sonnensystem', name: 'Sonnensystem' },
  },
  {
    id: 'f', cycle: [2, 3], ga: false,
    title: 'Galaxien und Kometen',
    desc: 'Entdecke Galaxien, Sternbilder und Kometen.',
    kinds: ['weltall'],
    merkblatt: { id: 'sonnensystem', name: 'Sonnensystem' },
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
