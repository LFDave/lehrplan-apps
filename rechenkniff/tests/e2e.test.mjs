// e2e.test.mjs — Playwright end-to-end tests for Rechenkniff.
//
// Run:
//   cd rechenkniff/tests && npm install && node e2e.test.mjs
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
import { genRound } from "../gen.js?v=1";
import { LEVELS, MEDALS, roundXp } from "../game.js?v=1";
import { STRINGS } from "../strings.js?v=1";

const TESTS_DIR = dirname(fileURLToPath(import.meta.url));
const APP_DIR = join(TESTS_DIR, "..");
const SHOTS_DIR = join(TESTS_DIR, "screenshots");
const PORT = 8491;
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
const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "'");

// Runden über Ganzzahl-Arithmetik (kein Float-Rauschen).
function roundFixed(valueStr, decimals) {
  const [int, frac = ""] = valueStr.split(".");
  const scale = frac.length;
  const scaled = Number(int + frac);
  const drop = 10 ** (scale - decimals);
  const rounded = Math.floor((scaled + drop / 2) / drop) * drop;
  return (rounded / 10 ** scale).toFixed(decimals);
}

// Unabhängig neu aufgeschriebene Binom-Tabelle (Frage → richtige Antwort).
const BINOM = {
  "(a + b)² = ?": "a² + 2ab + b²",
  "(a - b)² = ?": "a² - 2ab + b²",
  "(a + b) · (a - b) = ?": "a² - b²",
};

