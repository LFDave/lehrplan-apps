// gen.js — Aufgaben für Nordpfeil. Reine Funktionen ohne DOM.
// Massstab, Planmass und Himmelsrichtungen werden generiert und von
// der e2e-Suite unabhängig nachgerechnet (eigene Richtungs-Tabelle,
// eigene Massstab-Umrechnung). Die übrigen Stufen sind feste
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

// Die vier Haupt- und vier Zwischenrichtungen im Uhrzeigersinn.
export const RICHTUNGEN = ['Norden', 'Nordosten', 'Osten', 'Südosten', 'Süden', 'Südwesten', 'Westen', 'Nordwesten'];
const HAUPT = ['Norden', 'Osten', 'Süden', 'Westen'];

// Massstäbe mit Metern pro Zentimeter auf der Karte.
const MASSSTAEBE = [
  ["1'000", 10],
  ["5'000", 50],
  ["10'000", 100],
  ["25'000", 250],
];

// Pool-Einträge: [kind, 'mc', expr, richtig, [falsch...]] oder
// [kind, 'typed', expr, antwort].
export const POOLS = {
  a: [
    ['weg', 'mc', 'Du beschreibst deinen Schulweg. Was hilft der zuhörenden Person am meisten?', 'Merkpunkte wie Brunnen oder Bäckerei nennen', ['gar nichts sagen', 'nur «weit weg» sagen']],
    ['weg', 'mc', '«Beim roten Haus nach links» ist ein Beispiel für ...?', 'einen Merkpunkt mit Richtung', ['eine Hausnummer', 'einen Fahrplan']],
    ['weg', 'mc', 'Was gehört in eine gute Wegbeschreibung?', 'Reihenfolge, Richtungen und Merkpunkte', ['nur die Farbe der Häuser', 'das Wetter von gestern']],
    ['weg', 'mc', 'Du erklärst den Weg zum Turnplatz. Womit beginnst du?', 'beim Startpunkt', ['beim Ziel', 'irgendwo in der Mitte']],
    ['weg', 'mc', 'Welche Angabe ist am genauesten?', '«nach der Post rechts abbiegen»', ['«irgendwo dort drüben»', '«ziemlich weit weg»']],
    ['weg', 'mc', 'Wozu merkst du dir Merkpunkte auf dem Weg?', 'um den Weg wiederzuerkennen', ['um schneller zu rennen', 'für die Hausaufgaben']],
    ['weg', 'mc', 'Auf dem Schulweg kommst du zuerst am Brunnen vorbei, dann an der Bäckerei. Was kommt zuerst?', 'der Brunnen', ['die Bäckerei', 'das Schulhaus']],
    ['weg', 'mc', 'Welcher Satz beschreibt einen Weg?', '«Geradeaus bis zur Linde, dann rechts.»', ['«Ich mag Glace.»', '«Morgen regnet es.»']],
    ['weg', 'mc', 'Du beschreibst den gleichen Weg zurück. Was ändert sich?', 'aus links wird rechts', ['gar nichts', 'die Häuser stehen woanders']],
  ],
  b: [
    ['verkehr', 'mc', 'Wo gehst du zu Fuss, wenn es ein Trottoir hat?', 'auf dem Trottoir', ['auf der Strasse', 'auf dem Velostreifen']],
    ['verkehr', 'mc', 'Was machst du vor dem Überqueren der Strasse?', 'warten, schauen, horchen, dann gehen', ['sofort losrennen', 'die Augen schliessen']],
    ['verkehr', 'mc', 'Wo überquerst du die Strasse am sichersten?', 'am Fussgängerstreifen', ['zwischen parkierten Autos', 'in der Kurve']],
    ['verkehr', 'mc', 'Die Ampel zeigt Rot. Was machst du?', 'warten, bis es grün wird', ['schnell hinüberrennen', 'die Ampel ignorieren']],
    ['verkehr', 'mc', 'Warum ist helle Kleidung im Dunkeln wichtig?', 'damit dich die Fahrzeuge früh sehen', ['weil sie wärmer ist', 'weil sie schneller macht']],
    ['verkehr', 'mc', 'Eine Stelle ohne Trottoir und mit viel Verkehr ist ...?', 'eine unsichere Stelle', ['eine sichere Stelle', 'ein Spielplatz']],
    ['verkehr', 'mc', 'Ein Fussgängerstreifen mit Ampel ist ...?', 'eine sichere Stelle', ['eine unsichere Stelle', 'verboten']],
    ['verkehr', 'mc', 'Der Ball rollt auf die Strasse. Was machst du?', 'stehen bleiben und zuerst schauen', ['sofort hinterherrennen', 'die Augen zuhalten']],
    ['verkehr', 'mc', 'Hinter dem parkierten Auto siehst du die Strasse schlecht. Was ist das?', 'eine unsichere Stelle', ['eine sichere Stelle', 'ein guter Spielort']],
  ],
  c: [
    ['lagebezug', 'mc', 'Auf der Schatzkarte: «3 Schritte vom Baum zum Brunnen, dann 2 Schritte zum Stein.» Wo beginnst du?', 'beim Baum', ['beim Stein', 'beim Brunnen']],
    ['lagebezug', 'mc', 'Der Turnplatz liegt hinter dem Schulhaus. Du stehst vor dem Schulhaus. Siehst du den Turnplatz?', 'Nein, das Schulhaus ist davor', ['Ja, er liegt direkt vor mir']],
    ['lagebezug', 'mc', 'Auf dem Schulplan ist ein Bild von einer Rutschbahn. Was findest du an dieser Stelle?', 'die Rutschbahn', ['die Bibliothek', 'gar nichts']],
    ['lagebezug', 'mc', 'Was zeigt dir eine Schatzkarte?', 'wo etwas liegt und wie du hinkommst', ['wie spät es ist', 'was es zum Zmittag gibt']],
    ['lagebezug', 'mc', 'Das Piktogramm mit dem Buch zeigt auf dem Schulplan ...?', 'die Bibliothek', ['den Turnplatz', 'die Küche']],
    ['lagebezug', 'mc', 'Lisa sitzt zwischen Ben und Mia. Wer sitzt in der Mitte?', 'Lisa', ['Ben', 'Mia']],
    ['lagebezug', 'mc', 'Du gehst geradeaus, drehst dich dann zweimal nach links. Schaust du noch in die gleiche Richtung wie am Anfang?', 'Nein, ich schaue in die Gegenrichtung', ['Ja, in die gleiche Richtung']],
    ['lagebezug', 'mc', 'Der Schatz liegt laut Karte unter dem grossen Baum. Wo gräbst du?', 'unter dem grossen Baum', ['neben dem Brunnen', 'hinter dem Haus']],
    ['lagebezug', 'mc', 'Auf dem Plan ist der Sandkasten neben der Schaukel. Was hilft dir beim Suchen?', 'zuerst die Schaukel finden', ['den Plan wegwerfen', 'die Augen schliessen']],
  ],
  d: [
    ['plan', 'mc', 'Ein Plan zeigt das Zimmer ...?', 'von oben', ['von der Seite', 'von unten']],
    ['plan', 'mc', 'Wie nennt man den Blick von oben?', 'die Vogelperspektive', ['die Froschperspektive', 'die Seitenansicht']],
    ['plan', 'mc', 'Was gehört in eine Skizze vom Schulzimmer?', 'die wichtigen Dinge wie Tische und Türe', ['jedes einzelne Blatt Papier', 'die Farbe der Socken']],
    ['plan', 'mc', 'Warum zeichnet man einen Plan einfach und klar?', 'damit andere ihn schnell verstehen', ['damit er schön bunt ist', 'damit niemand ihn lesen kann']],
    ['plan', 'mc', 'Im Plan vom Zimmer ist das Bett ein Rechteck. Warum?', 'von oben sieht das Bett so aus', ['Betten sind immer Rechtecke', 'das ist ein Fehler im Plan']],
    ['plan', 'mc', 'Du erklärst deinen Sitzplatz mit einer Skizze. Was zeichnest du zuerst?', 'den Umriss des Zimmers', ['die Blumen auf dem Fensterbrett', 'dein Lieblingsbuch']],
    ['plan', 'mc', 'Was fehlt auf einer guten Zimmer-Skizze sicher nicht?', 'die Türe', ['die Zahnbürste', 'das Kissenmuster']],
    ['plan', 'mc', 'Dein Freund findet dank deiner Skizze den Weg. Wie war die Skizze?', 'klar und verständlich', ['möglichst kompliziert', 'ohne die wichtigen Dinge']],
    ['plan', 'mc', 'Ein runder Tisch sieht im Plan von oben aus wie ...?', 'ein Kreis', ['ein Dreieck', 'eine Linie']],
  ],
  e: [
    ['signatur', 'mc', 'Auf der Karte ist ein See eingezeichnet. Welche Farbe hat er?', 'Blau', ['Rot', 'Braun']],
    ['signatur', 'mc', 'Was bedeutet Grün auf der Karte meistens?', 'Wald oder Wiese', ['Wasser', 'Strassen']],
    ['signatur', 'mc', 'Was zeigen die braunen Linien auf der Wanderkarte?', 'die Höhenkurven', ['die Flüsse', 'die Zugstrecken']],
    ['signatur', 'mc', 'Was ist eine Signatur auf der Karte?', 'ein Zeichen für ein Objekt', ['eine Unterschrift', 'ein Foto']],
    ['signatur', 'mc', 'Wo erfährst du, was die Zeichen auf der Karte bedeuten?', 'in der Legende', ['im Wörterbuch', 'auf der Rückseite']],
  ],
  f: [
    ['planmass', 'mc', 'Was heisst «massstabsgetreu zeichnen»?', 'alle Längen im gleichen Verhältnis verkleinern', ['alles beliebig gross zeichnen', 'nur die Farben übernehmen']],
    ['planmass', 'mc', 'Im Plan ist der Tisch grösser als das Zimmer. Was stimmt nicht?', 'die Grössenverhältnisse', ['die Farbe des Tischs', 'der Name des Zimmers']],
    ['planmass', 'mc', 'Das grössere Zimmer erscheint im massstabsgetreuen Plan ...?', 'auch grösser', ['kleiner', 'gleich gross wie alle anderen']],
  ],
  g: [
    ['oev', 'mc', 'Was liest du im Fahrplan ab?', 'wann Bus oder Zug fahren', ['was es zum Zmittag gibt', 'wie das Wetter wird']],
    ['oev', 'typed', 'Der Zug fährt um 09:00 Uhr ab und kommt um 09:45 Uhr an. Wie viele Minuten dauert die Fahrt?', '45'],
    ['oev', 'typed', 'Der Bus fährt alle 10 Minuten. Einer ist dir gerade davongefahren. Wie viele Minuten wartest du höchstens auf den nächsten?', '10'],
    ['oev', 'mc', 'Was gehört zur Sicherheit auf dem Velo?', 'ein Helm und funktionierende Bremsen', ['laute Musik', 'freihändig fahren']],
    ['oev', 'mc', 'Was machst du vor dem Abbiegen mit dem Velo?', 'zurückschauen und mit dem Arm zeigen', ['die Augen schliessen', 'schneller fahren']],
    ['oev', 'mc', 'Du steigst am Bahnhof um. Was suchst du?', 'das richtige Gleis für den Anschlusszug', ['den längsten Zug', 'den Kiosk mit Glace']],
    ['oev', 'mc', 'Welches Licht braucht dein Velo im Dunkeln?', 'vorne weiss, hinten rot', ['vorne rot, hinten weiss', 'gar kein Licht']],
    ['oev', 'mc', 'Was ist im Bus während der Fahrt am sichersten?', 'sitzen oder sich gut festhalten', ['herumrennen', 'auf dem Sitz stehen']],
    ['oev', 'mc', 'Wo wartest du auf den Bus?', 'an der Haltestelle hinter der weissen Linie', ['auf der Strasse', 'zwischen den Autos']],
  ],
  h: [
    ['karte', 'mc', 'Du suchst eine Strasse in der Stadt. Welches Hilfsmittel passt?', 'der Ortsplan', ['der Fahrplan', 'das Wörterbuch']],
    ['karte', 'mc', 'Auf der topographischen Karte liegen die Höhenkurven eng beieinander. Was heisst das?', 'das Gelände ist steil', ['das Gelände ist flach', 'dort hat es einen See']],
    ['karte', 'mc', 'Die Höhenkurven liegen weit auseinander. Was heisst das?', 'das Gelände ist flach', ['das Gelände ist steil', 'dort hat es viele Häuser']],
    ['karte', 'mc', 'Was zeigt der Verkehrsnetzplan?', 'die Linien von Bus, Tram und Zug', ['die Höhe der Berge', 'die Namen aller Kinder']],
    ['karte', 'mc', 'Auf fast allen Karten ist Norden ...?', 'oben', ['unten', 'links']],
    ['karte', 'mc', 'Auf der Karte ist Norden oben. Welche Himmelsrichtung ist rechts?', 'Osten', ['Westen', 'Süden']],
    ['karte', 'mc', 'Auf der Karte ist Norden oben. Welche Himmelsrichtung ist unten?', 'Süden', ['Norden', 'Osten']],
    ['karte', 'mc', 'Du willst wandern und die Steigung kennen. Welche Karte hilft?', 'die topographische Karte', ['der Verkehrsnetzplan', 'der Stundenplan']],
  ],
  i: [
    ['kompass', 'mc', 'Wohin zeigt die Kompassnadel?', 'nach Norden', ['nach Süden', 'zum nächsten Haus']],
    ['kompass', 'mc', 'Was bestimmt das GPS?', 'deinen Standort', ['das Wetter', 'deine Laune']],
    ['kompass', 'mc', 'Was liest du in der Legende ab?', 'die Bedeutung der Kartenzeichen', ['die Öffnungszeiten', 'die Temperatur']],
    ['kompass', 'mc', 'Karte und Gelände sollen übereinstimmen. Was machst du mit der Karte?', 'sie nach Norden ausrichten', ['sie zusammenfalten', 'sie umdrehen']],
  ],
};

