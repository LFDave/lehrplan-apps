// data.js — Wordbau Stufen-Konfiguration.
//
// Die App setzt genau eine Kompetenz des Lehrplans 21 um: FS2E.5.D.1
// "Die Schülerinnen und Schüler können grammatische Strukturen
// verwenden" (Englisch, Ausgabe Kanton Bern, Stand 01.08.2022).
// Die Stufen a bis d sind die offiziellen Kompetenzstufen. Sprechen
// und freies Schreiben sind als Erkennen und Einsetzen von Formen
// umgesetzt.

export const COMPETENCY = 'FS2E.5.D.1';

export const STUFEN = [
  {
    id: 'a', cycle: 2, ga: true,
    title: 'Erste Bausteine',
    desc: 'Nutze a und an, die Mehrzahl und erste Wendungen.',
    kinds: ['baustein'],
    merkblatt: { id: 'englisch-saetze', name: 'Sätze bauen' },
  },
  {
    id: 'b', cycle: [2, 3], ga: false,
    title: 'be, have und Fragen',
    desc: 'Setze be und have, Pronomen und Fragewörter richtig ein.',
    kinds: ['verbform'],
    merkblatt: { id: 'verben-en', name: 'to be und to have' },
  },
  {
    id: 'c', cycle: 3, ga: true,
    title: 'Sätze und Ausnahmen',
    desc: 'Nutze die he-Form, besondere Mehrzahl und Präpositionen.',
    kinds: ['satzform'],
    merkblatt: { id: 'englisch-saetze', name: 'Sätze bauen' },
  },
  {
    id: 'd', cycle: 3, ga: false,
    title: 'Feine Formen',
    desc: 'Verneine Sätze, nutze can und must, this und these.',
    kinds: ['feinform'],
    merkblatt: { id: 'englisch-saetze', name: 'Sätze bauen' },
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
