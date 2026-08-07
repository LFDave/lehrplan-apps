// e2e.test.mjs — Playwright end-to-end tests for Rechnerraum.
//
// Run:
//   cd rechnerraum/tests && npm install && node e2e.test.mjs
//
// Part 1 exercises the pure generators with a seeded RNG and checks
// every task against an independent oracle (unabhängig neu
// aufgeschriebene Antwort-Tabellen und eigene Nachrechnungen).
// Part 2 drives the real app in Chromium. Screenshots land in
// tests/screenshots/ (gitignored).

import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { mkdirSync, existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { STUFEN } from "../data.js?v=1";
import { genRound } from "../gen.js?v=1";
import { LEVELS, MEDALS, roundXp } from "../game.js?v=1";
import { STRINGS } from "../strings.js?v=1";

const TESTS_DIR = dirname(fileURLToPath(import.meta.url));
const APP_DIR = join(TESTS_DIR, "..");
const SHOTS_DIR = join(TESTS_DIR, "screenshots");
const PORT = 8545;
const URL = `http://localhost:${PORT}/index.html`;

const CHROMIUM = process.env.CHROMIUM_PATH
  || (existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined);

let failures = 0;
function check(name, condition, detail = "") {
  const ok = Boolean(condition);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok || !detail ? "" : ` — ${detail}`}`);
  if (!ok) failures++;
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ── Independent oracle ───────────────────────────────────────────── */

// Unabhängige Nachrechnung: eigene Einheiten-Umrechnung (Faktor
// 1000) und Speicherplatz-Division, dazu eine neu aufgeschriebene
// Antwort-Tabelle für das Systemwissen.
const QA = {
  "Womit startest du ein Programm?": "mit einem Doppelklick oder Tippen auf das Symbol",
  "Bevor du das Tablet versorgst ...?": "beendest du deine Programme",
  "Der Ein-/Ausschaltknopf ...?": "startet das Gerät und schaltet es aus",
  "Ein Programm beendest du ...?": "über Schliessen oder Beenden im Programm",
  "Das Gerät reagiert langsam mit vielen offenen Programmen. Was hilft?": "nicht gebrauchte Programme schliessen",
  "Die Lautstärke stellst du ein ...?": "mit den Lautstärketasten oder im Menu",
  "Vor dem Ausschalten des Computers ...?": "speicherst du deine Arbeit",
  "Mit welcher Funktion machst du einen Schritt rückgängig?": "mit Rückgängig (Undo)",
  "Wozu dient dein Login?": "damit du zu deinen eigenen Dateien kommst",
  "Dein Passwort ...?": "behältst du für dich",
  "Nach der Arbeit am Schulcomputer ...?": "meldest du dich ab",
  "Ein gutes Passwort ist ...?": "schwer zu erraten",
  "Jemand kennt dein Passwort. Was machst du?": "es ändern und der Lehrperson sagen",
  "Mit deinem Login in der Lernumgebung siehst du ...?": "deine eigenen Aufgaben und Ablagen",
  "Warum hat jedes Kind ein eigenes Login?": "damit die Arbeiten getrennt bleiben",
  "Fremde Logins ...?": "benutzt man nicht",
  "Du speicherst deine Zeichnung. Wo findest du sie wieder?": "im Ordner, in dem du sie gespeichert hast",
  "Ein guter Dateiname ...?": "sagt, was in der Datei ist",
  "Ordner helfen dir ...?": "Dateien zu ordnen und wiederzufinden",
  "Das Suchfeld hilft ...?": "Dateien nach ihrem Namen zu finden",
  "Wohin gehört der Aufsatz über die Ferien?": "in deinen Ordner, z.B. «Deutsch»",
  "Speichern unter ...?": "legt die Datei mit Namen und Ort ab",
  "Zwei Fassungen eines Textes unterscheidest du ...?": "mit klaren Namen wie «Aufsatz-V2»",
  "Du findest eine Datei nicht. Was probierst du zuerst?": "die Suche mit dem Dateinamen",
  "Ein Fenster kannst du ...?": "verschieben, verkleinern und schliessen",
  "Das Menu eines Programms zeigt ...?": "die verfügbaren Befehle",
  "Zwei Programme sind offen. Wie wechselst du?": "über die Taskleiste oder die Fensterübersicht",
  "Das X oben im Fenster ...?": "schliesst das Fenster",
  "Das Symbol mit dem Rechteck neben dem X ...?": "vergrössert oder verkleinert das Fenster",
  "Mehrere Fenster gleichzeitig sind nützlich, um ...?": "Text von einem Fenster ins andere zu übernehmen",
  "Ein Dialogfenster mit «Speichern?» erscheint. Was tust du?": "lesen und bewusst wählen",
  "Den Mauszeiger steuerst du mit ...?": "Maus oder Trackpad",
  "Das Betriebssystem ...?": "verwaltet das Gerät und startet Programme",
  "Beispiele für Betriebssysteme sind ...?": "Windows, macOS und Android",
  "Ein Malprogramm ist ...?": "Anwendungssoftware",
  "Ohne Betriebssystem ...?": "startet kein Programm",
  "Der Browser zum Surfen ist ...?": "Anwendungssoftware",
  "Updates des Betriebssystems ...?": "beheben Fehler und Sicherheitslücken",
  "Apps auf dem Tablet sind ...?": "Anwendungsprogramme",
  "Wer verteilt die Arbeit an Prozessor und Speicher?": "das Betriebssystem",
  "Der Hauptspeicher (RAM) ...?": "vergisst beim Ausschalten alles",
  "Die Festplatte ...?": "behält Daten auch ohne Strom",
  "Flashspeicher wie im USB-Stick ist ...?": "klein, robust und ohne bewegliche Teile",
  "Die grösste dieser Einheiten ist ...?": "das Terabyte",
  "Die Reihenfolge von klein nach gross ist ...?": "Byte, Kilobyte, Megabyte, Gigabyte",
  "Das Programm reagiert nicht mehr. Erster Schritt?": "kurz warten, dann das Programm neu starten",
  "Wo findest du Erklärungen direkt im Programm?": "in der Hilfe-Funktion",
  "Eine Fehlermeldung erscheint. Was ist klug?": "sie lesen und danach suchen",
  "Das WLAN fehlt. Was prüfst du zuerst?": "ob das WLAN am Gerät eingeschaltet ist",
  "Du kommst nicht weiter. Wen oder was fragst du?": "die Hilfe, eine Recherche oder eine Fachperson",
  "Ein Neustart hilft oft, weil ...?": "das System frisch startet",
  "Vor dem Ausprobieren einer Lösung ...?": "speicherst du deine Arbeit",
  "Der Drucker druckt nicht. Sinnvoll ist ...?": "Kabel, Papier und Auswahl des Druckers prüfen",
  "Wie können Daten verloren gehen?": "Gerät defekt, versehentlich gelöscht oder verloren",
  "Der wichtigste Schutz vor Datenverlust ist ...?": "eine regelmässige Sicherungskopie (Backup)",
  "Wohin gehört die Sicherungskopie?": "auf ein zweites Gerät oder in die Cloud",
  "Vor dem Löschen einer Datei ...?": "prüfst du, ob du sie noch brauchst",
  "Der Papierkorb ...?": "gibt gelöschte Dateien oft noch zurück",
  "Ein USB-Stick geht schnell verloren. Darum ...?": "hat man wichtige Daten auch anderswo gesichert",
  "Automatische Sicherungen (z.B. in der Cloud) ...?": "sichern laufend im Hintergrund",
  "Das Gerät geht kaputt, die Daten sind gerettet. Warum?": "weil ein Backup bestand",
  "Wie findet eine Suchmaschine Webseiten?": "Programme (Crawler) bauen laufend einen Index auf",
  "Die Reihenfolge der Treffer bestimmt ...?": "ein Programm nach festgelegten Regeln",
  "Gute Suchwörter sind ...?": "kurz und treffend",
  "Der oberste Treffer ist ...?": "nicht automatisch der beste",
  "Als Werbung markierte Treffer sind ...?": "bezahlte Einträge",
  "Der Index einer Suchmaschine ist ...?": "ein riesiges Verzeichnis von Webseiten",
  "Zwei Suchmaschinen liefern verschiedene Treffer, weil ...?": "sie verschiedene Regeln und Indexe haben",
  "Wie prüfst du einen Treffer?": "Quelle anschauen und vergleichen",
  "Eine Datei nur auf deinem Gerät ist ...?": "lokal gespeichert",
  "Die Cloud ist ...?": "Speicher auf Computern im Internet",
  "Dateien im Schulnetzwerk ...?": "erreichst du von allen Schulcomputern",
  "Was du öffentlich ins Internet stellst ...?": "können viele Menschen sehen und kopieren",
  "Private Daten gehören ...?": "an geschützte Orte mit Login",
  "Ohne Internet erreichst du ...?": "nur lokal gespeicherte Dateien",
  "Ein geteilter Ordner in der Lernumgebung ...?": "ist für die Gruppe sichtbar",
  "Warum überlegst du vor dem Hochladen?": "weil Kopien im Netz bleiben können",
  "Mehr Megapixel bei der Kamera heisst ...?": "mehr Bildpunkte, feineres Bild",
  "Die Datenübertragungsrate sagt ...?": "wie schnell Daten übertragen werden",
  "Für viele lange Videos brauchst du vor allem ...?": "viel Speicherplatz",
  "Die Rechenleistung steckt im ...?": "Prozessor",
  "Videos ruckeln beim Streamen. Woran liegt es oft?": "an einer langsamen Übertragungsrate",
  "Die Tastatur ist ein ...?": "Eingabegerät",
  "Der Bildschirm ist ein ...?": "Ausgabegerät",
  "Der Prozessor ...?": "verarbeitet die Daten",
  "Der Sensor entspricht beim Menschen ...?": "den Sinnesorganen",
  "Der Aktor entspricht beim Menschen ...?": "den Muskeln",
  "Der Speicher entspricht beim Menschen ...?": "dem Gedächtnis",
  "WWW und E-Mail sind ...?": "Dienste, die das Internet nutzen",
  "Das Internet selbst ist ...?": "die Infrastruktur, ein Netz aus Netzen",
  "Das Mikrofon ist ein ...?": "Eingabegerät",
};

function solveTyped(expr) {
  let m;
  if ((m = expr.match(/^Wie viele \S+ sind (\d+) \S+\? \(1 \S+ = 1000 \S+\)$/))) {
    return String(Number(m[1]) * 1000);
  }
  if ((m = expr.match(/^Ein Foto braucht (\d+) Megabyte Speicher\. Wie viele solche Fotos passen auf einen Speicher mit (\d+) Megabyte\?$/))) {
    return String(Number(m[2]) / Number(m[1]));
  }
  return QA[expr] ?? null;
}

function chooseOption(expr, options) {
  return expr in QA ? options.indexOf(QA[expr]) : -1;
}

/* ── Cache-busting version consistency ────────────────────────────── */
{
  const sources = [
    ["index.html", readFileSync(join(APP_DIR, "index.html"), "utf8")],
    ["styles.css", readFileSync(join(APP_DIR, "styles.css"), "utf8")],
    ...readdirSync(APP_DIR).filter((f) => f.endsWith(".js"))
      .map((f) => [f, readFileSync(join(APP_DIR, f), "utf8")]),
  ];
  const versions = new Set();
  const unversioned = [];
  for (const [file, text] of sources) {
    const refs = [...text.matchAll(/(?:href="[^"]+?|src="[^"]+?|from '\.\/[^']+?|url\('fonts\/[^']+?)(\?v=(\d+))?["')]/g)];
    for (const m of refs) {
      if (m[0].includes("http") || m[0].includes('"#') || m[0].includes("${") || m[0].includes("../")) continue;
      if (m[2]) versions.add(m[2]);
      else unversioned.push(`${file}: ${m[0]}`);
    }
  }
  check("cache-busting: every local asset ref carries ?v=", unversioned.length === 0, unversioned.join("; "));
  check("cache-busting: one single version everywhere", versions.size === 1, [...versions].join(","));
}

/* ── Data and copy sanity ─────────────────────────────────────────── */
{
  check("data: 12 Stufen a-l", STUFEN.length === 12 && STUFEN.map((s) => s.id).join("") === "abcdefghijkl");
  check("data: GA marks on c and h",
    STUFEN.filter((s) => s.ga).map((s) => s.id).join(",") === "c,h");
  const eszett = [];
  for (const [id, v] of Object.entries(STRINGS.de)) if (v.includes("ß")) eszett.push(id);
  for (const s of STUFEN) if ((s.title + s.desc).includes("ß")) eszett.push(s.id);
  for (const m of MEDALS) if ((m.name + m.desc).includes("ß")) eszett.push(m.key);
  check("copy: Swiss standard German, no ß anywhere", eszett.length === 0, eszett.join(","));
  check("game: second level reachable within a first session", LEVELS[1].xp <= 3 * roundXp("a", 8));
}

/* ── Generator sanity against the oracle (seeded) ─────────────────── */
{
  const issues = [];
  for (const stufe of STUFEN) {
    const rng = mulberry32(75 + stufe.id.split("").reduce((n, ch, i) => n + ch.charCodeAt(0) * (i + 1), 0));
    for (let r = 0; r < 50; r++) {
      const round = genRound(rng, stufe, 8);
      if (round.length !== 8) issues.push(`${stufe.id}: round has only ${round.length} tasks`);
      for (const task of round) {
        if (task.type === "typed") {
          const oracle = solveTyped(task.expr);
          if (oracle !== task.answer) {
            issues.push(`${stufe.id}/${task.kind}: ${task.expr} → app "${task.answer}", oracle "${oracle}"`);
          }
        } else {
          if (new Set(task.options).size !== task.options.length) {
            issues.push(`${stufe.id}/${task.kind}: duplicate options for ${task.expr}`);
          }
          const idx = chooseOption(task.expr, task.options);
          if (idx !== task.answer) {
            issues.push(`${stufe.id}/${task.kind}: ${task.expr} [${task.options}] → app ${task.answer}, oracle ${idx}`);
          }
        }
      }
    }
  }
  check("gen: seeded rounds agree with the independent oracle", issues.length === 0, issues.slice(0, 4).join("; "));
}

/* ── Static server and browser ────────────────────────────────────── */
const MIME = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".woff2": "font/woff2" };
const server = createServer(async (req, res) => {
  const path = req.url.split("?")[0].replace(/^\//, "") || "index.html";
  try {
    const data = await readFile(join(APP_DIR, path));
    res.writeHead(200, { "Content-Type": MIME[extname(path)] || "application/octet-stream" });
    res.end(data);
  } catch { res.writeHead(404); res.end("not found"); }
});
await new Promise((r) => server.listen(PORT, r));
mkdirSync(SHOTS_DIR, { recursive: true });

const browser = await chromium.launch(CHROMIUM ? { executablePath: CHROMIUM } : {});
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const consoleErrors = [];
page.on("console", (msg) => { if (msg.type() === "error") consoleErrors.push(msg.text()); });
page.on("pageerror", (err) => consoleErrors.push(String(err)));
const externalRequests = [];
page.on("request", (req) => { if (!req.url().startsWith(`http://localhost:${PORT}`)) externalRequests.push(req.url()); });

async function solveTask() {
  const expr = (await page.textContent(".sequence .term")).trim();
  if (await page.locator(".typed-input").count()) {
    const answer = solveTyped(expr);
    await page.fill(".typed-input", String(answer));
  } else {
    const options = await page.locator("[data-option]").allTextContents();
    const idx = chooseOption(expr, options.map((o) => o.trim()));
    await page.click(`[data-option="${idx}"]`);
  }
  await page.waitForSelector('[data-action="next"]');
  await page.click('[data-action="next"]');
}

async function playRound(stufeId) {
  await page.click(`[data-stufe="${stufeId}"]`);
  for (let i = 0; i < 8; i++) {
    await page.waitForSelector(".task-area");
    await solveTask();
  }
  await page.waitForSelector(".done");
}

/* ── Home and rounds ──────────────────────────────────────────────── */
await page.goto(URL);
await page.waitForSelector(".stufen-list");
check("home: title renders", (await page.textContent("h1")).trim() === "Rechnerraum");
check("home: all Stufen with GA badges",
  await page.locator(".stufe").count() === 12 && await page.locator(".ga-badge").count() === 2);
check("home: competency code visible", (await page.textContent('[data-stufe="c"]')).includes("MI.2.3.c"));
check("home: Merkblatt link Stufe f",
  await page.locator('.merkblatt-link[href="../merkheft/speichereinheiten.html"]').count() === 1);
await page.screenshot({ path: join(SHOTS_DIR, "01-home.png"), fullPage: true });

await playRound("c");
check("round c: completion shows XP", (await page.textContent(".reward-xp")).includes(`+${roundXp("c", 8)} XP`));
check("round c: GA medal for Zyklus 1", (await page.textContent(".done")).includes("Grundanspruch Zyklus 1"));
check("round c: clean-run praise", (await page.textContent(".done-summary")).includes("Stark!"));
await page.screenshot({ path: join(SHOTS_DIR, "02-done.png"), fullPage: true });
await page.click('[data-action="home"]');
await page.waitForSelector(".stufen-list");

await playRound("h");
check("round h: completion shows XP", (await page.textContent(".reward-xp")).includes(`+${roundXp("h", 8)} XP`));
check("round h: GA medal for Zyklus 2", (await page.textContent(".done")).includes("Grundanspruch Zyklus 2"));
await page.click('[data-action="home"]');
await page.waitForSelector(".stufen-list");

/* ── Persistence, mistake flow, reset ─────────────────────────────── */
await page.waitForSelector(".stats-strip");
const expectedXp = roundXp("c", 8) + roundXp("h", 8);
check("home: stats strip shows accumulated XP", (await page.textContent(".stats-strip")).includes(`${expectedXp} XP`));
await page.reload();
await page.waitForSelector(".stats-strip");
check("persistence: XP survives reload", (await page.textContent(".stats-strip")).includes(`${expectedXp} XP`));

await page.click('[data-stufe="a"]');
await page.waitForSelector(".task-area");
{
  const expr = (await page.textContent(".sequence .term")).trim();
  if (await page.locator(".typed-input").count()) {
    const right = solveTyped(expr);
    await page.fill(".typed-input", `${right}x`);
    check("mistake: wrong answer marked and announced",
      await page.locator(".typed-input.wrong").count() === 1
      && (await page.textContent("#feedback")).includes("Fast"));
    await page.fill(".typed-input", String(right));
  } else {
    const options = (await page.locator("[data-option]").allTextContents()).map((o) => o.trim());
    const right = chooseOption(expr, options);
    const wrong = right === 0 ? 1 : 0;
    await page.click(`[data-option="${wrong}"]`);
    check("mistake: wrong answer marked and announced",
      await page.locator(".choice.wrong").count() === 1
      && (await page.textContent("#feedback")).includes("Fast"));
    await page.click(`[data-option="${right}"]`);
  }
  check("mistake: corrected answer solves the task", await page.locator('[data-action="next"]').count() === 1);
  await page.screenshot({ path: join(SHOTS_DIR, "03-task.png"), fullPage: false });
  await page.click('[data-action="abort"]');
}

await page.waitForSelector(".stufen-list");
await page.click(".stats-strip");
await page.waitForSelector(".medal-list");
check("medals: gallery lists all medals", await page.locator(".medal-row").count() === MEDALS.length);
await page.goBack();

await page.waitForSelector(".stufen-list");
await page.click('[data-action="reset-arm"]');
await page.waitForSelector(".reset-confirm");
check("reset: confirmation names the device storage", (await page.textContent(".reset-confirm p")).includes("Gerät"));
await page.click('[data-action="reset-confirm"]');
await page.waitForSelector('[data-action="reset-arm"]');
check("reset: XP back to zero", (await page.textContent(".stats-strip")).includes("0 XP"));

await page.setViewportSize({ width: 320, height: 700 });
await page.goto(URL);
await page.waitForSelector(".stufen-list");
check("layout: no horizontal scrolling at 320px",
  await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth));

/* ── Deep link (Merkheft «Dazu üben») ─────────────────────────────── */
await page.goto(`${URL}?stufe=f`);
await page.waitForSelector(".task-area");
check("deep link: ?stufe=f starts the Stufe directly, query cleaned",
  (await page.textContent(".practice-meta")).includes("Stufe f")
  && (await page.evaluate(() => location.search)) === "");

check("console: no errors", consoleErrors.length === 0, consoleErrors.slice(0, 3).join(" | "));
check("network: no external requests", externalRequests.length === 0, externalRequests.slice(0, 3).join(", "));

await browser.close();
server.close();
console.log(failures === 0 ? "\nAll tests passed." : `\n${failures} test(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
