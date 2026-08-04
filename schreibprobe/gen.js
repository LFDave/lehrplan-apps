// gen.js — Aufgaben für Schreibprobe. Reine Funktionen ohne DOM; der
// Inhalt liegt in festen Aufgaben-Pools pro Stufe (Rechtschreibung ist
// Faktenwissen, kein Zufallsgenerator). Die e2e-Suite prüft jede
// Aufgabe gegen unabhängig neu aufgeschriebene Wortlisten. Jede
// Aufgabe:
//   { type: 'typed', expr, answer }               getippte Antwort
//   { type: 'mc', expr, options, answer }         Auswahl (Index)

export function formatNumber(n) {
  return String(n);
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

// Pool-Einträge: [kind, 'mc', expr, richtig, [falsch...]] oder
// [kind, 'typed', expr, antwort].
export const POOLS = {
  a: [
    ['satzanfang', 'mc', 'Welcher Satzanfang ist richtig?', 'Der Hund bellt.', ['der Hund bellt.']],
    ['satzanfang', 'mc', 'Welcher Satz beginnt richtig?', 'Wir spielen draussen.', ['wir spielen draussen.']],
    ['satzanfang', 'mc', 'Welcher Satz beginnt richtig?', 'Heute regnet es.', ['heute regnet es.']],
    ['nomenGross', 'mc', 'Welche Schreibung stimmt?', 'die Katze', ['die katze']],
    ['nomenGross', 'mc', 'Welche Schreibung stimmt?', 'der Ball', ['der ball']],
    ['nomenGross', 'mc', 'Welche Schreibung stimmt?', 'Anna lacht.', ['anna lacht.']],
    ['nomenGross', 'typed', 'Schreibe das Tier richtig: hund', 'Hund'],
    ['nomenGross', 'typed', 'Schreibe den Namen richtig: anna', 'Anna'],
    ['satzende', 'mc', 'Welcher Satz ist richtig?', 'Es regnet.', ['Es regnet']],
    ['satzende', 'mc', 'Welcher Satz ist richtig?', 'Der Tag ist schön.', ['Der Tag ist schön']],
    ['wortgrenzen', 'mc', 'Wo sind die Lücken richtig?', 'Wir gehen nach Hause.', ['Wirgehen nachHause.']],
    ['wortgrenzen', 'mc', 'Wo sind die Lücken richtig?', 'Ich spiele mit dem Ball.', ['Ichspiele mitdem Ball.']],
  ],
  b: [
    ['spSt', 'typed', 'Schreibe richtig: Schtein', 'Stein'],
    ['spSt', 'typed', 'Schreibe richtig: Schpiel', 'Spiel'],
    ['spSt', 'typed', 'Schreibe richtig: schpät', 'spät'],
    ['spSt', 'typed', 'Schreibe richtig: Schtrasse', 'Strasse'],
    ['spSt', 'mc', 'Welche Schreibung stimmt?', 'Stern', ['Schtern']],
    ['ngSchreibung', 'mc', 'Welche Schreibung stimmt?', 'Ring', ['Rink']],
    ['ngSchreibung', 'mc', 'Welche Schreibung stimmt?', 'lang', ['lank']],
    ['schlusszeichen', 'mc', 'Welcher Satz ist richtig?', 'Kommst du mit?', ['Kommst du mit.']],
    ['schlusszeichen', 'mc', 'Welcher Satz ist richtig?', 'Wie spät ist es?', ['Wie spät ist es.']],
    ['abstraktGross', 'mc', 'Welche Schreibung stimmt?', 'die Angst', ['die angst']],
    ['abstraktGross', 'mc', 'Welche Schreibung stimmt?', 'der Mut', ['der mut']],
  ],
  c: [
    ['ieSchreibung', 'mc', 'Welche Schreibung stimmt?', 'Wiese', ['Wise']],
    ['ieSchreibung', 'mc', 'Welche Schreibung stimmt?', 'Brief', ['Brif']],
    ['ieSchreibung', 'typed', 'Schreibe richtig: Spil', 'Spiel'],
    ['ieSchreibung', 'typed', 'Schreibe richtig: Zil', 'Ziel'],
    ['aeSchreibung', 'mc', 'Welche Schreibung stimmt?', 'Bäume', ['Beume']],
    ['aeSchreibung', 'mc', 'Welche Schreibung stimmt?', 'Räder', ['Reder']],
    ['aeSchreibung', 'mc', 'Warum schreibt man «Bäume» mit ä?', 'wegen «Baum»', ['wegen «bauen»', 'ohne Grund']],
    ['kommaAufzaehlung', 'mc', 'Wo stehen die Kommas richtig?', 'Ich kaufe Äpfel, Birnen und Brot.', ['Ich kaufe Äpfel Birnen und Brot.']],
    ['kommaAufzaehlung', 'mc', 'Wo stehen die Kommas richtig?', 'Im Zoo leben Löwen, Affen und Zebras.', ['Im Zoo leben Löwen Affen und Zebras.']],
  ],
  d: [
    ['stammRegel', 'mc', 'Welche Schreibung stimmt? Denk an die Mehrzahl.', 'Hund', ['Hunt']],
    ['stammRegel', 'mc', 'Welche Schreibung stimmt? Denk an die Mehrzahl.', 'Berg', ['Berk']],
    ['stammRegel', 'mc', 'Welche Schreibung stimmt? Denk an die Mehrzahl.', 'Wald', ['Walt']],
    ['stammRegel', 'typed', 'Schreibe richtig: Hunt', 'Hund'],
    ['doppelKonsonant', 'mc', 'Welche Schreibung stimmt?', 'kommen', ['komen']],
    ['doppelKonsonant', 'mc', 'Welche Schreibung stimmt?', 'Sommer', ['Somer']],
    ['doppelKonsonant', 'typed', 'Schreibe richtig: schwimen', 'schwimmen'],
    ['doppelKonsonant', 'typed', 'Schreibe richtig: renen', 'rennen'],
    ['abstraktNomen', 'mc', 'Welche Schreibung stimmt?', 'das Glück', ['das glück']],
    ['abstraktNomen', 'mc', 'Welche Schreibung stimmt?', 'die Freude', ['die freude']],
  ],
  e: [
    ['abgeleiteteNomen', 'mc', 'Welche Schreibung stimmt?', 'die Freiheit', ['die freiheit']],
    ['abgeleiteteNomen', 'mc', 'Welche Schreibung stimmt?', 'die Entdeckung', ['die entdeckung']],
    ['abgeleiteteNomen', 'mc', 'Welche Schreibung stimmt?', 'das Ergebnis', ['das ergebnis']],
    ['abgeleiteteNomen', 'mc', 'Welche Schreibung stimmt?', 'die Übung', ['die übung']],
    ['strategie', 'mc', 'Du bist unsicher: «Hunt» oder «Hund»? Was hilft?', 'das Wort verlängern: Hunde', ['raten', 'das Wort weglassen']],
    ['strategie', 'mc', 'Du kennst die Schreibung eines Wortes nicht. Wo schaust du nach?', 'im Wörterbuch', ['im Rechenheft', 'nirgends']],
    ['strategie', 'mc', 'Wie prüfst du die Schreibung von «Fahrrad»?', 'den Stamm suchen: fahren', ['würfeln', 'das Wort auslassen']],
    ['strategie', 'mc', 'Du bist unsicher: «komen» oder «kommen»? Was hilft?', 'auf den kurzen Vokal achten', ['die Zeichen zählen', 'raten']],
  ],
  f: [
    ['kommaDass', 'mc', 'Wo steht das Komma richtig?', 'Ich weiss, dass du kommst.', ['Ich weiss dass du kommst.']],
    ['kommaDass', 'mc', 'Wo steht das Komma richtig?', 'Er sagt, dass es regnet.', ['Er sagt dass es regnet.']],
    ['kommaDass', 'mc', 'Wo steht das Komma richtig?', 'Sie hofft, dass wir gewinnen.', ['Sie hofft dass wir gewinnen.']],
    ['isstIst', 'mc', 'Anna ___ einen Apfel.', 'isst', ['ist']],
    ['isstIst', 'mc', 'Der Hund ___ im Garten.', 'ist', ['isst']],
    ['isstIst', 'mc', 'Papa ___ eine Suppe.', 'isst', ['ist']],
    ['dasDass', 'mc', 'Ich hoffe, ___ du kommst.', 'dass', ['das']],
    ['dasDass', 'mc', 'Ich sehe ___ Haus.', 'das', ['dass']],
    ['dasDass', 'mc', 'Er weiss, ___ es spät ist.', 'dass', ['das']],
  ],
  g: [
    ['fehlerSuche', 'mc', 'Welches Wort ist falsch geschrieben?', 'Schtrasse', ['Fahrrad', 'Garten']],
    ['fehlerSuche', 'mc', 'Welches Wort ist falsch geschrieben?', 'Hunt', ['Sonne', 'Blume']],
    ['fehlerSuche', 'mc', 'Welches Wort ist falsch geschrieben?', 'Somer', ['Winter', 'Herbst']],
    ['fehlerSuche', 'mc', 'Welches Wort ist falsch geschrieben?', 'glück', ['Freiheit', 'Mut']],
    ['fehlerSuche', 'mc', 'Welches Wort ist falsch geschrieben?', 'Wise', ['Brief', 'Ziel']],
    ['fehlerZaehlen', 'typed', 'Wie viele Fehler hat der Satz: «der hund belt.»?', '3'],
    ['fehlerZaehlen', 'typed', 'Wie viele Fehler hat der Satz: «wir spielen fussball.»?', '2'],
    ['fehlerZaehlen', 'typed', 'Wie viele Fehler hat der Satz: «Die katze schläft.»?', '1'],
    ['fehlerZaehlen', 'typed', 'Wie viele Fehler hat der Satz: «Das Velo ist rot.»?', '0'],
  ],
};

function build(rng, entry) {
  const [kind, type, expr, correctOrAnswer, wrongs] = entry;
  if (type === 'typed') return { kind, type, expr, answer: correctOrAnswer };
  const options = shuffled(rng, [correctOrAnswer, ...wrongs]);
  return { kind, type, expr, options, answer: options.indexOf(correctOrAnswer) };
}

export function genTask(rng, stufe) {
  return build(rng, pick(rng, POOLS[stufe.id]));
}

export function genRound(rng, stufe, length = 8) {
  const tasks = [];
  const seen = new Set();
  let guard = 0;
  while (tasks.length < length && guard++ < 300) {
    const task = genTask(rng, stufe);
    // Sortierte Optionen im Schlüssel: dieselbe Frage nur neu gemischt
    // zählt als Duplikat, echt andere Optionssätze bleiben erlaubt.
    const key = task.expr + '|' + (task.options ? [...task.options].sort().join('|') : '');
    if (seen.has(key)) continue;
    seen.add(key);
    tasks.push(task);
  }
  return tasks;
}
