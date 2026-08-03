// strings.js — alle UI-Texte, keyed nach stabilen IDs.
// v1 ist einsprachig Deutsch (Schweizer Standarddeutsch, ss statt ß).

export const STRINGS = {
  de: {
    'app.title': 'Rechenturm',
    'app.tagline': 'Plus, minus, mal und mehr. Stufe für Stufe den Turm hinauf.',
    'app.source': 'Setzt die Kompetenz MA.1.A.3 des Lehrplans 21 um (Kanton Bern). Die Stufen a bis j sind die offiziellen Kompetenzstufen. Rechner-Inhalte sind als Kopfrechnen mit einfachen Zahlen umgesetzt.',
    'home.stufen': 'Wähle deine Stufe',
    'home.level': 'Level {name}',
    'home.medals': '{n} Medaillen',
    'home.rounds': '{n} Runden',
    'stufe.ga': 'Grundanspruch Zyklus {cycle}',
    'stufe.erweiterung': 'Mit Erweiterung',
    'practice.progress': 'Aufgabe {i} von {n}',
    'practice.abort': 'Abbrechen',
    'task.typed': 'Rechne aus.',
    'task.mc': 'Wähle die richtige Antwort.',
    'task.autocheck': 'Beim letzten Zeichen siehst du sofort, ob es stimmt.',
    'feedback.correct': 'Richtig.',
    'feedback.almost': 'Fast. Versuch es noch einmal.',
    'next': 'Weiter',
    'done.title': 'Runde geschafft!',
    'done.tasks': '{n} Aufgaben gelöst, Stufe {stufe}.',
    'done.clean': 'Alles richtig beim ersten Versuch. Stark!',
    'done.xp': '+{xp} XP',
    'done.level': 'Level {name}',
    'done.levelup': 'Neues Level: {name}!',
    'done.medal': 'Neue Medaille: {name}',
    'done.suggest': 'Das lief rund. Probier Stufe {stufe}!',
    'done.suggestGo': 'Stufe {stufe} starten',
    'done.again': 'Noch eine Runde',
    'done.home': 'Zur Übersicht',
    'medals.title': 'Medaillen',
    'medals.back': 'Zurück zur Übersicht',
    'medals.locked': 'Noch nicht erreicht',
    'reset.button': 'Alles zurücksetzen',
    'reset.question': 'Wirklich den ganzen Fortschritt löschen? Er ist nur auf diesem Gerät gespeichert.',
    'reset.confirm': 'Ja, löschen',
    'reset.cancel': 'Abbrechen',
    'storage.note': 'Dein Fortschritt bleibt auf diesem Gerät gespeichert.',
  },
};

let lang = 'de';

export function t(id, vars) {
  const table = STRINGS[lang] || STRINGS.de;
  let s = table[id] ?? STRINGS.de[id] ?? id;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.replaceAll(`{${k}}`, String(v));
    }
  }
  return s;
}
