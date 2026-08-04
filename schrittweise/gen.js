// gen.js — Aufgaben für Schrittweise. Reine Funktionen ohne DOM.
// Anleitungen, Programm-Abläufe, Variablen und Unterprogramme werden
// generiert und von der e2e-Suite unabhängig nachgerechnet (eigener
// Programm-Interpreter in der Suite). Die übrigen Stufen sind feste
// Aufgaben-Pools. Jede Aufgabe:
//   { type: 'typed', expr, answer }               getippte Antwort
//   { type: 'mc', expr, options, answer }         Auswahl (Index)

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

// Pool-Einträge: [kind, 'mc', expr, richtig, [falsch...]] oder
// [kind, 'typed', expr, antwort].
export const POOLS = {
  a: [
    ['anleitung', 'mc', 'Backrezept: «Rühre zuerst den Teig, backe ihn danach.» Was kommt zuerst?', 'den Teig rühren', ['den Teig backen', 'den Kuchen essen']],
    ['anleitung', 'mc', 'Die Bastelanleitung hat die Schritte 1 bis 4. Wo beginnst du?', 'bei Schritt 1', ['bei Schritt 4', 'irgendwo in der Mitte']],
    ['anleitung', 'mc', 'Tanzschritt: «Zwei Schritte nach links, dann klatschen.» Was kommt nach den Schritten?', 'klatschen', ['zwei Schritte nach rechts', 'sich hinsetzen']],
    ['anleitung', 'mc', 'Wozu ist eine Spielanleitung da?', 'damit alle nach den gleichen Regeln spielen', ['damit das Spiel länger dauert', 'zum Anmalen']],
    ['anleitung', 'mc', 'Du lässt beim Rezept einen Schritt aus. Was kann passieren?', 'das Ergebnis stimmt nicht', ['es wird automatisch besser', 'nichts, Schritte sind egal']],
  ],
  b: [
    ['loesungsweg', 'mc', 'Du probierst einen Weg durchs Labyrinth und landest in einer Sackgasse. Was machst du?', 'zurückgehen und einen anderen Weg probieren', ['aufgeben', 'an der Wand warten']],
    ['loesungsweg', 'mc', 'Wie prüfst du, ob dein Lösungsweg stimmt?', 'ihn Schritt für Schritt ausprobieren', ['ihn schöner aufschreiben', 'ihn geheim halten']],
    ['loesungsweg', 'mc', 'Beim Turmbau fällt der Turm immer wieder um. Was hilft?', 'etwas ändern und den neuen Versuch vergleichen', ['immer genau gleich weiterbauen', 'die Bauklötze verstecken']],
    ['loesungsweg', 'mc', 'Du suchst dein Buch im Zimmer. Welcher Weg ist planvoll?', 'Regal für Regal der Reihe nach absuchen', ['überall gleichzeitig wühlen', 'gar nicht suchen']],
    ['loesungsweg', 'mc', 'Zwei Spielstrategien: Eine gewinnt oft, eine selten. Welche wählst du?', 'die, die oft gewinnt', ['die, die selten gewinnt', 'keine von beiden']],
    ['loesungsweg', 'mc', 'Was heisst «einen Lösungsweg prüfen»?', 'kontrollieren, ob er wirklich zum Ziel führt', ['ihn auswendig lernen', 'ihn löschen']],
    ['loesungsweg', 'mc', 'Weg A braucht 12 Schritte, Weg B braucht 9 Schritte. Welcher Weg ist kürzer?', 'Weg B', ['Weg A', 'beide gleich']],
    ['loesungsweg', 'mc', 'Dein Papierflieger fliegt nicht weit. Was ist ein guter nächster Schritt?', 'eine Sache ändern und neu testen', ['alles gleichzeitig ändern', 'nie mehr falten']],
  ],
  c: [
    ['ablauf', 'mc', '«Rühre, bis der Teig glatt ist.» Was ist das?', 'eine Schleife', ['eine Verzweigung', 'ein Fehler']],
    ['ablauf', 'mc', '«Wenn es regnet, nimm den Schirm, sonst die Sonnenbrille.» Was ist das?', 'eine Verzweigung', ['eine Schleife', 'ein Rezept']],
    ['ablauf', 'mc', '«Hüpfe 10-mal.» Was ist das?', 'eine Schleife', ['eine Verzweigung', 'ein Zufall']],
    ['ablauf', 'mc', '«Wenn die Ampel grün ist, geh los.» Was ist das?', 'eine Verzweigung', ['eine Schleife', 'ein Spiel']],
    ['ablauf', 'mc', '«Sammle Karten, bis du 5 hast.» Was ist das?', 'eine Schleife', ['eine Verzweigung', 'eine Tabelle']],
    ['ablauf', 'mc', 'Woran erkennst du eine Schleife?', 'etwas wird mehrmals wiederholt', ['es gibt ein Entweder-oder', 'es passiert nie etwas']],
    ['ablauf', 'mc', 'Woran erkennst du eine Verzweigung?', 'es gibt ein Entweder-oder', ['etwas wird mehrmals wiederholt', 'alles bleibt gleich']],
    ['ablauf', 'mc', '«Solange Musik spielt, tanze.» Was ist das?', 'eine Schleife', ['eine Verzweigung', 'eine Pause']],
    ['ablauf', 'mc', '«Wenn dein Name aufgerufen wird, steh auf.» Was ist das?', 'eine Verzweigung', ['eine Schleife', 'ein Lied']],
  ],
  e: [
    ['computer', 'mc', 'Was kann ein Computer ausführen?', 'nur vordefinierte Anweisungen', ['eigene Wünsche', 'Gedanken von Menschen']],
    ['computer', 'mc', 'Was ist ein Programm?', 'eine Abfolge von Anweisungen', ['ein Zufallsgerät', 'ein Bildschirm']],
    ['computer', 'mc', 'Das Programm hat einen Fehler. Was macht der Computer?', 'er führt die Anweisungen trotzdem genau aus', ['er korrigiert den Fehler von selbst', 'er denkt sich etwas Neues aus']],
    ['computer', 'mc', 'Warum macht der Computer beim zweiten Start genau das Gleiche?', 'weil er nur den Anweisungen folgt', ['weil er sich erinnert, was schön war', 'aus Zufall']],
    ['computer', 'mc', 'Wer legt fest, was ein Programm tut?', 'die Person, die es geschrieben hat', ['der Computer selbst', 'das Wetter']],
    ['computer', 'mc', 'Der Roboter fährt gegen die Wand. Woran liegt das am ehesten?', 'an einer falschen Anweisung im Programm', ['der Roboter ist wütend', 'die Wand ist schuld']],
    ['computer', 'mc', 'Kann ein Computer etwas tun, wofür es keine Anweisung gibt?', 'Nein', ['Ja']],
    ['computer', 'mc', 'Was braucht der Computer, damit er etwas tut?', 'ein Programm mit Anweisungen', ['gute Laune', 'Sonnenlicht']],
  ],
  i: [
    ['suche', 'mc', 'Du suchst ein Wort im Wörterbuch. Welcher Weg ist meistens schneller?', 'in der Mitte aufschlagen und halbieren', ['vorne beginnen und Wort für Wort lesen', 'zufällig blättern']],
    ['suche', 'mc', 'Die Karten sind nicht sortiert. Welche Suche ist möglich?', 'nur die lineare Suche, eine Karte nach der anderen', ['nur die binäre Suche mit Halbieren', 'gar keine Suche']],
    ['suche', 'mc', 'Was braucht die binäre Suche, damit sie funktioniert?', 'sortierte Daten', ['bunte Daten', 'gelöschte Daten']],
    ['suche', 'mc', 'Wie heisst die Suche, die den Suchbereich immer halbiert?', 'binäre Suche', ['lineare Suche', 'runde Suche']],
    ['suche', 'mc', 'Wie heisst die Suche, die alles der Reihe nach prüft?', 'lineare Suche', ['binäre Suche', 'doppelte Suche']],
    ['suche', 'mc', 'Zwei Verfahren lösen dasselbe Problem. Worin können sie sich unterscheiden?', 'in der Anzahl Schritte', ['im Ergebnis, das sie liefern müssen', 'in der Farbe']],
  ],
};

