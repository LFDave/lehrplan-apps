// data.js — Nachfragen mit KI: Prompt-Vorlagen, Marker, Dienste.
//
// Die Seite baut aus wenigen Knöpfen fertige Fragen an einen KI-Dienst.
// Jede Vorlage endet mit dem QUELLEN-Block: einzige Quelle ist das
// offizielle PDF des Lehrplans 21 (Ausgabe Kanton Bern), kein anderes
// Internet, keine erfundenen Kompetenzstufen, Antwort in der gewählten
// Sprache. Der Text der Vorlagen ist eigene Formulierung.
//
// Nur Prüfmarker, die der Lehrplan wirklich kennt: der Grundanspruch am
// Ende jedes Zyklus und die zwei Orientierungspunkte (Ende 4. Klasse,
// Mitte 8. Klasse). Andere Klassenenden haben keinen Marker.

export const PDF_URL = 'https://be.lehrplan.ch/container/BE_DE_Gesamtausgabe.pdf';
export const SITE_URL = 'https://lfdave.github.io/lehrplan-apps/';

// Die Gesamtausgabe (72 MB) ist für die PDF-Leser der KI-Dienste zu
// gross. be.lehrplan.ch bietet dieselben Kapitel als kleine Dateien an;
// die Prompts nennen nur diese. Die Fachbereichsdateien enthalten den
// vollständigen Kompetenzaufbau (NMG mit NT, WAH, RZG, ERG).
export const PDFS = {
  ueberblick: { label: 'Überblick (Aufbau, Zyklen, Grundansprüche, Orientierungspunkte, Codes)', url: 'https://be.lehrplan.ch/container/BE_Ueberblick.pdf' },
  grundlagen: { label: 'Grundlagen (Kompetenzorientierung, Zyklen, überfachliche Kompetenzen)', url: 'https://be.lehrplan.ch/container/BE_Grundlagen.pdf' },
  ahb: { label: 'Allgemeine Hinweise und Bestimmungen des Kantons Bern (Beurteilung, Übertritt)', url: 'https://be.lehrplan.ch/lehrplan_printout.php?e=1&fb_id=92' },
  spr: { label: 'Sprachen (Deutsch, Französisch, Englisch, Italienisch)', url: 'https://be.lehrplan.ch/container/BE_DE_Fachbereich_SPR.pdf' },
  ma: { label: 'Mathematik', url: 'https://be.lehrplan.ch/container/BE_DE_Fachbereich_MA.pdf' },
  nmg: { label: 'Natur, Mensch, Gesellschaft (mit NT, WAH, RZG, ERG)', url: 'https://be.lehrplan.ch/container/BE_DE_Fachbereich_NMG.pdf' },
  ges: { label: 'Gestalten', url: 'https://be.lehrplan.ch/container/BE_DE_Fachbereich_GES.pdf' },
  mu: { label: 'Musik', url: 'https://be.lehrplan.ch/container/BE_DE_Fachbereich_MU.pdf' },
  bs: { label: 'Bewegung und Sport', url: 'https://be.lehrplan.ch/container/BE_DE_Fachbereich_BS.pdf' },
  mi: { label: 'Medien und Informatik', url: 'https://be.lehrplan.ch/container/BE_DE_Modul_MI.pdf' },
  bo: { label: 'Berufliche Orientierung', url: 'https://be.lehrplan.ch/container/BE_DE_Modul_BO.pdf' },
};
export const FACH_PDFS = ['spr', 'ma', 'nmg', 'ges', 'mu', 'bs', 'mi', 'bo'];

// Dienste, die einen vorausgefüllten Prompt per URL annehmen. Der Text
// wird URL-kodiert an den Parameter gehängt; nichts wird von dieser Seite
// aus gesendet, erst der Klick öffnet den Dienst in einem neuen Tab.
export const PROVIDERS = [
  { id: 'chatgpt', name: 'ChatGPT', url: 'https://chatgpt.com/?q=' },
  { id: 'claude', name: 'Claude', url: 'https://claude.ai/new?q=' },
  { id: 'perplexity', name: 'Perplexity', url: 'https://www.perplexity.ai/search?q=' },
  { id: 'lechat', name: 'Le Chat', url: 'https://chat.mistral.ai/chat?q=' },
];

