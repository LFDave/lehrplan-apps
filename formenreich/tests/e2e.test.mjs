// e2e.test.mjs — Playwright end-to-end tests for Formenreich.
//
// Run:
//   cd formenreich/tests && npm install && node e2e.test.mjs
//
// Part 1 exercises the pure generators with a seeded RNG. The oracle
// classifies every SVG figure independently from the markup geometry
// (element signatures, parallel side pairs, side lengths, point and
// line coordinates) — it does not know the generator keys. Part 2
// drives the real app in Chromium. Screenshots land in
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
const PORT = 8501;
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

/* ── Geometrie-Klassifikator (unabhängig vom Generator) ──────────── */

function attrs(tag) {
  const out = {};
  for (const m of tag.matchAll(/([\w-]+)="([^"]*)"/g)) out[m[1]] = m[2];
  return out;
}

function elements(svg, name) {
  return [...svg.matchAll(new RegExp(`<${name}\\b[^>]*>`, "g"))].map((m) => attrs(m[0]));
}

function polygonPoints(tag) {
  return tag.points.trim().split(/\s+/).map((p) => p.split(",").map(Number));
}

const near = (a, b, tol = 1.5) => Math.abs(a - b) <= tol;

function classifyQuad(pts) {
  const v = pts.map((p, i) => {
    const q = pts[(i + 1) % 4];
    return [q[0] - p[0], q[1] - p[1]];
  });
  const len = v.map(([x, y]) => Math.hypot(x, y));
  const parallel = (a, b) => near(v[a][0] * v[b][1] - v[a][1] * v[b][0], 0, 40);
  const pairs = [parallel(0, 2), parallel(1, 3)].filter(Boolean).length;
  if (pairs === 2) {
    const allEqual = near(len[0], len[1], 2) && near(len[1], len[2], 2) && near(len[2], len[3], 2);
    return allEqual ? "Rhombus" : "Parallelogramm";
  }
  if (pairs === 1) return "Trapez";
  const kite = (near(len[0], len[3], 2) && near(len[1], len[2], 2))
    || (near(len[0], len[1], 2) && near(len[2], len[3], 2));
  return kite ? "Drachenviereck" : null;
}

function classifyShape(svg) {
  const circles = elements(svg, "circle").filter((a) => a.class !== "punkt");
  const ellipses = elements(svg, "ellipse");
  const rects = elements(svg, "rect");
  const polys = elements(svg, "polygon");
  const lines = elements(svg, "line").filter((a) => a.class === "shape");

  if (circles.length === 1 && ellipses.length === 1) return "Kugel";
  if (circles.length === 1) return "Kreis";
  if (ellipses.length === 2 && lines.length === 2) return "Zylinder";
  if (ellipses.length === 1 && polys.length === 1) return "Kegel";
  if (rects.length === 2 && lines.length === 4) {
    const r = attrsToNums(rects[0]);
    return near(r.width, r.height) ? "Würfel" : "Quader";
  }
  if (polys.length === 2 && lines.length === 3) return "Prisma";
  if (polys.length === 2) return "Pyramide";
  if (rects.length === 1) {
    const r = attrsToNums(rects[0]);
    return near(r.width, r.height) ? "Quadrat" : "Rechteck";
  }
  if (polys.length === 1) {
    const pts = polygonPoints(polys[0]);
    if (pts.length === 3) return "Dreieck";
    if (pts.length === 4) return classifyQuad(pts);
  }
  return null;
}

function attrsToNums(a) {
  const out = {};
  for (const [k, v] of Object.entries(a)) out[k] = Number.isNaN(Number(v)) ? v : Number(v);
  return out;
}

/* ── Frage-Tabellen (unabhängig neu aufgeschrieben) ──────────────── */

