// e2e.test.mjs — Playwright end-to-end tests for Grössenwissen.
//
// Run:
//   cd groessenwissen/tests && npm install && node e2e.test.mjs
//
// Part 1 exercises the pure generators with a seeded RNG and checks
// every task against an independent oracle: re-stated question tables,
// an own unit-conversion table and the official Swiss coin/note set.
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
const PORT = 8495;
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

// Eigene Umrechnungstabelle (zweite, unabhängige Aufschreibung).
const FACTORS = {
  "m>cm": 100, "Fr.>Rp.": 100, "h>min": 60,
  "kg>g": 1000, "km>m": 1000, "l>dl": 10, "dm>cm": 10, "cm>mm": 10,
  "l>cl": 100, "l>ml": 1000, "t>kg": 1000, "min>s": 60, "g>mg": 1000,
  "dm²>cm²": 100, "m²>dm²": 100, "cm²>mm²": 100, "km²>m²": 1000000,
  "kB>Byte": 1000, "d>h": 24,
  "m³>dm³": 1000, "dm³>cm³": 1000, "m³>l": 1000,
  "ha>a": 100, "a>m²": 100, "ha>m²": 10000, "km²>ha": 100,
};

// Offizielle Schweizer Münzen und Noten bis 20 Franken (unabhängig
// aufgeschrieben; Quelle: Schweizerische Nationalbank / Swissmint).
const REAL = new Set(["5 Rappen", "10 Rappen", "20 Rappen", "50 Rappen",
  "1 Franken", "2 Franken", "5 Franken", "10 Franken (Note)", "20 Franken (Note)"]);

// Neu aufgeschriebene Frage-Tabelle (Frage → richtige Antwort).
const QA = {
  "Was ist das Gegenteil von schwer?": "leicht",
  "Was ist das Gegenteil von leicht?": "schwer",
  "Was ist das Gegenteil von lang?": "kurz",
  "Was ist das Gegenteil von kurz?": "lang",
  "Was ist das Gegenteil von schnell?": "langsam",
  "Was ist das Gegenteil von langsam?": "schnell",
  "Was ist das Gegenteil von breit?": "schmal",
  "Was ist das Gegenteil von schmal?": "breit",
  "Was ist das Gegenteil von dick?": "dünn",
  "Was ist das Gegenteil von dünn?": "dick",
  "Was ist das Gegenteil von gross?": "klein",
  "Was ist das Gegenteil von vorher?": "nachher",
  "Wofür steht die Abkürzung cm?": "Zentimeter",
  "Wofür steht die Abkürzung m?": "Meter",
  "Wofür steht die Abkürzung Fr.?": "Franken",
  "Wofür steht die Abkürzung Rp.?": "Rappen",
  "Welche Abkürzung hat der Zentimeter?": "cm",
  "Welche Abkürzung hat der Franken?": "Fr.",
  "Welche Einheit misst die Zeit?": "Minuten",
  "Welche Einheit misst die Länge?": "Meter",
  "Was wiegt etwa 1 kg?": "eine Packung Mehl",
  "Was wiegt etwa 100 g?": "eine Tafel Schokolade",
  "Was ist etwa 1 km lang?": "ein Spaziergang von 12 Minuten ist länger",
  "Was fasst etwa 1 l?": "eine grosse Milchpackung",
  "Was fasst etwa 1 dl?": "ein kleines Glas",
  "Wie lang ist etwa 1 dm?": "eine Handbreite",
  "Wie lang dauert etwa 1 min?": "60 Sekunden",
  "Wie lang ist etwa 1 mm?": "die Dicke einer Münze",
  "Was bedeutet der Vorsatz Kilo?": "das Tausendfache",
  "Was bedeutet der Vorsatz Dezi?": "ein Zehntel",
  "Was bedeutet der Vorsatz Centi?": "ein Hundertstel",
  "Was bedeutet der Vorsatz Milli?": "ein Tausendstel",
  "Ein Würfel zeigt eine 7. Wie nennt man das?": "unmöglich",
  "Morgen geht die Sonne auf. Wie nennt man das?": "sicher",
  "Beim Würfeln kommt eine 6. Wie nennt man das?": "möglich",
  "Eine Woche hat 8 Tage. Wie nennt man das?": "unmöglich",
  "Nach dem Winter kommt der Frühling. Wie nennt man das?": "sicher",
  "Beim Münzwurf kommt Kopf. Wie nennt man das?": "möglich",
  "Du ziehst aus einem Sack mit nur roten Kugeln eine rote Kugel. Wie nennt man das?": "sicher",
  "Du ziehst aus einem Sack mit nur roten Kugeln eine blaue Kugel. Wie nennt man das?": "unmöglich",
  "Es regnet am nächsten Mittwoch. Wie nennt man das?": "möglich",
  "Welches Diagramm zeigt Anteile von einem Ganzen?": "Kreisdiagramm",
  "Welches Diagramm zeigt eine Entwicklung über die Zeit?": "Liniendiagramm",
  "Welches Diagramm vergleicht Werte nebeneinander?": "Säulendiagramm",
  "Wie nennt man die Zahl, die angibt, wie oft etwas vorkommt?": "Häufigkeit",
  "Was ist das Tausendfache von Kilo?": "Mega",
  "Was ist das Tausendfache von Mega?": "Giga",
  "Was ist das Tausendfache von Giga?": "Tera",
  "Was ist grösser: Mega oder Giga?": "Giga",
  "Was ist grösser: Giga oder Tera?": "Tera",
  "Was ist grösser: Kilo oder Mega?": "Mega",
  "Welches Zeichen steht für den Euro?": "€",
  "Welches Zeichen steht für den Dollar?": "$",
  "Für welche Währung steht CHF?": "Schweizer Franken",
  "Welche Währung gilt in der Schweiz?": "der Franken",
  "Welches Zeichen steht für das britische Pfund?": "£",
  "Welche Einheit misst Geschwindigkeit?": "km/h",
  "Welche Einheit misst die Datenrate?": "kB/s",
  "Wie heisst die waagrechte Achse im Koordinatensystem?": "x-Achse",
  "Wie heisst die senkrechte Achse im Koordinatensystem?": "y-Achse",
  "Wie heisst das Geld, das du bei der Bank anlegst?": "Kapital",
  "Wie heisst die jährliche Vergütung der Bank?": "Zins",
  "Wie heisst der Prozentsatz, mit dem verzinst wird?": "Zinssatz",
  "Was bedeutet Brutto?": "vor den Abzügen",
  "Was bedeutet Netto?": "nach den Abzügen",
  "Was bedeutet 10 % Rabatt?": "10 % günstiger",
  "Was bedeutet der Vorsatz Mikro?": "ein Millionstel",
  "Was bedeutet der Vorsatz Nano?": "ein Milliardstel",
  "Welche Einheit hat die Dichte?": "kg/dm³",
};

