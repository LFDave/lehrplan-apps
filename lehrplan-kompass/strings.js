// strings.js — alle UI-Texte, keyed nach stabilen IDs.
// v1 ist einsprachig Deutsch (Schweizer Standarddeutsch, ss statt ß).
// Weitere Sprachen kämen als zusätzliche Tabellen mit identischen Keys dazu.

export const STRINGS = {
  de: {
    'app.title': 'Lehrplan-Kompass',
    'app.tagline': 'Entdecke, was du in der Schule lernst, und hake ab, was du schon kannst.',
    'app.source': 'Nach Lehrplan 21, Kanton Bern. Die Texte sind kindgerechte Umschreibungen.',
    'cycle.label': 'Wähle deinen Zyklus',
    'cycle.1.title': 'Zyklus 1',
    'cycle.1.range': 'Kindergarten bis 2. Klasse',
    'cycle.2.title': 'Zyklus 2',
    'cycle.2.range': '3. bis 6. Klasse',
    'cycle.3.title': 'Zyklus 3',
    'cycle.3.range': '7. bis 9. Klasse',
    'home.subjects': 'Fachbereiche',
    'home.summary': '{done} von {total} abgehakt',
    'subject.progress': 'Das kann ich schon: {done} von {total}',
    'subject.competencies': '{n} Kompetenzen',
    'subject.back': 'Zurück zur Übersicht',
    'subject.cycleNote': 'Deine Häkchen gelten für {cycle}.',
    'subject.practice': 'Üben mit {name}',
    'check.aria': '{code}: {text}',
    'reset.button': 'Alles zurücksetzen',
    'reset.question': 'Wirklich alle Häkchen löschen? Dein Fortschritt ist nur auf diesem Gerät gespeichert.',
    'reset.confirm': 'Ja, löschen',
    'reset.cancel': 'Abbrechen',
    'reset.done': 'Alles zurückgesetzt.',
    'storage.note': 'Dein Fortschritt bleibt auf diesem Gerät gespeichert.',
    'noscript': 'Der Lehrplan-Kompass braucht JavaScript.',
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
