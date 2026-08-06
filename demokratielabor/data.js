// data.js — Demokratielabor Stufen-Konfiguration.
//
// Die App setzt genau eine Kompetenz des Lehrplans 21 um: RZG.8.1
// "Die Schülerinnen und Schüler können die Schweizer Demokratie
// erklären und mit anderen Systemen vergleichen" (Ausgabe Kanton
// Bern, Stand 01.08.2022). Die Stufen a bis d sind die offiziellen
// Kompetenzstufen. Eigenes Stellungbeziehen (Stufe d) ist als Wissen
// über Argumente, Quellen und faire Debatten umgesetzt; die App gibt
// keine Meinungen vor.

export const COMPETENCY = 'RZG.8.1';

export const STUFEN = [
  {
    id: 'a', cycle: 3, ga: false,
    title: 'Demokratie verstehen',
    desc: 'Verstehe, wie Demokratie entstand und was sie unterscheidet.',
    kinds: ['staatsform'],
  },
  {
    id: 'b', cycle: 3, ga: false,
    title: 'Die drei Gewalten',
    desc: 'Unterscheide Parlament, Regierung und Gerichte.',
    kinds: ['gewalt'],
    merkblatt: { id: 'gewaltenteilung', name: 'Gewaltenteilung' },
  },
  {
    id: 'c', cycle: 3, ga: true,
    title: 'Direkte Demokratie',
    desc: 'Kenne Initiative, Referendum und den Föderalismus.',
    kinds: ['mitbestimmung'],
  },
  {
    id: 'd', cycle: 3, ga: false,
    title: 'Meinung begründen',
    desc: 'Wisse, wie man fair debattiert und Positionen begründet.',
    kinds: ['debatte'],
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
