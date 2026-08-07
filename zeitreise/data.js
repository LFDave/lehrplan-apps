// data.js — Zeitreise Stufen-Konfiguration.
//
// Die App setzt genau eine Kompetenz des Lehrplans 21 um: NMG.9.1
// "Die Schülerinnen und Schüler können Zeitbegriffe anwenden, Zeit
// darstellen und Dauer, Entwicklungen und Epochen einordnen" (Ausgabe
// Kanton Bern, Stand 01.08.2022). Die Stufen a bis h sind die
// offiziellen Kompetenzstufen. Zeit erleben und selber messen ist als
// Einordnen und Vergleichen umgesetzt; die App prüft das Verständnis,
// nicht die Stoppuhr.

export const COMPETENCY = 'NMG.9.1';

export const STUFEN = [
  {
    id: 'a', cycle: 1, ga: false,
    title: 'Gestern, heute, morgen',
    desc: 'Ordne Zeitwörter, Wochentage und Monate.',
    kinds: ['zeitwort', 'wochentag', 'monat'],
    merkblatt: { id: 'kalender', name: 'Kalender' },
  },
  {
    id: 'b', cycle: 1, ga: false,
    title: 'Jahreszeiten und Uhr',
    desc: 'Kenne den Jahreskreis und lies die Uhr.',
    kinds: ['jahreszeit', 'uhr'],
    merkblatt: { id: 'kalender', name: 'Kalender' },
  },
  {
    id: 'c', cycle: 1, ga: true,
    title: 'Reihenfolgen und Dauer',
    desc: 'Ordne Handlungsschritte und schätze, was wie lange dauert.',
    kinds: ['abfolge', 'dauer'],
    merkblatt: { id: 'kalender', name: 'Kalender' },
  },
  {
    id: 'd', cycle: [1, 2], ga: false,
    title: 'Jeden Tag oder nicht?',
    desc: 'Unterscheide, was im Tageslauf gleich bleibt und was ändert.',
    kinds: ['tagesstruktur'],
    merkblatt: { id: 'kalender', name: 'Kalender' },
  },
  {
    id: 'e', cycle: [1, 2], ga: false,
    title: 'Der Zeitstrahl',
    desc: 'Vergleiche Jahre und Zeitdauern auf dem Zeitstrahl.',
    kinds: ['zeitstrahl', 'dauerRechnen'],
    merkblatt: { id: 'zeitstrahl', name: 'Zeitstrahl' },
  },
  {
    id: 'f', cycle: 2, ga: false,
    title: 'Drei Generationen',
    desc: 'Ordne Kinder, Eltern und Grosseltern zeitlich ein.',
    kinds: ['generation'],
    merkblatt: { id: 'zeitstrahl', name: 'Zeitstrahl' },
  },
  {
    id: 'g', cycle: 2, ga: true,
    title: 'Epochen der Geschichte',
    desc: 'Ordne Steinzeit, Antike, Mittelalter und Neuzeit.',
    kinds: ['epoche'],
    merkblatt: { id: 'zeitstrahl', name: 'Zeitstrahl' },
  },
  {
    id: 'h', cycle: [2, 3], ga: false,
    title: 'Ereignisse einordnen',
    desc: 'Ordne historische Ereignisse und rechne mit Jahrhunderten.',
    kinds: ['ereignis', 'jahrhundert'],
    merkblatt: { id: 'zeitstrahl', name: 'Zeitstrahl' },
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
