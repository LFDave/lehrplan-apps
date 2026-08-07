// data.js — Wordschatz Stufen-Konfiguration.
//
// Die App setzt genau eine Kompetenz des Lehrplans 21 um: FS2E.5.B.1
// "Die Schülerinnen und Schüler verfügen über einen Wortschatz, der
// ihnen Gespräche und Texte zu vertrauten Themen erlaubt" (Ausgabe
// Kanton Bern, Stand 01.08.2022). Die vier Stufen a bis d sind die
// offiziellen Kompetenzstufen; Englisch beginnt im 2. Zyklus.
// Die Stufen beschreiben wachsende Repertoires; die Wortlisten der
// App wachsen entsprechend von Überlebenswörtern zu Alltagsthemen.

export const COMPETENCY = 'FS2E.5.B.1';

export const STUFEN = [
  {
    id: 'a', cycle: 2, ga: false,
    title: 'First Words',
    desc: 'Begrüssen, danken, ja und nein, erste Zahlen und Farben.',
    kinds: ['vokabel'],
    merkblatt: { id: 'englisch-woerter', name: 'Erste Wörter' },
  },
  {
    id: 'b', cycle: 2, ga: true,
    title: 'Everyday Words',
    desc: 'Familie, Schule, Essen, Wochentage und mehr Zahlen.',
    kinds: ['vokabel'],
    merkblatt: { id: 'englisch-woerter', name: 'Erste Wörter' },
  },
  {
    id: 'c', cycle: 3, ga: true,
    title: 'Phrases und Themen',
    desc: 'Wetter, Zeit, häufige Verben und kurze Wendungen.',
    kinds: ['vokabel', 'wendung'],
    merkblatt: { id: 'englisch-woerter', name: 'Erste Wörter' },
  },
  {
    id: 'd', cycle: 3, ga: false,
    title: 'My World',
    desc: 'Über Vorlieben, Ferien und den Alltag sprechen.',
    kinds: ['vokabel', 'wendung'],
    merkblatt: { id: 'englisch-woerter', name: 'Erste Wörter' },
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
