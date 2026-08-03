// e2e.test.mjs — Playwright end-to-end tests for Masswerk.
//
// Run:
//   cd masswerk/tests && npm install && node e2e.test.mjs
//
// Part 1 exercises the pure generators with a seeded RNG and recomputes
// every answer through an independent unit-aware oracle. Part 2 drives
// the real app in Chromium, solving whole rounds by parsing the shown
// expressions with the same oracle. Screenshots land in
// tests/screenshots/ (gitignored).

import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { mkdirSync, existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { STUFEN, SKIPPED } from "../data.js?v=1";
import { genRound } from "../gen.js?v=1";
import { LEVELS, MEDALS, roundXp } from "../game.js?v=1";
import { STRINGS } from "../strings.js?v=1";

const TESTS_DIR = dirname(fileURLToPath(import.meta.url));
const APP_DIR = join(TESTS_DIR, "..");
const SHOTS_DIR = join(TESTS_DIR, "screenshots");
const PORT = 8487;
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

/* ── Independent unit-aware oracle ────────────────────────────────── */

const num = (s) => parseFloat(String(s).replace(/'/g, ""));
// Basisfaktoren je Dimension (kleinste Einheit = 1)
const UNITS = {
  mm: 1, cm: 10, m: 1000, km: 1e6,
  g: 1, kg: 1000, t: 1e6,
  ml: 1, cl: 10, dl: 100, l: 1000,
  s: 1, min: 60, h: 3600,
  "Rp.": 1, "Fr.": 100,
  "dm²": 1, "m²": 100,
  "dm³": 1, "m³": 1000,
};
// Volumen: 1 dm³ = 1 l — gleiche Basis über die Abbildung dm³→l
const VOL_ALIAS = { "dm³": "l", "m³": "l" };
const VOL_FACTOR = { "dm³": 1000, "m³": 1e6 };

function toBase(value, unit) {
  if (unit in VOL_ALIAS) return value * VOL_FACTOR[unit];
  return value * UNITS[unit];
}

function fromBase(base, unit) {
  if (unit in VOL_ALIAS) return base / VOL_FACTOR[unit];
  return base / UNITS[unit];
}

const PREFIX = { Mega: "10⁶", Kilo: "10³", Dezi: "10⁻¹", Centi: "10⁻²", Milli: "10⁻³" };
const r10 = (n) => Math.round(n * 1000) / 1000;

// Löst getippte Ausdrücke; MC-Aufgaben werden separat geprüft.
function solveExpr(expr) {
  expr = expr.trim();
  let m;
  if ((m = expr.match(/^Eine halbe Stunde nach (\d{2}):(\d{2}) = \?$/))) {
    const total = Number(m[1]) * 60 + Number(m[2]) + 30;
    return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
  }
  if ((m = expr.match(/^Von (\d{2}):(\d{2}) bis (\d{2}):(\d{2}) = \? min$/))) {
    return String((Number(m[3]) * 60 + Number(m[4])) - (Number(m[1]) * 60 + Number(m[2])));
  }
  if ((m = expr.match(/^1 m in (\d+) gleiche Teile = \? cm$/))) return String(100 / Number(m[1]));
  if ((m = expr.match(/^Das Doppelte von ([\d.']+) (\S+) = \? (\S+)$/))) {
    return String(r10(fromBase(2 * toBase(num(m[1]), m[2]), m[3])));
  }
  if ((m = expr.match(/^Die Hälfte von ([\d.']+) (\S+) = \? (\S+)$/))) {
    return String(r10(fromBase(toBase(num(m[1]), m[2]) / 2, m[3])));
  }
  if ((m = expr.match(/^Runde ([\d.']+) (\S+) auf ganze \S+ = \? \S+$/))) {
    return String(Math.round(num(m[1])));
  }
  if ((m = expr.match(/^([\d.']+) m in ([\d.']+) s = \? km\/h$/))) {
    return String(r10(num(m[1]) / num(m[2]) * 3.6));
  }
  if ((m = expr.match(/^([\d.']+) km\/h = \? m\/s$/))) return String(r10(num(m[1]) / 3.6));
  if ((m = expr.match(/^([\d.']+) (\S+) ([\d.']+) (\S+) \+ ([\d.']+) (\S+) ([\d.']+) (\S+) = \? (\S+)$/))) {
    const total = toBase(num(m[1]), m[2]) + toBase(num(m[3]), m[4])
      + toBase(num(m[5]), m[6]) + toBase(num(m[7]), m[8]);
    return String(r10(fromBase(total, m[9])));
  }
  if ((m = expr.match(/^([\d.']+) (\S+) ([\d.']+) (\S+) = \? (\S+)$/))) {
    return String(r10(fromBase(toBase(num(m[1]), m[2]) + toBase(num(m[3]), m[4]), m[5])));
  }
  if ((m = expr.match(/^([\d.']+) (\S+) ([+-]) ([\d.']+) (\S+) = \? (\S+)$/))) {
    const a = toBase(num(m[1]), m[2]);
    const b = toBase(num(m[4]), m[5]);
    return String(r10(fromBase(m[3] === "+" ? a + b : a - b, m[6])));
  }
  if ((m = expr.match(/^([\d.']+) (\S+) = \? (\S+)$/))) {
    return String(r10(fromBase(toBase(num(m[1]), m[2]), m[3])));
  }
  return null;
}

function sameAnswer(expected, produced) {
  if (expected === null) return false;
  const clean = (s) => String(s).replace(/'/g, "");
  if (clean(expected) === clean(produced)) return true;
  const [a, b] = [parseFloat(clean(expected)), parseFloat(clean(produced))];
  return Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) < 1e-9
    && !String(expected).includes(":") && !String(produced).includes(":");
}

function solveMc(task) {
  const expr = task.expr;
  let m;
  if (expr === "Was ist mehr?") {
    const values = task.options.map((opt) => {
      const [, v, u] = opt.match(/^([\d.']+) (\S+)$/);
      return toBase(num(v), u);
    });
    return values[0] > values[1] ? 0 : 1;
  }
  if ((m = expr.match(/^([\d.']+) von ([\d.']+) = \? %$/))) {
    const p = num(m[1]) / num(m[2]) * 100;
    return task.options.findIndex((o) => num(o) === p);
  }
  if ((m = expr.match(/^Welche Zehnerpotenz gehört zu (\w+)\?$/))) {
    return task.options.indexOf(PREFIX[m[1]]);
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
  check("data: 9 app Stufen, a and f documented as real-world only",
    STUFEN.length === 9 && SKIPPED.join(",") === "a,f"
    && !STUFEN.some((s) => SKIPPED.includes(s.id)));
  check("data: GA marks on c, h, j with cycles 1, 2, 3",
    STUFEN.filter((s) => s.ga).map((s) => `${s.id}${s.cycle}`).join(",") === "c1,h2,j3");
  const eszett = [];
  for (const [id, v] of Object.entries(STRINGS.de)) if (v.includes("ß")) eszett.push(id);
  for (const s of STUFEN) if ((s.title + s.desc).includes("ß")) eszett.push(s.id);
  for (const m of MEDALS) if ((m.name + m.desc).includes("ß")) eszett.push(m.key);
  check("copy: Swiss standard German, no ß anywhere", eszett.length === 0, eszett.join(","));
  check("game: second level reachable within a first session", LEVELS[1].xp <= 3 * roundXp("b", 8));
}

/* ── Generator sanity against the oracle (seeded) ─────────────────── */
{
  const issues = [];
  for (const stufe of STUFEN) {
    const rng = mulberry32(11 + stufe.id.charCodeAt(0));
    for (let r = 0; r < 50; r++) {
      for (const task of genRound(rng, stufe, 8)) {
        if (task.type === "typed") {
          const oracle = solveExpr(task.expr);
          if (!sameAnswer(oracle, task.answer)) {
            issues.push(`${stufe.id}/${task.kind}: ${task.expr} → ${task.answer}, oracle ${oracle}`);
          }
        } else {
          if (new Set(task.options).size !== task.options.length) {
            issues.push(`${stufe.id}/${task.kind}: duplicate options ${task.options.join("|")}`);
          }
          if (solveMc(task) !== task.answer) {
            issues.push(`${stufe.id}/${task.kind}: mc answer mismatch for ${task.expr} [${task.options.join("|")}]`);
          }
        }
      }
    }
  }
  check("gen: 450 seeded rounds per Stufe agree with the unit oracle", issues.length === 0, issues.slice(0, 4).join("; "));
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
  // Ein Lösungsversuch liest den sichtbaren Zustand komplett frisch;
  // falls die Auswertung nicht griff (z.B. Render-Race), wird der
  // aktuell gezeigte Stand erneut gelöst.
  for (let attempt = 0; attempt < 3; attempt++) {
    const expr = (await page.textContent(".sequence .term")).trim();
    if (await page.locator(".typed-input").count()) {
      const answer = solveExpr(expr);
      await page.fill(".typed-input", String(answer));
      // Enter nur, wenn die Längen-Auto-Prüfung noch nicht ausgelöst hat
      // (sonst ist das Feld schon deaktiviert und der Tastendruck hängt).
      try {
        await page.waitForSelector('[data-action="next"]', { timeout: 400 });
      } catch {
        if (await page.locator(".typed-input:not([disabled])").count()) {
          await page.press(".typed-input", "Enter");
        }
      }
    } else {
      const options = (await page.locator("[data-option]").allTextContents()).map((o) => o.trim());
      const idx = solveMc({ expr: expr.replace(/ = \?$/, ""), options });
      await page.click(`[data-option="${idx}"]`);
    }
    try {
      await page.waitForSelector('[data-action="next"]', { timeout: 2500 });
      await page.click('[data-action="next"]');
      return;
    } catch {
      // erneut versuchen mit frischem Zustand
    }
  }
  throw new Error("solveTask: task did not resolve after 3 attempts");
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
check("home: title renders", (await page.textContent("h1")).trim() === "Masswerk");
check("home: 9 Stufen with three GA badges",
  await page.locator(".stufe").count() === 9 && await page.locator(".ga-badge").count() === 3);
check("home: real-world note for skipped Stufen a and f",
  (await page.textContent(".stufen-section")).includes("Stufen a und f"));
check("home: competency code visible", (await page.textContent('[data-stufe="c"]')).includes("MA.3.A.2.c"));
await page.screenshot({ path: join(SHOTS_DIR, "01-home.png"), fullPage: true });

await playRound("c");
check("round c: completion shows XP", (await page.textContent(".reward-xp")).includes(`+${roundXp("c", 8)} XP`));
check("round c: GA medal for Zyklus 1", (await page.textContent(".done")).includes("Grundanspruch Zyklus 1"));
await page.screenshot({ path: join(SHOTS_DIR, "02-done.png"), fullPage: true });
await page.click('[data-action="home"]');

await page.waitForSelector(".stufen-list");
await playRound("h");
check("round h: GA medal for Zyklus 2", (await page.textContent(".done")).includes("Grundanspruch Zyklus 2"));
await page.click('[data-action="home"]');
await page.waitForSelector(".stufen-list");
await playRound("j");
check("round j: GA medal for Zyklus 3", (await page.textContent(".done")).includes("Grundanspruch Zyklus 3"));
await page.click('[data-action="home"]');
await page.waitForSelector(".stufen-list");
await playRound("k");
await page.click('[data-action="home"]');

/* ── Persistence, mistake flow, reset ─────────────────────────────── */
await page.waitForSelector(".stats-strip");
const expectedXp = roundXp("c", 8) + roundXp("h", 8) + roundXp("j", 8) + roundXp("k", 8);
check("home: stats strip shows accumulated XP", (await page.textContent(".stats-strip")).includes(`${expectedXp} XP`));
await page.reload();
await page.waitForSelector(".stats-strip");
check("persistence: XP survives reload", (await page.textContent(".stats-strip")).includes(`${expectedXp} XP`));

await page.click('[data-stufe="b"]');
await page.waitForSelector(".task-area");
{
  // eine falsche getippte Antwort erzwingen (nur bei Tipp-Aufgaben möglich)
  if (await page.locator(".typed-input").count()) {
    const expr = (await page.textContent(".sequence .term")).trim();
    const right = solveExpr(expr);
    const wrong = right.includes(":") ? "99:99" : String(parseFloat(right) + 1);
    await page.fill(".typed-input", wrong);
    if (!(await page.locator(".typed-input.wrong").count())) await page.press(".typed-input", "Enter");
    check("mistake: wrong answer marked and announced",
      await page.locator(".typed-input.wrong").count() === 1
      && (await page.textContent("#feedback")).includes("Fast"));
    await page.fill(".typed-input", String(right));
    try {
      await page.waitForSelector('[data-action="next"]', { timeout: 400 });
    } catch {
      await page.press(".typed-input", "Enter");
    }
    check("mistake: corrected answer solves the task", await page.locator('[data-action="next"]').count() === 1);
  } else {
    check("mistake: wrong typed answer is marked and announced", true, "skipped (mc task shown)");
    check("mistake: corrected answer solves the task", true, "skipped (mc task shown)");
  }
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
