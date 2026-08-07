// data.js — Spellwerk Stufen-Konfiguration.
//
// Die App setzt genau eine Kompetenz des Lehrplans 21 um: FS2E.5.E.1
// "Die Schülerinnen und Schüler können ihre Rechtschreibung
// entwickeln" (Englisch, Ausgabe Kanton Bern, Stand 01.08.2022).
// Die Stufen a bis d sind die offiziellen Kompetenzstufen. Eigene
// Texte sind als Abschreiben, Ergänzen und Prüfen von Wörtern und
// Wendungen umgesetzt. Das grosse I und grosse Wochentage gehören
// zur Rechtschreibung; die Prüfung achtet auf Gross- und
// Kleinschreibung.

export const COMPETENCY = 'FS2E.5.E.1';

export const STUFEN = [
  {
    id: 'a', cycle: 2, ga: false,
    title: 'Wörter abschreiben',
    desc: 'Schreibe englische Wörter genau ab.',
    kinds: ['abschreiben'],
    merkblatt: { id: 'englisch-schreiben', name: 'Richtig schreiben' },
  },
  {
    id: 'b', cycle: 2, ga: true,
    title: 'Sätze abschreiben',
    desc: 'Schreibe kurze Sätze ab und setze Satzzeichen.',
    kinds: ['satzschrift'],
    merkblatt: { id: 'englisch-schreiben', name: 'Richtig schreiben' },
  },
  {
    id: 'c', cycle: 3, ga: true,
    title: 'Häufige Formen',
    desc: 'Schreibe häufige Formen wie I am und they are korrekt.',
    kinds: ['hochform'],
    merkblatt: { id: 'englisch-schreiben', name: 'Richtig schreiben' },
  },
  {
    id: 'd', cycle: 3, ga: false,
    title: 'Fehler finden',
    desc: 'Finde Schreibfehler und meistere schwierige Wörter.',
    kinds: ['fehlerjagd'],
    merkblatt: { id: 'englisch-schreiben', name: 'Richtig schreiben' },
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
