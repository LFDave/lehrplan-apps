// gen.js — Aufgaben für Stromkreis. Reine Funktionen ohne DOM. Das
// Ohmsche Gesetz (c) und die Knotenregel (d) werden generiert und
// von der e2e-Suite mit eigener Physik-Rechnung unabhängig
// nachgerechnet; die übrigen Stufen sind gesichertes Grundwissen in
// festen Aufgaben-Pools. Jede Aufgabe:
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
    ['wirkung', 'mc', 'Die Glühlampe zeigt welche Wirkung des Stroms?', 'die Lichtwirkung', ['die chemische Wirkung', 'gar keine Wirkung']],
    ['wirkung', 'mc', 'Der Wasserkocher nutzt ...?', 'die Wärmewirkung', ['die Lichtwirkung', 'die magnetische Wirkung']],
    ['wirkung', 'mc', 'Der Elektromagnet nutzt ...?', 'die magnetische Wirkung', ['die Wärmewirkung', 'die Lichtwirkung']],
    ['wirkung', 'mc', 'Beim Laden eines Akkus wirkt der Strom ...?', 'chemisch', ['nur als Licht', 'gar nicht']],
    ['wirkung', 'mc', 'Damit Strom fliesst, braucht es ...?', 'einen geschlossenen Kreis mit Stromquelle', ['nur einen Draht', 'nur eine Lampe']],
    ['wirkung', 'mc', 'Gute Leiter sind ...?', 'Metalle wie Kupfer', ['Gummi und Glas', 'trockenes Holz']],
    ['wirkung', 'mc', 'Nichtleiter (Isolatoren) sind ...?', 'Gummi, Glas und Kunststoff', ['Kupfer und Eisen', 'Salzwasser']],
    ['wirkung', 'mc', 'Der Schalter im Stromkreis ...?', 'öffnet und schliesst den Kreis', ['erzeugt den Strom', 'färbt das Licht']],
  ],
  b: [
    ['schaltung', 'mc', 'Zwei Lampen in Serie, eine wird herausgedreht. Was passiert?', 'beide gehen aus', ['die andere leuchtet weiter', 'beide leuchten heller']],
    ['schaltung', 'mc', 'Zwei Lampen parallel, eine geht kaputt. Was passiert?', 'die andere leuchtet weiter', ['beide gehen aus', 'die Batterie ist sofort leer']],
    ['schaltung', 'mc', 'Zwei gleiche Lampen in Serie leuchten ...?', 'schwächer als eine Lampe allein', ['heller als eine allein', 'genau gleich hell']],
    ['schaltung', 'mc', 'Die Lampen in der Wohnung sind geschaltet ...?', 'parallel', ['in Serie', 'gar nicht']],
    ['schaltung', 'mc', 'Die Stromstärke misst man mit ...?', 'dem Amperemeter', ['dem Voltmeter', 'dem Thermometer']],
    ['schaltung', 'mc', 'Die Spannung misst man mit ...?', 'dem Voltmeter', ['dem Amperemeter', 'dem Massstab']],
    ['schaltung', 'mc', 'Mehr Lampen in Serie bedeuten für den Strom ...?', 'mehr Widerstand, weniger Strom', ['weniger Widerstand', 'keinen Unterschied']],
    ['schaltung', 'mc', 'Das Amperemeter schliesst man an ...?', 'in Serie in den Stromkreis', ['parallel zur Lampe', 'gar nicht']],
  ],
  c: [
    ['ohm', 'mc', 'Die Einheit der Stromstärke ist ...?', 'das Ampere', ['das Volt', 'das Ohm']],
    ['ohm', 'mc', 'Die Einheit der Spannung ist ...?', 'das Volt', ['das Ampere', 'das Watt']],
    ['ohm', 'mc', 'Die Einheit des Widerstands ist ...?', 'das Ohm', ['das Volt', 'das Gramm']],
    ['ohm', 'mc', 'Das Ohmsche Gesetz lautet ...?', 'U = R · I', ['U = R + I', 'U = R − I']],
    ['ohm', 'mc', 'Steigt die Spannung bei gleichem Widerstand, dann ...?', 'steigt die Stromstärke', ['sinkt die Stromstärke', 'bleibt alles gleich']],
  ],
  d: [
    ['knoten', 'mc', 'Am Knoten gilt für die Ströme ...?', 'hinein gleich hinaus', ['hinein grösser als hinaus', 'es gibt keine Regel']],
    ['knoten', 'mc', 'In einer Masche ist die Summe der Teilspannungen ...?', 'gleich der Quellenspannung', ['immer null Volt', 'beliebig gross']],
    ['knoten', 'mc', 'In der Parallelschaltung ist an beiden Zweigen ...?', 'die gleiche Spannung', ['der gleiche Strom in jedem Fall', 'gar keine Spannung']],
    ['knoten', 'mc', 'Ein Versuchsprotokoll enthält ...?', 'Aufbau, Messwerte und Folgerung', ['nur das Ergebnis', 'nur eine Zeichnung']],
  ],
  e: [
    ['maschine', 'mc', 'Der Elektromotor wandelt ...?', 'elektrische Energie in Bewegung', ['Bewegung in Strom', 'Wärme in Licht']],
    ['maschine', 'mc', 'Der Generator wandelt ...?', 'Bewegung in elektrische Energie', ['Strom in Bewegung', 'Licht in Wärme']],
    ['maschine', 'mc', 'Im Wasserkraftwerk treibt das Wasser ...?', 'die Turbine und den Generator an', ['die Batterie an', 'den Elektromotor an']],
    ['maschine', 'mc', 'Im Elektromotor wirken zusammen ...?', 'Magnetfelder und stromdurchflossene Spulen', ['Federn und Zahnräder allein', 'Licht und Schall']],
    ['maschine', 'mc', 'Der Dynamo am Velo ist ...?', 'ein kleiner Generator', ['ein Elektromotor', 'eine Batterie']],
    ['maschine', 'mc', 'Motor und Generator sind sich ähnlich, weil ...?', 'beide mit Spulen und Magneten arbeiten', ['beide Wasser brauchen', 'beide Licht erzeugen']],
    ['maschine', 'mc', 'Dreht man einen Motor von Hand, kann er ...?', 'wie ein Generator Spannung erzeugen', ['explodieren', 'nichts tun']],
    ['maschine', 'mc', 'Wo steckt ein Elektromotor?', 'im Ventilator und im Elektrovelo', ['in der Kerze', 'im Buch']],
  ],
};

