// data.js — Grössenwissen Stufen-Konfiguration.
//
// Die App setzt genau eine Kompetenz des Lehrplans 21 um: MA.3.A.1
// "Die Schülerinnen und Schüler verstehen und verwenden Begriffe und
// Symbole zu Grössen, Funktionen, Daten und Zufall und können sich an
// Referenzgrössen orientieren" (Ausgabe Kanton Bern). Die Stufen a
// bis l sind die offiziellen Kompetenzstufen dieser Kompetenz; `ga`
// markiert den Grundanspruch des Zyklus.

export const COMPETENCY = 'MA.3.A.1';

export const STUFEN = [
  {
    id: 'a', cycle: 1, ga: false,
    title: 'Gegenteile',
    desc: 'Beschreibe Dinge mit lang und kurz, schwer und leicht, schnell und langsam.',
    kinds: ['oppositeMc'],
  },
  {
    id: 'b', cycle: 1, ga: false,
    title: 'Münzen und Vergleiche',
    desc: 'Kenne die echten Münzen und Noten und vergleiche mit am meisten und am schwersten.',
    kinds: ['coinReal', 'superlative'],
  },
  {
    id: 'c', cycle: 1, ga: true,
    title: 'Meter, Minuten, Franken',
    desc: 'Kenne die Einheiten und Abkürzungen für Länge, Zeit und Geld.',
    kinds: ['abbrevMc', 'unitFact'],
  },
  {
    id: 'd', cycle: [1, 2], ga: false,
    title: 'Beträge legen',
    desc: 'Lege Geldbeträge bis 100 Franken mit Noten und Münzen.',
    kinds: ['legenAmount'],
  },
  {
    id: 'e', cycle: 2, ga: false,
    title: 'Referenzgrössen',
    desc: 'Orientiere dich an 1 kg, 1 l, 1 km und kenne die Abkürzungen.',
    kinds: ['referenceMc', 'unitFact2'],
  },
  {
    id: 'f', cycle: 2, ga: false,
    title: 'Vorsätze',
    desc: 'Verstehe Kilo, Dezi, Centi und Milli und die kleinen Einheiten.',
    kinds: ['prefixMc', 'smallUnitFact'],
  },
  {
    id: 'g', cycle: 2, ga: false,
    title: 'Sicher oder unmöglich',
    desc: 'Ordne Aussagen ein: sicher, möglich oder unmöglich.',
    kinds: ['probTerm'],
  },
  {
    id: 'h', cycle: 2, ga: true,
    title: 'Diagramme und Flächenmasse',
    desc: 'Kenne Kreis-, Säulen- und Liniendiagramm, Flächenmasse und den Mittelwert.',
    kinds: ['diagramMc', 'areaFact', 'mittelwert'],
  },
  {
    id: 'i', cycle: [2, 3], ga: false,
    title: 'Raummasse und grosse Vorsätze',
    desc: 'Orientiere dich an m³ und dm³ und kenne Mega, Giga und Tera.',
    kinds: ['volumeFact', 'bigPrefixMc'],
  },
  {
    id: 'j', cycle: 3, ga: false,
    title: 'Währungen und Hektaren',
    desc: 'Kenne CHF, Euro und Dollar sowie Hektare und Are.',
    kinds: ['currencyMc', 'haFact'],
  },
  {
    id: 'k', cycle: 3, ga: false,
    title: 'Häufigkeit und Geschwindigkeit',
    desc: 'Berechne relative Häufigkeiten und kenne Einheiten wie km/h.',
    kinds: ['relFreq', 'unitPickMc'],
  },
  {
    id: 'l', cycle: 3, ga: true,
    title: 'Zins, Rabatt und kleine Vorsätze',
    desc: 'Kenne Zins, Kapital, Brutto und Netto, Mikro und Nano, berechne Rabatte.',
    kinds: ['finTermMc', 'microPrefixMc', 'rabatt'],
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
