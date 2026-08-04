// e2e.test.mjs — Playwright end-to-end tests for Spiegelraster.
//
// Run:
//   cd spiegelraster/tests && npm install && node e2e.test.mjs
//
// Part 1 exercises the pure generators with a seeded RNG. The oracle
// liest die Zellen jeder Figur aus dem SVG-Markup und rechnet
// Spiegelung, Drehung und Verschiebung mit EIGENEN Transformationen
// nach (nichts wird aus gen.js importiert ausser den Generatoren
// selbst). Part 2 drives the real app in Chromium. Screenshots land
// in tests/screenshots/ (gitignored).

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
const PORT = 8503;
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

/* ── Eigene Zellgeometrie (unabhängige Zweit-Implementation) ─────── */

const CELL = 20;

function cellsOf(svg, cls) {
  return [...svg.matchAll(new RegExp(`<rect class="${cls}" x="(-?\\d+)" y="(-?\\d+)"`, "g"))]
    .map((m) => [Number(m[1]), Number(m[2])]);
}

function groupCells(svg, label) {
  const m = svg.match(new RegExp(`<g data-kand="${label}">(.*?)</g>`, "s"));
  return m ? cellsOf(m[1], "cell kand") : [];
}

function norm(cells) {
  const minX = Math.min(...cells.map(([x]) => x));
  const minY = Math.min(...cells.map(([, y]) => y));
  return cells.map(([x, y]) => [(x - minX) / CELL, (y - minY) / CELL])
    .sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

const key = (cells) => JSON.stringify(cells);

function oMirror(cells) {
  const maxX = Math.max(...cells.map(([x]) => x));
  return cells.map(([x, y]) => [maxX - x, y]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

function oRot90(cells) {
  const maxY = Math.max(...cells.map(([, y]) => y));
  return cells.map(([x, y]) => [maxY - y, x]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

const oRot180 = (c) => oRot90(oRot90(c));
const oRot270 = (c) => oRot90(oRot180(c));

const FACTS = {
  "Wie viele Symmetrieachsen hat ein Quadrat?": "4",
  "Wie viele Symmetrieachsen hat ein Rechteck (kein Quadrat)?": "2",
  "Wie viele Symmetrieachsen hat ein gleichseitiges Dreieck?": "3",
  "Ein Viereck zerlegst du von einer Ecke aus in Dreiecke. Wie viele entstehen?": "2",
  "Ein Fünfeck zerlegst du von einer Ecke aus in Dreiecke. Wie viele entstehen?": "3",
  "Ein Sechseck zerlegst du von einer Ecke aus in Dreiecke. Wie viele entstehen?": "4",
  "Ein Achteck zerlegst du von einer Ecke aus in Dreiecke. Wie viele entstehen?": "6",
};

function solveTyped(expr, svg = "") {
  let m;
  if (expr in FACTS) return FACTS[expr];
  if (expr === "Aus wie vielen Dreiecken besteht die Figur?") {
    return String((svg.match(/class="part"/g) || []).length);
  }
  if ((m = expr.match(/^Ein Rechteck ist (\d+) auf (\d+) Kästchen\. Es wird mit Faktor (\d+) vergrössert\. Wie viele Kästchen (breit|hoch) ist es dann\?$/))) {
    return String((m[4] === "breit" ? Number(m[1]) : Number(m[2])) * Number(m[3]));
  }
  if (expr === "Die rechte Figur ist die Vergrösserung der linken. Mit welchem Faktor?") {
    const o = cellsOf(svg, "cell orig");
    const t = cellsOf(svg, "cell trans");
    const width = (cells) => Math.max(...cells.map(([x]) => x)) - Math.min(...cells.map(([x]) => x)) + CELL;
    return String(Math.round(width(t) / width(o)));
  }
  if (expr === "Links das Original, rechts das Bild. Um wie viel Grad wurde im Uhrzeigersinn gedreht?") {
    const o = norm(cellsOf(svg, "cell orig"));
    const t = key(norm(cellsOf(svg, "cell trans")));
    if (t === key(oRot90(o))) return "90";
    if (t === key(oRot180(o))) return "180";
    if (t === key(oRot270(o))) return "270";
    return null;
  }
  if ((m = expr.match(/^A\((\d+)\|(\d+)\) wird vom Nullpunkt aus gestreckt zu A'\((\d+)\|(\d+)\)\. Streckfaktor = \?$/))) {
    const f = Number(m[3]) / Number(m[1]);
    return f === Number(m[4]) / Number(m[2]) ? String(f) : null;
  }
  if ((m = expr.match(/^P\((\d+)\|(\d+)\)\. Die y-Koordinate wird verdoppelt\. P' = \(\d+\|\?\)$/))) {
    return String(2 * Number(m[2]));
  }
  if ((m = expr.match(/^P\((\d+)\|(\d+)\)\. Die x-Koordinate wird verdoppelt\. P' = \(\?\|\d+\)$/))) {
    return String(2 * Number(m[1]));
  }
  return null;
}

function classifySequenceNext(svg) {
  const shapes = [];
  for (const m of svg.matchAll(/<(circle|polygon|rect) class="mini"[^>]*>/g)) {
    const tag = m[0];
    const x = tag.includes("circle") ? Number(tag.match(/cx="([\d.]+)"/)[1])
      : tag.includes("polygon") ? Number(tag.match(/points="([\d.]+),/)[1])
        : Number(tag.match(/x="([\d.]+)"/)[1]);
    shapes.push([x, m[1] === "circle" ? "Kreis" : m[1] === "polygon" ? "Dreieck" : "Quadrat"]);
  }
  shapes.sort((a, b) => a[0] - b[0]);
  const seq = shapes.map(([, s]) => s);
  for (let p = 1; p <= 3; p++) {
    if (seq.every((s, i) => s === seq[i % p])) return seq[seq.length % p];
  }
  return null;
}

function chooseOption(expr, options, svg = "") {
  if (expr === "Wie geht das Muster weiter?") {
    return options.indexOf(classifySequenceNext(svg));
  }
  if (expr === "Ist die Figur symmetrisch zur eingezeichneten Achse?") {
    const cells = cellsOf(svg, "cell orig");
    const ax = Number(svg.match(/class="achse" x1="([\d.]+)"/)[1]);
    const set = new Set(cells.map(([x, y]) => `${x},${y}`));
    const sym = cells.every(([x, y]) => set.has(`${2 * ax - x - CELL},${y}`));
    return options.indexOf(sym ? "Ja" : "Nein");
  }
  if (expr.startsWith("Welches Bild zeigt die Spiegelung") || expr.startsWith("Welches Bild zeigt die Punktspiegelung")) {
    const orig = norm(cellsOf(svg, "cell orig"));
    const expected = key(expr.includes("Punktspiegelung") ? oRot180(orig) : oMirror(orig));
    for (const label of ["A", "B", "C"]) {
      if (key(norm(groupCells(svg, label))) === expected) return options.indexOf(label);
    }
    return -1;
  }
  if (expr.startsWith("Rechts steht ein zweites Bild.")) {
    const orig = norm(cellsOf(svg, "cell orig"));
    const trans = key(norm(cellsOf(svg, "cell trans")));
    return options.indexOf(trans === key(oMirror(orig)) ? "Ja" : "Nein");
  }
  if (expr === "Links das Original, rechts das Bild. Wie wurde die Figur abgebildet?") {
    const orig = norm(cellsOf(svg, "cell orig"));
    const trans = key(norm(cellsOf(svg, "cell trans")));
    let kind = null;
    if (trans === key(orig)) kind = "verschoben";
    else if (trans === key(oMirror(orig))) kind = "gespiegelt";
    else if ([oRot90, oRot180, oRot270].some((f) => trans === key(f(orig)))) kind = "gedreht";
    return options.indexOf(kind);
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
  check("data: 10 Stufen a-j", STUFEN.length === 10 && STUFEN.map((s) => s.id).join("") === "abcdefghij");
  check("data: GA marks on c, f and i",
    STUFEN.filter((s) => s.ga).map((s) => s.id).join(",") === "c,f,i");
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
    const rng = mulberry32(31 + stufe.id.charCodeAt(0));
    for (let r = 0; r < 50; r++) {
      const round = genRound(rng, stufe, 8);
      if (round.length !== 8) issues.push(`${stufe.id}: round has only ${round.length} tasks`);
      for (const task of round) {
        if (task.type === "typed") {
          const oracle = solveTyped(task.expr, task.svg || "");
          if (oracle !== task.answer) {
            issues.push(`${stufe.id}/${task.kind}: ${task.expr} → app "${task.answer}", oracle "${oracle}"`);
          }
        } else {
          if (new Set(task.options).size !== task.options.length) {
            issues.push(`${stufe.id}/${task.kind}: duplicate options for ${task.expr}`);
          }
          const idx = chooseOption(task.expr, task.options, task.svg || "");
          if (idx !== task.answer) {
            issues.push(`${stufe.id}/${task.kind}: ${task.expr} [${task.options}] → app ${task.answer}, oracle ${idx}`);
          }
        }
      }
    }
  }
  check("gen: 500 seeded rounds agree with the transform oracle", issues.length === 0, issues.slice(0, 4).join("; "));
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

async function readFigure() {
  if (await page.locator(".task-figure").count()) return page.locator(".task-figure").innerHTML();
  return "";
}

async function solveTask() {
  const expr = (await page.textContent(".sequence .term")).trim();
  const svg = await readFigure();
  if (await page.locator(".typed-input").count()) {
    const answer = solveTyped(expr, svg);
    await page.fill(".typed-input", String(answer));
  } else {
    const options = await page.locator("[data-option]").allTextContents();
    const idx = chooseOption(expr, options.map((o) => o.trim()), svg);
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
check("home: title renders", (await page.textContent("h1")).trim() === "Spiegelraster");
check("home: 10 Stufen with three GA badges",
  await page.locator(".stufe").count() === 10 && await page.locator(".ga-badge").count() === 3);
check("home: competency code visible", (await page.textContent('[data-stufe="c"]')).includes("MA.2.A.2.c"));
await page.screenshot({ path: join(SHOTS_DIR, "01-home.png"), fullPage: true });

await playRound("c");
check("round c: completion shows XP", (await page.textContent(".reward-xp")).includes(`+${roundXp("c", 8)} XP`));
check("round c: clean-run praise", (await page.textContent(".done-summary")).includes("Stark!"));
check("round c: GA medal for Zyklus 1", (await page.textContent(".done")).includes("Grundanspruch Zyklus 1"));
await page.screenshot({ path: join(SHOTS_DIR, "02-done.png"), fullPage: true });
await page.click('[data-action="home"]');

await page.waitForSelector(".stufen-list");
await playRound("f");
check("round f: GA medal for Zyklus 2", (await page.textContent(".done")).includes("Grundanspruch Zyklus 2"));
await page.click('[data-action="home"]');
await page.waitForSelector(".stufen-list");
await playRound("i");
check("round i: GA medal for Zyklus 3", (await page.textContent(".done")).includes("Grundanspruch Zyklus 3"));
await page.click('[data-action="home"]');

/* ── Persistence, mistake flow, reset ─────────────────────────────── */
await page.waitForSelector(".stats-strip");
const expectedXp = roundXp("c", 8) + roundXp("f", 8) + roundXp("i", 8);
check("home: stats strip shows accumulated XP", (await page.textContent(".stats-strip")).includes(`${expectedXp} XP`));
await page.reload();
await page.waitForSelector(".stats-strip");
check("persistence: XP survives reload", (await page.textContent(".stats-strip")).includes(`${expectedXp} XP`));

await page.click('[data-stufe="a"]');
await page.waitForSelector(".choices");
{
  const expr = (await page.textContent(".sequence .term")).trim();
  check("figure: SVG rendered for pattern task", await page.locator(".task-figure svg").count() === 1);
  const options = (await page.locator("[data-option]").allTextContents()).map((o) => o.trim());
  const right = chooseOption(expr, options, await readFigure());
  const wrong = right === 0 ? 1 : 0;
  await page.click(`[data-option="${wrong}"]`);
  check("mistake: wrong choice marked and announced",
    await page.locator(".choice.wrong").count() === 1
    && (await page.textContent("#feedback")).includes("Fast"));
  await page.click(`[data-option="${right}"]`);
  check("mistake: corrected choice solves the task", await page.locator('[data-action="next"]').count() === 1);
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
