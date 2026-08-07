// data.js — Wortbau Stufen-Konfiguration.
//
// Die App setzt genau eine Kompetenz des Lehrplans 21 um: D.5.D.1
// "Die Schülerinnen und Schüler kennen die Wortarten, Zeitformen und
// grammatischen Proben und können Wörter und Sätze untersuchen"
// (Ausgabe Kanton Bern, Stand 01.08.2022). Die Stufen a bis g sind
// die offiziellen Kompetenzstufen; jede Stufe übt genau die Begriffe,
// die ihr Stufentext nennt.

export const COMPETENCY = 'D.5.D.1';

export const STUFEN = [
  {
    id: 'a', cycle: 1, ga: true,
    title: 'Nomen, Verb, Adjektiv',
    desc: 'Erkenne die drei Hauptwortarten an einfachen Wörtern.',
    kinds: ['wortart'],
    merkblatt: { id: 'wortarten', name: 'Wortarten' },
  },
  {
    id: 'b', cycle: 2, ga: false,
    title: 'Zeitformen und Wortfamilien',
    desc: 'Erkenne Präsens, Präteritum und Perfekt, zerlege zusammengesetzte Nomen.',
    kinds: ['zeitform', 'zusammengesetzt', 'wortstamm', 'wortfamilie'],
    merkblatt: { id: 'zeitformen', name: 'Zeitformen' },
  },
  {
    id: 'c', cycle: 2, ga: true,
    title: 'Infinitiv und Morpheme',
    desc: 'Bestimme Infinitiv und Personalform und zerlege Wörter in Morpheme.',
    kinds: ['infinitiv', 'personalform', 'morphem'],
    merkblatt: { id: 'zeitformen', name: 'Zeitformen' },
  },
  {
    id: 'd', cycle: [2, 3], ga: false,
    title: 'Pronomen, Partikeln und Fälle',
    desc: 'Erkenne Pronomen und Partikeln, lerne Futur und die vier Fälle kennen.',
    kinds: ['pronomen', 'futur', 'faelleIntro'],
    merkblatt: { id: 'wortarten', name: 'Wortarten' },
  },
  {
    id: 'e', cycle: 3, ga: true,
    title: 'Fälle und Satzglieder',
    desc: 'Bestimme die vier Fälle, Präpositionen und Satzglieder.',
    kinds: ['praeposition', 'fallBestimmen', 'morphemZerlegen', 'satzglied'],
    merkblatt: { id: 'satzglieder', name: 'Satzglieder' },
  },
  {
    id: 'f', cycle: 3, ga: false,
    title: 'Alle Wortarten bestimmen',
    desc: 'Bestimme Konjunktionen, Präpositionen und alle Zeitformen sicher.',
    kinds: ['konjunktion', 'zeitformAlle'],
    merkblatt: { id: 'wortarten', name: 'Wortarten' },
  },
  {
    id: 'g', cycle: 3, ga: false,
    title: 'Modus, Aktiv und Passiv',
    desc: 'Erkenne Imperativ und Konjunktiv, Aktiv und Passiv, Subjekt und Objekt.',
    kinds: ['modus', 'aktivPassiv', 'subjektObjekt', 'satzart'],
    merkblatt: { id: 'zeitformen', name: 'Zeitformen' },
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
