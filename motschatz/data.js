// data.js — Motschatz Stufen-Konfiguration.
//
// Die App setzt genau eine Kompetenz des Lehrplans 21 um: FS1F.5.B.1
// "Die Schülerinnen und Schüler verfügen über einen Wortschatz, der
// ihnen Gespräche und Texte zu vertrauten Themen erlaubt" (Ausgabe
// Kanton Bern, Stand 01.08.2022). Die vier Stufen a bis d sind die
// offiziellen Kompetenzstufen; Französisch beginnt im 2. Zyklus.
// Die Stufen beschreiben wachsende Repertoires; die Wortlisten der
// App wachsen entsprechend von Überlebenswörtern zu Alltagsthemen.

export const COMPETENCY = 'FS1F.5.B.1';

export const STUFEN = [
  {
    id: 'a', cycle: 2, ga: false,
    title: 'Erste Wörter',
    desc: 'Begrüssen, danken, ja und nein, erste Zahlen und Farben.',
    kinds: ['vokabel'],
  },
  {
    id: 'b', cycle: 2, ga: true,
    title: 'Alltagswörter',
    desc: 'Familie, Schule, Essen, Wochentage und mehr Zahlen.',
    kinds: ['vokabel'],
  },
  {
    id: 'c', cycle: 3, ga: true,
    title: 'Sätze und Themen',
    desc: 'Wetter, Zeit, häufige Verben und kurze Wendungen.',
    kinds: ['vokabel', 'wendung'],
  },
  {
    id: 'd', cycle: 3, ga: false,
    title: 'Meine Lebenswelt',
    desc: 'Über Vorlieben, Ferien und den Alltag sprechen.',
    kinds: ['vokabel', 'wendung'],
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
