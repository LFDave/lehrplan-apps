// data.js — Wertepfad Stufen-Konfiguration.
//
// Die App setzt genau eine Kompetenz des Lehrplans 21 um: MA.3.A.3
// "Die Schülerinnen und Schüler können Zahlenfolgen und Wertetabellen
// beschreiben, Proportionalität nutzen und mit Funktionen arbeiten"
// (Ausgabe Kanton Bern). Die Stufen a bis k sind die offiziellen
// Kompetenzstufen dieser Kompetenz; `ga` markiert den Grundanspruch
// des Zyklus.
//
// Zeichnen-Anteile des Lehrplans (Graphen einzeichnen) sind als
// Berechnen von Funktionswerten und Kenngrössen umgesetzt; die App
// prüft das Verständnis des Zusammenhangs, nicht die Zeichnung.

export const COMPETENCY = 'MA.3.A.3';

export const STUFEN = [
  {
    id: 'a', cycle: 1, ga: false,
    title: 'Wertetabellen lesen',
    desc: 'Führe einfache Tabellen weiter: 1 Flasche 2 Franken, 2 Flaschen 4 Franken.',
    kinds: ['tableSimple'],
  },
  {
    id: 'b', cycle: 1, ga: true,
    title: 'Zahlenfolgen',
    desc: 'Führe lineare Zahlenfolgen und Wertetabellen weiter.',
    kinds: ['linSeq', 'tableLinear'],
  },
  {
    id: 'c', cycle: 2, ga: false,
    title: 'Besondere Folgen',
    desc: 'Führe Quadrat-, Dreiecks- und andere nichtlineare Folgen weiter.',
    kinds: ['squareSeq', 'triangleSeq', 'fallingSeq'],
  },
  {
    id: 'd', cycle: 2, ga: false,
    title: 'Preistabellen',
    desc: 'Führe Wertetabellen mit Geldbeträgen weiter.',
    kinds: ['tableMoney'],
  },
  {
    id: 'e', cycle: 2, ga: true,
    title: 'Proportional rechnen',
    desc: 'Rechne mit Preisen pro Kilo, Geschwindigkeiten und Verbrauch.',
    kinds: ['propUnit', 'speedDist', 'fuel'],
  },
  {
    id: 'f', cycle: [2, 3], ga: false,
    title: 'Anteile vergleichen',
    desc: 'Bestimme Anteile in Prozent und vergleiche sie.',
    kinds: ['sharePercent', 'shareCompare'],
  },
  {
    id: 'g', cycle: 3, ga: false,
    title: 'Indirekt proportional',
    desc: 'Verteile gerecht, rechne mit umgekehrten Verhältnissen und Prozenten.',
    kinds: ['indirectProp', 'workers', 'percentOf'],
  },
  {
    id: 'h', cycle: 3, ga: false,
    title: 'Funktionswerte und Massstab',
    desc: 'Berechne y aus einer Funktionsgleichung und Strecken aus dem Massstab.',
    kinds: ['funcValue', 'mapScale'],
  },
  {
    id: 'i', cycle: 3, ga: true,
    title: 'Funktionen anwenden',
    desc: 'Bestimme Funktionswerte aus Gleichung und Tabelle, rechne Steigung und Zins.',
    kinds: ['funcValueEq', 'tableLookup', 'steigung', 'zins'],
  },
  {
    id: 'j', cycle: 3, ga: false,
    title: 'Schnittpunkte',
    desc: 'Bestimme den Schnittpunkt zweier Geraden rechnerisch.',
    kinds: ['intersect'],
  },
  {
    id: 'k', cycle: 3, ga: false,
    title: 'Steigung und Nullstelle',
    desc: 'Lies Steigung und y-Achsenabschnitt ab und berechne Nullstellen.',
    kinds: ['slope', 'intercept', 'zero'],
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
