// game.js — XP, Levels und Medaillen für Wertepfad. Reine Funktionen
// über dem gespeicherten Zustand, kein DOM. Medaillen sind reine
// Funktionen der Zähler, nie Ereignis-Flags (GAMIFICATION.md).

import { STUFEN, stufeIndex } from './data.js?v=1';

// XP pro abgeschlossener Runde: Grundwert plus Stufentiefe. Fehler
// kosten nichts, Tempo zählt nie.
export function roundXp(stufeId, tasksSolved) {
  return tasksSolved + stufeIndex(stufeId) + 1;
}

export const LEVELS = [
  { xp: 0, key: 'lehrling', name: 'Pfadstarter' },
  { xp: 25, key: 'spurenleser', name: 'Spurenleser' },
  { xp: 90, key: 'wertefinder', name: 'Wertefinder' },
  { xp: 220, key: 'musterkenner', name: 'Musterkenner' },
  { xp: 500, key: 'pfadmeister', name: 'Pfadmeister' },
];

export function levelFor(xp) {
  let level = LEVELS[0];
  for (const l of LEVELS) if (xp >= l.xp) level = l;
  return level;
}

export function nextLevel(xp) {
  return LEVELS.find((l) => l.xp > xp) || null;
}

export const MEDALS = [
  { key: 'runde-1', icon: 'flag', threshold: (s) => s.rounds >= 1, name: 'Erster Schritt', desc: 'Eine Runde abgeschlossen.' },
  { key: 'runden-3', icon: 'star', threshold: (s) => s.rounds >= 3, name: 'Dranbleiben', desc: '3 Runden abgeschlossen.' },
  { key: 'runden-8', icon: 'award', threshold: (s) => s.rounds >= 8, name: 'Rundenprofi', desc: '8 Runden abgeschlossen.' },
  { key: 'runden-21', icon: 'medal', threshold: (s) => s.rounds >= 21, name: 'Rundenmarathon', desc: '21 Runden abgeschlossen.' },
  { key: 'runden-55', icon: 'trophy', threshold: (s) => s.rounds >= 55, name: 'Wertepfad-Legende', desc: '55 Runden abgeschlossen.' },
  { key: 'aufgaben-50', icon: 'pencil', threshold: (s) => s.tasks >= 50, name: 'Fleissige Hände', desc: '50 Aufgaben gelöst.' },
  { key: 'aufgaben-200', icon: 'zap', threshold: (s) => s.tasks >= 200, name: 'Musterblitz', desc: '200 Aufgaben gelöst.' },
  { key: 'aufgaben-800', icon: 'gem', threshold: (s) => s.tasks >= 800, name: 'Werteschatz', desc: '800 Aufgaben gelöst.' },
  { key: 'ga-z1', icon: 'target', threshold: (s) => cleanRuns(s, 'b') >= 1, name: 'Grundanspruch Zyklus 1', desc: 'Stufe b ohne Fehler geschafft.' },
  { key: 'ga-z2', icon: 'target', threshold: (s) => cleanRuns(s, 'e') >= 1, name: 'Grundanspruch Zyklus 2', desc: 'Stufe e ohne Fehler geschafft.' },
  { key: 'ga-z3', icon: 'target', threshold: (s) => cleanRuns(s, 'i') >= 1, name: 'Grundanspruch Zyklus 3', desc: 'Stufe i ohne Fehler geschafft.' },
  { key: 'alle-stufen', icon: 'compass', threshold: (s) => STUFEN.every((st) => rounds(s, st.id) >= 1), name: 'Alle Stufen entdeckt', desc: 'In jeder Stufe eine Runde abgeschlossen.' },
];

function perStufe(state, id) {
  return state.stufen?.[id] || { rounds: 0, cleanRuns: 0, cleanStreak: 0 };
}

export function rounds(state, id) {
  return perStufe(state, id).rounds;
}

export function cleanRuns(state, id) {
  return perStufe(state, id).cleanRuns;
}

export function cleanStreak(state, id) {
  return perStufe(state, id).cleanStreak;
}

export function earnedMedals(state) {
  return MEDALS.filter((m) => m.threshold(state));
}

// Meisterschaft: 5 fehlerfreie Runden in Folge auf einer Stufe schlagen
// die nächste Stufe vor. Nie erzwungen, nie automatisch abgestuft.
export const MASTERY_STREAK = 5;

export function suggestsNextStufe(state, id) {
  return cleanStreak(state, id) >= MASTERY_STREAK;
}
