// data.js — Zahlensprung Stufen-Konfiguration.
//
// Die App setzt genau eine Kompetenz des Lehrplans 21 um: MA.1.A.2
// "Die Schülerinnen und Schüler können flexibel zählen, Zahlen nach der
// Grösse ordnen und Ergebnisse überschlagen" (Ausgabe Kanton Bern).
// Die Stufen a bis j sind die offiziellen Kompetenzstufen dieser
// Kompetenz; `ga` markiert den Grundanspruch des jeweiligen Zyklus.
// Die Beschreibungen sind kindgerechte Umschreibungen, keine
// Originaltexte; massgebend bleibt der offizielle Lehrplan.
//
// `tasks` nennt die Aufgabenformen der Stufe, `params` die Zahlenräume
// und Schrittweiten für die Generatoren in gen.js. Der Zahlenraum
// begrenzt jede Zahl der Aufgabe, auch das Ergebnis.

export const COMPETENCY = 'MA.1.A.2';

export const STUFEN = [
  {
    id: 'a', cycle: 1, ga: false,
    title: 'Punkte zählen',
    desc: 'Zähle Punkte und vergleiche Zahlen bis 20.',
    tasks: ['count', 'order'],
    params: { countMax: 20, orderMax: 20, orderCount: 3 },
  },
  {
    id: 'b', cycle: 1, ga: false,
    title: 'Bis 20 zählen',
    desc: 'Zähle vorwärts und rückwärts bis 20, auch in 2er-Schritten.',
    tasks: ['sequence'],
    params: { max: 20, steps: [1, 2], backward: true },
  },
  {
    id: 'c', cycle: 1, ga: true,
    title: 'Bis 100 in Schritten',
    desc: 'Zähle in 1er-, 2er-, 5er- und 10er-Schritten bis 100 und ordne Zahlen.',
    tasks: ['sequence', 'order'],
    params: { max: 100, steps: [1, 2, 5, 10], backward: false, orderMax: 100, orderCount: 4 },
  },
  {
    id: 'd', cycle: [1, 2], ga: false,
    title: 'Bis 100 rückwärts',
    desc: 'Zähle von jeder Zahl aus vorwärts und rückwärts bis 100.',
    tasks: ['sequence'],
    params: { max: 100, steps: [1, 2, 5, 10], backward: true },
  },
  {
    id: 'e', cycle: 2, ga: false,
    title: 'Bis 1000',
    desc: 'Zähle in Schritten bis 1000 und ordne Zahlen.',
    tasks: ['sequence', 'order'],
    params: { max: 1000, steps: [1, 2, 10, 100], backward: true, orderMax: 1000, orderCount: 4 },
  },
  {
    id: 'f', cycle: 2, ga: false,
    title: 'Bis 1 Million',
    desc: 'Zähle in grossen Schritten bis 1 Million und ordne grosse Zahlen.',
    tasks: ['sequence', 'order'],
    params: { max: 1000000, steps: [1000, 10000, 20000, 100000], backward: true, orderMax: 1000000, orderCount: 4 },
  },
  {
    id: 'g', cycle: 2, ga: true,
    title: 'Dezimalzahlen und Brüche',
    desc: 'Zähle mit Dezimalzahlen, ordne Brüche und überschlage Ergebnisse.',
    tasks: ['sequence', 'order', 'estimate'],
    params: {
      max: 10, steps: [0.005, 0.01, 0.1, 0.25], decimals: 3, backward: true,
      orderKind: 'decimals', orderCount: 4, estimateKind: 'natural',
    },
  },
  {
    id: 'h', cycle: [2, 3], ga: false,
    title: 'Überschlagen',
    desc: 'Überschlage Ergebnisse mit Dezimalzahlen und Prozenten.',
    tasks: ['estimate'],
    params: { estimateKind: 'decimal-percent' },
  },
  {
    id: 'i', cycle: 3, ga: false, erweiterung: true,
    title: 'Mal und geteilt überschlagen',
    desc: 'Überschlage Produkte und Quotienten von Dezimalzahlen.',
    tasks: ['estimate'],
    params: { estimateKind: 'decimal-multiply' },
  },
  {
    id: 'j', cycle: 3, ga: true,
    title: 'Negative Zahlen ordnen',
    desc: 'Ordne positive und negative Zahlen auf dem Zahlenstrahl.',
    tasks: ['order'],
    params: { orderKind: 'negatives', orderCount: 4 },
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