// Antwortsprache: der Prompt selbst bleibt deutsch, die letzte Zeile
// verlangt die Antwort in der gewählten Sprache (Produktregel: de, fr,
// it, rm, en). «Andere» öffnet das einzige Textfeld der Seite: den
// Namen einer weiteren Sprache (zum Beispiel Ukrainisch), der nur in
// diese Schlusszeile fliesst. Leer heisst Deutsch.
export const LANGS = [
  { id: 'de', label: 'Deutsch', answer: 'Deutsch' },
  { id: 'fr', label: 'Français', answer: 'Französisch' },
  { id: 'it', label: 'Italiano', answer: 'Italienisch' },
  { id: 'rm', label: 'Rumantsch', answer: 'Rumantsch Grischun' },
  { id: 'en', label: 'English', answer: 'Englisch' },
  { id: 'other', label: 'Andere', answer: null },
];
export const OTHER_LANG_MAX = 40;

export const ZYKLEN = [
  { id: '1', label: '1. Zyklus', range: 'Kindergarten bis 2. Klasse', text: 'im 1. Zyklus (Kindergarten bis 2. Klasse)' },
  { id: '2', label: '2. Zyklus', range: '3. bis 6. Klasse', text: 'im 2. Zyklus (3. bis 6. Klasse)' },
  { id: '3', label: '3. Zyklus', range: '7. bis 9. Klasse', text: 'im 3. Zyklus (7. bis 9. Klasse)' },
];

// Die fünf offiziellen Marker. `kind` steuert die Vorsicht im Prompt:
// ein Orientierungspunkt sagt «bearbeitet», nicht «erreicht».
export const CHECKS = [
  { id: 'ga1', label: 'Ende 2. Klasse', sub: 'Grundanspruch 1. Zyklus', kind: 'ga',
    text: 'Mein Kind ist am Ende der 2. Klasse. Massgebend ist der Grundanspruch des 1. Zyklus (Kindergarten bis 2. Klasse): die Kompetenzstufen, die alle Kinder bis Ende des Zyklus erreichen sollen.' },
  { id: 'op4', label: 'Ende 4. Klasse', sub: 'Orientierungspunkt', kind: 'op',
    text: 'Mein Kind ist am Ende der 4. Klasse. Massgebend ist der Orientierungspunkt in der Mitte des 2. Zyklus: die Kompetenzstufen, die bis Ende der 4. Klasse im Unterricht bearbeitet sein müssen. Das ist kein Grundanspruch. Beurteile darum vorsichtig und sprich von «bearbeitet» statt «erreicht».' },
  { id: 'ga2', label: 'Ende 6. Klasse', sub: 'Grundanspruch 2. Zyklus', kind: 'ga',
    text: 'Mein Kind ist am Ende der 6. Klasse, kurz vor dem Übertritt in die Sekundarstufe I. Massgebend ist der Grundanspruch des 2. Zyklus (3. bis 6. Klasse): die Kompetenzstufen, die alle Kinder bis Ende des Zyklus erreichen sollen.' },
  { id: 'op8', label: 'Mitte 8. Klasse', sub: 'Orientierungspunkt', kind: 'op',
    text: 'Mein Kind ist in der Mitte der 8. Klasse. Massgebend ist der Orientierungspunkt in der Mitte des 3. Zyklus: die Kompetenzstufen, die bis dahin im Unterricht bearbeitet sein müssen. Das ist kein Grundanspruch. Beurteile darum vorsichtig und sprich von «bearbeitet» statt «erreicht».' },
  { id: 'ga3', label: 'Ende 9. Klasse', sub: 'Grundanspruch 3. Zyklus', kind: 'ga',
    text: 'Mein Kind ist am Ende der 9. Klasse, am Ende der Volksschule. Massgebend ist der Grundanspruch des 3. Zyklus (7. bis 9. Klasse): die Kompetenzstufen, die alle Jugendlichen bis Ende der Schulzeit erreichen sollen.' },
];

