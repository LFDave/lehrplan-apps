// gen.js — Aufgaben für Zeitreise. Reine Funktionen ohne DOM; der
// Inhalt liegt in festen Aufgaben-Pools pro Stufe (Kalender und
// Geschichte sind Faktenwissen). Die e2e-Suite prüft jede Aufgabe
// gegen eine unabhängig neu aufgeschriebene Antwort-Tabelle. Jede
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
    ['zeitwort', 'mc', 'Was war zuerst: gestern, heute oder morgen?', 'gestern', ['heute', 'morgen']],
    ['zeitwort', 'mc', 'Was kommt als Letztes: gestern, heute oder morgen?', 'morgen', ['gestern', 'heute']],
    ['wochentag', 'typed', 'Welcher Tag kommt nach Dienstag?', 'Mittwoch'],
    ['wochentag', 'typed', 'Welcher Tag kommt vor Sonntag?', 'Samstag'],
    ['wochentag', 'typed', 'Wie viele Tage hat eine Woche?', '7'],
    ['wochentag', 'mc', 'Was gehört nicht zu den Wochentagen?', 'April', ['Montag', 'Freitag']],
    ['monat', 'typed', 'Wie viele Monate hat ein Jahr?', '12'],
    ['monat', 'typed', 'Welcher Monat kommt nach März?', 'April'],
    ['monat', 'typed', 'Welcher Monat kommt vor Dezember?', 'November'],
    ['monat', 'mc', 'Welcher Monat ist der erste im Jahr?', 'Januar', ['März', 'Dezember']],
  ],
  b: [
    ['jahreszeit', 'mc', 'Welche Jahreszeit kommt nach dem Sommer?', 'Herbst', ['Frühling', 'Winter']],
    ['jahreszeit', 'mc', 'Welche Jahreszeit kommt nach dem Winter?', 'Frühling', ['Herbst', 'Sommer']],
    ['jahreszeit', 'mc', 'In welcher Jahreszeit fällt am ehesten Schnee?', 'Winter', ['Sommer', 'Frühling']],
    ['jahreszeit', 'typed', 'Wie viele Jahreszeiten hat ein Jahr?', '4'],
    ['uhr', 'typed', 'Der kleine Zeiger zeigt auf die 3, der grosse auf die 12. Wie spät ist es? (? Uhr)', '3'],
    ['uhr', 'typed', 'Der kleine Zeiger zeigt auf die 8, der grosse auf die 12. Wie spät ist es? (? Uhr)', '8'],
    ['uhr', 'typed', 'Wie viele Stunden hat ein ganzer Tag?', '24'],
    ['uhr', 'typed', 'Wie viele Minuten hat eine Stunde?', '60'],
    ['uhr', 'typed', 'Wie viele Sekunden hat eine Minute?', '60'],
  ],
  c: [
    ['abfolge', 'mc', 'Zähneputzen: Was kommt zuerst?', 'Zahnpasta auf die Bürste geben', ['den Mund ausspülen', 'die Bürste versorgen']],
    ['abfolge', 'mc', 'Kuchen backen: Was kommt zuerst?', 'den Teig mischen', ['den Kuchen backen', 'den Kuchen essen']],
    ['abfolge', 'mc', 'Einen Brief schicken: Was kommt zuletzt?', 'den Brief einwerfen', ['den Brief schreiben', 'das Couvert zukleben']],
    ['abfolge', 'mc', 'Schuhe anziehen: Was kommt zuerst?', 'in die Schuhe schlüpfen', ['die Schuhe binden', 'losrennen']],
    ['dauer', 'mc', 'Was dauert etwa eine Minute?', 'einmal das ABC aufsagen', ['eine Nacht schlafen', 'ein ganzer Schultag']],
    ['dauer', 'mc', 'Was dauert etwa eine Stunde?', 'eine Schullektion mit Pause', ['einmal blinzeln', 'eine ganze Woche']],
    ['dauer', 'mc', 'Was dauert länger?', 'eine Stunde', ['eine Minute']],
    ['dauer', 'mc', 'Was ist kürzer?', 'eine Sekunde', ['eine Minute']],
    ['dauer', 'mc', 'Was dauert etwa eine Sekunde?', 'einmal klatschen', ['ein Mittagessen', 'ein Fussballspiel']],
  ],
  d: [
    ['tagesstruktur', 'mc', 'Die Sonne geht jeden Tag auf. Ist das immer gleich oder verschieden?', 'immer gleich', ['je nach Tag verschieden']],
    ['tagesstruktur', 'mc', 'Am Mittwoch hast du Turnen. Ist das an allen Tagen gleich?', 'je nach Tag verschieden', ['immer gleich']],
    ['tagesstruktur', 'mc', 'Nach dem Tag kommt die Nacht. Ist das immer gleich oder verschieden?', 'immer gleich', ['je nach Tag verschieden']],
    ['tagesstruktur', 'mc', 'Was du zum Zmittag isst: Ist das jeden Tag gleich?', 'je nach Tag verschieden', ['immer gleich']],
    ['tagesstruktur', 'mc', 'Zuerst Morgen, dann Mittag, dann Abend. Ist diese Reihenfolge immer gleich?', 'immer gleich', ['je nach Tag verschieden']],
    ['tagesstruktur', 'mc', 'Ob du am Nachmittag Schule hast: Ist das jeden Tag gleich?', 'je nach Tag verschieden', ['immer gleich']],
    ['tagesstruktur', 'mc', 'Was kommt in jedem Tageslauf vor?', 'aufwachen', ['eine Geburtstagsparty', 'ein Ausflug']],
    ['tagesstruktur', 'mc', 'Was gehört nicht zu jedem Tag?', 'ein Zoobesuch', ['schlafen', 'essen']],
  ],
  e: [
    ['zeitstrahl', 'mc', 'Was liegt auf dem Zeitstrahl weiter links (früher): 1950 oder 1990?', '1950', ['1990']],
    ['zeitstrahl', 'mc', 'Was liegt auf dem Zeitstrahl weiter rechts (später): 1800 oder 1900?', '1900', ['1800']],
    ['zeitstrahl', 'mc', 'Deine Grossmutter wurde 1960 geboren, deine Mutter 1990. Wer kommt auf dem Zeitstrahl zuerst?', 'die Grossmutter', ['die Mutter']],
    ['zeitstrahl', 'typed', 'Wie viele Jahre liegen zwischen 1950 und 1990?', '40'],
    ['zeitstrahl', 'typed', 'Wie viele Jahre liegen zwischen 1900 und 2000?', '100'],
    ['dauerRechnen', 'typed', 'Die Pause beginnt um 10:00 Uhr und endet um 10:20 Uhr. Wie viele Minuten dauert sie?', '20'],
    ['dauerRechnen', 'typed', 'Der Film beginnt um 14:00 Uhr und endet um 15:30 Uhr. Wie viele Minuten dauert er?', '90'],
    ['dauerRechnen', 'typed', 'Du schläfst von 20:00 Uhr bis 06:00 Uhr. Wie viele Stunden sind das?', '10'],
  ],
  f: [
    ['generation', 'mc', 'Wer ist in der Regel am ältesten?', 'die Grossmutter', ['die Mutter', 'das Kind']],
    ['generation', 'mc', 'Wer wurde zuerst geboren?', 'der Urgrossvater', ['der Grossvater', 'der Vater']],
    ['generation', 'typed', 'Die Mutter deiner Mutter ist deine ...?', 'Grossmutter'],
    ['generation', 'typed', 'Der Vater deines Vaters ist dein ...?', 'Grossvater'],
    ['generation', 'mc', 'Kind, Eltern, Grosseltern: Wie viele Generationen sind das?', '3', ['2', '4']],
    ['generation', 'mc', 'Wer kommt auf dem Familien-Zeitstrahl zuletzt?', 'das Kind', ['die Grossmutter', 'die Mutter']],
    ['generation', 'mc', 'Deine Eltern waren einmal so alt wie du. Stimmt das?', 'Ja', ['Nein']],
    ['generation', 'mc', 'Wer hat die längste Lebensgeschichte hinter sich?', 'die Urgrossmutter', ['die Mutter', 'das Kind']],
  ],
  g: [
    ['epoche', 'mc', 'Welche Epoche kam zuerst?', 'die Steinzeit', ['die Antike', 'das Mittelalter']],
    ['epoche', 'mc', 'Welche Epoche kam direkt nach der Antike?', 'das Mittelalter', ['die Steinzeit', 'die Neuzeit']],
    ['epoche', 'mc', 'Welche Epoche kam direkt nach dem Mittelalter?', 'die Neuzeit', ['die Antike', 'die Steinzeit']],
    ['epoche', 'mc', 'In welcher Epoche leben wir heute?', 'in der Neuzeit', ['im Mittelalter', 'in der Steinzeit']],
    ['epoche', 'mc', 'Ritter und Burgen gehören vor allem zu welcher Epoche?', 'zum Mittelalter', ['zur Steinzeit', 'zur Neuzeit']],
    ['epoche', 'mc', 'Womit jagten die Menschen in der Steinzeit?', 'mit Speer und Pfeilbogen', ['mit dem Gewehr', 'mit dem Auto']],
    ['epoche', 'mc', 'Die alten Römer und Griechen gehören zu welcher Epoche?', 'zur Antike', ['zum Mittelalter', 'zur Steinzeit']],
    ['epoche', 'mc', 'Was ist die richtige Reihenfolge?', 'Steinzeit, Antike, Mittelalter, Neuzeit', ['Antike, Steinzeit, Neuzeit, Mittelalter', 'Mittelalter, Steinzeit, Antike, Neuzeit']],
  ],
  h: [
    ['ereignis', 'mc', 'Was war früher?', 'die Erfindung der Schrift', ['der Bundesbrief von 1291']],
    ['ereignis', 'mc', 'Was war früher: die Höhlenmalerei der Steinzeit oder der Buchdruck?', 'die Höhlenmalerei', ['der Buchdruck']],
    ['ereignis', 'mc', 'Der Bundesbrief stammt von 1291. Welche Epoche war das?', 'das Mittelalter', ['die Antike', 'die Steinzeit']],
    ['jahrhundert', 'typed', 'Der Bundesbrief stammt von 1291. In welchem Jahrhundert war das? (?. Jahrhundert)', '13'],
    ['jahrhundert', 'typed', 'Der Schweizer Bundesstaat entstand 1848. In welchem Jahrhundert war das? (?. Jahrhundert)', '19'],
    ['jahrhundert', 'typed', 'Der Buchdruck wurde um 1450 erfunden. In welchem Jahrhundert war das? (?. Jahrhundert)', '15'],
    ['jahrhundert', 'typed', 'Wie viele Jahre hat ein Jahrhundert?', '100'],
    ['jahrhundert', 'typed', 'Wie viele Jahre hat ein Jahrzehnt?', '10'],
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
    const key = task.expr + '|' + (task.options ? [...task.options].sort().join('|') : '');
    if (seen.has(key)) continue;
    seen.add(key);
    tasks.push(task);
  }
  return tasks;
}
