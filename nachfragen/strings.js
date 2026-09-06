// strings.js — Nachfragen mit KI. Alle UI-Texte, stabile Schlüssel,
// Deutsch als Standard und Fallback.

export const STRINGS = {
  de: {
    'nav.site': 'Lehrplan-Apps',
    'nav.page': 'Nachfragen mit KI',
    'title': 'Nachfragen mit KI',
    'tagline': 'Fertige Fragen zum Lehrplan 21 für ChatGPT, Claude, Perplexity oder Le Chat. Wähle, kopiere oder öffne den Dienst direkt. Jede Frage nennt das offizielle PDF als einzige Quelle.',
    'note.privacy': 'Diese Seite sendet nichts. Erst dein Klick öffnet den gewählten Dienst in einem neuen Tab, mit dem Text, den du hier siehst. Schreib keine Namen in den Chat.',
    'lang.title': 'Antwortsprache',
    'lang.desc': 'Die Frage bleibt auf Deutsch, die Antwort kommt in dieser Sprache.',
    'lang.otherLabel': 'Welche Sprache?',
    'lang.otherPlaceholder': 'zum Beispiel Ukrainisch',
    'lang.otherHint': 'Schreib den Namen der Sprache auf Deutsch oder in der Sprache selbst. Solange das Feld leer ist, antwortet der Dienst auf Deutsch.',
    'card.erklaeren.title': 'Den Lehrplan erklären lassen',
    'card.erklaeren.desc': 'Für Eltern: was der Lehrplan 21 ist, in kurzen Abschnitten, mit fünf Merksätzen.',
    'card.koennen.title': 'Was soll ich können?',
    'card.koennen.desc': 'Für Kinder und Jugendliche: die Ziele des eigenen Zyklus in einfachen Worten, mit Beispielen zum Ausprobieren.',
    'card.einschaetzen.title': 'Eine Einschätzung bauen',
    'card.einschaetzen.desc': 'Für Eltern: kleine Aufgaben zu einem offiziellen Marker. Der Dienst fragt zuerst nach Stärken und Schwächen.',
    'card.einschaetzen.hint': 'Nur diese fünf Zeitpunkte haben im Lehrplan einen Marker. Ein Orientierungspunkt ist kein Grundanspruch; die Frage sagt das dem Dienst.',
    'card.material.title': 'Lernmaterial finden',
    'card.material.desc': 'Für Eltern und Kinder: welche Übungs-Apps und Merkblätter dieser Sammlung passen. Der Dienst fragt zuerst nach den schwierigen Themen.',
    'choice.zyklus': 'Zyklus',
    'choice.check': 'Zeitpunkt',
    'prompt.label': 'Frage anzeigen',
    'action.copy': 'Kopieren',
    'action.copied': 'Kopiert. Füge den Text in deinen KI-Dienst ein.',
    'action.copyFailed': 'Kopieren hat nicht geklappt. Markiere den Text oben und kopiere ihn von Hand.',
    'action.open': 'Öffnen in',
    'footer.honest': 'KI kann sich irren und Stufen erfinden. Geprüft sind die Stufen in den Übungs-Apps und die Seite «Der Lehrplan 21», nicht die Antwort des Dienstes.',
    'footer.storage': 'Keine Konten, keine Cookies. Deine Auswahl wird auf diesem Gerät gespeichert.',
    'footer.source': 'Nach Lehrplan 21, Ausgabe Kanton Bern.',
    'footer.code': 'Quellcode auf GitHub',
  },
};

export function t(key, lang = 'de') {
  const table = STRINGS[lang] || STRINGS.de;
  return table[key] ?? STRINGS.de[key] ?? key;
}
