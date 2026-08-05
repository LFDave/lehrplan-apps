// gen.js — Aufgaben für Rechnerraum. Reine Funktionen ohne DOM. Die
// Grössen-Umrechnungen (f) und die Speicherplatz-Rechnung (k) werden
// generiert und von der e2e-Suite unabhängig nachgerechnet; die
// übrigen Stufen sind gesichertes Grundwissen in festen
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

// Grössen-Umrechnungen (dezimal, Faktor 1000).
export const EINHEITEN = [
  ['Gigabyte', 'Megabyte'], ['Terabyte', 'Gigabyte'], ['Megabyte', 'Kilobyte'],
];

// Pool-Einträge: [kind, 'mc', expr, richtig, [falsch...]] oder
// [kind, 'typed', expr, antwort].
export const POOLS = {
  a: [
    ['bedienung', 'mc', 'Womit startest du ein Programm?', 'mit einem Doppelklick oder Tippen auf das Symbol', ['mit dem Ausschaltknopf', 'mit dem Netzkabel']],
    ['bedienung', 'mc', 'Bevor du das Tablet versorgst ...?', 'beendest du deine Programme', ['wirfst du es ins Fach', 'ziehst du am Kabel']],
    ['bedienung', 'mc', 'Der Ein-/Ausschaltknopf ...?', 'startet das Gerät und schaltet es aus', ['löscht alle Dateien', 'macht das Bild bunter']],
    ['bedienung', 'mc', 'Ein Programm beendest du ...?', 'über Schliessen oder Beenden im Programm', ['indem du den Bildschirm zudeckst', 'mit dem Radiergummi']],
    ['bedienung', 'mc', 'Das Gerät reagiert langsam mit vielen offenen Programmen. Was hilft?', 'nicht gebrauchte Programme schliessen', ['noch mehr Programme öffnen', 'auf den Bildschirm klopfen']],
    ['bedienung', 'mc', 'Die Lautstärke stellst du ein ...?', 'mit den Lautstärketasten oder im Menu', ['mit dem Dateinamen', 'mit dem Passwort']],
    ['bedienung', 'mc', 'Vor dem Ausschalten des Computers ...?', 'speicherst du deine Arbeit', ['löschst du alles', 'entfernst du die Tastatur']],
    ['bedienung', 'mc', 'Mit welcher Funktion machst du einen Schritt rückgängig?', 'mit Rückgängig (Undo)', ['mit Drucken', 'mit Ausschalten']],
  ],
  b: [
    ['login', 'mc', 'Wozu dient dein Login?', 'damit du zu deinen eigenen Dateien kommst', ['zum Spielen ohne Regeln', 'damit das Gerät schneller wird']],
    ['login', 'mc', 'Dein Passwort ...?', 'behältst du für dich', ['schreibst du an die Tafel', 'sagst du allen']],
    ['login', 'mc', 'Nach der Arbeit am Schulcomputer ...?', 'meldest du dich ab', ['lässt du alles offen', 'versteckst du die Maus']],
    ['login', 'mc', 'Ein gutes Passwort ist ...?', 'schwer zu erraten', ['dein Vorname', '1234']],
    ['login', 'mc', 'Jemand kennt dein Passwort. Was machst du?', 'es ändern und der Lehrperson sagen', ['nichts', 'das Gerät verstecken']],
    ['login', 'mc', 'Mit deinem Login in der Lernumgebung siehst du ...?', 'deine eigenen Aufgaben und Ablagen', ['die Post der Lehrperson', 'alle Passwörter']],
    ['login', 'mc', 'Warum hat jedes Kind ein eigenes Login?', 'damit die Arbeiten getrennt bleiben', ['damit es komplizierter ist', 'zum Spass']],
    ['login', 'mc', 'Fremde Logins ...?', 'benutzt man nicht', ['darf man ausprobieren', 'sind Gemeingut']],
  ],
  c: [
    ['ablage', 'mc', 'Du speicherst deine Zeichnung. Wo findest du sie wieder?', 'im Ordner, in dem du sie gespeichert hast', ['nirgends mehr', 'im Papierkorb']],
    ['ablage', 'mc', 'Ein guter Dateiname ...?', 'sagt, was in der Datei ist', ['ist möglichst kurz wie «x»', 'ist eine Zufallszahl']],
    ['ablage', 'mc', 'Ordner helfen dir ...?', 'Dateien zu ordnen und wiederzufinden', ['das Gerät aufzuladen', 'schneller zu tippen']],
    ['ablage', 'mc', 'Das Suchfeld hilft ...?', 'Dateien nach ihrem Namen zu finden', ['neue Dateien zu erfinden', 'das WLAN zu reparieren']],
    ['ablage', 'mc', 'Wohin gehört der Aufsatz über die Ferien?', 'in deinen Ordner, z.B. «Deutsch»', ['auf den Bildschirmhintergrund', 'in den Papierkorb']],
    ['ablage', 'mc', 'Speichern unter ...?', 'legt die Datei mit Namen und Ort ab', ['druckt die Datei', 'löscht die Datei']],
    ['ablage', 'mc', 'Zwei Fassungen eines Textes unterscheidest du ...?', 'mit klaren Namen wie «Aufsatz-V2»', ['gar nicht', 'an der Farbe des Bildschirms']],
    ['ablage', 'mc', 'Du findest eine Datei nicht. Was probierst du zuerst?', 'die Suche mit dem Dateinamen', ['das Gerät wegwerfen', 'alle Dateien löschen']],
  ],
  d: [
    ['oberflaeche', 'mc', 'Ein Fenster kannst du ...?', 'verschieben, verkleinern und schliessen', ['nur anschauen', 'ausdrucken, sonst nichts']],
    ['oberflaeche', 'mc', 'Das Menu eines Programms zeigt ...?', 'die verfügbaren Befehle', ['deine Fotos', 'das Wetter']],
    ['oberflaeche', 'mc', 'Zwei Programme sind offen. Wie wechselst du?', 'über die Taskleiste oder die Fensterübersicht', ['durch Neustart des Geräts', 'gar nicht möglich']],
    ['oberflaeche', 'mc', 'Das X oben im Fenster ...?', 'schliesst das Fenster', ['vergrössert die Schrift', 'macht ein Foto']],
    ['oberflaeche', 'mc', 'Das Symbol mit dem Rechteck neben dem X ...?', 'vergrössert oder verkleinert das Fenster', ['löscht die Datei', 'sperrt das Gerät']],
    ['oberflaeche', 'mc', 'Mehrere Fenster gleichzeitig sind nützlich, um ...?', 'Text von einem Fenster ins andere zu übernehmen', ['das Gerät zu wärmen', 'Strom zu sparen']],
    ['oberflaeche', 'mc', 'Ein Dialogfenster mit «Speichern?» erscheint. Was tust du?', 'lesen und bewusst wählen', ['immer sofort wegklicken', 'das Gerät ausschalten']],
    ['oberflaeche', 'mc', 'Den Mauszeiger steuerst du mit ...?', 'Maus oder Trackpad', ['der Leertaste', 'dem Netzschalter']],
  ],
  e: [
    ['software', 'mc', 'Das Betriebssystem ...?', 'verwaltet das Gerät und startet Programme', ['ist ein Malprogramm', 'ist ein Drucker']],
    ['software', 'mc', 'Beispiele für Betriebssysteme sind ...?', 'Windows, macOS und Android', ['Word und Paint', 'WLAN und USB']],
    ['software', 'mc', 'Ein Malprogramm ist ...?', 'Anwendungssoftware', ['ein Betriebssystem', 'ein Speicher']],
    ['software', 'mc', 'Ohne Betriebssystem ...?', 'startet kein Programm', ['läuft alles schneller', 'druckt der Drucker allein']],
    ['software', 'mc', 'Der Browser zum Surfen ist ...?', 'Anwendungssoftware', ['das Betriebssystem', 'ein Kabel']],
    ['software', 'mc', 'Updates des Betriebssystems ...?', 'beheben Fehler und Sicherheitslücken', ['löschen deine Dateien absichtlich', 'sind Werbung']],
    ['software', 'mc', 'Apps auf dem Tablet sind ...?', 'Anwendungsprogramme', ['Betriebssysteme', 'Bildschirme']],
    ['software', 'mc', 'Wer verteilt die Arbeit an Prozessor und Speicher?', 'das Betriebssystem', ['die Maus', 'das Malprogramm']],
  ],
  f: [
    ['speicher', 'mc', 'Der Hauptspeicher (RAM) ...?', 'vergisst beim Ausschalten alles', ['behält alles für immer', 'ist der Bildschirm']],
    ['speicher', 'mc', 'Die Festplatte ...?', 'behält Daten auch ohne Strom', ['vergisst alles sofort', 'ist nur für Musik']],
    ['speicher', 'mc', 'Flashspeicher wie im USB-Stick ist ...?', 'klein, robust und ohne bewegliche Teile', ['gross wie ein Schrank', 'nur mit Internet nutzbar']],
    ['speicher', 'mc', 'Die grösste dieser Einheiten ist ...?', 'das Terabyte', ['das Kilobyte', 'das Megabyte']],
    ['speicher', 'mc', 'Die Reihenfolge von klein nach gross ist ...?', 'Byte, Kilobyte, Megabyte, Gigabyte', ['Gigabyte, Byte, Megabyte, Kilobyte', 'Megabyte, Byte, Gigabyte, Kilobyte']],
  ],
  g: [
    ['strategie', 'mc', 'Das Programm reagiert nicht mehr. Erster Schritt?', 'kurz warten, dann das Programm neu starten', ['das Gerät sofort wegwerfen', 'auf die Tastatur schlagen']],
    ['strategie', 'mc', 'Wo findest du Erklärungen direkt im Programm?', 'in der Hilfe-Funktion', ['im Papierkorb', 'im Passwortfeld']],
    ['strategie', 'mc', 'Eine Fehlermeldung erscheint. Was ist klug?', 'sie lesen und danach suchen', ['sie sofort wegklicken', 'das Passwort ändern']],
    ['strategie', 'mc', 'Das WLAN fehlt. Was prüfst du zuerst?', 'ob das WLAN am Gerät eingeschaltet ist', ['ob der Drucker Papier hat', 'ob die Maus geladen ist']],
    ['strategie', 'mc', 'Du kommst nicht weiter. Wen oder was fragst du?', 'die Hilfe, eine Recherche oder eine Fachperson', ['niemanden, aufgeben', 'das Gerät selbst']],
    ['strategie', 'mc', 'Ein Neustart hilft oft, weil ...?', 'das System frisch startet', ['er Dateien löscht', 'er das Gerät neu kauft']],
    ['strategie', 'mc', 'Vor dem Ausprobieren einer Lösung ...?', 'speicherst du deine Arbeit', ['löschst du den Ordner', 'entfernst du den Akku']],
    ['strategie', 'mc', 'Der Drucker druckt nicht. Sinnvoll ist ...?', 'Kabel, Papier und Auswahl des Druckers prüfen', ['lauter rufen', 'den Bildschirm putzen']],
  ],
  h: [
    ['schutz', 'mc', 'Wie können Daten verloren gehen?', 'Gerät defekt, versehentlich gelöscht oder verloren', ['nur durch Blitzschlag', 'gar nie']],
    ['schutz', 'mc', 'Der wichtigste Schutz vor Datenverlust ist ...?', 'eine regelmässige Sicherungskopie (Backup)', ['ein schöner Dateiname', 'ein grosser Bildschirm']],
    ['schutz', 'mc', 'Wohin gehört die Sicherungskopie?', 'auf ein zweites Gerät oder in die Cloud', ['in denselben Ordner', 'auf einen Zettel']],
    ['schutz', 'mc', 'Vor dem Löschen einer Datei ...?', 'prüfst du, ob du sie noch brauchst', ['schaltest du das Licht aus', 'änderst du den Namen']],
    ['schutz', 'mc', 'Der Papierkorb ...?', 'gibt gelöschte Dateien oft noch zurück', ['verbrennt Dateien sofort', 'ist ein Spiel']],
    ['schutz', 'mc', 'Ein USB-Stick geht schnell verloren. Darum ...?', 'hat man wichtige Daten auch anderswo gesichert', ['speichert man alles nur dort', 'braucht man keinen Namen']],
    ['schutz', 'mc', 'Automatische Sicherungen (z.B. in der Cloud) ...?', 'sichern laufend im Hintergrund', ['verbrauchen Papier', 'löschen den Papierkorb']],
    ['schutz', 'mc', 'Das Gerät geht kaputt, die Daten sind gerettet. Warum?', 'weil ein Backup bestand', ['weil das Gerät neu war', 'aus Zufall']],
  ],
  i: [
    ['suche', 'mc', 'Wie findet eine Suchmaschine Webseiten?', 'Programme (Crawler) bauen laufend einen Index auf', ['Menschen lesen alles live vor', 'sie rät zufällig']],
    ['suche', 'mc', 'Die Reihenfolge der Treffer bestimmt ...?', 'ein Programm nach festgelegten Regeln', ['das Alphabet allein', 'die Tageszeit']],
    ['suche', 'mc', 'Gute Suchwörter sind ...?', 'kurz und treffend', ['ganze Aufsätze', 'nur ein Buchstabe']],
    ['suche', 'mc', 'Der oberste Treffer ist ...?', 'nicht automatisch der beste', ['immer die Wahrheit', 'immer Werbung']],
    ['suche', 'mc', 'Als Werbung markierte Treffer sind ...?', 'bezahlte Einträge', ['die besten Antworten', 'Fehler']],
    ['suche', 'mc', 'Der Index einer Suchmaschine ist ...?', 'ein riesiges Verzeichnis von Webseiten', ['ein Drucker', 'eine Webcam']],
    ['suche', 'mc', 'Zwei Suchmaschinen liefern verschiedene Treffer, weil ...?', 'sie verschiedene Regeln und Indexe haben', ['eine davon kaputt ist', 'das Internet zweimal existiert']],
    ['suche', 'mc', 'Wie prüfst du einen Treffer?', 'Quelle anschauen und vergleichen', ['sofort glauben', 'nur das Bild anschauen']],
  ],
  j: [
    ['ortewahl', 'mc', 'Eine Datei nur auf deinem Gerät ist ...?', 'lokal gespeichert', ['im Internet für alle', 'verloren']],
    ['ortewahl', 'mc', 'Die Cloud ist ...?', 'Speicher auf Computern im Internet', ['eine Wolke am Himmel', 'ein USB-Stick']],
    ['ortewahl', 'mc', 'Dateien im Schulnetzwerk ...?', 'erreichst du von allen Schulcomputern', ['sind für die ganze Welt sichtbar', 'löschen sich täglich']],
    ['ortewahl', 'mc', 'Was du öffentlich ins Internet stellst ...?', 'können viele Menschen sehen und kopieren', ['sieht niemand', 'verschwindet nach einer Stunde']],
    ['ortewahl', 'mc', 'Private Daten gehören ...?', 'an geschützte Orte mit Login', ['auf öffentliche Seiten', 'in fremde Ordner']],
    ['ortewahl', 'mc', 'Ohne Internet erreichst du ...?', 'nur lokal gespeicherte Dateien', ['die Cloud', 'alle Webseiten']],
    ['ortewahl', 'mc', 'Ein geteilter Ordner in der Lernumgebung ...?', 'ist für die Gruppe sichtbar', ['gehört nur dir', 'ist öffentlich im Web']],
    ['ortewahl', 'mc', 'Warum überlegst du vor dem Hochladen?', 'weil Kopien im Netz bleiben können', ['weil Hochladen Geld kostet', 'weil es verboten ist']],
  ],
  k: [
    ['leistung', 'mc', 'Mehr Megapixel bei der Kamera heisst ...?', 'mehr Bildpunkte, feineres Bild', ['bessere Musik', 'längere Akkulaufzeit']],
    ['leistung', 'mc', 'Die Datenübertragungsrate sagt ...?', 'wie schnell Daten übertragen werden', ['wie gross der Bildschirm ist', 'wie alt das Gerät ist']],
    ['leistung', 'mc', 'Für viele lange Videos brauchst du vor allem ...?', 'viel Speicherplatz', ['eine lautere Musik', 'mehr Tasten']],
    ['leistung', 'mc', 'Die Rechenleistung steckt im ...?', 'Prozessor', ['Lautsprecher', 'Netzkabel']],
    ['leistung', 'mc', 'Videos ruckeln beim Streamen. Woran liegt es oft?', 'an einer langsamen Übertragungsrate', ['an der Tastatur', 'am Dateinamen']],
  ],
  l: [
    ['eva', 'mc', 'Die Tastatur ist ein ...?', 'Eingabegerät', ['Ausgabegerät', 'Speicher']],
    ['eva', 'mc', 'Der Bildschirm ist ein ...?', 'Ausgabegerät', ['Eingabegerät', 'Prozessor']],
    ['eva', 'mc', 'Der Prozessor ...?', 'verarbeitet die Daten', ['druckt die Daten', 'kühlt das Gerät']],
    ['eva', 'mc', 'Der Sensor entspricht beim Menschen ...?', 'den Sinnesorganen', ['den Muskeln', 'den Haaren']],
    ['eva', 'mc', 'Der Aktor entspricht beim Menschen ...?', 'den Muskeln', ['den Augen', 'den Ohren']],
    ['eva', 'mc', 'Der Speicher entspricht beim Menschen ...?', 'dem Gedächtnis', ['der Nase', 'den Füssen']],
    ['eva', 'mc', 'WWW und E-Mail sind ...?', 'Dienste, die das Internet nutzen', ['dasselbe wie das Internet', 'Geräte']],
    ['eva', 'mc', 'Das Internet selbst ist ...?', 'die Infrastruktur, ein Netz aus Netzen', ['eine einzige Webseite', 'ein Programm auf deinem Gerät']],
    ['eva', 'mc', 'Das Mikrofon ist ein ...?', 'Eingabegerät', ['Ausgabegerät', 'Prozessor']],
  ],
};

// Grössen-Umrechnungen (f) und Speicherplatz-Rechnung (k) werden
// generiert.
export function genTask(rng, stufe) {
  if (stufe.id === 'f' && rng() < 0.45) {
    const [gross, klein] = pick(rng, EINHEITEN);
    const n = randInt(rng, 1, 9);
    return {
      kind: 'speicher', type: 'typed',
      expr: `Wie viele ${klein} sind ${n} ${gross}? (1 ${gross} = 1000 ${klein})`,
      answer: String(n * 1000),
    };
  }
  if (stufe.id === 'k' && rng() < 0.4) {
    const proFoto = pick(rng, [2, 4, 5, 8]);
    const anzahl = pick(rng, [100, 200, 500]);
    return {
      kind: 'leistung', type: 'typed',
      expr: `Ein Foto braucht ${proFoto} Megabyte Speicher. Wie viele solche Fotos passen auf einen Speicher mit ${proFoto * anzahl} Megabyte?`,
      answer: String(anzahl),
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