const QA = {
  "Der Ball liegt im Schrank. Wo ist er?": "innerhalb",
  "Der Ball liegt neben dem Schrank. Wo ist er?": "ausserhalb",
  "In der Reihe A B C: Was liegt zwischen A und C?": "B",
  "Du schaust auf dein Blatt. Wo ist die Seite mit dem Herz (bei den meisten Menschen)?": "links",
  "Der Keller ist ... dem Haus.": "unter",
  "Das Dach ist ... dem Haus.": "auf",
  "Ist ein Würfel eine Figur oder ein Körper?": "ein Körper",
  "Ist ein Quadrat eine Figur oder ein Körper?": "eine Figur",
  "Ist eine Kugel eine Figur oder ein Körper?": "ein Körper",
  "Ist ein Kreis eine Figur oder ein Körper?": "eine Figur",
  "Eine Figur klappt über eine Achse auf die andere Seite. Wie heisst das?": "spiegeln",
  "Eine Figur rutscht ohne Drehung an einen anderen Ort. Wie heisst das?": "verschieben",
  "Wie heisst der Platz, den eine Figur bedeckt?": "Fläche",
  "Wie breit eine Figur ist, nennt man ihre ...": "Breite",
  "Wie heisst die Strecke vom Mittelpunkt zum Kreisrand?": "Radius",
  "Wie heisst die Strecke quer durch den Kreis durch den Mittelpunkt?": "Durchmesser",
  "Wie heisst der Punkt, in dem sich zwei Geraden treffen?": "Schnittpunkt",
  "Wie nennt man einen Winkel von 90 Grad?": "rechter Winkel",
  "Wie heisst die Linie um eine Figur herum?": "Umfang",
  "Wie heisst die Strecke von Ecke zu Ecke durch das Viereck?": "Diagonale",
  "Wie heisst der Blick von oben auf einen Körper?": "Aufsicht",
  "Wie heisst der Blick von vorne auf einen Körper?": "Vorderansicht",
  "Wie heisst der Blick von der Seite auf einen Körper?": "Seitenansicht",
  "Wie heisst ein Dreieck mit zwei gleich langen Seiten?": "gleichschenklig",
  "Wie heisst ein Dreieck mit drei gleich langen Seiten?": "gleichseitig",
  "Wie heisst ein Dreieck mit einem Winkel über 90 Grad?": "stumpfwinklig",
  "Wie heisst ein Dreieck, dessen Winkel alle unter 90 Grad sind?": "spitzwinklig",
  "Welches Viereck hat vier rechte Winkel und vier gleich lange Seiten?": "Quadrat",
  "Welches Viereck hat vier rechte Winkel, aber nicht vier gleich lange Seiten?": "Rechteck",
  "Welches Viereck hat zwei Paar parallele Seiten, aber keine rechten Winkel?": "Parallelogramm",
  "Welches Viereck hat genau ein Paar parallele Seiten?": "Trapez",
  "Welches Viereck hat vier gleich lange Seiten, aber keine rechten Winkel?": "Rhombus",
  "Welches Viereck hat zwei Paare gleich langer Nachbarseiten?": "Drachenviereck",
  "Wie heisst die waagrechte Achse im Koordinatensystem?": "x-Achse",
  "Wie heisst die senkrechte Achse im Koordinatensystem?": "y-Achse",
  "Zwei Figuren sind deckungsgleich. Wie nennt man sie?": "kongruent",
  "Wie heisst die Fläche, auf der eine Pyramide steht?": "Grundfläche (Basis)",
  "Wie heisst eine Abbildung, die Längen und Winkel unverändert lässt?": "Kongruenzabbildung",
  "Wie heisst die längste Seite im rechtwinkligen Dreieck?": "Hypotenuse",
  "Wie heissen die beiden kürzeren Seiten im rechtwinkligen Dreieck?": "Katheten",
  "Wie heisst die Gerade, die den Kreis in genau einem Punkt berührt?": "Tangente",
  "Wie heisst die Strecke zwischen zwei Punkten auf dem Kreis?": "Sehne",
  "Wie heisst das «Kuchenstück» zwischen zwei Radien?": "Kreissektor",
};

const FACTS = {
  "Wie viele Ecken hat ein Würfel?": "8",
  "Wie viele Kanten hat ein Würfel?": "12",
  "Wie viele Seitenflächen hat ein Würfel?": "6",
  "Wie viele Ecken hat ein Quader?": "8",
  "Wie viele Kanten hat ein Quader?": "12",
  "Wie viele Seitenflächen hat ein Quader?": "6",
  "Wie viele Ecken hat ein Dreieck?": "3",
  "Wie viele Ecken hat ein Quadrat?": "4",
  "Wie viele Seitenflächen hat ein Tetraeder?": "4",
  "Wie viele Ecken hat ein Tetraeder?": "4",
  "Wie viele Kanten hat ein Tetraeder?": "6",
  "Der Durchmesser ist ?-mal so lang wie der Radius.": "2",
};

function solveTyped(expr) {
  return FACTS[expr] ?? null;
}

