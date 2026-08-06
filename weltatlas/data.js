// data.js — Weltatlas Stufen-Konfiguration.
//
// Die App setzt genau eine Kompetenz des Lehrplans 21 um: RZG.4.1
// "Die Schülerinnen und Schüler können Orte lokalisieren"
// (Geografie, Ausgabe Kanton Bern, Stand 01.08.2022). Die Stufen a
// bis c sind die offiziellen Kompetenzstufen. Arbeit mit Karte und
// Globus ist als Orts- und Rasterwissen umgesetzt.

export const COMPETENCY = 'RZG.4.1';

export const STUFEN = [
  {
    id: 'a', cycle: 3, ga: false,
    title: 'Orte auffinden',
    desc: 'Kenne Kontinente, Ozeane, Länder und Hauptstädte.',
    kinds: ['ort'],
  },
  {
    id: 'b', cycle: 3, ga: false,
    title: 'Lage beschreiben',
    desc: 'Beschreibe die Lage von Orten mit Raummerkmalen.',
    kinds: ['lage'],
  },
  {
    id: 'c', cycle: 3, ga: true,
    title: 'Raster nutzen',
    desc: 'Nutze Gradnetz, Vegetationszonen und Plattengrenzen.',
    kinds: ['raster'],
    merkblatt: { id: 'gradnetz', name: 'Gradnetz' },
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
