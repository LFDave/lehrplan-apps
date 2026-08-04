// data.js — Bitkiste Stufen-Konfiguration.
//
// Die App setzt genau eine Kompetenz des Lehrplans 21 um: MI.2.1
// "Die Schülerinnen und Schüler können Daten aus ihrer Umwelt
// darstellen, strukturieren und auswerten" (Ausgabe Kanton Bern,
// Stand 01.08.2022). Die Stufen a bis k sind die offiziellen
// Kompetenzstufen. Praktisches Arbeiten am Gerät (Dokumente ablegen,
// Datenbanken bedienen) ist als Erkennen und Entscheiden umgesetzt.

export const COMPETENCY = 'MI.2.1';

export const STUFEN = [
  {
    id: 'a', cycle: 1, ga: true,
    title: 'Ordnen und finden',
    desc: 'Ordne Dinge nach Eigenschaften, damit du sie schneller findest.',
    kinds: ['ordnen'],
  },
  {
    id: 'b', cycle: 2, ga: false,
    title: 'Daten darstellen',
    desc: 'Erkenne Symbole, Tabellen und Diagramme.',
    kinds: ['darstellung'],
  },
  {
    id: 'c', cycle: 2, ga: false,
    title: 'Geheimschriften',
    desc: 'Entschlüssle Wörter mit verschobenen Buchstaben.',
    kinds: ['geheimschrift'],
  },
  {
    id: 'd', cycle: 2, ga: false,
    title: 'Text, Bild, Ton',
    desc: 'Ordne Dateiendungen den Datenarten zu.',
    kinds: ['dateityp'],
  },
  {
    id: 'e', cycle: 2, ga: true,
    title: 'Dokumente kennen',
    desc: 'Kenne die Dokumententypen, mit denen du arbeitest.',
    kinds: ['dokument'],
  },
  {
    id: 'f', cycle: [2, 3], ga: false,
    title: 'Baum oder Netz',
    desc: 'Erkenne Baum- und Netzstrukturen im Alltag.',
    kinds: ['struktur'],
  },
  {
    id: 'g', cycle: [2, 3], ga: false,
    title: 'Prüfbits',
    desc: 'Verstehe, wie ein Prüfbit Fehler erkennt.',
    kinds: ['pruefbit'],
  },
  {
    id: 'h', cycle: 3, ga: false,
    title: 'Gut ablegen',
    desc: 'Lege Dateien so ab, dass andere sie wiederfinden.',
    kinds: ['ablegen'],
  },
  {
    id: 'i', cycle: 3, ga: false,
    title: 'Und, oder, nicht',
    desc: 'Werte logische Aussagen mit UND, ODER und NICHT aus.',
    kinds: ['logik'],
  },
  {
    id: 'j', cycle: 3, ga: true,
    title: 'Datenbanken',
    desc: 'Verstehe Datensätze, Merkmale und Abfragen.',
    kinds: ['datenbank'],
  },
  {
    id: 'k', cycle: 3, ga: false,
    title: 'Backup und Co.',
    desc: 'Unterscheide Backup, Synchronisation und Versionierung.',
    kinds: ['replikation'],
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
