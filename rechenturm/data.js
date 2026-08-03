// data.js — Rechenturm Stufen-Konfiguration.
//
// Die App setzt genau eine Kompetenz des Lehrplans 21 um: MA.1.A.3
// "Die Schülerinnen und Schüler können addieren, subtrahieren,
// multiplizieren, dividieren und potenzieren" (Ausgabe Kanton Bern).
// Die Stufen a bis j sind die offiziellen Kompetenzstufen dieser
// Kompetenz; `ga` markiert den Grundanspruch des Zyklus. Für den
// 3. Zyklus setzt der Lehrplan bei diesem Kompetenzaufbau keinen
// Grundanspruch. Stufenteile, die laut Lehrplan mit dem Rechner
// ausgeführt werden, sind hier als Kopfrechnen mit einfachen Zahlen
// umgesetzt; `erweiterung` markiert Erweiterungsinhalte.
//
// `kinds` nennt die Aufgabenformen der Generatoren in gen.js.

export const COMPETENCY = 'MA.1.A.3';

export const STUFEN = [
  {
    id: 'a', cycle: 1, ga: false,
    title: 'Bis 20 rechnen',
    desc: 'Verdopple, halbiere, rechne plus und minus bis 20.',
    kinds: ['add20', 'sub20', 'double20', 'half20'],
  },
  {
    id: 'b', cycle: 1, ga: true,
    title: 'Bis 100 ohne Übergang',
    desc: 'Rechne bis 100 ohne Zehnerübergang und ergänze auf den nächsten Zehner.',
    kinds: ['addNoCarry', 'subNoCarry', 'fillToTen', 'doubleRound', 'halfRound'],
  },
  {
    id: 'c', cycle: [1, 2], ga: false,
    title: 'Bis 100 mit Einmaleins',
    desc: 'Rechne bis 100 mit Übergang und übe das Einmaleins mit 2, 5 und 10.',
    kinds: ['add100', 'sub100', 'double100', 'half100', 'mul2510'],
  },
  {
    id: 'd', cycle: 2, ga: false,
    title: 'Schriftlich und Einmaleins',
    desc: 'Rechne grosse Plus- und Minusaufgaben und kenne das ganze Einmaleins.',
    kinds: ['addWritten', 'subWritten', 'einmaleins'],
  },
  {
    id: 'e', cycle: 2, ga: false,
    title: 'Grosse Zahlen im Kopf',
    desc: 'Rechne mit grossen Zahlen im Kopf, zum Beispiel 320000 plus 38000.',
    kinds: ['addBig', 'subBig', 'mulTens'],
  },
  {
    id: 'f', cycle: 2, ga: true,
    title: 'Dezimalzahlen plus und minus',
    desc: 'Addiere und subtrahiere Dezimalzahlen, zum Beispiel 30.8 plus 5.6.',
    kinds: ['addDec', 'subDec'],
  },
  {
    id: 'g', cycle: [2, 3], ga: false,
    title: 'Dezimalzahlen mal',
    desc: 'Multipliziere Dezimalzahlen und grosse Zahlen.',
    kinds: ['mulDec', 'mulBig'],
  },
  {
    id: 'h', cycle: 3, ga: false, erweiterung: true,
    title: 'Prozente und Primfaktoren',
    desc: 'Berechne Prozente und zerlege Zahlen in Primfaktoren.',
    kinds: ['percent', 'primeFactors'],
  },
  {
    id: 'i', cycle: 3, ga: false,
    title: 'Negative Zahlen, Brüche, Potenzen',
    desc: 'Rechne mit negativen Zahlen, Brüchen, Potenzen und Wurzeln.',
    kinds: ['negAdd', 'negMul', 'fracAdd', 'powerEval', 'rootEval'],
  },
  {
    id: 'j', cycle: 3, ga: false,
    title: 'Potenzterme umformen',
    desc: 'Forme Potenzterme um und rechne in wissenschaftlicher Schreibweise.',
    kinds: ['powerRule', 'sciConvert'],
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
