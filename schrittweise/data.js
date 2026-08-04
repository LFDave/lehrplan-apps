// data.js — Schrittweise Stufen-Konfiguration.
//
// Die App setzt genau eine Kompetenz des Lehrplans 21 um: MI.2.2
// "Die Schülerinnen und Schüler können einfache Problemstellungen
// analysieren, mögliche Lösungsverfahren beschreiben und in
// Programmen umsetzen" (Ausgabe Kanton Bern, Stand 01.08.2022).
// Die Stufen a bis i sind die offiziellen Kompetenzstufen.
// Eigenes Schreiben von Programmen ist als Lesen, Nachverfolgen
// und Vorhersagen von Programmen umgesetzt.

export const COMPETENCY = 'MI.2.2';

export const STUFEN = [
  {
    id: 'a', cycle: 1, ga: true,
    title: 'Anleitungen befolgen',
    desc: 'Folge einer Anleitung Schritt für Schritt.',
    kinds: ['anleitung'],
  },
  {
    id: 'b', cycle: 2, ga: false,
    title: 'Wege ausprobieren',
    desc: 'Suche Lösungswege, prüfe und vergleiche sie.',
    kinds: ['loesungsweg'],
  },
  {
    id: 'c', cycle: 2, ga: false,
    title: 'Schleife oder Verzweigung',
    desc: 'Erkenne Schleifen und Verzweigungen im Alltag.',
    kinds: ['ablauf'],
  },
  {
    id: 'd', cycle: 2, ga: false,
    title: 'Programme ausführen',
    desc: 'Führe kleine Programme im Kopf aus.',
    kinds: ['ausfuehren'],
  },
  {
    id: 'e', cycle: 2, ga: false,
    title: 'Der Computer gehorcht',
    desc: 'Verstehe, dass ein Computer nur Anweisungen ausführt.',
    kinds: ['computer'],
  },
  {
    id: 'f', cycle: 2, ga: true,
    title: 'Schleifen verstehen',
    desc: 'Sage voraus, was ein Programm mit Schleife ergibt.',
    kinds: ['programm'],
  },
  {
    id: 'g', cycle: 3, ga: false,
    title: 'Bedingungen verfolgen',
    desc: 'Verfolge Programme mit Wenn und Sonst.',
    kinds: ['bedingung'],
  },
  {
    id: 'h', cycle: 3, ga: true,
    title: 'Variablen und Unterprogramme',
    desc: 'Verfolge Programme mit Variablen und Unterprogrammen.',
    kinds: ['unterprogramm'],
  },
  {
    id: 'i', cycle: 3, ga: false,
    title: 'Suchen im Vergleich',
    desc: 'Vergleiche lineare Suche und Halbieren.',
    kinds: ['suche'],
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