// Anleitungen (a), Programm-Abläufe (d, f, g), Unterprogramme (h)
// und Halbieren (i) werden generiert.
export function genTask(rng, stufe) {
  if (stufe.id === 'a' && rng() < 0.5) {
    let start, moves, pos;
    do {
      start = randInt(rng, 1, 5);
      pos = start;
      moves = [];
      for (let i = 0; i < 3; i++) {
        const n = randInt(rng, 1, 4);
        const dir = rng() < 0.6 ? 1 : -1;
        if (pos + dir * n < 0) { i--; continue; }
        pos += dir * n;
        moves.push(`${n} ${dir > 0 ? 'vor' : 'zurück'}`);
      }
    } while (pos > 15);
    return {
      kind: 'anleitung', type: 'typed',
      expr: `Folge der Anleitung. Start auf Feld ${start}. Gehe ${moves.join(', ')}. Auf welchem Feld stehst du jetzt?`,
      answer: String(pos),
    };
  }
  if (stufe.id === 'd') {
    const variant = pick(rng, ['schritte', 'sterne', 'wenn']);
    if (variant === 'wenn') {
      const k = randInt(rng, 3, 29);
      return {
        kind: 'ausfuehren', type: 'mc',
        expr: `Programm: Wenn die Zahl gerade ist, sage JA, sonst sage NEIN. Die Zahl ist ${k}. Was sagst du?`,
        ...buildMc(rng, k % 2 === 0 ? 'JA' : 'NEIN', [k % 2 === 0 ? 'NEIN' : 'JA']),
      };
    }
    const n = randInt(rng, 2, 5);
    const m = randInt(rng, 2, 6);
    const [verb, thing, frage] = variant === 'schritte'
      ? ['gehe', 'Schritte', 'Wie viele Schritte gehst du insgesamt?']
      : ['male', 'Sterne', 'Wie viele Sterne malst du insgesamt?'];
    return {
      kind: 'ausfuehren', type: 'typed',
      expr: `Programm: Wiederhole ${n}-mal: ${verb} ${m} ${thing}. ${frage}`,
      answer: String(n * m),
    };
  }
  if (stufe.id === 'f') {
    if (rng() < 0.35) {
      const x0 = randInt(rng, 1, 3);
      const n = randInt(rng, 2, 3);
      return {
        kind: 'programm', type: 'typed',
        expr: `Programm: x = ${x0}. Wiederhole ${n}-mal: x = x * 2. Was ist x am Ende?`,
        answer: String(x0 * 2 ** n),
      };
    }
    const x0 = randInt(rng, 1, 9);
    const n = randInt(rng, 2, 4);
    const d = randInt(rng, 2, 5);
    return {
      kind: 'programm', type: 'typed',
      expr: `Programm: x = ${x0}. Wiederhole ${n}-mal: x = x + ${d}. Was ist x am Ende?`,
      answer: String(x0 + n * d),
    };
  }
  if (stufe.id === 'g') {
    if (rng() < 0.5) {
      const n = randInt(rng, 2, 4);
      const d = randInt(rng, 2, 5);
      const x0 = n * d + randInt(rng, 0, 9);
      return {
        kind: 'bedingung', type: 'typed',
        expr: `Programm: x = ${x0}. Wiederhole ${n}-mal: x = x - ${d}. Was ist x am Ende?`,
        answer: String(x0 - n * d),
      };
    }
    const x = randInt(rng, 2, 12);
    const t = randInt(rng, 1, 12);
    const plus = randInt(rng, 2, 6);
    const minus = randInt(rng, 1, Math.min(x, 6));
    const result = x > t ? x + plus : x - minus;
    return {
      kind: 'bedingung', type: 'typed',
      expr: `Programm: x = ${x}. Wenn x grösser als ${t} ist: x = x + ${plus}. Sonst: x = x - ${minus}. Was ist x am Ende?`,
      answer: String(result),
    };
  }
  if (stufe.id === 'h') {
    if (rng() < 0.5) {
      const p = randInt(rng, 2, 4);
      const q = randInt(rng, 1, p - 1);
      const s = randInt(rng, 0, 3);
      const n = randInt(rng, 2, 4);
      return {
        kind: 'unterprogramm', type: 'typed',
        expr: `Das Unterprogramm HÜPF bedeutet: ${p} vor und ${q} zurück. Start auf Feld ${s}. Führe HÜPF ${n}-mal aus. Auf welchem Feld stehst du?`,
        answer: String(s + n * (p - q)),
      };
    }
    const x0 = randInt(rng, 0, 9);
    const d = randInt(rng, 2, 5);
    const n = randInt(rng, 2, 4);
    return {
      kind: 'unterprogramm', type: 'typed',
      expr: `Programm: x = ${x0}. Das Unterprogramm PLUS bedeutet: x = x + ${d}. Rufe PLUS ${n}-mal auf. Was ist x am Ende?`,
      answer: String(x0 + n * d),
    };
  }
  if (stufe.id === 'i' && rng() < 0.4) {
    const exp = randInt(rng, 3, 6);
    return {
      kind: 'suche', type: 'typed',
      expr: `Du halbierst einen Stapel mit ${2 ** exp} Karten immer wieder, bis nur noch 1 Karte übrig ist. Wie oft halbierst du?`,
      answer: String(exp),
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
