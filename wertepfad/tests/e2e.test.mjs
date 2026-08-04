// e2e.test.mjs — Playwright end-to-end tests for Wertepfad.
//
// Run:
//   cd wertepfad/tests && npm install && node e2e.test.mjs
//
// Part 1 exercises the pure generators with a seeded RNG and recomputes
// every answer through an independent oracle (generischer Folgen-Löser
// über erste und zweite Differenzen, Bruchvergleich, lineare
// Gleichungen). Part 2 drives the real app in Chromium, solving whole
// rounds by parsing the shown expressions with the same oracle.
// Screenshots land in tests/screenshots/ (gitignored).

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
const PORT = 8493;
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

const num = (s) => Number(String(s).replace(/'/g, ""));
const money = (cents) => {
  const fr = Math.floor(cents / 100);
  return `${fr}.${String(cents % 100).padStart(2, "0")}`;
};

function solveTyped(expr) {
  let m;
  if ((m = expr.match(/^(-?\d+), (-?\d+), (-?\d+), (-?\d+), \?$/))) {
    const t = [num(m[1]), num(m[2]), num(m[3]), num(m[4])];
    const d = [t[1] - t[0], t[2] - t[1], t[3] - t[2]];
    if (d[0] === d[1] && d[1] === d[2]) return String(t[3] + d[2]);
    if (d[1] - d[0] === d[2] - d[1]) return String(t[3] + d[2] + (d[2] - d[1]));
    return null;
  }
  if ((m = expr.match(/^1 (?:Flasche|m) → (\d+) Fr\. 2 (?:Flaschen|m) → (\d+) Fr\. (\d+) (?:Flaschen|m) → \? Fr\.$/))) {
    if (num(m[2]) !== 2 * num(m[1])) return null;
    return String(num(m[3]) * num(m[1]));
  }
  if ((m = expr.match(/^100 g → ([\d.]+) Fr\. 200 g → [\d.]+ Fr\. (\d)00 g → \? Fr\.$/))) {
    return money(Math.round(Number(m[1]) * 100) * num(m[2]));
  }
  if ((m = expr.match(/^(\d+) g Käse\. 1 kg kostet (\d+) Fr\. Preis = \? Fr\.$/))) {
    return String((num(m[1]) * num(m[2])) / 1000);
  }
  if ((m = expr.match(/^([\d.]+) km\/h\. Nach (\d+) min = \? km$/))) {
    const tenths = (Math.round(Number(m[1]) * 10) * num(m[2])) / 60;
    return tenths % 10 === 0 ? String(tenths / 10) : (tenths / 10).toFixed(1);
  }
  if ((m = expr.match(/^(\d+) l auf 100 km\. Für ([\d']+) km = \? l$/))) {
    return String((num(m[1]) * num(m[2])) / 100);
  }
  if ((m = expr.match(/^(\d+) von (\d+) = \? %$/))) {
    return String((100 * num(m[1])) / num(m[2]));
  }
  if ((m = expr.match(/^(\d+) Karten für (\d+) Personen\. Jede Person bekommt \? Karten$/))) {
    return String(num(m[1]) / num(m[2]));
  }
  if ((m = expr.match(/^(\d+) Arbeiter brauchen (\d+) Tage\. (\d+) Arbeiter brauchen \? Tage$/))) {
    return String((num(m[1]) * num(m[2])) / num(m[3]));
  }
  if ((m = expr.match(/^(\d+) % von (\d+) = \?$/))) {
    return String((num(m[1]) * num(m[2])) / 100);
  }
  if ((m = expr.match(/^y = (\d+)x ([+-]) (\d+)\. x = (\d+) → y = \?$/))) {
    const b = m[2] === "-" ? -num(m[3]) : num(m[3]);
    return String(num(m[1]) * num(m[4]) + b);
  }
  if ((m = expr.match(/^Massstab 1:([\d']+)\. (\d+) cm auf der Karte = \? km$/))) {
    return String((num(m[2]) * num(m[1])) / 100000);
  }
  if ((m = expr.match(/^x 2 → y (-?\d+), x 4 → y (-?\d+), x 6 → y (-?\d+)\. x = 8 → y = \?$/))) {
    const [y2, y4, y6] = [num(m[1]), num(m[2]), num(m[3])];
    if (y6 - y4 !== y4 - y2) return null;
    return String(y6 + (y6 - y4));
  }
  if ((m = expr.match(/^(\d+) m hinauf auf (\d+) m vorwärts\. Steigung = \? %$/))) {
    return String((100 * num(m[1])) / num(m[2]));
  }
  if ((m = expr.match(/^Kapital ([\d']+) Fr\., Zinssatz (\d+) %\. Zins in einem Jahr = \? Fr\.$/))) {
    return String((num(m[1]) * num(m[2])) / 100);
  }
  if ((m = expr.match(/^y = (\d+)x \+ (-?\d+) und y = (\d+)x \+ (-?\d+)\. Schnittpunkt bei x = \?$/))) {
    return String((num(m[4]) - num(m[2])) / (num(m[1]) - num(m[3])));
  }
  if ((m = expr.match(/^y = (\d+)x ([+-]) (\d+)\. Steigung = \?$/))) {
    return String(num(m[1]));
  }
  if ((m = expr.match(/^y = (\d+)x ([+-]) (\d+)\. y-Achsenabschnitt = \?$/))) {
    return m[2] === "-" ? `-${m[3]}` : String(num(m[3]));
  }
  if ((m = expr.match(/^y = (\d+)x - (\d+)\. Nullstelle bei x = \?$/))) {
    return String(num(m[2]) / num(m[1]));
  }
  return null;
}

function chooseOption(expr, options) {
  if (expr === "Wo ist der Anteil grösser?") {
    const vals = options.map((o) => {
      const m = o.match(/^(\d+) von (\d+)$/);
      return m ? num(m[1]) / num(m[2]) : -1;
    });
    return vals.indexOf(Math.max(...vals));
  }
  return -1;
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
      if (m[0].includes("http") || m[0].includes('"#') || m[0].includes("${")) continue;
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
  check("data: GA marks on b, e and i",
    STUFEN.filter((s) => s.ga).map((s) => s.id).join(",") === "b,e,i");
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
    const rng = mulberry32(17 + stufe.id.charCodeAt(0));
    for (let r = 0; r < 50; r++) {
      for (const task of genRound(rng, stufe, 8)) {
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
  check("gen: 550 seeded rounds agree with the independent oracle", issues.length === 0, issues.slice(0, 4).join("; "));
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
check("home: title renders", (await page.textContent("h1")).trim() === "Wertepfad");
check("home: 11 Stufen with three GA badges",
  await page.locator(".stufe").count() === 11 && await page.locator(".ga-badge").count() === 3);
check("home: competency code visible", (await page.textContent('[data-stufe="b"]')).includes("MA.3.A.3.b"));
await page.screenshot({ path: join(SHOTS_DIR, "01-home.png"), fullPage: true });

await playRound("b");
check("round b: completion shows XP", (await page.textContent(".reward-xp")).includes(`+${roundXp("b", 8)} XP`));
check("round b: clean-run praise", (await page.textContent(".done-summary")).includes("Stark!"));
check("round b: GA medal for Zyklus 1", (await page.textContent(".done")).includes("Grundanspruch Zyklus 1"));
await page.screenshot({ path: join(SHOTS_DIR, "02-done.png"), fullPage: true });
await page.click('[data-action="home"]');

await page.waitForSelector(".stufen-list");
await playRound("e");
check("round e: GA medal for Zyklus 2", (await page.textContent(".done")).includes("Grundanspruch Zyklus 2"));
await page.click('[data-action="home"]');
await page.waitForSelector(".stufen-list");
await playRound("i");
check("round i: GA medal for Zyklus 3", (await page.textContent(".done")).includes("Grundanspruch Zyklus 3"));
await page.click('[data-action="home"]');

/* ── Persistence, mistake flow, reset ─────────────────────────────── */
await page.waitForSelector(".stats-strip");
const expectedXp = roundXp("b", 8) + roundXp("e", 8) + roundXp("i", 8);
check("home: stats strip shows accumulated XP", (await page.textContent(".stats-strip")).includes(`${expectedXp} XP`));
await page.reload();
await page.waitForSelector(".stats-strip");
check("persistence: XP survives reload", (await page.textContent(".stats-strip")).includes(`${expectedXp} XP`));

await page.click('[data-stufe="a"]');
await page.waitForSelector(".typed-input");
{
  const expr = (await page.textContent(".sequence .term")).trim();
  const right = solveTyped(expr);
  await page.fill(".typed-input", String(Number(right) + 1));
  check("mistake: wrong answer marked and announced",
    await page.locator(".typed-input.wrong").count() === 1
    && (await page.textContent("#feedback")).includes("Fast"));
  await page.fill(".typed-input", String(right));
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