// Ohmsches Gesetz (c) und Knotenregel (d) werden generiert.
export function genTask(rng, stufe) {
  if (stufe.id === 'c' && rng() < 0.55) {
    const R = randInt(rng, 2, 12);
    const I = randInt(rng, 1, 4);
    const U = R * I;
    const variante = pick(rng, ['U', 'I', 'R']);
    if (variante === 'U') {
      return {
        kind: 'ohm', type: 'typed',
        expr: `Widerstand ${R} Ohm, Stromstärke ${I} Ampere. Wie gross ist die Spannung in Volt?`,
        answer: String(U),
      };
    }
    if (variante === 'I') {
      return {
        kind: 'ohm', type: 'typed',
        expr: `Spannung ${U} Volt, Widerstand ${R} Ohm. Wie gross ist die Stromstärke in Ampere?`,
        answer: String(I),
      };
    }
    return {
      kind: 'ohm', type: 'typed',
      expr: `Spannung ${U} Volt, Stromstärke ${I} Ampere. Wie gross ist der Widerstand in Ohm?`,
      answer: String(R),
    };
  }
  if (stufe.id === 'd' && rng() < 0.5) {
    if (rng() < 0.5) {
      const a = randInt(rng, 1, 6);
      const b = randInt(rng, 1, 6);
      return {
        kind: 'knoten', type: 'typed',
        expr: `In einen Knoten fliessen ${a} Ampere und ${b} Ampere hinein. Wie viel Ampere fliessen hinaus?`,
        answer: String(a + b),
      };
    }
    const gesamt = randInt(rng, 5, 12);
    const zweig = randInt(rng, 1, gesamt - 1);
    return {
      kind: 'knoten', type: 'typed',
      expr: `Ein Strom von ${gesamt} Ampere teilt sich auf zwei Zweige. Durch den ersten fliessen ${zweig} Ampere. Wie viel Ampere fliessen durch den zweiten?`,
      answer: String(gesamt - zweig),
    };
  }
  const entry = pick(rng, POOLS[stufe.id]);
  const [kind, type, expr, correctOrAnswer, wrongs] = entry;
  if (type === 'typed') return { kind, type, expr, answer: correctOrAnswer };
  const options = shuffled(rng, [correctOrAnswer, ...wrongs]);
  return { kind, type, expr, options, answer: options.indexOf(correctOrAnswer) };
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
