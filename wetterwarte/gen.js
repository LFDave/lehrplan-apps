// gen.js — Aufgaben für Wetterwarte. Reine Funktionen ohne DOM. Die
// Temperatur-Rechnungen (1e) und die Blitz-Donner-Distanz (1g)
// werden generiert und von der e2e-Suite unabhängig nachgerechnet;
// alles andere ist gesichertes Grundwissen in festen Aufgaben-Pools
// mit neu aufgeschriebener Antwort-Tabelle. Jede Aufgabe:
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
  '1a': [
    ['wetterwort', 'mc', 'Dicke weisse Flocken fallen vom Himmel. Welches Wetter ist das?', 'Schneefall', ['Nebel', 'Hitze']],
    ['wetterwort', 'mc', 'Es blitzt und donnert. Was ist das?', 'ein Gewitter', ['Nebel', 'Raureif']],
    ['wetterwort', 'mc', 'Du siehst kaum 50 Meter weit, alles ist grau. Was ist das?', 'Nebel', ['Sonnenschein', 'Hagel']],
    ['wetterwort', 'mc', 'Die Blätter fliegen und die Äste biegen sich. Was ist das?', 'starker Wind', ['Windstille', 'Nebel']],
    ['wetterwort', 'mc', 'Wasser fällt in Tropfen vom Himmel. Was ist das?', 'Regen', ['Schnee', 'Nebel']],
    ['wetterwort', 'mc', 'Der Himmel ist blau und die Sonne scheint. Wie heisst dieses Wetter?', 'sonnig', ['neblig', 'stürmisch']],
    ['wetterwort', 'mc', 'Kleine Eiskörner prasseln vom Himmel. Was ist das?', 'Hagel', ['Schnee', 'Tau']],
    ['wetterwort', 'mc', 'Nach Regen und Sonne siehst du bunte Farben am Himmel. Was ist das?', 'ein Regenbogen', ['ein Blitz', 'ein Komet']],
  ],
  '1b': [
    ['bedeutung', 'mc', 'Der Bauer will Heu ernten. Welches Wetter braucht er?', 'trockenes, sonniges Wetter', ['Dauerregen', 'Hagel']],
    ['bedeutung', 'mc', 'Was brauchst du zum Schlitteln?', 'Schnee', ['Regen', 'Nebel']],
    ['bedeutung', 'mc', 'Die Pflanzen im Garten brauchen ...?', 'Sonne und Regen', ['nur Schnee', 'nur Wind']],
    ['bedeutung', 'mc', 'Was gehört zu einem heissen Sommertag?', 'Sonnenhut tragen und Wasser trinken', ['dicke Winterjacke', 'Handschuhe']],
    ['bedeutung', 'mc', 'Für wen ist die Wettervorhersage besonders wichtig?', 'für Bäuerinnen, Piloten und Bergführer', ['für niemanden', 'nur für Kinder']],
    ['bedeutung', 'mc', 'Es regnet am Wandertag. Was ändert sich?', 'das Programm findet vielleicht drinnen statt', ['gar nichts, Regen ist egal', 'die Schule fällt immer aus']],
    ['bedeutung', 'mc', 'Bei Glatteis auf dem Schulweg ...?', 'gehst du langsam und vorsichtig', ['rennst du besonders schnell', 'fährst du mit dem Velo freihändig']],
    ['bedeutung', 'mc', 'Lange Trockenheit ist für die Landwirtschaft ...?', 'ein Problem, die Felder brauchen Wasser', ['immer gut', 'ohne Bedeutung']],
  ],
  '1c': [
    ['beobachtung', 'mc', 'Nieselregen ist ...?', 'feiner, leichter Regen', ['starker Platzregen', 'gefrorener Regen']],
    ['beobachtung', 'mc', '«Windstill» heisst ...?', 'es weht kein Wind', ['es stürmt', 'es regnet']],
    ['beobachtung', 'mc', 'Der Himmel ist bedeckt. Was siehst du?', 'nur Wolken, keine Sonne', ['klaren blauen Himmel', 'Sterne am Mittag']],
    ['beobachtung', 'mc', 'Was gehört alles zum Niederschlag?', 'Regen, Schnee und Hagel', ['Wind und Wolken', 'Sonne und Mond']],
    ['beobachtung', 'mc', 'Woran erkennst du die Windrichtung?', 'an einer Windfahne oder Fahne', ['am Thermometer', 'an der Uhr']],
    ['beobachtung', 'mc', 'Hohe Schäfchenwolken bedeuten meist ...?', 'schönes Wetter', ['sofort Gewitter', 'Schneefall']],
    ['beobachtung', 'mc', 'Dunkle, hohe Wolkentürme am Sommernachmittag deuten auf ...?', 'ein mögliches Gewitter', ['sicher Sonne', 'Nebel am Mittag']],
    ['beobachtung', 'mc', 'Ein Wetterprotokoll hält fest ...?', 'Wetter, Temperatur und Wind jeden Tag', ['nur die Hausaufgaben', 'die Pausenzeiten']],
  ],
  '1d': [
    ['jahreszeit', 'mc', 'Hagel gibt es am ehesten ...?', 'bei Sommergewittern', ['bei Winternebel', 'an klaren Herbstmorgen']],
    ['jahreszeit', 'mc', 'Raureif und Bodennebel passen zu ...?', 'Spätherbst und Winter', ['Hochsommer', 'Frühlingsgewittern']],
    ['jahreszeit', 'mc', 'Schnee fällt, wenn es ...?', 'etwa 0 Grad oder kälter ist', ['über 20 Grad warm ist', 'windstill ist, egal wie warm']],
    ['jahreszeit', 'mc', 'Gewitter gibt es am häufigsten ...?', 'an heissen Sommertagen', ['an kalten Winterabenden', 'nur im Frühling']],
    ['jahreszeit', 'mc', 'Im Frühling schmilzt der Schnee in den Bergen. Die Bäche führen dann ...?', 'mehr Wasser', ['weniger Wasser', 'gar kein Wasser']],
    ['jahreszeit', 'mc', 'Tau auf der Wiese entsteht ...?', 'in klaren, kühlen Nächten', ['bei starkem Wind am Mittag', 'nur im Winter']],
    ['jahreszeit', 'mc', 'Welche Jahreszeit hat bei uns die kürzesten Tage?', 'der Winter', ['der Sommer', 'der Frühling']],
    ['jahreszeit', 'mc', 'Der Föhn ist ...?', 'ein warmer, kräftiger Wind', ['eine Regenart', 'eine Wolkenform']],
  ],
  '1e': [
    ['messwert', 'mc', 'Womit misst man die Temperatur?', 'mit dem Thermometer', ['mit dem Regenmesser', 'mit der Waage']],
    ['messwert', 'mc', 'Womit misst man den Niederschlag?', 'mit dem Regenmesser', ['mit dem Barometer', 'mit dem Kompass']],
    ['messwert', 'mc', 'Womit misst man den Luftdruck?', 'mit dem Barometer', ['mit dem Thermometer', 'mit dem Lineal']],
    ['messwert', 'mc', 'Womit misst man die Windstärke?', 'mit dem Windmesser', ['mit dem Regenmesser', 'mit der Sonnenuhr']],
    ['messwert', 'mc', 'Wozu stellt man Messwerte in einem Diagramm dar?', 'um Veränderungen auf einen Blick zu sehen', ['damit es schöner aussieht', 'um die Zahlen zu verstecken']],
  ],
  '1f': [
    ['prognose', 'mc', 'Die Prognose sagt 90 Prozent Regenwahrscheinlichkeit. Was heisst das?', 'Regen ist sehr wahrscheinlich', ['es regnet sicher nicht', 'es wird 90 Grad warm']],
    ['prognose', 'mc', 'Das Symbol zeigt eine Sonne hinter einer Wolke. Was bedeutet das?', 'teilweise sonnig, teilweise bewölkt', ['dichter Nebel', 'starker Schneefall']],
    ['prognose', 'mc', 'Für die Schulreise ist Gewitter gemeldet. Was ist klug?', 'einen Plan für drinnen bereithalten', ['die Warnung ignorieren', 'ohne Jacke losgehen']],
    ['prognose', 'mc', 'Bei Gewitter im Freien ...?', 'stellst du dich nicht unter einzelne Bäume', ['stellst du dich unter den höchsten Baum', 'badest du weiter im See']],
    ['prognose', 'mc', 'Bei Sturmwarnung ...?', 'bleibst du weg von Wäldern und Baustellen', ['gehst du in den Wald spielen', 'kletterst du auf ein Gerüst']],
    ['prognose', 'mc', 'Bei Hagel auf dem Velo ...?', 'suchst du einen Unterstand', ['fährst du schneller', 'hältst du die Hände hin']],
    ['prognose', 'mc', 'Wo findest du eine Wetterprognose?', 'in Wetter-Apps, Radio und Zeitung', ['nur im Rechenbuch', 'nirgends']],
    ['prognose', 'mc', 'Die Prognose hilft dir ...?', 'Kleidung und Pläne anzupassen', ['das Wetter zu ändern', 'die Zeit anzuhalten']],
  ],
  '1g': [
    ['zusammenhang', 'mc', 'Die Sonne erwärmt das Wasser im See. Was passiert?', 'Wasser verdunstet und steigt als Wasserdampf auf', ['das Wasser wird zu Stein', 'nichts']],
    ['zusammenhang', 'mc', 'Woraus bestehen Wolken?', 'aus vielen kleinen Wassertröpfchen', ['aus Rauch', 'aus Watte']],
    ['zusammenhang', 'mc', 'Verdunsten, Wolken bilden, abregnen, zurück ins Meer: Wie heisst das?', 'der Wasserkreislauf', ['die Windrose', 'der Jahresring']],
    ['zusammenhang', 'mc', 'Warum hörst du den Donner erst nach dem Blitz?', 'Licht ist viel schneller als Schall', ['der Donner kommt von einem anderen Ort', 'das Ohr braucht länger als das Auge']],
    ['zusammenhang', 'mc', 'In einer Gewitterwolke steigt warme, feuchte Luft ...?', 'schnell nach oben', ['langsam nach unten', 'gar nicht']],
    ['zusammenhang', 'mc', 'Eine Kaltfront bringt oft ...?', 'Schauer und sinkende Temperaturen', ['immer Sonnenschein', 'keine Veränderung']],
  ],
  '2a': [
    ['ereignis', 'mc', 'Viel Wasser tritt über die Ufer. Wie heisst das Ereignis?', 'eine Überschwemmung', ['eine Lawine', 'ein Erdbeben']],
    ['ereignis', 'mc', 'Schnee rutscht den Berghang hinunter. Wie heisst das?', 'eine Lawine', ['eine Überschwemmung', 'ein Regenbogen']],
    ['ereignis', 'mc', 'Sehr starker Wind wirft Bäume um. Wie heisst das?', 'ein Sturm', ['ein Nieselregen', 'eine Windstille']],
    ['ereignis', 'mc', 'Erde und Steine rutschen einen Hang hinab. Wie heisst das?', 'ein Erdrutsch', ['eine Flut', 'ein Blitz']],
    ['ereignis', 'mc', 'Grosse Eiskörner beschädigen Autos und Pflanzen. Was ist das?', 'Hagel', ['Tau', 'Nebel']],
    ['ereignis', 'mc', 'Der Boden zittert und wackelt. Wie heisst das?', 'ein Erdbeben', ['ein Gewitter', 'ein Föhnsturm']],
    ['ereignis', 'mc', 'Ein Blitz kann ...?', 'einen Brand auslösen', ['Schnee bringen', 'die Sonne verdecken']],
    ['ereignis', 'mc', 'Naturereignisse sind ...?', 'Ereignisse der Natur wie Sturm und Hochwasser', ['Erfindungen', 'nur Geschichten']],
  ],
  '2b': [
    ['schutzregel', 'mc', 'Ein Gewitter zieht auf, du bist im Schwimmbad. Was machst du?', 'sofort aus dem Wasser gehen', ['weiterschwimmen', 'auf das Sprungbrett klettern']],
    ['schutzregel', 'mc', 'Der Bach führt nach starkem Regen viel Wasser. Was gilt?', 'Abstand vom Ufer halten', ['nahe ans Wasser gehen', 'hineinstehen']],
    ['schutzregel', 'mc', 'Der See ist zugefroren. Wann darfst du aufs Eis?', 'nur wenn es offiziell freigegeben ist', ['immer', 'wenn es dünn glänzt']],
    ['schutzregel', 'mc', 'Es blitzt, du bist draussen auf dem Feld. Was machst du?', 'ein Gebäude oder ein Auto aufsuchen', ['dich unter den einzigen Baum stellen', 'den Drachen steigen lassen']],
    ['schutzregel', 'mc', 'Bei starkem Schneefall in den Bergen ...?', 'bleibst du auf markierten Wegen und Pisten', ['gehst du abseits in den Tiefschnee', 'ist alles erlaubt']],
    ['schutzregel', 'mc', 'Bei Sturm fallen manchmal Äste. Wo bist du sicherer?', 'weg von Bäumen, drinnen', ['direkt unter grossen Bäumen', 'auf dem Spielplatz unter der Platane']],
    ['schutzregel', 'mc', 'Wer sagt dir, was bei Gefahr zu tun ist?', 'Eltern, Lehrpersonen und offizielle Warnungen', ['niemand', 'nur der Zufall']],
    ['schutzregel', 'mc', 'Warnt eine Sirene oder eine Warnung auf dem Handy, dann ...?', 'hörst du hin und folgst den Anweisungen', ['ignorierst du sie', 'gehst du nach draussen schauen']],
  ],
  '2c': [
    ['spur', 'mc', 'Nach dem Sturm liegen Bäume kreuz und quer im Wald. Was war die Ursache?', 'sehr starker Wind', ['ein Regenbogen', 'Vogelzug']],
    ['spur', 'mc', 'Der Bach hat Kies und Äste auf die Wiese getragen. Was war hier?', 'Hochwasser', ['Trockenheit', 'Nebel']],
    ['spur', 'mc', 'Am Steilhang fehlt Erde und unten liegt ein Erdhaufen. Was ist passiert?', 'ein Erdrutsch', ['ein Blitzschlag', 'Schneefall']],
    ['spur', 'mc', 'Was schützt ein Bergdorf vor Lawinen?', 'Schutzwald und Lawinenverbauungen', ['offene, kahle Hänge', 'nichts']],
    ['spur', 'mc', 'Was schützt ein Dorf am Fluss vor Hochwasser?', 'Dämme und Rückhaltebecken', ['mehr Häuser am Ufer', 'das Fällen des Schutzwaldes']],
    ['spur', 'mc', 'Löcher in Blechdächern und kaputte Pflanzen nach einem Sommergewitter deuten auf ...?', 'Hagel', ['Raureif', 'Tau']],
    ['spur', 'mc', 'Warum ist der Wald am Hang wichtig?', 'er hält Schnee und Boden zurück', ['er macht den Hang rutschiger', 'er hat keine Wirkung']],
    ['spur', 'mc', 'Ein verkohlter Baum nach dem Gewitter deutet auf ...?', 'einen Blitzeinschlag', ['Hochwasser', 'Lawinen']],
  ],
  '2d': [
    ['prozess', 'mc', 'Wann entstehen Lawinen am ehesten?', 'nach starkem Schneefall an steilen Hängen', ['bei trockenem Sommerwetter', 'auf flachen Wiesen']],
    ['prozess', 'mc', 'Was macht Überschwemmungen wahrscheinlicher?', 'lange, starke Regenfälle', ['klare Winternächte', 'leichter Wind']],
    ['prozess', 'mc', 'Womit warnen die Behörden heute vor Naturgefahren?', 'mit offiziellen Warnungen, zum Beispiel in Apps', ['mit Brieftauben', 'gar nicht']],
    ['prozess', 'mc', 'Wie entsteht ein Erdrutsch oft?', 'viel Regen weicht den Hang auf', ['die Sonne trocknet den Boden', 'Schneeflocken fallen leise']],
    ['prozess', 'mc', 'Warum baut man heute anders als früher an Flüssen?', 'man kennt die Gefahrenzonen besser', ['Wasser ist heute harmloser', 'früher gab es keine Flüsse']],
    ['prozess', 'mc', 'Was zeigt eine Gefahrenkarte?', 'wo Naturgefahren besonders drohen', ['wo es Glace gibt', 'die Schulzimmer']],
    ['prozess', 'mc', 'Nach einem Waldbrand wächst der Wald ...?', 'langsam über viele Jahre nach', ['über Nacht nach', 'nie mehr']],
    ['prozess', 'mc', 'Ein Sturm wird gemeldet, wenn ...?', 'sehr starke Winde erwartet werden', ['die Sonne scheint', 'es windstill ist']],
  ],
  '2e': [
    ['verhalten', 'mc', 'Beim Wandern zieht ein Gewitter auf. Was ist richtig?', 'absteigen und Schutz in einer Hütte suchen', ['auf den Gipfel weitergehen', 'sich an einen Drahtseilzaun stellen']],
    ['verhalten', 'mc', 'Es gilt Lawinengefahr. Was gilt beim Skifahren?', 'auf den markierten, offenen Pisten bleiben', ['abseits im Tiefschnee fahren', 'die Absperrungen übersteigen']],
    ['verhalten', 'mc', 'Gewitterwarnung am Badesee. Was machst du?', 'aus dem Wasser gehen und Schutz suchen', ['weiter baden', 'aufs Floss hinausschwimmen']],
    ['verhalten', 'mc', 'In den Bergen ziehen dunkle Wolken auf. Was ist klug?', 'früh umkehren oder eine Hütte ansteuern', ['warten, bis es blitzt', 'weitergehen wie geplant']],
    ['verhalten', 'mc', 'Hochwasserwarnung: Der Keller könnte volllaufen. Was gilt?', 'nicht in den Keller gehen', ['im Keller spielen', 'im Bach schauen gehen']],
    ['verhalten', 'mc', 'Beim Sturm bist du draussen. Was meidest du?', 'Bäume, Baugerüste und lose Gegenstände', ['feste Gebäude', 'den Hauseingang']],
    ['verhalten', 'mc', 'Nach der Entwarnung ...?', 'bleibst du trotzdem aufmerksam', ['ist jede Vorsicht unnötig', 'suchst du die Gefahr']],
    ['verhalten', 'mc', 'Warum übt die Schule Verhaltensregeln?', 'damit alle im Ernstfall richtig handeln', ['zum Zeitvertreib', 'weil es Punkte gibt']],
  ],
};

// Temperatur-Rechnungen (1e) und Blitz-Donner-Distanz (1g) werden
// generiert.
export function genTask(rng, stufe) {
  if (stufe.id === '1e' && rng() < 0.45) {
    const morgen = randInt(rng, -5, 10);
    const anstieg = randInt(rng, 3, 12);
    const mittag = morgen + anstieg;
    return {
      kind: 'messwert', type: 'typed',
      expr: `Das Thermometer zeigt am Morgen ${morgen} Grad, am Mittag ${mittag} Grad. Um wie viele Grad ist es wärmer geworden?`,
      answer: String(anstieg),
    };
  }
  if (stufe.id === '1g' && rng() < 0.35) {
    const km = randInt(rng, 1, 5);
    return {
      kind: 'zusammenhang', type: 'typed',
      expr: `Zwischen Blitz und Donner zählst du ${km * 3} Sekunden. Der Schall braucht 3 Sekunden pro Kilometer. Wie viele Kilometer ist das Gewitter entfernt?`,
      answer: String(km),
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
