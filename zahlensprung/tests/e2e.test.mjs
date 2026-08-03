// e2e.test.mjs — Playwright end-to-end tests for Zahlensprung.
//
// Run:
//   cd zahlensprung/tests && npm install && node e2e.test.mjs
//
// Part 1 exercises the pure generators with a seeded RNG (ranges bound
// every number including the answer, sequences are arithmetic, order
// answers are sorted permutations, the correct estimate option is the
// one closest to the true value). Part 2 drives the real app in
// Chromium: a full round per interaction pattern (typing, ordering,
// choosing), rewards, persistence, reset. Screenshots land in
// tests/screenshots/ (gitignored).

import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { mkdirSync, existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { STUFEN, stufeById } from "../data.js?v=1";
import { genRound, formatNumber } from "../gen.js?v=1";
import { LEVELS, MEDALS, levelFor, roundXp, earnedMedals } from "../game.js?v=1";
import { STRINGS } from "../strings.js?v=1";

const TESTS_DIR = dirname(fileURLToPath(import.meta.url));
const APP_DIR = join(TESTS_DIR, "..");
const SHOTS_DIR = join(TESTS_DIR, "screenshots");
const PORT = 8481;
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

const num = (s) => parseFloat(String(s).replace(/'/g, ""));

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
    const refs = [...text.matchAll(/(?:href="[^"]+?|src="[^"]+?|from '\.\/[^']+?|import\('\.\/[^']+?|url\('fonts\/[^']+?)(\?v=(\d+))?["')]/g)];
    for (const m of refs) {
      if (m[0].includes("http") || m[0].includes('"#')) continue;
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
  check("data: GA marks on c, g, j with cycles 1, 2, 3",
    STUFEN.filter((s) => s.ga).map((s) => `${s.id}${s.cycle}`).join(",") === "c1,g2,j3");
  const eszett = [];
  for (const [id, v] of Object.entries(STRINGS.de)) if (v.includes("ß")) eszett.push(id);
  for (const s of STUFEN) if ((s.title + s.desc).includes("ß")) eszett.push(s.id);
  for (const m of MEDALS) if ((m.name + m.desc).includes("ß")) eszett.push(m.key);
  for (const l of LEVELS) if (l.name.includes("ß")) eszett.push(l.key);
  check("copy: Swiss standard German, no ß anywhere", eszett.length === 0, eszett.join(","));
  check("game: levels strictly increasing from 0",
    LEVELS[0].xp === 0 && LEVELS.every((l, i) => i === 0 || l.xp > LEVELS[i - 1].xp));
  check("game: second level reachable within a first session",
    LEVELS[1].xp <= 3 * roundXp("a", 8));
}

/* ── Generator sanity (seeded) ────────────────────────────────────── */
{
  const issues = [];
  for (const stufe of STUFEN) {
    const rng = mulberry32(42 + stufe.id.charCodeAt(0));
    for (let r = 0; r < 40; r++) {
      for (const task of genRound(rng, stufe, 8)) {
        if (task.type === "count") {
          if (task.dots < 1 || task.dots > stufe.params.countMax) issues.push(`${stufe.id}: count out of range`);
          if (task.answer !== String(task.dots)) issues.push(`${stufe.id}: count answer mismatch`);
        } else if (task.type === "sequence") {
          const values = [...task.terms, task.answer].map(num);
          const step = values[1] - values[0];
          for (let i = 1; i < values.length; i++) {
            if (Math.abs(values[i] - values[i - 1] - step) > 1e-9) issues.push(`${stufe.id}: not arithmetic (${values.join(", ")})`);
          }
          if (values.some((v) => v < 0 || v > stufe.params.max)) issues.push(`${stufe.id}: sequence out of range (${values.join(", ")})`);
        } else if (task.type === "order") {
          const items = task.items.map(num);
          const answer = task.answer.map(num);
          const sorted = [...items].sort((a, b) => a - b);
          if (answer.join("|") !== sorted.join("|")) issues.push(`${stufe.id}: order answer not sorted`);
          if (new Set(task.items).size !== task.items.length) issues.push(`${stufe.id}: duplicate order items`);
        } else if (task.type === "estimate") {
          const options = task.options.map(num);
          if (new Set(options).size !== options.length) issues.push(`${stufe.id}: duplicate estimate options`);
          const m = task.expr.match(/^(?:([\d.']+) ([+\-·:]) ([\d.']+)|(\d+)% von ([\d.']+))$/);
          if (!m) { issues.push(`${stufe.id}: unparsable expr ${task.expr}`); continue; }
          let truth;
          if (m[4]) truth = num(m[5]) * num(m[4]) / 100;
          else {
            const [a, b] = [num(m[1]), num(m[3])];
            truth = m[2] === "+" ? a + b : m[2] === "-" ? a - b : m[2] === "·" ? a * b : a / b;
          }
          const nearest = options.reduce((best, o) => Math.abs(o - truth) < Math.abs(best - truth) ? o : best);
          if (nearest !== options[task.answer]) issues.push(`${stufe.id}: correct option not nearest for ${task.expr} (truth ${truth}, options ${options.join(",")})`);
        }
      }
    }
  }
  check("gen: 400 seeded rounds per Stufe are valid and range-bounded", issues.length === 0, issues.slice(0, 4).join("; "));
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

/* Solve the currently shown task by reading the DOM. */
async function solveTask() {
  if (await page.locator(".typed-input").count()) {
    let answer;
    if (await page.locator(".dots").count()) {
      answer = String(await page.locator(".dot").count());
    } else {
      const terms = (await page.locator(".sequence .term:not(.blank)").allTextContents()).map(num);
      const step = terms[1] - terms[0];
      const value = terms[terms.length - 1] + step;
      const decimals = Math.max(...terms.map((t) => (String(t).split(".")[1] || "").length),
        (String(step).split(".")[1] || "").length);
      answer = formatNumber(Math.round(value * 1000) / 1000, decimals);
    }
    await page.fill(".typed-input", answer);
  } else if (await page.locator("[data-pick]").count()) {
    const items = (await page.locator("[data-pick]").allTextContents()).map(num);
    const order = items.map((v, i) => [v, i]).sort((a, b) => a[0] - b[0]).map(([, i]) => i);
    for (const i of order) await page.click(`[data-pick="${i}"]`);
  } else {
    const expr = (await page.textContent(".sequence .term")).replace(" ≈ ?", "");
    const options = (await page.locator("[data-option]").allTextContents()).map(num);
    const m = expr.match(/^(?:([\d.']+) ([+\-·:]) ([\d.']+)|(\d+)% von ([\d.']+))$/);
    let truth;
    if (m[4]) truth = num(m[5]) * num(m[4]) / 100;
    else {
      const [a, b] = [num(m[1]), num(m[3])];
      truth = m[2] === "+" ? a + b : m[2] === "-" ? a - b : m[2] === "·" ? a * b : a / b;
    }
    const best = options.reduce((bi, o, i) => Math.abs(o - truth) < Math.abs(options[bi] - truth) ? i : bi, 0);
    await page.click(`[data-option="${best}"]`);
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

/* ── Home ─────────────────────────────────────────────────────────── */
await page.goto(URL);
await page.waitForSelector(".stufen-list");
check("home: title renders", (await page.textContent("h1")).trim() === "Zahlensprung");
check("home: 10 Stufen listed", await page.locator(".stufe").count() === 10);
check("home: three Grundanspruch badges",
  (await page.locator(".ga-badge").allTextContents()).join(",").includes("Zyklus 1")
  && await page.locator(".ga-badge").count() === 3);
check("home: competency code visible", (await page.textContent('[data-stufe="c"]')).includes("MA.1.A.2.c"));
await page.screenshot({ path: join(SHOTS_DIR, "01-home.png"), fullPage: true });

/* ── Round on Stufe b (typed sequences) ───────────────────────────── */
await playRound("b");
check("round b: completion screen shows XP", (await page.textContent(".reward-xp")).includes(`+${roundXp("b", 8)} XP`));
check("round b: clean-run praise shown", (await page.textContent(".done-summary")).includes("Stark!"));
check("round b: first-round medal appears", (await page.textContent(".done")).includes("Erste Runde"));
await page.screenshot({ path: join(SHOTS_DIR, "02-done.png"), fullPage: true });

/* ── Persistence ──────────────────────────────────────────────────── */
await page.click('[data-action="home"]');
await page.waitForSelector(".stats-strip");
const xpAfterB = roundXp("b", 8);
check("home: stats strip shows earned XP", (await page.textContent(".stats-strip")).includes(`${xpAfterB} XP`));
await page.reload();
await page.waitForSelector(".stats-strip");
check("persistence: XP survives reload", (await page.textContent(".stats-strip")).includes(`${xpAfterB} XP`));

/* ── Round on Stufe a (counting dots + ordering) ──────────────────── */
await playRound("a");
await page.click('[data-action="home"]');

/* ── Round on Stufe j (ordering negatives) and h (estimates) ──────── */
await page.waitForSelector(".stufen-list");
await playRound("j");
check("round j: GA medal for Zyklus 3 after clean run", (await page.textContent(".done")).includes("Grundanspruch Zyklus 3"));
await page.click('[data-action="home"]');
await page.waitForSelector(".stufen-list");
await playRound("h");
await page.screenshot({ path: join(SHOTS_DIR, "03-estimate-done.png"), fullPage: true });
await page.click('[data-action="home"]');

/* ── Wrong answer flow on Stufe b ─────────────────────────────────── */
await page.waitForSelector(".stufen-list");
await page.click('[data-stufe="b"]');
await page.waitForSelector(".typed-input");
{
  const terms = (await page.locator(".sequence .term:not(.blank)").allTextContents()).map(num);
  const step = terms[1] - terms[0];
  const wrong = String(terms[terms.length - 1] + step + 1);
  await page.fill(".typed-input", wrong);
  check("mistake: wrong typed answer is marked and announced",
    await page.locator(".typed-input.wrong").count() === 1
    && (await page.textContent("#feedback")).includes("Fast"));
  await page.fill(".typed-input", String(terms[terms.length - 1] + step));
  check("mistake: corrected answer still solves the task",
    await page.locator('[data-action="next"]').count() === 1);
  await page.screenshot({ path: join(SHOTS_DIR, "04-task-sequence.png"), fullPage: false });
  await page.click('[data-action="abort"]');
}

/* ── Medal gallery ────────────────────────────────────────────────── */
await page.waitForSelector(".stats-strip");
await page.click(".stats-strip");
await page.waitForSelector(".medal-list");
check("medals: gallery lists all medals with locked state visible",
  await page.locator(".medal-row").count() === MEDALS.length
  && await page.locator(".medal-row.earned").count() >= 3);
await page.screenshot({ path: join(SHOTS_DIR, "05-medals.png"), fullPage: true });
await page.goBack();

/* ── Reset ────────────────────────────────────────────────────────── */
await page.waitForSelector(".stufen-list");
await page.click('[data-action="reset-arm"]');
await page.waitForSelector(".reset-confirm");
check("reset: asks for confirmation and names the device storage",
  (await page.textContent(".reset-confirm p")).includes("Gerät"));
await page.click('[data-action="reset-confirm"]');
await page.waitForSelector('[data-action="reset-arm"]');
check("reset: XP back to zero", (await page.textContent(".stats-strip")).includes("0 XP"));

/* ── Layout and hygiene ───────────────────────────────────────────── */
await page.setViewportSize({ width: 320, height: 700 });
await page.goto(URL);
await page.waitForSelector(".stufen-list");
const noHorizScroll = await page.evaluate(() =>
  document.documentElement.scrollWidth <= document.documentElement.clientWidth);
check("layout: no horizontal scrolling at 320px", noHorizScroll);

check("console: no errors", consoleErrors.length === 0, consoleErrors.slice(0, 3).join(" | "));
check("network: no external requests", externalRequests.length === 0, externalRequests.slice(0, 3).join(", "));

await browser.close();
server.close();
console.log(failures === 0 ? "\nAll tests passed." : `\n${failures} test(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
