// e2e.test.mjs — Playwright end-to-end tests for Rechenturm.
//
// Run:
//   cd rechenturm/tests && npm install && node e2e.test.mjs
//
// Part 1 exercises the pure generators with a seeded RNG and recomputes
// every answer through an independent expression oracle. Part 2 drives
// the real app in Chromium, solving whole rounds by parsing the shown
// expressions with the same oracle. Screenshots land in
// tests/screenshots/ (gitignored).

import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { mkdirSync, existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { STUFEN } from "../data.js?v=1";
import { genRound, formatNumber } from "../gen.js?v=1";
import { LEVELS, MEDALS, roundXp } from "../game.js?v=1";
import { STRINGS } from "../strings.js?v=1";

const TESTS_DIR = dirname(fileURLToPath(import.meta.url));
const APP_DIR = join(TESTS_DIR, "..");
const SHOTS_DIR = join(TESTS_DIR, "screenshots");
const PORT = 8483;
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

/* ── Independent expression oracle ────────────────────────────────── */

const SUPS = { "⁰": 0, "¹": 1, "²": 2, "³": 3, "⁴": 4, "⁵": 5, "⁶": 6, "⁷": 7, "⁸": 8, "⁹": 9 };
const num = (s) => parseFloat(String(s).replace(/'/g, ""));
const unsup = (s) => s.split("").reduce((n, ch) => n * 10 + SUPS[ch], 0);
const r10 = (n) => Math.round(n * 1000) / 1000;

function solveExpr(expr) {
  expr = expr.trim();
  let m;
  if ((m = expr.match(/^Das Doppelte von ([\d.']+)$/))) return String(r10(2 * num(m[1])));
  if ((m = expr.match(/^Die Hälfte von ([\d.']+)$/))) return String(r10(num(m[1]) / 2));
  if ((m = expr.match(/^([\d.']+) \+ \? = ([\d.']+)$/))) return String(r10(num(m[2]) - num(m[1])));
  if ((m = expr.match(/^(\d+)\/(\d+) \+ (\d+)\/(\d+)$/))) return `${Number(m[1]) + Number(m[3])}/${m[2]}`;
  if ((m = expr.match(/^(\d+)% von ([\d.']+)$/))) return String(r10(num(m[2]) * Number(m[1]) / 100));
  if ((m = expr.match(/^(\d+)([⁰¹²³⁴⁵⁶⁷⁸⁹]+) · (\d+)([⁰¹²³⁴⁵⁶⁷⁸⁹]+) = (\d+)\^\?$/))) {
    return String(unsup(m[2]) + unsup(m[4]));
  }
  if ((m = expr.match(/^([\d.']+) · 10([⁰¹²³⁴⁵⁶⁷⁸⁹]+)$/))) return String(r10(num(m[1]) * 10 ** unsup(m[2])));
  if ((m = expr.match(/^(\d+)([⁰¹²³⁴⁵⁶⁷⁸⁹]+)$/))) return String(Number(m[1]) ** unsup(m[2]));
  if ((m = expr.match(/^√([\d.']+)$/))) return String(Math.sqrt(num(m[1])));
  if ((m = expr.match(/^(-?[\d.']+) ([+\-·:]) (-?[\d.']+)$/))) {
    const [a, b] = [num(m[1]), num(m[3])];
    const v = m[2] === "+" ? a + b : m[2] === "-" ? a - b : m[2] === "·" ? a * b : a / b;
    return String(r10(v));
  }
  return null;
}

function sameAnswer(expected, produced) {
  if (expected === null) return false;
  const clean = (s) => String(s).replace(/'/g, "");
  if (clean(expected) === clean(produced)) return true;
  const [a, b] = [parseFloat(clean(expected)), parseFloat(clean(produced))];
  return Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) < 1e-9;
}

// So tippt der UI-Löser eine Orakel-Antwort: grosse ganze Zahlen im
// App-Format mit Apostroph. Das Ergebnis muss dem answer-String der App
// exakt entsprechen, sonst passt die Längen-Autoprüfung nicht (etwa
// Orakel "36" gegen App-Antwort "36.0") und eine Runde bliebe stehen.
function asTyped(expr, oracle) {
  let text = String(oracle);
  if (!text.includes("/") && Number.isFinite(parseFloat(text)) && !expr.includes("^?")) {
    const v = parseFloat(text);
    if (Number.isInteger(v) && Math.abs(v) >= 1000) text = formatNumber(v);
  }
  return text;
}

const isPrime = (n) => {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
};

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
  check("data: GA marks on b and f only (no cycle-3 GA in MA.1.A.3)",
    STUFEN.filter((s) => s.ga).map((s) => `${s.id}${s.cycle}`).join(",") === "b1,f2");
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
    const rng = mulberry32(7 + stufe.id.charCodeAt(0));
    for (let r = 0; r < 50; r++) {
      for (const task of genRound(rng, stufe, 8)) {
        if (task.type === "typed") {
          const oracle = solveExpr(task.expr.replace(" = ?", ""));
          if (!sameAnswer(oracle, task.answer)) {
            issues.push(`${stufe.id}/${task.kind}: ${task.expr} → ${task.answer}, oracle ${oracle}`);
          } else if (asTyped(task.expr, oracle) !== task.answer) {
            issues.push(`${stufe.id}/${task.kind}: format mismatch ${task.expr} → app "${task.answer}", getippt würde "${asTyped(task.expr, oracle)}"`);
          }
        } else {
          // Primfaktoren: die richtige Option muss aus Primzahlen bestehen
          // und das Produkt der Zielzahl ergeben; die Ablenker nicht.
          const n = num(task.expr.match(/^([\d']+)/)[1]);
          const good = (opt) => {
            const fs = opt.split("·").map((x) => Number(x.trim()));
            return fs.every(isPrime) && fs.reduce((a, b) => a * b, 1) === n;
          };
          task.options.forEach((opt, i) => {
            if (good(opt) !== (i === task.answer)) issues.push(`${stufe.id}: bad mc option ${opt} for ${task.expr}`);
          });
        }
      }
    }
  }
  check("gen: 500 seeded rounds per Stufe agree with the oracle in value and typed format", issues.length === 0, issues.slice(0, 4).join("; "));
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
  const expr = (await page.textContent(".sequence .term")).replace(/ = \?$/, "");
  if (await page.locator(".typed-input").count()) {
    await page.fill(".typed-input", asTyped(expr, solveExpr(expr)));
  } else {
    const n = num(expr.match(/^([\d']+)/)[1]);
    const options = await page.locator("[data-option]").allTextContents();
    const idx = options.findIndex((opt) => {
      const fs = opt.split("·").map((x) => Number(x.trim().replace(/'/g, "")));
      return fs.every(isPrime) && fs.reduce((a, b) => a * b, 1) === n;
    });
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
check("home: title renders", (await page.textContent("h1")).trim() === "Rechenturm");
check("home: 10 Stufen with two GA badges",
  await page.locator(".stufe").count() === 10 && await page.locator(".ga-badge").count() === 2);
check("home: competency code visible", (await page.textContent('[data-stufe="b"]')).includes("MA.1.A.3.b"));
await page.screenshot({ path: join(SHOTS_DIR, "01-home.png"), fullPage: true });

await playRound("b");
check("round b: completion shows XP", (await page.textContent(".reward-xp")).includes(`+${roundXp("b", 8)} XP`));
check("round b: clean-run praise", (await page.textContent(".done-summary")).includes("Stark!"));
check("round b: GA medal for Zyklus 1", (await page.textContent(".done")).includes("Grundanspruch Zyklus 1"));
await page.screenshot({ path: join(SHOTS_DIR, "02-done.png"), fullPage: true });
await page.click('[data-action="home"]');

await page.waitForSelector(".stufen-list");
await playRound("f");
check("round f: GA medal for Zyklus 2", (await page.textContent(".done")).includes("Grundanspruch Zyklus 2"));
await page.click('[data-action="home"]');
await page.waitForSelector(".stufen-list");
await playRound("h");
await page.click('[data-action="home"]');
await page.waitForSelector(".stufen-list");
await playRound("j");
check("round j: Turmspitze medal", (await page.textContent(".done")).includes("Turmspitze"));
await page.click('[data-action="home"]');

/* ── Persistence, mistake flow, reset ─────────────────────────────── */
await page.waitForSelector(".stats-strip");
const expectedXp = roundXp("b", 8) + roundXp("f", 8) + roundXp("h", 8) + roundXp("j", 8);
check("home: stats strip shows accumulated XP", (await page.textContent(".stats-strip")).includes(`${expectedXp} XP`));
await page.reload();
await page.waitForSelector(".stats-strip");
check("persistence: XP survives reload", (await page.textContent(".stats-strip")).includes(`${expectedXp} XP`));

await page.click('[data-stufe="a"]');
await page.waitForSelector(".typed-input");
{
  const expr = (await page.textContent(".sequence .term")).replace(/ = \?$/, "");
  const right = solveExpr(expr);
  await page.fill(".typed-input", String(parseFloat(right) + 1));
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
