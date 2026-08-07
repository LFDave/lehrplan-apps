// e2e.test.mjs — Playwright end-to-end tests for Körperatlas.
//
// Run:
//   cd koerperatlas/tests && npm install && node e2e.test.mjs
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
const PORT = 8533;
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

// Unabhängige Nachrechnung: eigener Puls-Rechner, dazu eine neu
// aufgeschriebene Antwort-Tabelle für das Körperwissen.
const QA = {
  "Womit greifst du?": "mit den Händen",
  "Womit hörst du?": "mit den Ohren",
  "Womit riechst du?": "mit der Nase",
  "Wo liegt das Herz?": "im Brustkorb, leicht links",
  "Wozu dienen die Beine?": "zum Gehen und Stehen",
  "Was verbindet Kopf und Rumpf?": "der Hals",
  "Wo liegt der Magen?": "im Bauch",
  "Womit kaust du?": "mit den Zähnen",
  "Das Knie ist ein ...?": "Gelenk",
  "Gelenke sind ...?": "beweglich",
  "Der Schädelknochen ...?": "schützt das Gehirn",
  "Die Augen sind ...?": "empfindlich und brauchen Schutz",
  "Die Rippen schützen ...?": "Herz und Lunge",
  "Die Haut ...?": "schützt den Körper von aussen",
  "Die Muskeln können ...?": "sich zusammenziehen",
  "Die Knochen geben dem Körper ...?": "Halt und Form",
  "Die Zähne sind ...?": "hart, zum Zerkleinern der Nahrung",
  "Muskeln und Skelett arbeiten zusammen für ...?": "die Bewegung",
  "Wo beginnt die Verdauung?": "im Mund beim Kauen",
  "Wohin gelangt die Luft beim Einatmen?": "in die Lunge",
  "Was pumpt das Blut durch den Körper?": "das Herz",
  "Was macht der Magen?": "er verdaut die Nahrung weiter",
  "Was holt der Körper aus der Atemluft?": "Sauerstoff",
  "Wohin geht die Nahrung nach dem Magen?": "in den Darm",
  "Was steuert den ganzen Körper?": "das Gehirn",
  "Warum schwitzt du beim Rennen?": "der Schweiss kühlt den Körper",
  "Warum wird dein Gesicht beim Turnen rot?": "die Haut wird stärker durchblutet",
  "Was schützt vor Sonnenbrand?": "Schatten, Kleidung und Sonnencreme",
  "Wann bekommst du Gänsehaut?": "wenn dir kalt ist",
  "Die Haut ist ...?": "unser grösstes Organ",
  "Was spürst du mit der Haut?": "Druck, Wärme und Kälte",
  "Warum ist Sonnenbrand schädlich?": "er verletzt die Haut",
  "Was hilft der Haut nach dem Waschen?": "sie gut abtrocknen und pflegen",
  "Wie fliesst das Blut vom Herzen weg?": "durch die Arterien",
  "Wie fliesst das Blut zum Herzen zurück?": "durch die Venen",
  "Was ermöglicht den aufrechten Gang?": "Skelett und Muskeln zusammen",
  "Die Wirbelsäule ...?": "trägt den Körper und ist beweglich",
  "Das Herz ist ein ...?": "Muskel",
  "Was transportiert das Blut?": "Sauerstoff und Nährstoffe",
  "Was spürst du am Handgelenk als Pochen?": "den Puls",
  "Beim Rennen schlägt das Herz ...?": "schneller",
  "Was stärkt die Ausdauer?": "regelmässige Bewegung",
  "Wie viel Schlaf braucht ein Kind etwa?": "rund 10 Stunden",
  "Was gehört zu einem gesunden Znüni?": "ein Apfel und Wasser",
  "Was hilft dem Körper nach dem Sport?": "Wasser trinken",
  "Was trainiert das Gleichgewicht?": "balancieren",
  "Was hält die Zähne gesund?": "putzen nach dem Essen",
  "Warum ist Aufwärmen vor dem Sport gut?": "es bereitet Muskeln und Gelenke vor",
  "Was gehört zu einem gesunden Tag?": "Bewegung, gutes Essen und genug Schlaf",
};

function solveTyped(expr) {
  let m;
  if ((m = expr.match(/^Ein Herz schlägt (\d+)-mal pro Minute\. Wie oft schlägt es in (\d+) Minuten\?$/))) {
    return String(Number(m[1]) * Number(m[2]));
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
  check("data: 6 Stufen a-f", STUFEN.length === 6 && STUFEN.map((s) => s.id).join("") === "abcdef");
  check("data: GA marks on b and e",
    STUFEN.filter((s) => s.ga).map((s) => s.id).join(",") === "b,e");
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
    const rng = mulberry32(69 + stufe.id.split("").reduce((n, ch, i) => n + ch.charCodeAt(0) * (i + 1), 0));
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
check("home: title renders", (await page.textContent("h1")).trim() === "Körperatlas");
check("home: all Stufen with GA badges",
  await page.locator(".stufe").count() === 6 && await page.locator(".ga-badge").count() === 2);
check("home: competency code visible", (await page.textContent('[data-stufe="b"]')).includes("NMG.1.4.b"));
check("home: Merkblatt link Stufe a",
  await page.locator('.merkblatt-link[href="../merkheft/skelett.html"]').count() === 1);
check("home: Merkblatt link Stufe e",
  await page.locator('.merkblatt-link[href="../merkheft/blutkreislauf.html"]').count() === 1);
await page.screenshot({ path: join(SHOTS_DIR, "01-home.png"), fullPage: true });

await playRound("b");
check("round b: completion shows XP", (await page.textContent(".reward-xp")).includes(`+${roundXp("b", 8)} XP`));
check("round b: GA medal for Zyklus 1", (await page.textContent(".done")).includes("Grundanspruch Zyklus 1"));
check("round b: clean-run praise", (await page.textContent(".done-summary")).includes("Stark!"));
await page.screenshot({ path: join(SHOTS_DIR, "02-done.png"), fullPage: true });
await page.click('[data-action="home"]');
await page.waitForSelector(".stufen-list");

await playRound("e");
check("round e: completion shows XP", (await page.textContent(".reward-xp")).includes(`+${roundXp("e", 8)} XP`));
check("round e: GA medal for Zyklus 2", (await page.textContent(".done")).includes("Grundanspruch Zyklus 2"));
await page.click('[data-action="home"]');
await page.waitForSelector(".stufen-list");

/* ── Persistence, mistake flow, reset ─────────────────────────────── */
await page.waitForSelector(".stats-strip");
const expectedXp = roundXp("b", 8) + roundXp("e", 8);
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
await page.goto(`${URL}?stufe=e`);
await page.waitForSelector(".task-area");
check("deep link: ?stufe=e starts the Stufe directly, query cleaned",
  (await page.textContent(".practice-meta")).includes("Stufe e")
  && (await page.evaluate(() => location.search)) === "");

check("console: no errors", consoleErrors.length === 0, consoleErrors.slice(0, 3).join(" | "));
check("network: no external requests", externalRequests.length === 0, externalRequests.slice(0, 3).join(", "));

await browser.close();
server.close();
console.log(failures === 0 ? "\nAll tests passed." : `\n${failures} test(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
