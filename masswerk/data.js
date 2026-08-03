// data.js — Masswerk Stufen-Konfiguration.
//
// Die App setzt genau eine Kompetenz des Lehrplans 21 um: MA.3.A.2
// "Die Schülerinnen und Schüler können Grössen schätzen, messen,
// umwandeln, runden und mit ihnen rechnen" (Ausgabe Kanton Bern).
// Die Stufen sind die offiziellen Kompetenzstufen a bis k dieser
// Kompetenz; `ga` markiert den Grundanspruch des Zyklus.
//
// Die Stufen a und f üben Schätzen und Messen mit echten Dingen
// (Schnur schneiden, Wasser verteilen, Gegenstände messen). Das kann
// eine App nicht prüfen; sie fehlen darum bewusst in der Leiter und
// werden im Fuss der Übersicht genannt (SKIPPED).

export const COMPETENCY = 'MA.3.A.2';

export const STUFEN = [
  {
    id: 'b', cycle: 1, ga: false,
    title: 'Franken und halbe Stunden',
    desc: 'Rechne mit ganzen Franken bis 20 und mit halben Stunden.',
    kinds: ['moneyAdd', 'moneySub', 'halfHour'],
  },
  {
    id: 'c', cycle: 1, ga: true,
    title: 'Längen bis 1 Meter',
    desc: 'Rechne mit Zentimetern, teile den Meter und halbiere Geldbeträge.',
    kinds: ['lenAdd', 'doubleLen', 'halfMoney', 'meterParts'],
  },
  {
    id: 'd', cycle: [1, 2], ga: false,
    title: 'Franken und Rappen, Uhrzeiten',
    desc: 'Rechne mit Franken und Rappen und bestimme Zeitdauern.',
    kinds: ['moneyRp', 'duration'],
  },
  {
    id: 'e', cycle: 2, ga: false,
    title: 'Einheiten umwandeln',
    desc: 'Wandle benachbarte Einheiten um: Meter, Liter, Kilogramm.',
    kinds: ['convertNeighbor', 'addUnits'],
  },
  {
    id: 'g', cycle: 2, ga: false,
    title: 'Mit Grössen rechnen',
    desc: 'Rechne mit Längen, Gewichten und Zeiten über Einheitsgrenzen.',
    kinds: ['calcUnits', 'timeToMin', 'minToH'],
  },
  {
    id: 'h', cycle: 2, ga: true,
    title: 'Vergleichen und runden',
    desc: 'Vergleiche Grössen, runde sie und wandle zweifach benannte um.',
    kinds: ['compare', 'twoUnit', 'roundUnit'],
  },
  {
    id: 'i', cycle: 3, ga: false,
    title: 'Flächen und Volumen',
    desc: 'Wandle Flächen und Volumen um und vergleiche relativ in Prozent.',
    kinds: ['areaVol', 'relPercent'],
  },
  {
    id: 'j', cycle: 3, ga: true,
    title: 'SI-Vorsätze',
    desc: 'Ordne Mega, Kilo, Dezi, Centi und Milli den Zehnerpotenzen zu.',
    kinds: ['prefix'],
  },
  {
    id: 'k', cycle: 3, ga: false,
    title: 'Geschwindigkeiten',
    desc: 'Rechne mit zusammengesetzten Grössen wie Metern pro Sekunde.',
    kinds: ['speedToKmh', 'speedToMs'],
  },
];

// Bewusst nicht in der App: Schätzen und Messen mit echten Dingen.
export const SKIPPED = ['a', 'f'];

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
