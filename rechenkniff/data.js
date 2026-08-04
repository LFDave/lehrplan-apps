// data.js — Rechenkniff Stufen-Konfiguration.
//
// Die App setzt genau eine Kompetenz des Lehrplans 21 um: MA.1.A.4
// "Die Schülerinnen und Schüler können Zahlen zerlegen, umformen und
// Rechengesetze nutzen" (Ausgabe Kanton Bern). Die Stufen a bis l
// sind die offiziellen Kompetenzstufen dieser Kompetenz; `ga`
// markiert den Grundanspruch des Zyklus, `erweiterung` Stufen, deren
// Inhalt der Lehrplan als Erweiterung führt.

export const COMPETENCY = 'MA.1.A.4';

export const STUFEN = [
  {
    id: 'a', cycle: 1, ga: false,
    title: 'Gleich viele machen',
    desc: 'Verteile zwei Mengen so, dass beide gleich gross sind.',
    kinds: ['equalize'],
  },
  {
    id: 'b', cycle: 1, ga: false,
    title: 'Zahlen zerlegen',
    desc: 'Zerlege Zahlen bis 20 und tausche die Reihenfolge beim Plus.',
    kinds: ['decompose', 'commuteAdd'],
  },
  {
    id: 'c', cycle: 1, ga: true,
    title: 'Umkehren und geschickt rechnen',
    desc: 'Nutze Plus als Umkehrung von Minus und rechne über den Zehner.',
    kinds: ['inverseAdd', 'assocSplit'],
  },
  {
    id: 'd', cycle: [1, 2], ga: false,
    title: 'Nachbar-Produkte',
    desc: 'Nutze Beziehungen zwischen Malaufgaben und tausche Faktoren.',
    kinds: ['prodNeighbor', 'commuteMul'],
  },
  {
    id: 'e', cycle: 2, ga: false,
    title: 'Geteilt als Umkehrung',
    desc: 'Nutze Mal als Umkehrung von Geteilt und das Zehnereinmaleins.',
    kinds: ['inverseDiv', 'tensEinmaleins'],
  },
  {
    id: 'f', cycle: 2, ga: false,
    title: 'Verdoppeln, bündeln, runden',
    desc: 'Forme Produkte um, bündle Summen geschickt und runde Zahlen.',
    kinds: ['doubleHalf', 'assocSum', 'assocProd', 'roundNat'],
  },
  {
    id: 'g', cycle: 2, ga: true,
    title: 'Teilbarkeit und Dezimal-Runden',
    desc: 'Erkenne teilbare Zahlen und runde Dezimalzahlen.',
    kinds: ['divisibleMc', 'roundDec'],
  },
  {
    id: 'h', cycle: [2, 3], ga: false,
    title: 'Punkt vor Strich',
    desc: 'Beachte Punkt vor Strich und Klammern, löse einfache Gleichungen.',
    kinds: ['dotBeforeDash', 'brackets', 'solveSimple', 'divisible39Mc'],
  },
  {
    id: 'i', cycle: 3, ga: false,
    title: 'Potenzen und Verteilen',
    desc: 'Schreibe Produkte als Potenz und nutze das Distributivgesetz.',
    kinds: ['powerWrite', 'distributive', 'roundSensible'],
  },
  {
    id: 'j', cycle: 3, ga: false, erweiterung: true,
    title: 'Gleichungen mit x',
    desc: 'Löse lineare Gleichungen und fasse einfache Terme zusammen.',
    kinds: ['linearEq', 'addTermsSimple'],
  },
  {
    id: 'k', cycle: 3, ga: true,
    title: 'Terme zusammenfassen',
    desc: 'Addiere und subtrahiere Terme mit zwei Variablen.',
    kinds: ['combineTerms'],
  },
  {
    id: 'l', cycle: 3, ga: false,
    title: 'Quadrate und Binome',
    desc: 'Löse x² - 9 = 0, beachte Potenz vor Punkt und kenne die binomischen Formeln.',
    kinds: ['quadSolve', 'powerFirst', 'binomMc'],
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
