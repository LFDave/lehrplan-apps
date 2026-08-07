// e2e.test.mjs — Playwright end-to-end tests for Zeitreise.
//
// Run:
//   cd zeitreise/tests && npm install && node e2e.test.mjs
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
const PORT = 8513;
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

// Unabhängig neu aufgeschriebene Antwort-Tabelle (Frage → richtige
// Antwort). Kalender- und Geschichtsfakten, von Hand nachgeprüft.
const QA = {
  "Was war zuerst: gestern, heute oder morgen?": "gestern",
  "Was kommt als Letztes: gestern, heute oder morgen?": "morgen",
  "Welcher Tag kommt nach Dienstag?": "Mittwoch",
  "Welcher Tag kommt vor Sonntag?": "Samstag",
  "Wie viele Tage hat eine Woche?": "7",
  "Was gehört nicht zu den Wochentagen?": "April",
  "Wie viele Monate hat ein Jahr?": "12",
  "Welcher Monat kommt nach März?": "April",
  "Welcher Monat kommt vor Dezember?": "November",
  "Welcher Monat ist der erste im Jahr?": "Januar",
  "Welche Jahreszeit kommt nach dem Sommer?": "Herbst",
  "Welche Jahreszeit kommt nach dem Winter?": "Frühling",
  "In welcher Jahreszeit fällt am ehesten Schnee?": "Winter",
  "Wie viele Jahreszeiten hat ein Jahr?": "4",
  "Der kleine Zeiger zeigt auf die 3, der grosse auf die 12. Wie spät ist es? (? Uhr)": "3",
  "Der kleine Zeiger zeigt auf die 8, der grosse auf die 12. Wie spät ist es? (? Uhr)": "8",
  "Wie viele Stunden hat ein ganzer Tag?": "24",
  "Wie viele Minuten hat eine Stunde?": "60",
  "Wie viele Sekunden hat eine Minute?": "60",
  "Zähneputzen: Was kommt zuerst?": "Zahnpasta auf die Bürste geben",
  "Kuchen backen: Was kommt zuerst?": "den Teig mischen",
  "Einen Brief schicken: Was kommt zuletzt?": "den Brief einwerfen",
  "Schuhe anziehen: Was kommt zuerst?": "in die Schuhe schlüpfen",
  "Was dauert etwa eine Minute?": "einmal das ABC aufsagen",
  "Was dauert etwa eine Stunde?": "eine Schullektion mit Pause",
  "Was dauert länger?": "eine Stunde",
  "Was ist kürzer?": "eine Sekunde",
  "Was dauert etwa eine Sekunde?": "einmal klatschen",
  "Die Sonne geht jeden Tag auf. Ist das immer gleich oder verschieden?": "immer gleich",
  "Am Mittwoch hast du Turnen. Ist das an allen Tagen gleich?": "je nach Tag verschieden",
  "Nach dem Tag kommt die Nacht. Ist das immer gleich oder verschieden?": "immer gleich",
  "Was du zum Zmittag isst: Ist das jeden Tag gleich?": "je nach Tag verschieden",
  "Zuerst Morgen, dann Mittag, dann Abend. Ist diese Reihenfolge immer gleich?": "immer gleich",
  "Ob du am Nachmittag Schule hast: Ist das jeden Tag gleich?": "je nach Tag verschieden",
  "Was kommt in jedem Tageslauf vor?": "aufwachen",
  "Was gehört nicht zu jedem Tag?": "ein Zoobesuch",
  "Was liegt auf dem Zeitstrahl weiter links (früher): 1950 oder 1990?": "1950",
  "Was liegt auf dem Zeitstrahl weiter rechts (später): 1800 oder 1900?": "1900",
  "Deine Grossmutter wurde 1960 geboren, deine Mutter 1990. Wer kommt auf dem Zeitstrahl zuerst?": "die Grossmutter",
  "Wie viele Jahre liegen zwischen 1950 und 1990?": "40",
  "Wie viele Jahre liegen zwischen 1900 und 2000?": "100",
  "Die Pause beginnt um 10:00 Uhr und endet um 10:20 Uhr. Wie viele Minuten dauert sie?": "20",
  "Der Film beginnt um 14:00 Uhr und endet um 15:30 Uhr. Wie viele Minuten dauert er?": "90",
  "Du schläfst von 20:00 Uhr bis 06:00 Uhr. Wie viele Stunden sind das?": "10",
  "Wer ist in der Regel am ältesten?": "die Grossmutter",
  "Wer wurde zuerst geboren?": "der Urgrossvater",
  "Die Mutter deiner Mutter ist deine ...?": "Grossmutter",
  "Der Vater deines Vaters ist dein ...?": "Grossvater",
  "Kind, Eltern, Grosseltern: Wie viele Generationen sind das?": "3",
  "Wer kommt auf dem Familien-Zeitstrahl zuletzt?": "das Kind",
  "Deine Eltern waren einmal so alt wie du. Stimmt das?": "Ja",
  "Wer hat die längste Lebensgeschichte hinter sich?": "die Urgrossmutter",
  "Welche Epoche kam zuerst?": "die Steinzeit",
  "Welche Epoche kam direkt nach der Antike?": "das Mittelalter",
  "Welche Epoche kam direkt nach dem Mittelalter?": "die Neuzeit",
  "In welcher Epoche leben wir heute?": "in der Neuzeit",
  "Ritter und Burgen gehören vor allem zu welcher Epoche?": "zum Mittelalter",
  "Womit jagten die Menschen in der Steinzeit?": "mit Speer und Pfeilbogen",
  "Die alten Römer und Griechen gehören zu welcher Epoche?": "zur Antike",
  "Was ist die richtige Reihenfolge?": "Steinzeit, Antike, Mittelalter, Neuzeit",
  "Was war früher?": "die Erfindung der Schrift",
  "Was war früher: die Höhlenmalerei der Steinzeit oder der Buchdruck?": "die Höhlenmalerei",
  "Der Bundesbrief stammt von 1291. Welche Epoche war das?": "das Mittelalter",
  "Der Bundesbrief stammt von 1291. In welchem Jahrhundert war das? (?. Jahrhundert)": "13",
  "Der Schweizer Bundesstaat entstand 1848. In welchem Jahrhundert war das? (?. Jahrhundert)": "19",
  "Der Buchdruck wurde um 1450 erfunden. In welchem Jahrhundert war das? (?. Jahrhundert)": "15",
  "Wie viele Jahre hat ein Jahrhundert?": "100",
  "Wie viele Jahre hat ein Jahrzehnt?": "10",
};

