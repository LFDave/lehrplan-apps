// gen.js — Aufgaben für Buchstabenleiter. Reine Funktionen ohne DOM.
// ABC-Nachbarn, Vokale, ABC-Gruppen und Wörterbuch-Reihenfolge
// werden generiert und von der e2e-Suite unabhängig nachgerechnet
// (eigene ABC-Tabelle und eigener Wortvergleich in der Suite). Die
// übrigen Stufen sind feste Aufgaben-Pools. Jede Aufgabe:
//   { type: 'typed', expr, answer }               getippte Antwort
//   { type: 'mc', expr, options, answer }         Auswahl (Index)
// Aufgaben mit ci: true akzeptieren Gross- und Kleinschreibung.

export function formatNumber(n) {
  return String(n);
}

function randInt(rng, min, max) {
  return min + Math.floor(rng() * (max - min + 1));
}

function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}

function shuffled(rng, arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const VOKALE = 'AEIOU';

// Wortgruppen für die Wörterbuch-Reihenfolge (ohne Umlaute, damit
// die einfache ABC-Ordnung genügt).
export const WOERTER = [
  ['Ball', 'Baum', 'Berg', 'Blume', 'Brot'],
  ['Hase', 'Haus', 'Herbst', 'Himmel', 'Hund'],
  ['Mantel', 'Maus', 'Milch', 'Mond', 'Morgen'],
  ['Salz', 'Sand', 'Sonne', 'Stein', 'Suppe'],
];

// Pool-Einträge: [kind, 'mc', expr, richtig, [falsch...]] oder
// [kind, 'typed', expr, antwort].
export const POOLS = {
  'b-hoeren': [
    ['buchstabieren', 'mc', 'Wie viele Silben hat «Ba-na-ne»?', '3', ['2', '4']],
    ['buchstabieren', 'mc', 'Wie viele Silben hat «Scho-ko-la-de»?', '4', ['3', '5']],
    ['buchstabieren', 'mc', 'Wie viele Silben hat «Ap-fel»?', '2', ['1', '3']],
    ['buchstabieren', 'mc', 'Wie viele Silben hat «To-ma-te»?', '3', ['2', '4']],
    ['buchstabieren', 'mc', 'Am Wortanfang hörst du «schp» wie in «Spiel». Wie schreibst du?', 'sp', ['schp', 'sb']],
    ['buchstabieren', 'mc', 'Am Wortanfang hörst du «scht» wie in «Stein». Wie schreibst du?', 'st', ['scht', 'sd']],
    ['buchstabieren', 'mc', 'Wie schreibst du den Anfang von «Sport»?', 'sp', ['schp', 'sb']],
    ['buchstabieren', 'mc', 'Wie schreibst du den Anfang von «Stern»?', 'st', ['scht', 'sd']],
  ],
  'd-nachschlagen': [
    ['abcOrdnung', 'mc', 'Du willst «lief» im Wörterbuch nachschlagen. Unter welchem Wort suchst du?', 'unter «laufen»', ['unter «lief»', 'unter «gelaufen»']],
    ['abcOrdnung', 'mc', 'Du willst «ass» im Wörterbuch nachschlagen. Unter welchem Wort suchst du?', 'unter «essen»', ['unter «ass»', 'unter «gegessen»']],
    ['abcOrdnung', 'mc', 'Du willst «ging» im Wörterbuch nachschlagen. Unter welchem Wort suchst du?', 'unter «gehen»', ['unter «ging»', 'unter «gegangen»']],
    ['abcOrdnung', 'mc', 'Du willst «sang» im Wörterbuch nachschlagen. Unter welchem Wort suchst du?', 'unter «singen»', ['unter «sang»', 'unter «gesungen»']],
    ['abcOrdnung', 'mc', 'Du willst «flog» im Wörterbuch nachschlagen. Unter welchem Wort suchst du?', 'unter «fliegen»', ['unter «flog»', 'unter «geflogen»']],
    ['abcOrdnung', 'mc', 'In welcher Form stehen die Verben im Wörterbuch?', 'in der Grundform', ['in der Vergangenheit', 'in der Wir-Form']],
  ],
  'd-stammregel': [
    ['abcOrdnung', 'mc', 'Was ist der Stamm von «fahren, Fahrer, Abfahrt»?', 'fahr', ['fahren', 'ab']],
    ['abcOrdnung', 'mc', 'Was ist der Stamm von «spielen, Spieler, verspielt»?', 'spiel', ['spielen', 'ver']],
    ['abcOrdnung', 'mc', 'Warum schreibt man «Bäume» mit äu?', 'wegen des Stamms «Baum»', ['weil es schöner aussieht', 'wegen der Endung -e']],
    ['abcOrdnung', 'mc', 'Warum schreibt man «Häuser» mit äu?', 'wegen des Stamms «Haus»', ['weil es viele sind', 'wegen des s am Ende']],
    ['abcOrdnung', 'mc', 'Warum schreibt man «Räume» mit äu?', 'wegen des Stamms «Raum»', ['weil es gross ist', 'wegen der Endung -e']],
    ['abcOrdnung', 'mc', 'Am Ende von «Hund» hörst du ein t. Wie prüfst du die Schreibung?', 'verlängern: die Hun-de', ['lauter sprechen', 'das Wort auswendig lernen']],
    ['abcOrdnung', 'mc', 'Am Ende von «Berg» hörst du ein k. Wie prüfst du die Schreibung?', 'verlängern: die Ber-ge', ['das k einfach schreiben', 'das Wort weglassen']],
    ['abcOrdnung', 'mc', 'Am Ende von «Kind» hörst du ein t. Wie prüfst du die Schreibung?', 'verlängern: die Kin-der', ['leiser sprechen', 'ein t schreiben']],
  ],
  e: [
    ['morphem', 'typed', 'frei + heit: Schreibe das Nomen.', 'Freiheit'],
    ['morphem', 'typed', 'krank + heit: Schreibe das Nomen.', 'Krankheit'],
    ['morphem', 'typed', 'entdeck + ung: Schreibe das Nomen.', 'Entdeckung'],
    ['morphem', 'typed', 'wander + ung: Schreibe das Nomen.', 'Wanderung'],
    ['morphem', 'mc', 'Woran erkennst du, dass «Freiheit» ein Nomen ist?', 'an der Endung -heit', ['am f am Anfang', 'an der Länge']],
    ['morphem', 'mc', 'Welche Endung macht aus «schön» ein Nomen?', '-heit', ['-lich', '-en']],
    ['morphem', 'mc', 'Welche Endung macht aus «erfinden» ein Nomen?', '-ung', ['-heit', '-ig']],
    ['morphem', 'mc', 'Wörter mit -heit, -keit oder -ung schreibt man ...?', 'gross', ['klein', 'mal so, mal so']],
    ['morphem', 'mc', 'Aus welchen Teilen besteht «Freiheit»?', 'frei + heit', ['fre + iheit', 'frei + heit + ung']],
    ['morphem', 'mc', 'Aus welchen Teilen besteht «Entdeckung»?', 'ent + deck + ung', ['entde + ckung', 'ent + eckung']],
  ],
  f: [
    ['nominalisierung', 'mc', '«beim Essen» oder «beim essen»: Was ist richtig?', 'beim Essen', ['beim essen']],
    ['nominalisierung', 'mc', '«nach dem Spielen» oder «nach dem spielen»: Was ist richtig?', 'nach dem Spielen', ['nach dem spielen']],
    ['nominalisierung', 'mc', '«vor dem Schlafen» oder «vor dem schlafen»: Was ist richtig?', 'vor dem Schlafen', ['vor dem schlafen']],
    ['nominalisierung', 'mc', '«zum Lesen» oder «zum lesen»: Was ist richtig?', 'zum Lesen', ['zum lesen']],
    ['nominalisierung', 'mc', 'Warum schreibt man in «beim Lesen» das Wort «Lesen» gross?', 'weil aus dem Verb ein Nomen geworden ist', ['weil es am Satzanfang steht', 'weil es ein langes Wort ist']],
    ['nominalisierung', 'mc', 'Woran erkennst du das Nomen in «nach dem Essen»?', 'an Präposition und Artikel davor: nach dem', ['an der Wortlänge', 'am E am Anfang']],
    ['nominalisierung', 'mc', 'Du schreibst einen Brief an Frau Muster. Welche Anrede ist richtig?', '«Kommen Sie morgen?»', ['«Kommen sie morgen?»']],
    ['nominalisierung', 'mc', 'Das Höflichkeitspronomen in Briefen schreibt man ...?', 'gross: Sie', ['klein: sie', 'nur am Satzanfang gross']],
    ['nominalisierung', 'mc', 'In welchem Briefsatz ist die Höflichkeitsform richtig?', '«Ich danke Ihnen für den Brief.»', ['«Ich danke ihnen für den Brief.»']],
  ],
  'g-gross': [
    ['strategie', 'mc', '«alles Gute» oder «alles gute»: Was ist richtig?', 'alles Gute', ['alles gute']],
    ['strategie', 'mc', '«etwas Schönes» oder «etwas schönes»: Was ist richtig?', 'etwas Schönes', ['etwas schönes']],
    ['strategie', 'mc', '«nichts Neues» oder «nichts neues»: Was ist richtig?', 'nichts Neues', ['nichts neues']],
    ['strategie', 'mc', '«viel Gutes» oder «viel gutes»: Was ist richtig?', 'viel Gutes', ['viel gutes']],
    ['strategie', 'mc', '«alles Liebe» oder «alles liebe»: Was ist richtig?', 'alles Liebe', ['alles liebe']],
    ['strategie', 'mc', '«etwas Wichtiges» oder «etwas wichtiges»: Was ist richtig?', 'etwas Wichtiges', ['etwas wichtiges']],
    ['strategie', 'mc', 'Nomen aus Adjektiven nach «alles, etwas, nichts» schreibt man ...?', 'gross', ['klein', 'in Anführungszeichen']],
    ['strategie', 'mc', 'Warum schreibt man «etwas Schönes» gross?', 'aus dem Adjektiv wird ein Nomen', ['weil es am Satzanfang steht', 'weil es schön klingt']],
  ],
  'g-nachschlagen': [
    ['strategie', 'mc', 'Du hörst «Fater», findest es im Wörterbuch aber nicht unter F. Wo suchst du?', 'unter V wie «Vater»', ['unter W', 'unter PH']],
    ['strategie', 'mc', 'Du hörst «Kwelle». Wo steht das Wort im Wörterbuch?', 'unter Q wie «Quelle»', ['unter K', 'unter G']],
    ['strategie', 'mc', 'Du hörst «Fogel». Wo steht das Wort im Wörterbuch?', 'unter V wie «Vogel»', ['unter F', 'unter W']],
    ['strategie', 'mc', 'Das Wort klingt wie «Kor», geschrieben wird es «Chor». Wo steht es im Wörterbuch?', 'unter C', ['unter K', 'unter Sch']],
    ['strategie', 'mc', 'Ein Wort beginnt gesprochen mit «oi» wie in «Eule». Womit beginnt es geschrieben oft?', 'mit Eu', ['mit Oi', 'mit Au']],
    ['strategie', 'mc', 'Du hörst «Faze». Wo steht das Wort im Wörterbuch?', 'unter V wie «Vase»', ['unter F', 'unter W']],
    ['strategie', 'mc', 'Du hörst «Kwark». Wo steht das Wort im Wörterbuch?', 'unter Q wie «Quark»', ['unter K', 'unter G']],
    ['strategie', 'mc', 'Warum findest du «Vogel» nicht unter F?', 'weil es mit V geschrieben wird', ['weil es ein Tier ist', 'weil es kurz ist']],
  ],
};

// ABC-Nachbarn (a, b), Vokale und ABC-Gruppen (c) und die
// Wörterbuch-Reihenfolge (d) werden generiert.
export function genTask(rng, stufe) {
  if (stufe.id === 'a') {
    const nach = rng() < 0.5;
    const i = nach ? randInt(rng, 0, 24) : randInt(rng, 1, 25);
    const letter = ABC[i];
    const correct = nach ? ABC[i + 1] : ABC[i - 1];
    const wrong = shuffled(rng, [...ABC].filter((ch) => ch !== letter && ch !== correct
      && Math.abs(ABC.indexOf(ch) - i) <= 3)).slice(0, 2);
    return {
      kind: 'abcNachbar', type: 'mc',
      expr: `Welcher Buchstabe kommt im ABC direkt ${nach ? 'nach' : 'vor'} dem ${letter}?`,
      ...buildMc(rng, correct, wrong),
    };
  }
  if (stufe.id === 'b-abc') {
    const nach = rng() < 0.5;
    const i = nach ? randInt(rng, 0, 24) : randInt(rng, 1, 25);
    const letter = ABC[i];
    return {
      kind: 'buchstabieren', type: 'typed', ci: true,
      expr: `Welcher Buchstabe kommt im ABC direkt ${nach ? 'nach' : 'vor'} dem ${letter}?`,
      answer: nach ? ABC[i + 1] : ABC[i - 1],
    };
  }
  if (stufe.id === 'c-vokale') {
    if (rng() < 0.5) {
      const letter = ABC[randInt(rng, 0, 25)];
      const correct = VOKALE.includes(letter) ? 'ein Vokal' : 'ein Konsonant';
      return {
        kind: 'vokal', type: 'mc',
        expr: `Ist der Buchstabe ${letter} ein Vokal oder ein Konsonant?`,
        ...buildMc(rng, correct, [correct === 'ein Vokal' ? 'ein Konsonant' : 'ein Vokal']),
      };
    }
    const vokal = VOKALE[randInt(rng, 0, VOKALE.length - 1)];
    const kons = shuffled(rng, [...ABC].filter((ch) => !VOKALE.includes(ch))).slice(0, 2);
    return {
      kind: 'vokal', type: 'mc',
      expr: 'Welcher dieser Buchstaben ist ein Vokal?',
      ...buildMc(rng, vokal, kons),
    };
  }
  if (stufe.id === 'c-gruppen') {
    if (rng() < 0.5) {
      const letter = ABC[randInt(rng, 0, 25)];
      const gruppen = ['vorne (A bis H)', 'in der Mitte (I bis Q)', 'hinten (R bis Z)'];
      const idx = ABC.indexOf(letter) <= 7 ? 0 : ABC.indexOf(letter) <= 16 ? 1 : 2;
      return {
        kind: 'abcGruppe', type: 'mc',
        expr: `Wo steht das ${letter} im ABC: vorne (A bis H), in der Mitte (I bis Q) oder hinten (R bis Z)?`,
        ...buildMc(rng, gruppen[idx], gruppen.filter((_, g) => g !== idx)),
      };
    }
    const i = randInt(rng, 0, 24);
    const j = randInt(rng, i + 1, 25);
    const [x, y] = rng() < 0.5 ? [ABC[i], ABC[j]] : [ABC[j], ABC[i]];
    const correct = ABC.indexOf(x) < ABC.indexOf(y) ? 'vor' : 'nach';
    return {
      kind: 'vorNach', type: 'mc',
      expr: `Steht das ${x} im ABC vor oder nach dem ${y}?`,
      ...buildMc(rng, correct, [correct === 'vor' ? 'nach' : 'vor']),
    };
  }
  if (stufe.id === 'd-nachschlagen' && rng() < 0.5) {
    const gruppe = pick(rng, WOERTER);
    const [w1, w2] = shuffled(rng, gruppe).slice(0, 2);
    const first = w1.toLowerCase() < w2.toLowerCase() ? w1 : w2;
    return {
      kind: 'abcOrdnung', type: 'mc',
      expr: `Welches Wort steht im Wörterbuch zuerst: «${w1}» oder «${w2}»?`,
      ...buildMc(rng, first, [first === w1 ? w2 : w1]),
    };
  }
  const entry = pick(rng, POOLS[stufe.id]);
  const [kind, type, expr, correctOrAnswer, wrongs] = entry;
  if (type === 'typed') return { kind, type, expr, answer: correctOrAnswer };
  return { kind, type, expr, ...buildMc(rng, correctOrAnswer, wrongs) };
}

function buildMc(rng, correct, wrongs) {
  const options = shuffled(rng, [correct, ...wrongs]);
  return { options, answer: options.indexOf(correct) };
}

export function genRound(rng, stufe, length = 8) {
  const tasks = [];
  const seen = new Set();
  let guard = 0;
  while (tasks.length < length && guard++ < 300) {
    const task = genTask(rng, stufe);
    const key = task.expr + '|' + (task.options ? [...task.options].sort().join('|') : '');
    if (seen.has(key)) continue;
    seen.add(key);
    tasks.push(task);
  }
  return tasks;
}
