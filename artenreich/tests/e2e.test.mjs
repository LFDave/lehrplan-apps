// e2e.test.mjs — Playwright end-to-end tests for Artenreich.
//
// Run:
//   cd artenreich/tests && npm install && node e2e.test.mjs
//
// Part 1 exercises the pure generators with a seeded RNG and checks
// every task against an independent oracle (unabhängig neu
// aufgeschriebene Antwort-Tabellen und eigene Nachrechnungen).
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
const PORT = 8535;
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

// Unabhängige Nachrechnung: eigene, neu aufgeschriebene
// Zuordnungs-Tabelle für Bäume und Tiere, dazu eine Antwort-Tabelle
// für das Artenwissen.
const ZUORDNUNG = {
  "die Buche": "ein Laubbaum", "die Eiche": "ein Laubbaum",
  "der Ahorn": "ein Laubbaum", "die Birke": "ein Laubbaum",
  "die Linde": "ein Laubbaum", "die Tanne": "ein Nadelbaum",
  "die Fichte": "ein Nadelbaum", "die Föhre": "ein Nadelbaum",
  "die Lärche": "ein Nadelbaum",
  "der Fuchs": "ein Wildtier", "das Reh": "ein Wildtier",
  "der Igel": "ein Wildtier", "das Eichhörnchen": "ein Wildtier",
  "die Kuh": "ein Nutztier", "das Huhn": "ein Nutztier",
  "das Schaf": "ein Nutztier", "das Schwein": "ein Nutztier",
  "die Katze": "ein Heimtier", "der Hund": "ein Heimtier",
  "das Meerschweinchen": "ein Heimtier", "der Wellensittich": "ein Heimtier",
};

const QA = {
  "Vögel haben ...?": "ein Gefieder aus Federn",
  "Fische atmen mit ...?": "Kiemen",
  "Reptilien haben ...?": "eine Haut aus Hornschuppen",
  "Säugetiere säugen ...?": "ihre Jungen mit Milch",
  "Insekten haben ...?": "sechs Beine",
  "Amphibien wie der Frosch leben ...?": "im Wasser und an Land",
  "Die meisten Vögel können ...?": "fliegen",
  "Fische leben ...?": "im Wasser",
  "Die Amsel gehört zu den ...?": "Singvögeln",
  "Der Mäusebussard ist ein ...?": "Greifvogel",
  "Die Stockente ist ein ...?": "Wasservogel",
  "Was machen Zugvögel im Herbst?": "sie fliegen in den Süden",
  "Was machen Standvögel im Winter?": "sie bleiben das ganze Jahr hier",
  "Die Rauchschwalbe ist ein ...?": "Zugvogel",
  "Die Kohlmeise ist ein ...?": "Standvogel",
  "Womit bestimmst du einen unbekannten Vogel?": "mit einem Bestimmungsbuch",
  "Wozu dient ein Feldstecher?": "Vögel aus der Distanz gross zu sehen",
  "Die Eule jagt vor allem ...?": "in der Nacht",
  "Das Fell des Maulwurfs ...?": "passt zum Leben in Grabgängen",
  "Die Schwimmhäute der Ente ...?": "helfen beim Schwimmen",
  "Der Specht hat einen kräftigen Schnabel, um ...?": "in Holz zu hämmern",
  "Der Igel schützt sich mit ...?": "seinen Stacheln",
  "Das weisse Winterfell des Schneehasen ...?": "tarnt ihn im Schnee",
  "Fische sind stromlinienförmig, damit ...?": "sie leicht durchs Wasser gleiten",
  "Die langen Wurzeln mancher Pflanzen ...?": "holen Wasser aus der Tiefe",
  "Der Biber hat einen flachen Schwanz, der ...?": "beim Schwimmen steuert",
  "Welches Merkmal hilft beim Ordnen von Bäumen?": "die Blattform",
  "Was unterscheidet Gehölze von Kräutern?": "Gehölze haben verholzte Stängel",
  "Wozu dient ein Ordnungssystem?": "Lebewesen nach Merkmalen zu gruppieren",
  "Die Blüte dient der Pflanze ...?": "zur Fortpflanzung",
  "Amsel, Meise und Fink bilden eine Gruppe, weil ...?": "sie Singvögel sind",
  "Ein gutes Kriterium zum Ordnen ist ...?": "ein Merkmal, das man klar erkennt",
  "Ein anatomisches Merkmal der Säugetiere ist ...?": "das Fell",
  "Pilze sind ...?": "weder Pflanzen noch Tiere",
  "Zu welcher Insektengruppe gehört der Marienkäfer?": "zu den Käfern",
  "Das Tagpfauenauge gehört zu den ...?": "Schmetterlingen",
  "Ist die Spinne ein Insekt?": "Nein, sie hat acht Beine",
  "Die Heuschrecke erkennt man an ...?": "den kräftigen Sprungbeinen",
  "Libellen jagen ...?": "im Flug über Wasser und Wiese",
  "Ist der Löwenzahn krautig oder holzig?": "krautig",
  "Ist der Haselstrauch krautig oder holzig?": "holzig",
  "Ameisen leben ...?": "in Staaten mit vielen Tieren",
  "Die Biene gehört wie die Wespe zu den ...?": "Hautflüglern",
};

