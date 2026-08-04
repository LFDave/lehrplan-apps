// e2e.test.mjs — Playwright end-to-end tests for Zahlenwissen.
//
// Run:
//   cd zahlenwissen/tests && npm install && node e2e.test.mjs
//
// Part 1 exercises the pure generators with a seeded RNG and recomputes
// every answer through an independent oracle: an own Zahlwort-Parser,
// an own decimal shifter, and re-stated term tables. Part 2 drives the
// real app in Chromium, solving whole rounds by parsing the shown
// expressions with the same oracle. Screenshots land in
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
const PORT = 8489;
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

const W_ONES = { null: 0, eins: 1, ein: 1, zwei: 2, drei: 3, vier: 4, fünf: 5, sechs: 6, sieben: 7, acht: 8, neun: 9, zehn: 10, elf: 11, zwölf: 12, dreizehn: 13, vierzehn: 14, fünfzehn: 15, sechzehn: 16, siebzehn: 17, achtzehn: 18, neunzehn: 19 };
const W_TENS = { zehn: 10, zwanzig: 20, dreissig: 30, vierzig: 40, fünfzig: 50, sechzig: 60, siebzig: 70, achtzig: 80, neunzig: 90 };

function parseBelow100(w) {
  if (w in W_ONES) return W_ONES[w];
  if (w in W_TENS) return W_TENS[w];
  const m = w.match(/^(.+?)und(.+)$/);
  if (m && m[1] in W_ONES && m[2] in W_TENS) return W_TENS[m[2]] + W_ONES[m[1]];
  return NaN;
}

function parseBelow1000(w) {
  const hi = w.indexOf("hundert");
  let n = 0;
  if (hi >= 0) {
    n += (parseBelow100(w.slice(0, hi) || "ein")) * 100;
    w = w.slice(hi + 7);
  }
  if (!w) return n;
  const rest = parseBelow100(w);
  return Number.isNaN(rest) ? NaN : n + rest;
}

function parseWord(w) {
  const ti = w.indexOf("tausend");
  if (ti >= 0) {
    const th = parseBelow1000(w.slice(0, ti) || "ein");
    const rest = w.slice(ti + 7);
    return th * 1000 + (rest ? parseBelow1000(rest) : 0);
  }
  return parseBelow1000(w);
}

const SUPS = { "⁰": 0, "¹": 1, "²": 2, "³": 3, "⁴": 4, "⁵": 5, "⁶": 6, "⁷": 7, "⁸": 8, "⁹": 9 };
function unsup(s) {
  let sign = 1;
  if (s.startsWith("⁻")) { sign = -1; s = s.slice(1); }
  return sign * s.split("").reduce((n, ch) => n * 10 + SUPS[ch], 0);
}

// Eigener Dezimal-Schieber, stringbasiert (kein Float-Rauschen).
function shift(mantisse, exp) {
  let [int, frac = ""] = String(mantisse).split(".");
  let digits = int + frac;
  let point = int.length + exp;
  while (point > digits.length) digits += "0";
  while (point < 1) { digits = "0" + digits; point += 1; }
  const left = digits.slice(0, point).replace(/^0+(?=\d)/, "");
  const right = digits.slice(point).replace(/0+$/, "");
  return right ? `${left}.${right}` : left;
}

function fmt(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "'");
}

