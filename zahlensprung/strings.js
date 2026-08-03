// strings.js — alle UI-Texte, keyed nach stabilen IDs.
// v1 ist einsprachig Deutsch (Schweizer Standarddeutsch, ss statt ß).

export const STRINGS = {
  de: {
    'app.title': 'Zahlensprung',
    'app.tagline': 'Zählen, ordnen und überschlagen. Stufe für Stufe, wie in der Schule.',
    'app.source': 'Setzt die Kompetenz MA.1.A.2 des Lehrplans 21 um (Kanton Bern). Die Stufen a bis j sind die offiziellen Kompetenzstufen.',
    'home.stufen': 'Wähle deine Stufe',
    'home.level': 'Level {name}',
    'home.medals': '{n} Medaillen',
    'home.rounds': '{n} Runden',
    'stufe.ga': 'Grundanspruch Zyklus {cycle}',
    'stufe.erweiterung': 'Erweiterung',
    'practice.progress': 'Aufgabe {i} von {n}',
    'practice.abort': 'Abbrechen',
    'task.count': 'Wie viele Punkte sind es?',
    'task.sequence': 'Wie geht die Reihe weiter?',
    'task.order': 'Tippe die Zahlen von der kleinsten zur grössten an.',
    'task.estimate': 'Was ist ein guter Überschlag?',
    'task.autocheck': 'Beim letzten Zeichen siehst du sofort, ob es stimmt.',
    'task.orderhint': 'Geprüft wird, sobald alle Zahlen gewählt sind.',
    'feedback.correct': 'Richtig.',
    'feedback.almost': 'Fast. Versuch es noch einmal.',
    'feedback.solution': 'Die Reihenfolge stimmt noch nicht. Versuch es noch einmal.',
    'feedback.retry': 'Noch einmal',
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