// Die Übungs-Apps der Familie, abgeleitet aus ueben/index.html. Die
// Root-Suite prüft, dass diese Liste der Übungs-Apps-Liste entspricht.
export const APPS = [
  { id: "zahlenwissen", name: "Zahlenwissen", code: "MA.1.A.1", desc: "Zahlen lesen, schreiben und benennen." },
  { id: "zahlensprung", name: "Zahlensprung", code: "MA.1.A.2", desc: "Zählen, ordnen und überschlagen üben." },
  { id: "rechenturm", name: "Rechenturm", code: "MA.1.A.3", desc: "Plus, minus, mal, geteilt und Potenzen üben." },
  { id: "rechenkniff", name: "Rechenkniff", code: "MA.1.A.4", desc: "Zahlen zerlegen und mit Rechengesetzen umformen." },
  { id: "formenreich", name: "Formenreich", code: "MA.2.A.1", desc: "Formen, Körper und ihre Namen entdecken." },
  { id: "spiegelraster", name: "Spiegelraster", code: "MA.2.A.2", desc: "Spiegeln, drehen und verschieben im Raster." },
  { id: "figurenmass", name: "Figurenmass", code: "MA.2.A.3", desc: "Umfang, Fläche und Volumen berechnen." },
  { id: "groessenwissen", name: "Grössenwissen", code: "MA.3.A.1", desc: "Einheiten, Referenzgrössen und Fachwörter üben." },
  { id: "masswerk", name: "Masswerk", code: "MA.3.A.2", desc: "Geld, Längen, Gewichte und Zeit üben." },
  { id: "wertepfad", name: "Wertepfad", code: "MA.3.A.3", desc: "Zahlenfolgen, Tabellen und Funktionen üben." },
  { id: "schreibprobe", name: "Schreibprobe", code: "D.4.F.1", desc: "Rechtschreibregeln prüfen." },
  { id: "wortbau", name: "Wortbau", code: "D.5.D.1", desc: "Wortarten, Zeitformen und Satzglieder erkennen." },
  { id: "buchstabenleiter", name: "Buchstabenleiter", code: "D.5.E.1", desc: "Das ABC, die Stammregel und die Grossschreibung üben." },
  { id: "motschatz", name: "Motschatz", code: "FS1F.5.B.1", desc: "Französische Wörter und Wendungen sammeln." },
  { id: "motbau", name: "Motbau", code: "FS1F.5.D.1", desc: "Französische Grammatik üben." },
  { id: "ortho", name: "Ortho", code: "FS1F.5.E.1", desc: "Französische Rechtschreibung üben." },
  { id: "wordschatz", name: "Wordschatz", code: "FS2E.5.B.1", desc: "Englische Wörter und Wendungen sammeln." },
  { id: "wordbau", name: "Wordbau", code: "FS2E.5.D.1", desc: "Englische Grammatik üben." },
  { id: "spellwerk", name: "Spellwerk", code: "FS2E.5.E.1", desc: "Englische Rechtschreibung üben." },
  { id: "koerperatlas", name: "Körperatlas", code: "NMG.1.4", desc: "Den Körper und seine Organe kennen." },
  { id: "artenreich", name: "Artenreich", code: "NMG.2.4", desc: "Tiere und Pflanzen nach Merkmalen ordnen." },
  { id: "wetterwarte", name: "Wetterwarte", code: "NMG.4.4", desc: "Wetter, Messgeräte und Naturereignisse verstehen." },
  { id: "sternwarte", name: "Sternwarte", code: "NMG.4.5", desc: "Sonne, Mond, Planeten und Sterne verstehen." },
  { id: "nordpfeil", name: "Nordpfeil", code: "NMG.8.5", desc: "Sich mit Plänen, Karten und Himmelsrichtungen orientieren." },
  { id: "zeitreise", name: "Zeitreise", code: "NMG.9.1", desc: "Zeitbegriffe, Kalender und Epochen üben." },
  { id: "weltatlas", name: "Weltatlas", code: "RZG.4.1", desc: "Kontinente, Länder und das Gradnetz kennen." },
  { id: "demokratielabor", name: "Demokratielabor", code: "RZG.8.1", desc: "Gewaltenteilung, Initiative und Referendum verstehen." },
  { id: "stromkreis", name: "Stromkreis", code: "NT.5.2", desc: "Wirkungen, Schaltungen und das Ohmsche Gesetz." },
  { id: "bitkiste", name: "Bitkiste", code: "MI.2.1", desc: "Daten ordnen, verschlüsseln und verstehen." },
  { id: "schrittweise", name: "Schrittweise", code: "MI.2.2", desc: "Anleitungen, Schleifen und kleine Programme verstehen." },
  { id: "rechnerraum", name: "Rechnerraum", code: "MI.2.3", desc: "Geräte, Speicher, Suchmaschinen und Netze verstehen." },
];

