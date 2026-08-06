// data.js — Rechnerraum Stufen-Konfiguration.
//
// Die App setzt genau eine Kompetenz des Lehrplans 21 um: MI.2.3
// "Die Schülerinnen und Schüler verstehen Aufbau und Funktionsweise
// von informationsverarbeitenden Systemen" (Ausgabe Kanton Bern,
// Stand 01.08.2022). Die Stufen a bis l sind die offiziellen
// Kompetenzstufen. Arbeit am echten Gerät ist als Wissen über
// Bedienung, Speicher und Netze umgesetzt.

export const COMPETENCY = 'MI.2.3';

export const STUFEN = [
  {
    id: 'a', cycle: 1, ga: false,
    title: 'Geräte bedienen',
    desc: 'Schalte Geräte ein und aus, starte und beende Programme.',
    kinds: ['bedienung'],
  },
  {
    id: 'b', cycle: 1, ga: false,
    title: 'Anmelden',
    desc: 'Nutze dein Login und gehe gut mit dem Passwort um.',
    kinds: ['login'],
  },
  {
    id: 'c', cycle: 1, ga: true,
    title: 'Ablegen und finden',
    desc: 'Lege Dokumente ab und finde sie wieder.',
    kinds: ['ablage'],
  },
  {
    id: 'd', cycle: [1, 2], ga: false,
    title: 'Fenster und Menus',
    desc: 'Arbeite mit Fenstern, Menus und mehreren Programmen.',
    kinds: ['oberflaeche'],
  },
  {
    id: 'e', cycle: 2, ga: false,
    title: 'System und Programme',
    desc: 'Unterscheide Betriebssystem und Anwendungssoftware.',
    kinds: ['software'],
  },
  {
    id: 'f', cycle: 2, ga: false,
    title: 'Speicher und Grössen',
    desc: 'Kenne Speicherarten und rechne mit Byte, MB und GB.',
    kinds: ['speicher'],
    merkblatt: { id: 'speichereinheiten', name: 'Speichereinheiten' },
  },
  {
    id: 'g', cycle: 2, ga: false,
    title: 'Probleme lösen',
    desc: 'Hilf dir mit Hilfe-Funktion und Recherche.',
    kinds: ['strategie'],
  },
  {
    id: 'h', cycle: 2, ga: true,
    title: 'Daten schützen',
    desc: 'Wisse, wie Daten verloren gehen und wie man sie schützt.',
    kinds: ['schutz'],
  },
  {
    id: 'i', cycle: [2, 3], ga: false,
    title: 'Suchmaschinen',
    desc: 'Verstehe, wie Suchmaschinen arbeiten.',
    kinds: ['suche'],
  },
  {
    id: 'j', cycle: [2, 3], ga: false,
    title: 'Speicherorte',
    desc: 'Unterscheide lokales Gerät, Netzwerk und Internet.',
    kinds: ['ortewahl'],
  },
  {
    id: 'k', cycle: [2, 3], ga: false,
    title: 'Leistung einschätzen',
    desc: 'Schätze Speicher, Auflösung und Übertragungsrate ein.',
    kinds: ['leistung'],
  },
  {
    id: 'l', cycle: 3, ga: false,
    title: 'EVA und Internet',
    desc: 'Kenne Eingabe, Verarbeitung, Ausgabe und die Netz-Dienste.',
    kinds: ['eva'],
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
