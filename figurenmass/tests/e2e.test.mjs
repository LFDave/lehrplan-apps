// e2e.test.mjs — Playwright end-to-end tests for Figurenmass.
//
// Run:
//   cd figurenmass/tests && npm install && node e2e.test.mjs
//
// Part 1 exercises the pure generators with a seeded RNG and recomputes
// every answer through an independent oracle — SVG-Aufgaben werden aus
// dem Markup nachgemessen (Strecken-Koordinaten, Zellen zählen,
// Polylinien-Längen), Text-Aufgaben mit eigenen Formeln nachgerechnet.
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
const PORT = 8499;
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

const CELL = 20;
const num = (s) => Number(String(s).replace(/'/g, ""));

// Manhattan-Länge einer achsenparallelen Polylinie aus dem SVG-Markup.
function polylineLength(svg, label) {
  const m = svg.match(new RegExp(`data-weg="${label}"[^>]*points="([^"]+)"`));
  if (!m) return -1;
  const pts = m[1].trim().split(/\s+/).map((p) => p.split(",").map(Number));
  let len = 0;
  for (let i = 1; i < pts.length; i++) {
    len += (Math.abs(pts[i][0] - pts[i - 1][0]) + Math.abs(pts[i][1] - pts[i - 1][1])) / CELL;
  }
  return Math.round(len);
}

function countClass(svg, cls) {
  return (svg.match(new RegExp(`class="${cls}"`, "g")) || []).length;
}

// Ergebnis von n Hundertsteln als gekürzten Dezimal-String.
function fromHundredths(h) {
  const int = Math.floor(h / 100);
  const rest = h % 100;
  if (rest === 0) return String(int);
  if (rest % 10 === 0) return `${int}.${rest / 10}`;
  return `${int}.${String(rest).padStart(2, "0")}`;
}

// Neu aufgeschriebene Frage-Tabelle (Frage → richtige Antwort).
const QA = {
  "Ein Draht wird zu einem Ring gebogen. Wird er länger, kürzer oder bleibt er gleich lang?": "gleich lang",
  "Eine Schnur wird zu einer Schlange gelegt. Wie lang ist sie jetzt?": "gleich lang wie vorher",
  "Knete wird von einer Kugel zu einer Wurst gerollt. Wie viel Knete ist es jetzt?": "gleich viel",
  "Wasser wird vom breiten ins schmale Glas gegossen. Wie viel Wasser ist es jetzt?": "gleich viel",
  "Ein Blatt wird gefaltet. Wie schwer ist es jetzt?": "gleich schwer",
  "Ein Seil wird aufgerollt. Wie lang ist es jetzt?": "gleich lang",
  "Ein Teig wird flachgedrückt. Wie viel Teig ist es jetzt?": "gleich viel",
  "Eine Kette wird im Kreis gelegt statt gerade. Wie lang ist sie?": "gleich lang",
  "Ein Dreieck hat seine Spitze auf dem Halbkreis über dem Durchmesser. Wie gross ist der Winkel an der Spitze (Satz von Thales)?": "90°",
  "Wie gross ist die Winkelsumme im Dreieck?": "180°",
  "Wie gross ist die Winkelsumme im Viereck?": "360°",
};

function solveTyped(expr, svg = "") {
  let m;
  if (expr.startsWith("Wie viele Kästchen (je 1 cm) lang ist die Strecke?")) {
    const x1 = svg.match(/class="strecke" x1="(\d+)" y1="16"/);
    const x2 = svg.match(/class="strecke" x1="\d+" y1="16" x2="(\d+)"/);
    if (!x1 || !x2) return null;
    return String((num(x2[1]) - num(x1[1])) / CELL);
  }
  if (expr === "Wie viele Einheitsquadrate bedecken das Rechteck?") return String(countClass(svg, "cell"));
  if (expr === "Wie viele ganze Quadrate sind gefärbt?") return String(countClass(svg, "fill"));
  if ((m = expr.match(/^Ein Becher fasst (\d+) dl\. Wie viele Becher füllen (\d+) dl\?$/))) {
    return String(num(m[2]) / num(m[1]));
  }
  if ((m = expr.match(/^Rechteck: (\d+) cm auf (\d+) cm\. Umfang = \? cm$/))) {
    return String(2 * (num(m[1]) + num(m[2])));
  }
  if ((m = expr.match(/^Rechteck: (\d+) cm auf (\d+) cm\. Fläche = \? cm²$/))) {
    return String(num(m[1]) * num(m[2]));
  }
  if ((m = expr.match(/^Quadrat: Seite (\d+) cm\. Fläche = \? cm²$/))) {
    return String(num(m[1]) ** 2);
  }
  if ((m = expr.match(/^Ein Quader ist (\d+) auf (\d+) auf (\d+) Würfel gross\. Wie viele Würfel sind es\?$/))) {
    return String(num(m[1]) * num(m[2]) * num(m[3]));
  }
  if ((m = expr.match(/^Quader: (\d+) cm auf (\d+) cm auf (\d+) cm\. Volumen = \? cm³$/))) {
    return String(num(m[1]) * num(m[2]) * num(m[3]));
  }
  if ((m = expr.match(/^Dreieck: Grundlinie (\d+) cm, Höhe (\d+) cm\. Fläche = \? cm²$/))) {
    return String((num(m[1]) * num(m[2])) / 2);
  }
  if ((m = expr.match(/^Quader: (\d+) cm auf (\d+) cm auf (\d+) cm\. Alle 12 Kanten zusammen = \? cm$/))) {
    return String(4 * (num(m[1]) + num(m[2]) + num(m[3])));
  }
  if ((m = expr.match(/^Quader: (\d+) cm auf (\d+) cm auf (\d+) cm\. Oberfläche = \? cm²$/))) {
    const [a, b, c] = [num(m[1]), num(m[2]), num(m[3])];
    return String(2 * (a * b + b * c + a * c));
  }
  if ((m = expr.match(/^Rechtwinkliges Dreieck: Katheten (\d+) cm und (\d+) cm\. Hypotenuse = \? cm$/))) {
    return String(Math.round(Math.sqrt(num(m[1]) ** 2 + num(m[2]) ** 2)));
  }
  if ((m = expr.match(/^Rechtwinkliges Dreieck: Hypotenuse (\d+) cm, eine Kathete (\d+) cm\. Andere Kathete = \? cm$/))) {
    return String(Math.round(Math.sqrt(num(m[1]) ** 2 - num(m[2]) ** 2)));
  }
  if ((m = expr.match(/^Kreis: (Radius|Durchmesser) (\d+) cm\. (Umfang|Fläche) ≈ \? cm²? \(π ≈ 3\.14\)$/))) {
    const r = m[1] === "Radius" ? num(m[2]) : num(m[2]) / 2;
    const hundredths = m[3] === "Umfang" ? 314 * 2 * r : 314 * r * r;
    return fromHundredths(hundredths);
  }
  if ((m = expr.match(/^(?:Prisma|Zylinder): Grundfläche (\d+) cm², Höhe (\d+) cm\. Volumen = \? cm³$/))) {
    return String(num(m[1]) * num(m[2]));
  }
  if ((m = expr.match(/^Pyramide: Grundfläche (\d+) cm², Höhe (\d+) cm\. Volumen = \? cm³ \(G · h : 3\)$/))) {
    return String((num(m[1]) * num(m[2])) / 3);
  }
  if ((m = expr.match(/^Dreieck: Winkel (\d+)° und (\d+)°\. Dritter Winkel = \?°$/))) {
    return String(180 - num(m[1]) - num(m[2]));
  }
  if ((m = expr.match(/^Ähnliche Figur mit Streckfaktor (\d+): Aus (\d+) cm werden \? cm$/))) {
    return String(num(m[1]) * num(m[2]));
  }
  if ((m = expr.match(/^Streckfaktor (\d+): Die Fläche wird \?-mal so gross$/))) {
    return String(num(m[1]) ** 2);
  }
  if ((m = expr.match(/^Streckfaktor (\d+): Das Volumen wird \?-mal so gross$/))) {
    return String(num(m[1]) ** 3);
  }
  return null;
}

function chooseOption(expr, options, svg = "") {
  if (expr in QA) return options.indexOf(QA[expr]);
  if (expr.endsWith("Welcher Weg ist länger?")) {
    return options.indexOf(polylineLength(svg, "A") > polylineLength(svg, "B") ? "Weg A" : "Weg B");
  }
  if (expr === "Welches Rechteck bedeckt mehr Quadrate?") {
    const areas = options.map((o) => {
      const m = o.match(/(\d+) auf (\d+) Quadrate$/);
      return m ? num(m[1]) * num(m[2]) : -1;
    });
    return areas.indexOf(Math.max(...areas));
  }
  if (expr === "Welcher Würfelbau braucht mehr Würfel?") {
    const vols = options.map((o) => {
      const m = o.match(/(\d+) · (\d+) · (\d+) Würfel$/);
      return m ? num(m[1]) * num(m[2]) * num(m[3]) : -1;
    });
    return vols.indexOf(Math.max(...vols));
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
    const rng = mulberry32(23 + stufe.id.charCodeAt(0));
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
check("home: title renders", (await page.textContent("h1")).trim() === "Figurenmass");
check("home: 11 Stufen with three GA badges",
  await page.locator(".stufe").count() === 11 && await page.locator(".ga-badge").count() === 3);
check("home: competency code visible", (await page.textContent('[data-stufe="b"]')).includes("MA.2.A.3.b"));
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

await page.click('[data-stufe="d"]');
await page.waitForSelector(".typed-input");
{
  const expr = (await page.textContent(".sequence .term")).trim();
  check("figure: SVG rendered for raster task", await page.locator(".task-figure svg").count() === 1);
  const right = solveTyped(expr, await readFigure());
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