export const MERKHEFT_GROUPS = ["Zahlen und Rechnen", "Grössen und Masse", "Form und Raum", "Daten und Funktionen", "Deutsch", "Französisch", "Englisch", "Mensch und Körper", "Tiere und Pflanzen", "Wetter und Natur", "Natur und Technik", "Informatik", "Himmel und Weltall", "Zeit und Geschichte", "Raum und Erde", "Zusammenleben"];

// Gemeinsamer Schluss der Vorlagen, die den Lehrplan lesen sollen.
// {pdfs} wird durch die Kapitel-Dateien der Vorlage ersetzt, {lang}
// durch die Antwortsprache.
export const SOURCE_BLOCK = [
  'Quelle und Regeln:',
  '- Einzige Quelle ist der offizielle Lehrplan 21, Ausgabe Kanton Bern. Öffne dazu diese PDF-Dateien, sie sind klein genug zum Lesen:',
  '{pdfs}',
  `- Die Gesamtausgabe (${PDF_URL}) brauchst du nicht; sie ist mit 72 MB für die meisten PDF-Leser zu gross.`,
  '- Falls du im Internet suchen kannst, öffne nur diese PDF-Dateien und keine andere Website.',
  '- Falls du keine davon lesen kannst, sag das zu Beginn und arbeite mit deinem Wissen über den Lehrplan 21.',
  '- Nenne bei jeder inhaltlichen Aussage den Kompetenz-Code (zum Beispiel MA.1.A.3).',
  '- Erfinde keine Kompetenzstufen. Markiere Unsicheres mit (?).',
  '- Antworte auf {lang}.',
].join('\n');

// Schluss der Materialvorlage: die Liste im Prompt ist die Quelle,
// ein PDF braucht es dafür nicht.
export const LIST_BLOCK = [
  'Regeln:',
  '- Für diese Frage brauchst du kein PDF und keine Website. Die Liste oben ist die Quelle.',
  '- Die Codes und Links in der Liste sind offiziell und geprüft; sie brauchen kein (?).',
  '- Nenne nur Apps aus der Liste und gib zu jeder App den Link aus der Liste an.',
  '- Antworte auf {lang}.',
].join('\n');

// Welche Kapitel-Dateien eine Vorlage nennt (Schlüssel in PDFS).
export const PROMPT_PDFS = {
  erklaeren: ['ueberblick', 'grundlagen', 'ahb'],
  koennen: ['ueberblick', ...FACH_PDFS],
  einschaetzen: ['ueberblick', 'ahb', ...FACH_PDFS],
  material: [],
};

