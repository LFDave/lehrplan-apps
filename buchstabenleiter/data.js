// data.js — Buchstabenleiter Stufen-Konfiguration.
//
// Die App setzt genau eine Kompetenz des Lehrplans 21 um: D.5.E.1
// "Die Schülerinnen und Schüler kennen das ABC und können
// Rechtschreibregeln und Nachschlage-Strategien nutzen" (Ausgabe
// Kanton Bern, Stand 01.08.2022). Die Stufen a bis g sind die
// offiziellen Kompetenzstufen. Das Nachschlagen im echten
// Wörterbuch ist als ABC-Wissen und Entscheiden umgesetzt.

export const COMPETENCY = 'D.5.E.1';

export const STUFEN = [
  {
    id: 'a', cycle: 1, ga: false,
    title: 'ABC mit Hilfe',
    desc: 'Finde Nachbarn im ABC mit Auswahlhilfe.',
    kinds: ['abcNachbar'],
    merkblatt: { id: 'abc-tabelle', name: 'ABC-Tabelle' },
  },
  {
    id: 'b', cycle: 1, ga: true,
    title: 'ABC auswendig',
    desc: 'Tippe ABC-Nachbarn, zähle Silben, kenne sp und st.',
    kinds: ['buchstabieren'],
    merkblatt: { id: 'abc-tabelle', name: 'ABC-Tabelle' },
  },
  {
    id: 'c-vokale', code: 'c', cycle: 2, ga: false,
    title: 'Vokale und Konsonanten',
    desc: 'Erkenne Vokale und Konsonanten im ABC.',
    kinds: ['vokal'],
  },
  {
    id: 'c-gruppen', code: 'c', cycle: 2, ga: false,
    title: 'ABC-Gruppen',
    desc: 'Wo steht ein Buchstabe im ABC: vorne, in der Mitte oder hinten?',
    kinds: ['abcGruppe', 'vorNach'],
  },
  {
    id: 'd', cycle: 2, ga: true,
    title: 'Nachschlagen und Stammregel',
    desc: 'Ordne Wörter alphabetisch und nutze die Stammregel.',
    kinds: ['abcOrdnung'],
  },
  {
    id: 'e', cycle: [2, 3], ga: false,
    title: 'Wortbausteine',
    desc: 'Baue Nomen mit -heit, -keit und -ung.',
    kinds: ['morphem'],
  },
  {
    id: 'f', cycle: 3, ga: true,
    title: 'Beim Essen gross',
    desc: 'Schreibe Nomen nach beim, zum, nach dem gross, und «Sie» in Briefen.',
    kinds: ['nominalisierung'],
  },
  {
    id: 'g', cycle: 3, ga: false,
    title: 'Alles Gute',
    desc: 'Schreibe «alles Gute» gross und finde schwierige Wörter.',
    kinds: ['strategie'],
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
