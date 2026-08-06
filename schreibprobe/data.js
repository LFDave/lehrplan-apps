// data.js — Schreibprobe Stufen-Konfiguration.
//
// Die App setzt genau eine Kompetenz des Lehrplans 21 um: D.4.F.1
// "Die Schülerinnen und Schüler können ihren Text sprachformal
// überarbeiten und dabei Rechtschreibregeln beachten" (Ausgabe Kanton
// Bern, Stand 01.08.2022). Die Stufen a bis g sind die offiziellen
// Kompetenzstufen; jede Stufe übt genau die Regeln, die ihr
// Stufentext nennt. Das Überarbeiten eigener Texte ist als Prüfen
// und Korrigieren vorgegebener Wörter und Sätze umgesetzt.

export const COMPETENCY = 'D.4.F.1';

export const STUFEN = [
  {
    id: 'a', cycle: 1, ga: true,
    title: 'Gross anfangen, Punkt setzen',
    desc: 'Satzanfang und Namenwörter gross, Punkt am Satzende, Lücken zwischen Wörtern.',
    kinds: ['satzanfang', 'nomenGross', 'satzende', 'wortgrenzen'],
  },
  {
    id: 'b', cycle: [1, 2], ga: false,
    title: 'Sch, Sp, St und Satzzeichen',
    desc: 'Schreibe sch-, sp- und st-Wörter richtig und wähle das Satzschlusszeichen.',
    kinds: ['spSt', 'ngSchreibung', 'schlusszeichen', 'abstraktGross'],
  },
  {
    id: 'c-schreibung', code: 'c', cycle: 2, ga: false,
    title: 'ie und ä',
    desc: 'Schreibe ie- und ä-Wörter richtig.',
    kinds: ['ieSchreibung', 'aeSchreibung'],
  },
  {
    id: 'c-kommas', code: 'c', cycle: 2, ga: false,
    title: 'Kommas bei Aufzählungen',
    desc: 'Setze die Kommas in Aufzählungen richtig.',
    kinds: ['kommaAufzaehlung'],
  },
  {
    id: 'd', cycle: 2, ga: true,
    title: 'Stamm und Doppelkonsonant',
    desc: 'Nutze die Wortstammregel und die Doppelkonsonantenregel.',
    kinds: ['stammRegel', 'doppelKonsonant', 'abstraktNomen'],
  },
  {
    id: 'e', cycle: [2, 3], ga: false,
    title: 'Abgeleitete Nomen und Strategien',
    desc: 'Schreibe Nomen mit -heit und -ung gross und wähle die passende Prüf-Strategie.',
    kinds: ['abgeleiteteNomen', 'strategie'],
  },
  {
    id: 'f', cycle: 3, ga: true,
    title: 'Alle Regeln mit Ausnahmen',
    desc: 'Beachte Kommas vor dass-Sätzen und schwierige Wörter wie isst und ist.',
    kinds: ['kommaDass', 'isstIst', 'dasDass'],
  },
  {
    id: 'g', cycle: 3, ga: false,
    title: 'Fehler selbst finden',
    desc: 'Finde die falsch geschriebenen Wörter und zähle Fehler in Sätzen.',
    kinds: ['fehlerSuche', 'fehlerZaehlen'],
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
