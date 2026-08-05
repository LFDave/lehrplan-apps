// gen.js — Aufgaben für Körperatlas. Reine Funktionen ohne DOM. Der
// Puls-Rechner (Stufe e) wird generiert und von der e2e-Suite
// unabhängig nachgerechnet; alles andere ist gesichertes
// Grundwissen in festen Aufgaben-Pools mit neu aufgeschriebener
// Antwort-Tabelle in der Suite. Jede Aufgabe:
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
    ['koerperteil', 'mc', 'Womit greifst du?', 'mit den Händen', ['mit den Füssen', 'mit den Ohren']],
    ['koerperteil', 'mc', 'Womit hörst du?', 'mit den Ohren', ['mit den Augen', 'mit der Nase']],
    ['koerperteil', 'mc', 'Womit riechst du?', 'mit der Nase', ['mit dem Mund', 'mit den Händen']],
    ['koerperteil', 'mc', 'Wo liegt das Herz?', 'im Brustkorb, leicht links', ['im Bauch', 'im Kopf']],
    ['koerperteil', 'mc', 'Wozu dienen die Beine?', 'zum Gehen und Stehen', ['zum Hören', 'zum Atmen']],
    ['koerperteil', 'mc', 'Was verbindet Kopf und Rumpf?', 'der Hals', ['die Schulter', 'die Hüfte']],
    ['koerperteil', 'mc', 'Wo liegt der Magen?', 'im Bauch', ['im Kopf', 'im Bein']],
    ['koerperteil', 'mc', 'Womit kaust du?', 'mit den Zähnen', ['mit der Zunge allein', 'mit den Lippen allein']],
    ['koerperteil', 'mc', 'Das Knie ist ein ...?', 'Gelenk', ['Muskel', 'Organ']],
  ],
  b: [
    ['eigenschaft', 'mc', 'Gelenke sind ...?', 'beweglich', ['starr', 'hohl']],
    ['eigenschaft', 'mc', 'Der Schädelknochen ...?', 'schützt das Gehirn', ['pumpt das Blut', 'verdaut die Nahrung']],
    ['eigenschaft', 'mc', 'Die Augen sind ...?', 'empfindlich und brauchen Schutz', ['hart wie Knochen', 'unempfindlich']],
    ['eigenschaft', 'mc', 'Die Rippen schützen ...?', 'Herz und Lunge', ['die Füsse', 'die Ohren']],
    ['eigenschaft', 'mc', 'Die Haut ...?', 'schützt den Körper von aussen', ['hört Geräusche', 'macht das Blut']],
    ['eigenschaft', 'mc', 'Die Muskeln können ...?', 'sich zusammenziehen', ['Licht sehen', 'Nahrung verdauen']],
    ['eigenschaft', 'mc', 'Die Knochen geben dem Körper ...?', 'Halt und Form', ['Farbe', 'Wärme allein']],
    ['eigenschaft', 'mc', 'Die Zähne sind ...?', 'hart, zum Zerkleinern der Nahrung', ['weich wie Haut', 'beweglich wie Gelenke']],
  ],
  c: [
    ['organsystem', 'mc', 'Muskeln und Skelett arbeiten zusammen für ...?', 'die Bewegung', ['das Sehen', 'das Riechen']],
    ['organsystem', 'mc', 'Wo beginnt die Verdauung?', 'im Mund beim Kauen', ['im Magen', 'im Darm']],
    ['organsystem', 'mc', 'Wohin gelangt die Luft beim Einatmen?', 'in die Lunge', ['in den Magen', 'ins Herz']],
    ['organsystem', 'mc', 'Was pumpt das Blut durch den Körper?', 'das Herz', ['die Lunge', 'der Magen']],
    ['organsystem', 'mc', 'Was macht der Magen?', 'er verdaut die Nahrung weiter', ['er pumpt Blut', 'er füllt sich mit Luft']],
    ['organsystem', 'mc', 'Was holt der Körper aus der Atemluft?', 'Sauerstoff', ['Wasser', 'Zucker']],
    ['organsystem', 'mc', 'Wohin geht die Nahrung nach dem Magen?', 'in den Darm', ['in die Lunge', 'ins Gehirn']],
    ['organsystem', 'mc', 'Was steuert den ganzen Körper?', 'das Gehirn', ['der Magen', 'die Haut']],
  ],
  d: [
    ['hautreaktion', 'mc', 'Warum schwitzt du beim Rennen?', 'der Schweiss kühlt den Körper', ['der Körper spart Wasser', 'die Haut wird härter']],
    ['hautreaktion', 'mc', 'Warum wird dein Gesicht beim Turnen rot?', 'die Haut wird stärker durchblutet', ['die Haut färbt sich von der Sonne', 'das Blut wird dunkler']],
    ['hautreaktion', 'mc', 'Was schützt vor Sonnenbrand?', 'Schatten, Kleidung und Sonnencreme', ['viel Sonne am Mittag', 'nasse Haare']],
    ['hautreaktion', 'mc', 'Wann bekommst du Gänsehaut?', 'wenn dir kalt ist', ['wenn du satt bist', 'wenn du liest']],
    ['hautreaktion', 'mc', 'Die Haut ist ...?', 'unser grösstes Organ', ['ein Knochen', 'ein Muskel']],
    ['hautreaktion', 'mc', 'Was spürst du mit der Haut?', 'Druck, Wärme und Kälte', ['Farben', 'Töne']],
    ['hautreaktion', 'mc', 'Warum ist Sonnenbrand schädlich?', 'er verletzt die Haut', ['er macht die Haut stärker', 'er ist nur Farbe']],
    ['hautreaktion', 'mc', 'Was hilft der Haut nach dem Waschen?', 'sie gut abtrocknen und pflegen', ['fest rubbeln bis es weh tut', 'gar nichts']],
  ],
  e: [
    ['kreislauf', 'mc', 'Wie fliesst das Blut vom Herzen weg?', 'durch die Arterien', ['durch die Venen', 'durch die Luftröhre']],
    ['kreislauf', 'mc', 'Wie fliesst das Blut zum Herzen zurück?', 'durch die Venen', ['durch die Arterien', 'durch den Darm']],
    ['kreislauf', 'mc', 'Was ermöglicht den aufrechten Gang?', 'Skelett und Muskeln zusammen', ['nur die Haut', 'nur das Herz']],
    ['kreislauf', 'mc', 'Die Wirbelsäule ...?', 'trägt den Körper und ist beweglich', ['pumpt das Blut', 'ist ein einzelner starrer Knochen']],
    ['kreislauf', 'mc', 'Das Herz ist ein ...?', 'Muskel', ['Knochen', 'Gelenk']],
    ['kreislauf', 'mc', 'Was transportiert das Blut?', 'Sauerstoff und Nährstoffe', ['Luftblasen', 'Gedanken']],
    ['kreislauf', 'mc', 'Was spürst du am Handgelenk als Pochen?', 'den Puls', ['die Verdauung', 'die Atmung']],
    ['kreislauf', 'mc', 'Beim Rennen schlägt das Herz ...?', 'schneller', ['langsamer', 'genau gleich']],
  ],
  f: [
    ['gesundheit', 'mc', 'Was stärkt die Ausdauer?', 'regelmässige Bewegung', ['langes Sitzen', 'viel Süsses']],
    ['gesundheit', 'mc', 'Wie viel Schlaf braucht ein Kind etwa?', 'rund 10 Stunden', ['rund 4 Stunden', 'rund 16 Stunden']],
    ['gesundheit', 'mc', 'Was gehört zu einem gesunden Znüni?', 'ein Apfel und Wasser', ['nur Schokolade', 'nur Chips']],
    ['gesundheit', 'mc', 'Was hilft dem Körper nach dem Sport?', 'Wasser trinken', ['gar nichts trinken', 'sofort viel Süsses']],
    ['gesundheit', 'mc', 'Was trainiert das Gleichgewicht?', 'balancieren', ['fernsehen', 'liegen']],
    ['gesundheit', 'mc', 'Was hält die Zähne gesund?', 'putzen nach dem Essen', ['viel Zucker', 'nie putzen']],
    ['gesundheit', 'mc', 'Warum ist Aufwärmen vor dem Sport gut?', 'es bereitet Muskeln und Gelenke vor', ['es macht müde', 'es ersetzt das Training']],
    ['gesundheit', 'mc', 'Was gehört zu einem gesunden Tag?', 'Bewegung, gutes Essen und genug Schlaf', ['nur Bildschirmzeit', 'nichts trinken']],
  ],
};

// Der Puls-Rechner (e) wird generiert.
export function genTask(rng, stufe) {
  if (stufe.id === 'e' && rng() < 0.3) {
    const proMinute = pick(rng, [60, 70, 80, 90, 100]);
    const minuten = randInt(rng, 2, 4);
    return {
      kind: 'kreislauf', type: 'typed',
      expr: `Ein Herz schlägt ${proMinute}-mal pro Minute. Wie oft schlägt es in ${minuten} Minuten?`,
      answer: String(proMinute * minuten),
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