function chooseOption(expr, options, svg = "") {
  let m;
  if (expr in QA) return options.indexOf(QA[expr]);
  if (expr === "Wie heisst diese Form?" || expr === "Wie heisst dieser Körper?" || expr === "Wie heisst dieses Viereck?") {
    return options.indexOf(classifyShape(svg));
  }
  if (expr === "Welche Strecke ist am längsten?" || expr === "Welche Strecke ist am kürzesten?") {
    const lines = elements(svg, "line").filter((a) => a["data-strecke"]);
    const lens = lines.map((a) => Number(a.x2) - Number(a.x1));
    const target = expr.includes("längsten") ? Math.max(...lens) : Math.min(...lens);
    return options.indexOf(lines[lens.indexOf(target)]["data-strecke"]);
  }
  if (expr === "Wo liegt der Punkt?") {
    const r = attrsToNums(elements(svg, "rect")[0]);
    const p = attrsToNums(elements(svg, "circle").find((a) => a.class === "punkt"));
    let where = "in der Mitte des Quadrats";
    if (p.cy < r.y) where = "über dem Quadrat";
    else if (p.cy > r.y + r.height) where = "unter dem Quadrat";
    else if (p.cx < r.x) where = "links vom Quadrat";
    else if (p.cx > r.x + r.width) where = "rechts vom Quadrat";
    return options.indexOf(where);
  }
  if (expr === "Wie liegen die beiden Geraden zueinander?") {
    const [l1, l2] = elements(svg, "line").filter((a) => a.class === "gerade").map(attrsToNums);
    const d1 = [l1.x2 - l1.x1, l1.y2 - l1.y1];
    const d2 = [l2.x2 - l2.x1, l2.y2 - l2.y1];
    const cross = d1[0] * d2[1] - d1[1] * d2[0];
    const dot = d1[0] * d2[0] + d1[1] * d2[1];
    const rel = near(cross, 0, 1) ? "parallel" : near(dot, 0, 1) ? "senkrecht" : "schräg";
    return options.indexOf(rel);
  }
  if ((m = expr.match(/^Welcher Punkt liegt bei \((\d+)\|(\d+)\)\?/))) {
    const pts = elements(svg, "circle").filter((a) => a["data-punkt"]).map(attrsToNums);
    const hit = pts.find((a) => (a.cx - 10) / 20 === Number(m[1]) && (110 - a.cy) / 20 === Number(m[2]));
    return hit ? options.indexOf(hit["data-punkt"]) : -1;
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
  check("data: 12 Stufen a-l", STUFEN.length === 12 && STUFEN.map((s) => s.id).join("") === "abcdefghijkl");
  check("data: GA marks on c, g and k",
    STUFEN.filter((s) => s.ga).map((s) => s.id).join(",") === "c,g,k");
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
    const rng = mulberry32(29 + stufe.id.charCodeAt(0));
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
          const idx = chooseOption(task.expr, task.options, task.svg || "");
          if (idx !== task.answer) {
            issues.push(`${stufe.id}/${task.kind}: ${task.expr} [${task.options}] → app ${task.answer}, oracle ${idx}`);
          }
        }
      }
    }
  }
  check("gen: 600 seeded rounds agree with the geometry oracle", issues.length === 0, issues.slice(0, 4).join("; "));
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
  if (await page.locator(".typed-input").count()) {
    const answer = solveTyped(expr);
    await page.fill(".typed-input", String(answer));
  } else {
    const svg = await readFigure();
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
check("home: title renders", (await page.textContent("h1")).trim() === "Formenreich");
check("home: 12 Stufen with three GA badges",
  await page.locator(".stufe").count() === 12 && await page.locator(".ga-badge").count() === 3);
check("home: competency code visible", (await page.textContent('[data-stufe="c"]')).includes("MA.2.A.1.c"));
await page.screenshot({ path: join(SHOTS_DIR, "01-home.png"), fullPage: true });

await playRound("c");
check("round c: completion shows XP", (await page.textContent(".reward-xp")).includes(`+${roundXp("c", 8)} XP`));
check("round c: clean-run praise", (await page.textContent(".done-summary")).includes("Stark!"));
check("round c: GA medal for Zyklus 1", (await page.textContent(".done")).includes("Grundanspruch Zyklus 1"));
await page.screenshot({ path: join(SHOTS_DIR, "02-done.png"), fullPage: true });
await page.click('[data-action="home"]');

await page.waitForSelector(".stufen-list");
await playRound("g");
check("round g: GA medal for Zyklus 2", (await page.textContent(".done")).includes("Grundanspruch Zyklus 2"));
await page.click('[data-action="home"]');
await page.waitForSelector(".stufen-list");
await playRound("k");
check("round k: GA medal for Zyklus 3", (await page.textContent(".done")).includes("Grundanspruch Zyklus 3"));
await page.click('[data-action="home"]');

/* ── Persistence, mistake flow, reset ─────────────────────────────── */
await page.waitForSelector(".stats-strip");
const expectedXp = roundXp("c", 8) + roundXp("g", 8) + roundXp("k", 8);
check("home: stats strip shows accumulated XP", (await page.textContent(".stats-strip")).includes(`${expectedXp} XP`));
await page.reload();
await page.waitForSelector(".stats-strip");
check("persistence: XP survives reload", (await page.textContent(".stats-strip")).includes(`${expectedXp} XP`));

await page.click('[data-stufe="a"]');
await page.waitForSelector(".choices");
{
  const expr = (await page.textContent(".sequence .term")).trim();
  check("figure: SVG rendered for shape task", await page.locator(".task-figure svg").count() === 1);
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