function solveTyped(expr) {
  let m;
  if ((m = expr.match(/^(\d+) und (\d+) Knöpfe\. Verteile gleich: \? und \?$/))) {
    return String((num(m[1]) + num(m[2])) / 2);
  }
  if ((m = expr.match(/^(\d+) = (\d+) \+ \?$/))) return String(num(m[1]) - num(m[2]));
  if ((m = expr.match(/^(\d+) \+ (\d+) = (\d+) \+ (\d+) \+ \?$/))) {
    return String(num(m[1]) + num(m[2]) - num(m[3]) - num(m[4]));
  }
  if ((m = expr.match(/^(\d+) \+ (\d+) \+ (\d+) = (\d+) \+ \?$/))) {
    return String(num(m[1]) + num(m[2]) + num(m[3]) - num(m[4]));
  }
  if ((m = expr.match(/^(\d+) \+ (\d+) = (\d+) \+ \?$/))) {
    return String(num(m[1]) + num(m[2]) - num(m[3]));
  }
  if ((m = expr.match(/^(\d+) - (\d+) = \? \(denn (\d+) \+ \? = (\d+)\)$/))) {
    return String(num(m[1]) - num(m[2]));
  }
  if ((m = expr.match(/^(\d+) · (\d+) = (\d+) · (\d+) \+ \?$/))) {
    return String(num(m[1]) * num(m[2]) - num(m[3]) * num(m[4]));
  }
  if ((m = expr.match(/^(\d+) · (\d+) · (\d+) = (\d+) · \?$/))) {
    return String((num(m[1]) * num(m[2]) * num(m[3])) / num(m[4]));
  }
  if ((m = expr.match(/^(\d+) · (\d+) = (\d+) · \?$/))) {
    return String((num(m[1]) * num(m[2])) / num(m[3]));
  }
  if ((m = expr.match(/^(\d+) : (\d+) = \? \(denn \? · (\d+) = (\d+)\)$/))) {
    return String(num(m[1]) / num(m[2]));
  }
  if ((m = expr.match(/^(\d+) · (\d+) = (\d+)\. Also: (\d+) · (\d+) = \?$/))) {
    return String(num(m[4]) * num(m[5]));
  }
  if ((m = expr.match(/^Runde ([\d']+) auf (10er|100er|1'000er): \?$/))) {
    const place = m[2] === "10er" ? 10 : m[2] === "100er" ? 100 : 1000;
    return fmt(Math.round(num(m[1]) / place) * place);
  }
  if ((m = expr.match(/^Runde ([\d.]+) auf Zehntel: \?$/))) return roundFixed(m[1], 1);
  if ((m = expr.match(/^Runde ([\d.]+) auf Hundertstel: \?$/))) return roundFixed(m[1], 2);
  if ((m = expr.match(/^(\d+) \+ (\d+) · (\d+) - (\d+) = \?$/))) {
    return String(num(m[1]) + num(m[2]) * num(m[3]) - num(m[4]));
  }
  if ((m = expr.match(/^\((\d+) \+ (\d+) - (\d+)\) · (\d+) = \?$/))) {
    return String((num(m[1]) + num(m[2]) - num(m[3])) * num(m[4]));
  }
  if ((m = expr.match(/^(\d+) \+ \((\d+) - (\d+)\) · (\d+) = \?$/))) {
    return String(num(m[1]) + (num(m[2]) - num(m[3])) * num(m[4]));
  }
  if ((m = expr.match(/^x \+ (\d+) = (\d+)\. x = \?$/))) return String(num(m[2]) - num(m[1]));
  if ((m = expr.match(/^(\d+) · x = (\d+)\. x = \?$/))) return String(num(m[2]) / num(m[1]));
  if ((m = expr.match(/^(\d+(?: · \d+)+) = (\d+)\^\?$/))) {
    return String(m[1].split(" · ").length);
  }
  if ((m = expr.match(/^(\d+) · \((\d+) \+ (\d+)\) = (\d+) · (\d+) \+ (\d+) · \?$/))) {
    return String(num(m[3]));
  }
  if ((m = expr.match(/^(\d+)x \+ (\d+) = (\d+)\. x = \?$/))) {
    return String((num(m[3]) - num(m[2])) / num(m[1]));
  }
  if ((m = expr.match(/^(\d+)([abx]) ([+-]) (\d+)\2 = \?$/))) {
    const v = m[3] === "+" ? num(m[1]) + num(m[4]) : num(m[1]) - num(m[4]);
    return `${v === 1 ? "" : v}${m[2]}`;
  }
  if ((m = expr.match(/^(\d+)a \+ (\d+)b ([+-]) (\d+)a = \?$/))) {
    const aSum = m[3] === "+" ? num(m[1]) + num(m[4]) : num(m[1]) - num(m[4]);
    return `${aSum === 1 ? "" : aSum}a + ${m[2]}b`;
  }
  if ((m = expr.match(/^x² - ([\d']+) = 0\. x = \? \(positive Lösung\)$/))) {
    return String(Math.round(Math.sqrt(num(m[1]))));
  }
  if ((m = expr.match(/^(\d+) · (\d+)² = \?$/))) return String(num(m[1]) * num(m[2]) ** 2);
  if ((m = expr.match(/^\((\d+) · (\d+)\)² = \?$/))) return String((num(m[1]) * num(m[2])) ** 2);
  return null;
}

function chooseOption(expr, options) {
  let m;
  if (expr in BINOM) return options.indexOf(BINOM[expr]);
  if ((m = expr.match(/^Welche Zahl ist durch (\d+) teilbar\?$/))) {
    return options.findIndex((o) => num(o) % num(m[1]) === 0);
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
  check("data: Stufe j marked as Erweiterung", STUFEN.find((s) => s.id === "j").erweiterung === true);
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
    const rng = mulberry32(13 + stufe.id.charCodeAt(0));
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
check("home: title renders", (await page.textContent("h1")).trim() === "Rechenkniff");
check("home: 12 Stufen with three GA badges and one Erweiterung tag",
  await page.locator(".stufe").count() === 12
  && await page.locator(".ga-badge").count() === 3
  && await page.locator(".stufe-tag").count() === 1);
check("home: competency code visible", (await page.textContent('[data-stufe="c"]')).includes("MA.1.A.4.c"));
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