// Vorlagen. Platzhalter: {zyklus}, {n} (Zyklusnummer), {check}
// (Markertext), {marker} (kurzer Markername), {apps}, {merkheft}.
export const PROMPTS = {
  erklaeren: [
    'Ich bin Mutter oder Vater eines Kindes an der Volksschule im Kanton Bern. Erkläre mir den Lehrplan 21 (Ausgabe Kanton Bern) in einfacher Sprache und in kurzen, gut verdaulichen Abschnitten:',
    '1. Was der Lehrplan festlegt und was er nicht regelt (Noten, Stundenplan, Schultyp).',
    '2. Die drei Zyklen mit ihren Klassen und was ein Zyklus für mein Kind bedeutet.',
    '3. Die Begriffe Kompetenz, Kompetenzstufe, Grundanspruch, Auftrag des Zyklus und Orientierungspunkt, je in zwei Sätzen mit einem Beispiel aus der Mathematik.',
    '4. Woran ich als Elternteil erkenne, ob mein Kind auf Kurs ist, und was ich die Lehrperson am Standortgespräch fragen kann.',
    'Schliess mit fünf Merksätzen ab, die ich mir leicht merken kann.',
  ].join('\n'),

  koennen: [
    'Ich gehe im Kanton Bern zur Schule und bin {zyklus}. Erkläre mir in einfachen Worten, was ich bis zum Ende dieses Zyklus in Mathematik und Deutsch können sollte (Grundanspruch des {n}. Zyklus im Lehrplan 21).',
    'Mach pro Fach eine Liste mit höchstens acht Punkten. Zu jedem Punkt ein kleines Beispiel, das ich gleich ausprobieren kann.',
    'Frag mich danach, welche Punkte ich schon gut kann, und schlag mir für die anderen eine kurze Übung vor.',
    'Sei freundlich und mach keinen Druck. Fehler sind okay.',
  ].join('\n'),

  einschaetzen: [
    'Hilf mir, eine kurze und faire Einschätzung für mein Kind zu bauen. {check}',
    'Frag mich zuerst diese vier Dinge und warte auf meine Antwort:',
    '1. Welche Fachbereiche ich anschauen will (zum Beispiel Mathematik, Deutsch, Französisch, Englisch, Natur, Mensch, Gesellschaft).',
    '2. Welche Stärken ich schon kenne.',
    '3. Womit sich mein Kind schwer tut.',
    '4. Wie viel Zeit wir dafür haben.',
    'Dann erstelle pro Fachbereich sechs bis acht kleine Aufgaben, die je eine Kompetenz prüfen. Zu jeder Aufgabe: der Kompetenz-Code, ein Satz, was am {marker} erwartet wird, und die erwartete Lösung. Formuliere kindgerecht, ohne Zeitdruck und ohne Noten.',
    'Am Schluss: eine Tabelle mit Code, Aufgabe und Ergebnis zum Ausfüllen, und drei Sätze, wie ich das Ergebnis mit der Lehrperson besprechen kann.',
    'Nimm nur Inhalte, die der Lehrplan für diesen Zyklus wirklich nennt.',
  ].join('\n'),

  material: [
    'Mein Kind ist {zyklus}. Hilf mir, aus dieser Sammlung das passende Lernmaterial auszuwählen. Frag mich zuerst nach zwei oder drei Themen, die dem Kind schwerfallen, und warte auf meine Antwort.',
    'Kostenlose Übungs-Apps zum Lehrplan 21, je eine App pro Kompetenz, mit Code und Link:',
    '{apps}',
    'Dazu ein Merkheft mit Merkblättern zum Nachlesen: {site}merkheft/ mit den Themen {merkheft}.',
    'Schlag dann höchstens drei Apps vor, die zum Zyklus und zu den Themen passen. Zu jeder App: Name, Link, Code, ein Satz, warum sie passt, und ein Merkheft-Thema, das man vorher gemeinsam lesen kann.',
  ].join('\n'),
};