const num = (s) => Number(String(s).replace(/'/g, ""));
const isSquare = (x) => Number.isInteger(Math.sqrt(x));
const isPrime = (n) => {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
};

// Wert eines Options-Strings: Bruch, √, Dezimalzahl oder ganze Zahl.
function optValue(s) {
  const frac = s.match(/^(-?\d+)\/(\d+)$/);
  if (frac) return Number(frac[1]) / Number(frac[2]);
  const root = s.match(/^√(\d+)$/);
  if (root) return Math.sqrt(Number(root[1]));
  return num(s);
}

// Unabhängig neu aufgeschriebene Begriff-Tabelle (Frage → richtige Antwort).
const QA = {
  "Wie heisst das Ergebnis einer Addition?": "Summe",
  "Wie heisst das Ergebnis einer Subtraktion?": "Differenz",
  "Wie heisst das Ergebnis einer Multiplikation?": "Produkt",
  "Wie heisst das Ergebnis einer Division?": "Quotient",
  "Wie heissen die Zahlen, die man addiert?": "Summanden",
  "Wie heissen die Zahlen, die man multipliziert?": "Faktoren",
  "Wie heisst die Zahl über dem Bruchstrich?": "Zähler",
  "Wie heisst die Zahl unter dem Bruchstrich?": "Nenner",
  "Welches Zeichen steht für Prozent?": "%",
  "Welches Zeichen bedeutet «ungefähr gleich»?": "≈",
  "Wie heisst die 2 in 2⁵?": "Basis",
  "Wie heisst die 5 in 2⁵?": "Exponent",
  "Wie heisst die 3 in 10³?": "Exponent",
  "Wie heisst die 10 in 10³?": "Basis",
  "Welches Zeichen steht für die Quadratwurzel?": "√",
  "Was bedeutet ≤?": "kleiner oder gleich",
  "Was bedeutet ≥?": "grösser oder gleich",
  "Was bedeutet ≠?": "ungleich",
  "Welche Zahl ist eine natürliche Zahl?": "7",
  "Welche Zahl ist eine ganze Zahl, aber keine natürliche Zahl?": "-4",
  "Welche Zahl ist rational, aber keine ganze Zahl?": "2.5",
};

function solveTyped(expr) {
  let m;
  if ((m = expr.match(/^Schreibe als Zahl: (.+)$/))) {
    const w = m[1];
    if (w === "eine Milliarde") return fmt(1e9);
    if ((m = w.match(/^(.+) Millionen$/))) return fmt(parseWord(m[1]) * 1e6);
    if ((m = w.match(/^(.+) Komma (.+)$/))) return `${parseWord(m[1])}.${parseWord(m[2])}`;
    const n = parseWord(w);
    return n >= 1000 ? fmt(n) : String(n);
  }
  if ((m = expr.match(/^Wie viele Zehner hat (\d+)\?$/))) return String(Math.floor(Number(m[1]) / 10));
  if ((m = expr.match(/^Wie viele Einer hat (\d+)\?$/))) return String(Number(m[1]) % 10);
  if ((m = expr.match(/^Welchen Wert hat die Ziffer (\d) in ([\d']+)\?$/))) {
    const digits = m[2].replace(/'/g, "");
    const pos = digits.indexOf(m[1]);
    return fmt(Number(m[1]) * 10 ** (digits.length - 1 - pos));
  }
  if ((m = expr.match(/^(\d+) : (\d+) = (\d+) Rest \?$/))) return String(Number(m[1]) - Number(m[2]) * Number(m[3]));
  if ((m = expr.match(/^(\d+)\/(\d+) = \? %$/))) return String((100 * Number(m[1])) / Number(m[2]));
  if ((m = expr.match(/^(\d+) % = \? \(Dezimalzahl\)$/))) return shift(m[1], -2);
  if ((m = expr.match(/^([\d.]+)² = \?$/))) {
    const scaled = Math.round(Number(m[1]) * 10);
    return shift(String(scaled * scaled), -2);
  }
  if ((m = expr.match(/^∛([\d']+) = \?$/))) return String(Math.round(Math.cbrt(num(m[1]))));
  if ((m = expr.match(/^([\d.]+) · 10([⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+) = \?$/))) {
    const e = unsup(m[2]);
    const v = shift(m[1], e);
    return e > 0 ? fmt(Number(v)) : v;
  }
  if ((m = expr.match(/^([\d']+) = ([\d.]+) · 10\^\?$/))) {
    for (let e = 1; e <= 9; e++) if (shift(m[2], e) === m[1].replace(/'/g, "")) return String(e);
    return null;
  }
  return null;
}

function chooseOption(expr, options) {
  let m;
  if (expr in QA) return options.indexOf(QA[expr]);
  if (expr === "Wo sind mehr Punkte?" || expr === "Wo sind weniger Punkte?") {
    const counts = options.map((o) => (o.match(/●/g) || []).length);
    const target = expr.includes("mehr") ? Math.max(...counts) : Math.min(...counts);
    return counts.indexOf(target);
  }
  if (expr === "Welche Rechnung stimmt?") {
    return options.findIndex((o) => {
      const p = o.match(/^(\d+) \+ (\d+) = (\d+)$/);
      return p && Number(p[1]) + Number(p[2]) === Number(p[3]);
    });
  }
  if ((m = expr.match(/^(\d+) \? (\d+) = (\d+)$/))) {
    const [a, b, c] = [Number(m[1]), Number(m[2]), Number(m[3])];
    return options.findIndex((o) =>
      (o === "+" && a + b === c) || (o === "-" && a - b === c)
      || (o === "·" && a * b === c) || (o === ":" && a / b === c));
  }
  if ((m = expr.match(/^Ist (\d+) gerade oder ungerade\?$/))) {
    return options.indexOf(Number(m[1]) % 2 === 0 ? "gerade" : "ungerade");
  }
  if ((m = expr.match(/^(\d+) \? (\d+)$/))) {
    return options.indexOf(Number(m[1]) < Number(m[2]) ? "<" : ">");
  }
  if (expr === "Welche Zahl ist eine Quadratzahl?") return options.findIndex((o) => isSquare(num(o)));
  if ((m = expr.match(/^Welche Zahl ist ein Teiler von (\d+)\?$/))) {
    return options.findIndex((o) => Number(m[1]) % num(o) === 0);
  }
  if ((m = expr.match(/^Welche Zahl ist ein Vielfaches von (\d+)\?$/))) {
    return options.findIndex((o) => num(o) % Number(m[1]) === 0);
  }
  if (expr === "Welche Zahl ist eine Primzahl?") return options.findIndex((o) => isPrime(num(o)));
  if ((m = expr.match(/^([\d.]+) = \?$/))) {
    return options.findIndex((o) => Math.abs(optValue(o) - Number(m[1])) < 1e-9);
  }
  if ((m = expr.match(/^Was ist der Kehrwert von (\d+)\?$/))) {
    return options.findIndex((o) => Math.abs(optValue(o) * Number(m[1]) - 1) < 1e-9);
  }
  if (expr === "Welche Zahl ist irrational?") {
    return options.findIndex((o) => {
      const r = o.match(/^√(\d+)$/);
      return r && !isSquare(Number(r[1]));
    });
  }
  if ((m = expr.match(/^Ist (.+) rational oder irrational\?$/))) {
    const r = m[1].match(/^√(\d+)$/);
    const rational = r ? isSquare(Number(r[1])) : true;
    return options.indexOf(rational ? "rational" : "irrational");
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
  check("data: GA marks on c, g and j",
    STUFEN.filter((s) => s.ga).map((s) => s.id).join(",") === "c,g,j");
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
    const rng = mulberry32(11 + stufe.id.charCodeAt(0));
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
  check("gen: 600 seeded rounds agree with the independent oracle", issues.length === 0, issues.slice(0, 4).join("; "));
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
check("home: title renders", (await page.textContent("h1")).trim() === "Zahlenwissen");
check("home: 12 Stufen with three GA badges",
  await page.locator(".stufe").count() === 12 && await page.locator(".ga-badge").count() === 3);
check("home: competency code visible", (await page.textContent('[data-stufe="c"]')).includes("MA.1.A.1.c"));
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
await playRound("j");
check("round j: GA medal for Zyklus 3", (await page.textContent(".done")).includes("Grundanspruch Zyklus 3"));
await page.click('[data-action="home"]');

/* ── Persistence, mistake flow, reset ─────────────────────────────── */
await page.waitForSelector(".stats-strip");
const expectedXp = roundXp("c", 8) + roundXp("g", 8) + roundXp("j", 8);
check("home: stats strip shows accumulated XP", (await page.textContent(".stats-strip")).includes(`${expectedXp} XP`));
await page.reload();
await page.waitForSelector(".stats-strip");
check("persistence: XP survives reload", (await page.textContent(".stats-strip")).includes(`${expectedXp} XP`));

await page.click('[data-stufe="a"]');
await page.waitForSelector(".choices");
{
  const expr = (await page.textContent(".sequence .term")).trim();
  const options = (await page.locator("[data-option]").allTextContents()).map((o) => o.trim());
  const right = chooseOption(expr, options);
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
