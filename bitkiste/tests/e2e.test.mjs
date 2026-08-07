// e2e.test.mjs — Playwright end-to-end tests for Bitkiste.
//
// Run:
//   cd bitkiste/tests && npm install && node e2e.test.mjs
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
const PORT = 8515;
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

// Unabhängige Nachrechnung: eigene Caesar-Entschlüsselung, eigene
// Paritäts- und Logik-Auswertung, dazu eine neu aufgeschriebene
// Antwort-Tabelle für die Wissensfragen.
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function caesarDecode(coded, shift) {
  return coded.split("").map((ch) => ALPHABET[(ALPHABET.indexOf(ch) - shift + 26) % 26]).join("");
}

const QA = {
  "Du willst den roten Stift schnell finden. Wonach ordnest du die Stifte?": "nach der Farbe",
  "Du suchst das grösste Buch. Wonach ordnest du die Bücher?": "nach der Grösse",
  "Alle runden Knöpfe liegen zusammen. Wonach ist geordnet?": "nach der Form",
  "Die Bauklötze sind in Rot, Blau und Gelb sortiert. Wonach ist geordnet?": "nach der Farbe",
  "Du willst deine Socken paarweise schneller finden. Was hilft?": "gleiche Socken zusammenlegen",
  "Die Bibliothek ordnet Bücher nach dem ABC. Was findest du so schneller?": "ein Buch mit bekanntem Titel",
  "Warum ordnet man Dinge?": "um sie schneller zu finden",
  "Du sortierst Muscheln nach klein und gross. Wonach ordnest du?": "nach der Grösse",
  "Der Stundenplan hat Zeilen und Spalten. Welche Darstellung ist das?": "eine Tabelle",
  "Ein Herz bedeutet «Das mag ich». Was ist das Herz?": "ein Symbol",
  "Balken zeigen, wie viele Kinder welches Hobby haben. Was ist das?": "ein Diagramm",
  "Das WC-Schild am Bahnhof ist ...?": "ein Symbol",
  "Die Klassenliste mit Name und Geburtstag ist ...?": "eine Tabelle",
  "Wofür eignet sich ein Diagramm besonders gut?": "Anzahlen vergleichen",
  "Ein Piktogramm auf dem Wanderweg zeigt einen Wanderer. Was ist das?": "ein Symbol",
  "Du zählst Vögel und schreibst pro Art einen Strich. Was machst du?": "Daten sammeln",
  "Die Endung .jpg gehört zu welcher Datenart?": "Bild",
  "Die Endung .png gehört zu welcher Datenart?": "Bild",
  "Die Endung .mp3 gehört zu welcher Datenart?": "Ton",
  "Die Endung .wav gehört zu welcher Datenart?": "Ton",
  "Die Endung .txt gehört zu welcher Datenart?": "Text",
  "Eine Tabellendatei (.xlsx) speichert vor allem ...?": "Zahlen",
  "Ein Foto auf dem Handy ist gespeichert als ...?": "Bilddatei",
  "Eine Sprachnachricht ist gespeichert als ...?": "Tondatei",
  "Womit schreibst du einen Brief am Computer?": "mit einem Textdokument",
  "Ein Vortrag mit Folien ist ...?": "eine Präsentation",
  "Die Klassenliste mit Spalten führst du in ...?": "einer Tabelle",
  "Ein gescannter Elternbrief, den niemand mehr ändern soll, ist oft ...?": "ein PDF",
  "Dein Aufsatz am Computer ist ...?": "ein Textdokument",
  "Das Lied der Klasse nimmst du auf als ...?": "Tonaufnahme",
  "Das Plakatfoto vom Sporttag ist ...?": "eine Bilddatei",
  "Wozu dient der Dateiname?": "die Datei wiederzufinden",
  "Die Ordner auf dem Computer bilden eine ...?": "Baumstruktur",
  "Verlinkte Internetseiten bilden eine ...?": "Netzstruktur",
  "Ein Stammbaum der Familie ist eine ...?": "Baumstruktur",
  "Eine Mindmap mit einem Thema in der Mitte und Ästen ist eine ...?": "Baumstruktur",
  "Strassen, die viele Orte kreuz und quer verbinden, bilden eine ...?": "Netzstruktur",
  "Im Ordner «Schule» liegt der Ordner «Deutsch», darin «Aufsätze». Was ist das?": "eine Baumstruktur",
  "Was ist der oberste Punkt einer Baumstruktur?": "die Wurzel",
  "Freundschaften in einer Klasse, kreuz und quer: Welche Struktur?": "eine Netzstruktur",
  "Die Klasse sucht das Foto vom Sporttag. Welcher Ablageort ist am besten?": "Klasse/Fotos/Sporttag",
  "Welcher Dateiname hilft am meisten?": "Aufsatz-Fruehling-Mai",
  "Wohin gehört das Arbeitsblatt für Mathematik?": "Schule/Mathematik/Arbeitsblaetter",
  "Warum sind gute Ordnernamen wichtig?": "damit auch andere die Dateien finden",
  "Du speicherst jede Woche ein Foto. Welche Ordnung hilft?": "ein Ordner pro Monat",
  "Was gehört in den Ordner «Deutsch/Aufsätze»?": "dein Aufsatz über die Ferien",
  "Welcher Name sagt am meisten über den Inhalt?": "Einladung-Geburtstag-Juni",
  "Wie findet man eine gut abgelegte Datei wieder?": "dem Pfad durch die Ordner folgen",
  "Du willst alle Kinder mit Geburtstag im Mai finden. Was nutzt du?": "eine Abfrage mit Filter",
  "In der Klassentabelle: Jede Zeile ist ...?": "ein Kind (ein Datensatz)",
  "In der Klassentabelle: Jede Spalte ist ...?": "ein Merkmal, z.B. der Name",
  "Damit der Computer sortieren kann, müssen die Daten ...?": "strukturiert erfasst sein",
  "Die Bibliothek findet jedes Buch in Sekunden. Was steckt dahinter?": "eine Datenbank",
  "Was macht eine Abfrage?": "sie sucht passende Datensätze heraus",
  "Alle Kinder, sortiert nach Nachname: Was hat der Computer gemacht?": "die Datensätze sortiert",
  "Was gehört als Merkmal in eine Bücher-Datenbank?": "der Titel",
  "Eine Sicherheitskopie auf einer zweiten Festplatte heisst ...?": "Backup",
  "Handy und Computer zeigen automatisch dieselben Fotos. Das heisst ...?": "Synchronisation",
  "Du kannst eine ältere Fassung deines Textes zurückholen. Das heisst ...?": "Versionierung",
  "Wozu macht man ein Backup?": "damit bei einem Defekt nichts verloren geht",
  "Die Festplatte ist kaputt, die Daten sind trotzdem da. Was hat geholfen?": "das Backup",
  "Zwei Geräte gleichen ihre Daten laufend ab. Wie heisst das?": "Synchronisation",
  "Du speicherst «Aufsatz-V1», dann «Aufsatz-V2». Was machst du von Hand?": "Versionierung",
  "Wie oft sollte man wichtige Daten sichern?": "regelmässig",
};