function solveTyped(expr) {
  let m;
  if ((m = expr.match(/^1 (\S+) = \? (\S+)$/))) {
    const f = FACTORS[`${m[1]}>${m[2]}`];
    return f === undefined ? null : fmt(f);
  }
  if ((m = expr.match(/^(\d) (?:Note|Noten|Münze|Münzen) à (\d+) Fr\. und (\d) (?:Note|Noten|Münze|Münzen) à (\d+) Fr\. = \? Fr\.$/))) {
    return String(num(m[1]) * num(m[2]) + num(m[3]) * num(m[4]));
  }
  if ((m = expr.match(/^Mittelwert von (\d+), (\d+) und (\d+) = \?$/))) {
    return String((num(m[1]) + num(m[2]) + num(m[3])) / 3);
  }
  if ((m = expr.match(/^Von (\d+) Würfen sind (\d+) Treffer\. Relative Häufigkeit = \? %$/))) {
    return String((100 * num(m[2])) / num(m[1]));
  }
  if ((m = expr.match(/^(\d+) % Rabatt auf (\d+) Fr\. Du sparst \? Fr\.$/))) {
    return String((num(m[1]) * num(m[2])) / 100);
  }
  return null;
}

function chooseOption(expr, options) {
  let m;
  if (expr in QA) return options.indexOf(QA[expr]);
  if (expr === "Welches Geldstück gibt es wirklich?") {
    return options.findIndex((o) => REAL.has(o));
  }
  if ((m = expr.match(/^(\w) ist (\S+) als (\w)\. (\w) ist \2 als (\w)\. Was ist am [^?]+\?$/))) {
    // Kette: m1 > m3 und m4 > m5(=m1) → m4 ist am grössten.
    if (m[5] !== m[1]) return -1;
    return options.indexOf(m[4]);
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
  check("data: GA marks on c, h and l",
    STUFEN.filter((s) => s.ga).map((s) => s.id).join(",") === "c,h,l");
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
    const rng = mulberry32(19 + stufe.id.charCodeAt(0));
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
check("home: title renders", (await page.textContent("h1")).trim() === "Grössenwissen");
check("home: 12 Stufen with three GA badges",
  await page.locator(".stufe").count() === 12 && await page.locator(".ga-badge").count() === 3);
check("home: competency code visible", (await page.textContent('[data-stufe="c"]')).includes("MA.3.A.1.c"));
await page.screenshot({ path: join(SHOTS_DIR, "01-home.png"), fullPage: true });

await playRound("c");
check("round c: completion shows XP", (await page.textContent(".reward-xp")).includes(`+${roundXp("c", 8)} XP`));
check("round c: clean-run praise", (await page.textContent(".done-summary")).includes("Stark!"));
check("round c: GA medal for Zyklus 1", (await page.textContent(".done")).includes("Grundanspruch Zyklus 1"));
await page.screenshot({ path: join(SHOTS_DIR, "02-done.png"), fullPage: true });
await page.click('[data-action="home"]');

await page.waitForSelector(".stufen-list");
await playRound("h");
check("round h: GA medal for Zyklus 2", (await page.textContent(".done")).includes("Grundanspruch Zyklus 2"));
await page.click('[data-action="home"]');
await page.waitForSelector(".stufen-list");
await playRound("l");
check("round l: GA medal for Zyklus 3", (await page.textContent(".done")).includes("Grundanspruch Zyklus 3"));
await page.click('[data-action="home"]');

/* ── Persistence, mistake flow, reset ─────────────────────────────── */
await page.waitForSelector(".stats-strip");
const expectedXp = roundXp("c", 8) + roundXp("h", 8) + roundXp("l", 8);
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