// Massstab (e), Planmass (f), Richtung (h) und Kompass (i) werden
// generiert.
export function genTask(rng, stufe) {
  if (stufe.id === 'e' && rng() < 0.45) {
    const [label, perCm] = pick(rng, MASSSTAEBE);
    const cm = perCm === 250 ? randInt(rng, 2, 3) : randInt(rng, 2, 9);
    return {
      kind: 'massstab', type: 'typed',
      expr: `Karte im Massstab 1:${label}: 1 Zentimeter auf der Karte ist ${perCm} Meter in Wirklichkeit. Du misst ${cm} Zentimeter. Wie viele Meter sind das in Wirklichkeit?`,
      answer: String(perCm * cm),
    };
  }
  if (stufe.id === 'f' && rng() < 0.6) {
    const scale = pick(rng, [100, 50]);
    const L = randInt(rng, 2, 9);
    const perM = 100 / scale;
    const zuText = perM === 1 ? '1 Zentimeter' : `${perM} Zentimetern`;
    return {
      kind: 'planmass', type: 'typed',
      expr: `Plan im Massstab 1:${scale}: 1 Meter im Zimmer wird im Plan zu ${zuText}. Das Zimmer ist ${L} Meter lang. Wie viele Zentimeter sind das im Plan?`,
      answer: String(perM * L),
    };
  }
  if (stufe.id === 'h' && rng() < 0.35) {
    const dir = pick(rng, HAUPT);
    const gegen = RICHTUNGEN[(RICHTUNGEN.indexOf(dir) + 4) % 8];
    const wrong = shuffled(rng, RICHTUNGEN.filter((r) => r !== dir && r !== gegen)).slice(0, 2);
    return {
      kind: 'richtung', type: 'mc',
      expr: `Du schaust nach ${dir}. Welche Himmelsrichtung liegt genau hinter dir?`,
      ...buildMc(rng, gegen, wrong),
    };
  }
  if (stufe.id === 'i' && rng() < 0.55) {
    if (rng() < 0.5) {
      const dir = pick(rng, RICHTUNGEN);
      const gegen = RICHTUNGEN[(RICHTUNGEN.indexOf(dir) + 4) % 8];
      const wrong = shuffled(rng, RICHTUNGEN.filter((r) => r !== dir && r !== gegen)).slice(0, 2);
      return {
        kind: 'kompass', type: 'mc',
        expr: `Welche Himmelsrichtung ist das Gegenteil von ${dir}?`,
        ...buildMc(rng, gegen, wrong),
      };
    }
    const dir = pick(rng, HAUPT);
    const rechts = rng() < 0.5;
    const idx = HAUPT.indexOf(dir);
    const neu = HAUPT[(idx + (rechts ? 1 : 3)) % 4];
    const wrong = shuffled(rng, HAUPT.filter((r) => r !== dir && r !== neu)).slice(0, 2);
    return {
      kind: 'kompass', type: 'mc',
      expr: `Du schaust nach ${dir} und drehst dich eine Vierteldrehung nach ${rechts ? 'rechts' : 'links'}. Wohin schaust du jetzt?`,
      ...buildMc(rng, neu, wrong),
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
