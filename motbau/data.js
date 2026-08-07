// data.js — Motbau Stufen-Konfiguration.
//
// Die App setzt genau eine Kompetenz des Lehrplans 21 um: FS1F.5.D.1
// "Die Schülerinnen und Schüler können grammatische Strukturen
// verwenden" (Französisch, Ausgabe Kanton Bern, Stand 01.08.2022).
// Die Stufen a bis d sind die offiziellen Kompetenzstufen. Sprechen
// und freies Schreiben sind als Erkennen und Einsetzen von Formen
// umgesetzt.

export const COMPETENCY = 'FS1F.5.D.1';

export const STUFEN = [
  {
    id: 'a', cycle: 2, ga: false,
    title: 'Erste Bausteine',
    desc: 'Nutze le und la, die Mehrzahl und erste Wendungen.',
    kinds: ['baustein'],
    merkblatt: { id: 'franzoesisch-saetze', name: 'Sätze bauen' },
  },
  {
    id: 'b', cycle: 2, ga: true,
    title: 'Verben und Fragen',
    desc: 'Konjugiere Verben auf -er, setze Pronomen und Fragewörter.',
    kinds: ['verbform'],
    merkblatt: { id: 'franzoesisch-saetze', name: 'Sätze bauen' },
  },
  {
    id: 'c', cycle: 3, ga: true,
    title: 'Sätze und Ausnahmen',
    desc: 'Nutze être und avoir, besondere Mehrzahl und Präpositionen.',
    kinds: ['satzform'],
    merkblatt: { id: 'verben-fr', name: 'être und avoir' },
  },
  {
    id: 'd', cycle: 3, ga: false,
    title: 'Feine Formen',
    desc: 'Verneine Sätze, nutze Modalverben und kleine Pronomen.',
    kinds: ['feinform'],
    merkblatt: { id: 'franzoesisch-saetze', name: 'Sätze bauen' },
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
