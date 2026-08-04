// data.js — Nordpfeil Stufen-Konfiguration.
//
// Die App setzt genau eine Kompetenz des Lehrplans 21 um: NMG.8.5
// "Die Schülerinnen und Schüler können sich in Räumen orientieren"
// (Ausgabe Kanton Bern, Stand 01.08.2022). Die Stufen a bis i sind
// die offiziellen Kompetenzstufen. Arbeit im Gelände und eigenes
// Zeichnen von Plänen ist als Erkennen, Lesen und Berechnen am
// Bildschirm umgesetzt.

export const COMPETENCY = 'NMG.8.5';

export const STUFEN = [
  {
    id: 'a', cycle: 1, ga: false,
    title: 'Wege beschreiben',
    desc: 'Beschreibe Wege mit Merkpunkten und Richtungen.',
    kinds: ['weg'],
  },
  {
    id: 'b', cycle: 1, ga: false,
    title: 'Sicher unterwegs',
    desc: 'Erkenne sichere und unsichere Stellen im Verkehr.',
    kinds: ['verkehr'],
  },
  {
    id: 'c', cycle: 1, ga: true,
    title: 'Pläne und Lagebezüge',
    desc: 'Finde Orte mit einfachen Plänen und Lageangaben.',
    kinds: ['lagebezug'],
  },
  {
    id: 'd', cycle: [1, 2], ga: false,
    title: 'Skizzen verstehen',
    desc: 'Verstehe Skizzen und Pläne aus der Vogelperspektive.',
    kinds: ['plan'],
  },
  {
    id: 'e', cycle: 2, ga: false,
    title: 'Karten lesen',
    desc: 'Lies Signaturen und rechne mit dem Massstab.',
    kinds: ['signatur', 'massstab'],
  },
  {
    id: 'f', cycle: 2, ga: false,
    title: 'Massstabsgetreu',
    desc: 'Rechne Längen für den Plan um.',
    kinds: ['planmass'],
  },
  {
    id: 'g', cycle: 2, ga: false,
    title: 'Velo und ÖV',
    desc: 'Sei mit Velo und öffentlichem Verkehr sicher unterwegs.',
    kinds: ['oev'],
  },
  {
    id: 'h', cycle: 2, ga: true,
    title: 'Ortsplan und Karte',
    desc: 'Orientiere dich mit Ortsplan und topographischer Karte.',
    kinds: ['karte', 'richtung'],
  },
  {
    id: 'i', cycle: [2, 3], ga: false,
    title: 'Kompass und GPS',
    desc: 'Nutze Himmelsrichtungen, Kompass, GPS und Legende.',
    kinds: ['kompass'],
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
