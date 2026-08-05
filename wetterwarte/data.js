// data.js — Wetterwarte Stufen-Konfiguration.
//
// Die App setzt genau eine Kompetenz des Lehrplans 21 um: NMG.4.4
// "Die Schülerinnen und Schüler können Wetterphänomene beobachten,
// sich über Naturereignisse informieren sowie entsprechende
// Situationen einschätzen" (Ausgabe Kanton Bern, Stand 01.08.2022).
// Die Kompetenz hat zwei offizielle Stufenreihen: 1a bis 1g (Wetter)
// und 2a bis 2e (Naturereignisse und Naturgefahren). Eigenes
// Beobachten und Messen ist als Wissen über Phänomene, Messgeräte
// und Verhaltensregeln umgesetzt.

export const COMPETENCY = 'NMG.4.4';

export const STUFEN = [
  {
    id: '1a', cycle: 1, ga: false,
    title: 'Wetter erleben',
    desc: 'Erkenne Sonne, Regen, Wind, Schnee und Gewitter.',
    kinds: ['wetterwort'],
  },
  {
    id: '1b', cycle: 1, ga: true,
    title: 'Wetter ist wichtig',
    desc: 'Verstehe, was das Wetter für Menschen bedeutet.',
    kinds: ['bedeutung'],
  },
  {
    id: '1c', cycle: [1, 2], ga: false,
    title: 'Wetter beobachten',
    desc: 'Unterscheide Bewölkung, Wind und Niederschlag.',
    kinds: ['beobachtung'],
  },
  {
    id: '1d', cycle: 2, ga: false,
    title: 'Wetter und Jahreszeiten',
    desc: 'Ordne Wetterphänomene den Jahreszeiten zu.',
    kinds: ['jahreszeit'],
  },
  {
    id: '1e', cycle: 2, ga: false,
    title: 'Wetter messen',
    desc: 'Kenne Messgeräte und rechne mit Temperaturen.',
    kinds: ['messwert'],
  },
  {
    id: '1f', cycle: 2, ga: true,
    title: 'Prognosen nutzen',
    desc: 'Lies Wetterprognosen und verhalte dich richtig.',
    kinds: ['prognose'],
  },
  {
    id: '1g', cycle: [2, 3], ga: false,
    title: 'Wetter verstehen',
    desc: 'Verstehe Wasserkreislauf, Gewitter und Wetterlagen.',
    kinds: ['zusammenhang'],
  },
  {
    id: '2a', cycle: 1, ga: false,
    title: 'Naturereignisse kennen',
    desc: 'Benenne Überschwemmung, Lawine, Sturm und Hagel.',
    kinds: ['ereignis'],
  },
  {
    id: '2b', cycle: 1, ga: true,
    title: 'Sich schützen',
    desc: 'Kenne Schutzregeln für Kinder bei Naturereignissen.',
    kinds: ['schutzregel'],
  },
  {
    id: '2c', cycle: 2, ga: false,
    title: 'Spuren lesen',
    desc: 'Erkenne Spuren von Naturereignissen und ihre Ursachen.',
    kinds: ['spur'],
  },
  {
    id: '2d', cycle: 2, ga: false,
    title: 'Gefahren verstehen',
    desc: 'Verstehe, wie Naturereignisse entstehen und gemeldet werden.',
    kinds: ['prozess'],
  },
  {
    id: '2e', cycle: 2, ga: true,
    title: 'Richtig handeln',
    desc: 'Wende Verhaltensregeln in echten Situationen an.',
    kinds: ['verhalten'],
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