function solveTyped(expr) {
  let m;
  if ((m = expr.match(/^Geheimschrift: Jeder Buchstabe wurde im ABC um (\d) nach hinten verschoben .*Entschlüssle: ([A-Z]+)$/))) {
    return caesarDecode(m[2], Number(m[1]));
  }
  if ((m = expr.match(/^Welches Prüfbit ergänzt ([01]+), damit die Anzahl Einsen gerade wird\? \(0 oder 1\)$/))) {
    const ones = m[1].split("").filter((b) => b === "1").length;
    return String(ones % 2);
  }
  return QA[expr] ?? null;
}

function chooseOption(expr, options) {
  let m;
  if ((m = expr.match(/^Zähle die Einsen in ([01]+)\. Ist ihre Anzahl gerade oder ungerade\?$/))) {
    const ones = m[1].split("").filter((b) => b === "1").length;
    return options.indexOf(ones % 2 === 0 ? "gerade" : "ungerade");
  }
  if ((m = expr.match(/^A ist (wahr|falsch)\. Was ist NICHT A\?$/))) {
    return options.indexOf(m[1] === "wahr" ? "falsch" : "wahr");
  }
  if ((m = expr.match(/^A ist (wahr|falsch), B ist (wahr|falsch)\. Was ist A (UND|ODER) B\?$/))) {
    const A = m[1] === "wahr";
    const B = m[2] === "wahr";
    const r = m[3] === "UND" ? (A && B) : (A || B);
    return options.indexOf(r ? "wahr" : "falsch");
  }
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
  check("data: 11 Stufen a-k", STUFEN.length === 11 && STUFEN.map((s) => s.id).join("") === "abcdefghijk");
  check("data: GA marks on a and e and j",
    STUFEN.filter((s) => s.ga).map((s) => s.id).join(",") === "a,e,j");
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
    const rng = mulberry32(59 + stufe.id.charCodeAt(0));
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
check("home: title renders", (await page.textContent("h1")).trim() === "Bitkiste");
check("home: all Stufen with GA badges",
  await page.locator(".stufe").count() === 11 && await page.locator(".ga-badge").count() === 3);
check("home: competency code visible", (await page.textContent('[data-stufe="a"]')).includes("MI.2.1.a"));
await page.screenshot({ path: join(SHOTS_DIR, "01-home.png"), fullPage: true });

await playRound("a");
check("round a: completion shows XP", (await page.textContent(".reward-xp")).includes(`+${roundXp("a", 8)} XP`));
check("round a: GA medal for Zyklus 1", (await page.textContent(".done")).includes("Grundanspruch Zyklus 1"));
check("round a: clean-run praise", (await page.textContent(".done-summary")).includes("Stark!"));
await page.screenshot({ path: join(SHOTS_DIR, "02-done.png"), fullPage: true });
await page.click('[data-action="home"]');
await page.waitForSelector(".stufen-list");

await playRound("e");
check("round e: completion shows XP", (await page.textContent(".reward-xp")).includes(`+${roundXp("e", 8)} XP`));
check("round e: GA medal for Zyklus 2", (await page.textContent(".done")).includes("Grundanspruch Zyklus 2"));
await page.click('[data-action="home"]');
await page.waitForSelector(".stufen-list");

await playRound("j");
check("round j: completion shows XP", (await page.textContent(".reward-xp")).includes(`+${roundXp("j", 8)} XP`));
check("round j: GA medal for Zyklus 3", (await page.textContent(".done")).includes("Grundanspruch Zyklus 3"));
await page.click('[data-action="home"]');
await page.waitForSelector(".stufen-list");

/* ── Persistence, mistake flow, reset ─────────────────────────────── */
await page.waitForSelector(".stats-strip");
const expectedXp = roundXp("a", 8) + roundXp("e", 8) + roundXp("j", 8);
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

check("console: no errors", consoleErrors.length === 0, consoleErrors.slice(0, 3).join(" | "));
check("network: no external requests", externalRequests.length === 0, externalRequests.slice(0, 3).join(", "));

await browser.close();
server.close();
console.log(failures === 0 ? "\nAll tests passed." : `\n${failures} test(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
