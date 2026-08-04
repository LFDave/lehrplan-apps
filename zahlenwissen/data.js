// data.js — Zahlenwissen Stufen-Konfiguration.
//
// Die App setzt genau eine Kompetenz des Lehrplans 21 um: MA.1.A.1
// "Die Schülerinnen und Schüler verstehen und verwenden arithmetische
// Begriffe und Symbole. Sie können Zahlen lesen und schreiben"
// (Ausgabe Kanton Bern). Die Stufen a bis l sind die offiziellen
// Kompetenzstufen dieser Kompetenz; `ga` markiert den Grundanspruch
// des Zyklus.
//
// `kinds` nennt die Aufgabenformen der Generatoren in gen.js.

export const COMPETENCY = 'MA.1.A.1';

export const STUFEN = [
  {
    id: 'a', cycle: 1, ga: false,
    title: 'Mehr oder weniger',
    desc: 'Vergleiche Punktmengen: Wo sind mehr, wo weniger Punkte?',
    kinds: ['moreDots', 'fewerDots'],
  },
  {
    id: 'b', cycle: 1, ga: false,
    title: 'Plus, minus, gleich',
    desc: 'Setze die Zeichen +, - und = richtig ein.',
    kinds: ['opSymbol', 'trueEquation'],
  },
  {
    id: 'c', cycle: 1, ga: true,
    title: 'Zahlen bis 100',
    desc: 'Lies und schreibe Zahlen bis 100, erkenne gerade Zahlen, Zehner und Einer.',
    kinds: ['numberWord100', 'evenOdd', 'compareSign', 'tensOnes'],
  },
  {
    id: 'd', cycle: [1, 2], ga: false,
    title: 'Geteilt',
    desc: 'Verstehe das Zeichen : für geteilt.',
    kinds: ['divSymbol'],
  },
  {
    id: 'e', cycle: 2, ga: false,
    title: 'Zahlen bis 1000',
    desc: 'Lies Zahlen bis 1000, erkenne Quadratzahlen, Stellenwerte und Reste.',
    kinds: ['numberWord1000', 'squareNumber', 'placeValue', 'remainder'],
  },
  {
    id: 'f', cycle: 2, ga: false,
    title: 'Fachwörter und grosse Zahlen',
    desc: 'Kenne Summe, Differenz, Produkt und Quotient und schreibe Zahlen bis 1 Million.',
    kinds: ['opTerms', 'numberWordBig'],
  },
  {
    id: 'g', cycle: 2, ga: true,
    title: 'Brüche und Prozente lesen',
    desc: 'Kenne Zähler, Nenner, Teiler und Vielfache und schreibe Dezimalzahlen.',
    kinds: ['fracTerms', 'teilerMc', 'vielfacheMc', 'decimalWord'],
  },
  {
    id: 'h', cycle: [2, 3], ga: false,
    title: 'Umwandeln',
    desc: 'Wandle zwischen Bruch, Dezimalzahl und Prozent um und erkenne Primzahlen.',
    kinds: ['fracToPercent', 'percentToDec', 'decToFrac', 'primeMc'],
  },
  {
    id: 'i', cycle: 3, ga: false,
    title: 'Potenzen und Wurzeln benennen',
    desc: 'Kenne Basis, Exponent und die Zeichen für Wurzel und Vergleich, lies Zahlen bis 1 Milliarde.',
    kinds: ['powerTerms', 'symbolMeaning', 'bigRead'],
  },
  {
    id: 'j', cycle: 3, ga: true,
    title: 'Wissenschaftliche Schreibweise',
    desc: 'Lies und schreibe Zahlen wie 1.32 · 10⁸ und Potenzen mit Dezimalbasis.',
    kinds: ['sciRead', 'sciWrite', 'ratPower'],
  },
  {
    id: 'k', cycle: 3, ga: false,
    title: 'Kehrwert und kleine Zahlen',
    desc: 'Kenne Kehrwert, dritte Wurzel und Zehnerpotenzen mit Minus.',
    kinds: ['kehrwert', 'negExp', 'cubeRoot', 'numberSet'],
  },
  {
    id: 'l', cycle: 3, ga: false,
    title: 'Irrationale Zahlen',
    desc: 'Unterscheide rationale und irrationale Zahlen.',
    kinds: ['irrationalPick', 'rationalCheck'],
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