function solveTyped(expr) {
  return QA[expr] ?? null;
}

function chooseOption(expr, options) {
  let m;
  if ((m = expr.match(/^Ist (\S+ \S+) ein Laubbaum oder ein Nadelbaum\?$/))) {
    return options.indexOf(ZUORDNUNG[m[1]]);
  }
  if ((m = expr.match(/^Ist (\S+ \S+) ein Wildtier, ein Nutztier oder ein Heimtier\?$/))) {
    return options.indexOf(ZUORDNUNG[m[1]]);
  }
  return expr in QA ? options.indexOf(QA[expr]) : -1;
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
      if (m[0].includes("http") || m[0].includes('"#') || m[0].includes("${") || m[0].includes("../")) continue;
      if (m[2]) versions.add(m[2]);
      else unversioned.push(`${file}: ${m[0]}`);
    }
  }
  check("cache-busting: every local asset ref carries ?v=", unversioned.length === 0, unversioned.join("; "));
  check("cache-busting: one single version everywhere", versions.size === 1, [...versions].join(","));
}

/* ── Data and copy sanity ─────────────────────────────────────────── */
{
  check("data: 6 Stufen a-f", STUFEN.length === 6 && STUFEN.map((s) => s.id).join("") === "abcdef");
  check("data: GA marks on b and e",
    STUFEN.filter((s) => s.ga).map((s) => s.id).join(",") === "b,e");
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
    const rng = mulberry32(70 + stufe.id.split("").reduce((n, ch, i) => n + ch.charCodeAt(0) * (i + 1), 0));
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
  check("gen: seeded rounds agree with the independent oracle", issues.length === 0, issues.slice(0, 4).join("; "));
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
check("home: title renders", (await page.textContent("h1")).trim() === "Artenreich");
check("home: all Stufen with GA badges",
  await page.locator(".stufe").count() === 6 && await page.locator(".ga-badge").count() === 2);
check("home: competency code visible", (await page.textContent('[data-stufe="b"]')).includes("NMG.2.4.b"));
await page.screenshot({ path: join(SHOTS_DIR, "01-home.png"), fullPage: true });

await playRound("b");
check("round b: completion shows XP", (await page.textContent(".reward-xp")).includes(`+${roundXp("b", 8)} XP`));
check("round b: GA medal for Zyklus 1", (await page.textContent(".done")).includes("Grundanspruch Zyklus 1"));
check("round b: clean-run praise", (await page.textContent(".done-summary")).includes("Stark!"));
await page.screenshot({ path: join(SHOTS_DIR, "02-done.png"), fullPage: true });
await page.click('[data-action="home"]');
await page.waitForSelector(".stufen-list");

await playRound("e");
check("round e: completion shows XP", (await page.textContent(".reward-xp")).includes(`+${roundXp("e", 8)} XP`));
check("round e: GA medal for Zyklus 2", (await page.textContent(".done")).includes("Grundanspruch Zyklus 2"));
await page.click('[data-action="home"]');
await page.waitForSelector(".stufen-list");

/* ── Persistence, mistake flow, reset ─────────────────────────────── */
await page.waitForSelector(".stats-strip");
const expectedXp = roundXp("b", 8) + roundXp("e", 8);
check("home: stats strip shows accumulated XP", (await page.textContent(".stats-strip")).includes(`${expectedXp} XP`));
await page.reload();
await page.waitForSelector(".stats-strip");
check("persistence: XP survives reload", (await page.textContent(".stats-strip")).includes(`${expectedXp} XP`));

await page.click('[data-stufe="a"]');
await page.waitForSelector(".task-area");
{
  const expr = (await page.textContent(".sequence .term")).trim();
  if (await page.locator(".typed-input").count()) {
    const right = solveTyped(expr);
    await page.fill(".typed-input", `${right}x`);
    check("mistake: wrong answer marked and announced",
      await page.locator(".typed-input.wrong").count() === 1
      && (await page.textContent("#feedback")).includes("Fast"));
    await page.fill(".typed-input", String(right));
  } else {
    const options = (await page.locator("[data-option]").allTextContents()).map((o) => o.trim());
    const right = chooseOption(expr, options);
    const wrong = right === 0 ? 1 : 0;
    await page.click(`[data-option="${wrong}"]`);
    check("mistake: wrong answer marked and announced",
      await page.locator(".choice.wrong").count() === 1
      && (await page.textContent("#feedback")).includes("Fast"));
    await page.click(`[data-option="${right}"]`);
  }
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