function solveTyped(expr) {
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
  check("data: 8 Stufen a-h", STUFEN.length === 8 && STUFEN.map((s) => s.id).join("") === "abcdefgh");
  check("data: GA marks on c and g",
    STUFEN.filter((s) => s.ga).map((s) => s.id).join(",") === "c,g");
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
    const rng = mulberry32(53 + stufe.id.charCodeAt(0));
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
check("home: title renders", (await page.textContent("h1")).trim() === "Zeitreise");
check("home: all Stufen with GA badges",
  await page.locator(".stufe").count() === 8 && await page.locator(".ga-badge").count() === 2);
check("home: competency code visible", (await page.textContent('[data-stufe="c"]')).includes("NMG.9.1.c"));
await page.screenshot({ path: join(SHOTS_DIR, "01-home.png"), fullPage: true });

await playRound("c");
check("round c: completion shows XP", (await page.textContent(".reward-xp")).includes(`+${roundXp("c", 8)} XP`));
check("round c: GA medal for Zyklus 1", (await page.textContent(".done")).includes("Grundanspruch Zyklus 1"));
check("round c: clean-run praise", (await page.textContent(".done-summary")).includes("Stark!"));
await page.screenshot({ path: join(SHOTS_DIR, "02-done.png"), fullPage: true });
await page.click('[data-action="home"]');
await page.waitForSelector(".stufen-list");

await playRound("g");
check("round g: completion shows XP", (await page.textContent(".reward-xp")).includes(`+${roundXp("g", 8)} XP`));
check("round g: GA medal for Zyklus 2", (await page.textContent(".done")).includes("Grundanspruch Zyklus 2"));
await page.click('[data-action="home"]');
await page.waitForSelector(".stufen-list");

/* ── Persistence, mistake flow, reset ─────────────────────────────── */
await page.waitForSelector(".stats-strip");
const expectedXp = roundXp("c", 8) + roundXp("g", 8);
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
