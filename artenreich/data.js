// data.js — Artenreich Stufen-Konfiguration.
//
// Die App setzt genau eine Kompetenz des Lehrplans 21 um: NMG.2.4
// "Die Schülerinnen und Schüler können die Artenvielfalt von
// Pflanzen und Tieren erkennen und sie kategorisieren" (Ausgabe
// Kanton Bern, Stand 01.08.2022). Die Stufen a bis f sind die
// offiziellen Kompetenzstufen. Untersuchen im Gelände ist als
// Erkennen und Zuordnen von Merkmalen umgesetzt.

export const COMPETENCY = 'NMG.2.4';

export const STUFEN = [
  {
    id: 'a', cycle: 1, ga: false,
    title: 'Merkmale kennen',
    desc: 'Kenne Merkmale von Vögeln, Fischen und Säugetieren.',
    kinds: ['merkmal'],
  },
  {
    id: 'b', cycle: 1, ga: true,
    title: 'Bäume und Tiere zuordnen',
    desc: 'Ordne zu: Laub- oder Nadelbaum, Wild-, Nutz- oder Heimtier.',
    kinds: ['zuordnung'],
  },
  {
    id: 'c', cycle: [1, 2], ga: false,
    title: 'Vögel unterscheiden',
    desc: 'Unterscheide Sing-, Wasser- und Greifvögel, Zug- und Standvögel.',
    kinds: ['vogel'],
  },
  {
    id: 'd', cycle: 2, ga: false,
    title: 'Angepasst leben',
    desc: 'Erkenne, wie Tiere an ihren Lebensraum angepasst sind.',
    kinds: ['anpassung'],
  },
  {
    id: 'e', cycle: 2, ga: true,
    title: 'Ordnen mit Kriterien',
    desc: 'Ordne mit Kriterien wie Blattform und Körperbau.',
    kinds: ['kriterium'],
  },
  {
    id: 'f', cycle: [2, 3], ga: false,
    title: 'Ordnungssysteme nutzen',
    desc: 'Nutze Gruppen wie Käfer, Schmetterlinge, krautig und holzig.',
    kinds: ['system'],
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
