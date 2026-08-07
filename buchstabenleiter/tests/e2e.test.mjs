// e2e.test.mjs — Playwright end-to-end tests for Buchstabenleiter.
//
// Run:
//   cd buchstabenleiter/tests && npm install && node e2e.test.mjs
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
const PORT = 8523;
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

// Unabhängige Nachrechnung: eigene ABC-Tabelle für Nachbarn, Vokale
// und Gruppen, eigener Wortvergleich für die Wörterbuch-Reihenfolge,
// dazu eine neu aufgeschriebene Antwort-Tabelle für die
// Wissensfragen.
const ABC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const VOKALE = "AEIOU";

const QA = {
  "Wie viele Silben hat «Ba-na-ne»?": "3",
  "Wie viele Silben hat «Scho-ko-la-de»?": "4",
  "Am Wortanfang hörst du «schp» wie in «Spiel». Wie schreibst du?": "sp",
  "Am Wortanfang hörst du «scht» wie in «Stein». Wie schreibst du?": "st",
  "Wozu hilft dir das ABC im Wörterbuch?": "Wörter schneller zu finden",
  "Was ist der Stamm von «fahren, Fahrer, Abfahrt»?": "fahr",
  "Was ist der Stamm von «spielen, Spieler, verspielt»?": "spiel",
  "Du willst «lief» im Wörterbuch nachschlagen. Unter welchem Wort suchst du?": "unter «laufen»",
  "Du willst «ass» im Wörterbuch nachschlagen. Unter welchem Wort suchst du?": "unter «essen»",
  "Warum schreibt man «Bäume» mit äu?": "wegen des Stamms «Baum»",
  "Warum schreibt man «Häuser» mit äu?": "wegen des Stamms «Haus»",
  "Am Ende von «Hund» hörst du ein t. Wie prüfst du die Schreibung?": "verlängern: die Hun-de",
  "Am Ende von «Berg» hörst du ein k. Wie prüfst du die Schreibung?": "verlängern: die Ber-ge",
  "Aus welchen Teilen besteht «verkaufen»?": "ver + kauf + en",
  "frei + heit: Schreibe das Nomen.": "Freiheit",
  "krank + heit: Schreibe das Nomen.": "Krankheit",
  "entdeck + ung: Schreibe das Nomen.": "Entdeckung",
  "wander + ung: Schreibe das Nomen.": "Wanderung",
  "Woran erkennst du, dass «Freiheit» ein Nomen ist?": "an der Endung -heit",
  "Welche Endung macht aus «schön» ein Nomen?": "-heit",
  "Welche Endung macht aus «erfinden» ein Nomen?": "-ung",
  "Wörter mit -heit, -keit oder -ung schreibt man ...?": "gross",
  "Aus welchen Teilen besteht «Freiheit»?": "frei + heit",
  "Aus welchen Teilen besteht «Entdeckung»?": "ent + deck + ung",
  "«beim Essen» oder «beim essen»: Was ist richtig?": "beim Essen",
  "«nach dem Spielen» oder «nach dem spielen»: Was ist richtig?": "nach dem Spielen",
  "«vor dem Schlafen» oder «vor dem schlafen»: Was ist richtig?": "vor dem Schlafen",
  "«zum Lesen» oder «zum lesen»: Was ist richtig?": "zum Lesen",
  "Warum schreibt man in «beim Lesen» das Wort «Lesen» gross?": "weil aus dem Verb ein Nomen geworden ist",
  "Woran erkennst du das Nomen in «nach dem Essen»?": "an Präposition und Artikel davor: nach dem",
  "Du schreibst einen Brief an Frau Muster. Welche Anrede ist richtig?": "«Kommen Sie morgen?»",
  "Das Höflichkeitspronomen in Briefen schreibt man ...?": "gross: Sie",
  "In welchem Briefsatz ist die Höflichkeitsform richtig?": "«Ich danke Ihnen für den Brief.»",
  "«alles Gute» oder «alles gute»: Was ist richtig?": "alles Gute",
  "«etwas Schönes» oder «etwas schönes»: Was ist richtig?": "etwas Schönes",
  "«nichts Neues» oder «nichts neues»: Was ist richtig?": "nichts Neues",
  "Nomen aus Adjektiven nach «alles, etwas, nichts» schreibt man ...?": "gross",
  "Du hörst «Fater», findest es im Wörterbuch aber nicht unter F. Wo suchst du?": "unter V wie «Vater»",
  "Du hörst «Kwelle». Wo steht das Wort im Wörterbuch?": "unter Q wie «Quelle»",
  "Du hörst «Fogel». Wo steht das Wort im Wörterbuch?": "unter V wie «Vogel»",
  "Das Wort klingt wie «Kor», geschrieben wird es «Chor». Wo steht es im Wörterbuch?": "unter C",
  "Ein Wort beginnt gesprochen mit «oi» wie in «Eule». Womit beginnt es geschrieben oft?": "mit Eu",
  "Wie viele Silben hat «Ap-fel»?": "2",
  "Wie viele Silben hat «To-ma-te»?": "3",
  "Wie schreibst du den Anfang von «Sport»?": "sp",
  "Wie schreibst du den Anfang von «Stern»?": "st",
  "Du willst «ging» im Wörterbuch nachschlagen. Unter welchem Wort suchst du?": "unter «gehen»",
  "Du willst «sang» im Wörterbuch nachschlagen. Unter welchem Wort suchst du?": "unter «singen»",
  "Du willst «flog» im Wörterbuch nachschlagen. Unter welchem Wort suchst du?": "unter «fliegen»",
  "In welcher Form stehen die Verben im Wörterbuch?": "in der Grundform",
  "Warum schreibt man «Räume» mit äu?": "wegen des Stamms «Raum»",
  "Am Ende von «Kind» hörst du ein t. Wie prüfst du die Schreibung?": "verlängern: die Kin-der",
  "«viel Gutes» oder «viel gutes»: Was ist richtig?": "viel Gutes",
  "«alles Liebe» oder «alles liebe»: Was ist richtig?": "alles Liebe",
  "«etwas Wichtiges» oder «etwas wichtiges»: Was ist richtig?": "etwas Wichtiges",
  "Warum schreibt man «etwas Schönes» gross?": "aus dem Adjektiv wird ein Nomen",
  "Du hörst «Faze». Wo steht das Wort im Wörterbuch?": "unter V wie «Vase»",
  "Du hörst «Kwark». Wo steht das Wort im Wörterbuch?": "unter Q wie «Quark»",
  "Du hörst «fier» (die Zahl 4). Wo steht das Wort im Wörterbuch?": "unter V wie «vier»",
  "Warum findest du «Vogel» nicht unter F?": "weil es mit V geschrieben wird",
};

function nachbar(expr) {
  const m = expr.match(/^Welcher Buchstabe kommt im ABC direkt (nach|vor) dem ([A-Z])\?$/);
  if (!m) return null;
  const i = ABC.indexOf(m[2]);
  return m[1] === "nach" ? ABC[i + 1] : ABC[i - 1];
}

function solveTyped(expr) {
  const n = nachbar(expr);
  if (n) return n;
  return QA[expr] ?? null;
}

function chooseOption(expr, options) {
  let m;
  const n = nachbar(expr);
  if (n) return options.indexOf(n);
  if ((m = expr.match(/^Ist der Buchstabe ([A-Z]) ein Vokal oder ein Konsonant\?$/))) {
    return options.indexOf(VOKALE.includes(m[1]) ? "ein Vokal" : "ein Konsonant");
  }
  if (expr === "Welcher dieser Buchstaben ist ein Vokal?") {
    return options.findIndex((o) => VOKALE.includes(o));
  }
  if ((m = expr.match(/^Steht das ([A-Z]) im ABC vor oder nach dem ([A-Z])\?$/))) {
    return options.indexOf(ABC.indexOf(m[1]) < ABC.indexOf(m[2]) ? "vor" : "nach");
  }
  if ((m = expr.match(/^Wo steht das ([A-Z]) im ABC: vorne \(A bis H\), in der Mitte \(I bis Q\) oder hinten \(R bis Z\)\?$/))) {
    const i = ABC.indexOf(m[1]);
    const correct = i <= 7 ? "vorne (A bis H)" : i <= 16 ? "in der Mitte (I bis Q)" : "hinten (R bis Z)";
    return options.indexOf(correct);
  }
  if ((m = expr.match(/^Welches Wort steht im Wörterbuch zuerst: «(\S+)» oder «(\S+)»\?$/))) {
    const a = m[1].toLowerCase();
    const b = m[2].toLowerCase();
    return options.indexOf(a < b ? m[1] : m[2]);
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
  check("data: 11 Stufen cards (b, c, d, g split by topic)",
    STUFEN.length === 11 && STUFEN.map((s) => s.code || s.id).join(",") === "a,b,b,c,c,d,d,e,f,g,g");
  check("data: GA marks on both b, both d and f",
    STUFEN.filter((s) => s.ga).map((s) => s.id).join(",") === "b-abc,b-hoeren,d-nachschlagen,d-stammregel,f");
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
    const rng = mulberry32(64 + stufe.id.charCodeAt(0));
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
check("home: title renders", (await page.textContent("h1")).trim() === "Buchstabenleiter");
check("home: 11 Stufen cards with GA badges on both b, both d and f",
  await page.locator(".stufe").count() === 11 && await page.locator(".ga-badge").count() === 5);
check("home: split cards show the official letter",
  (await page.textContent('[data-stufe="b-abc"]')).includes("D.5.E.1.b")
  && (await page.textContent('[data-stufe="b-hoeren"]')).includes("D.5.E.1.b")
  && (await page.textContent('[data-stufe="d-nachschlagen"]')).includes("D.5.E.1.d")
  && (await page.textContent('[data-stufe="g-gross"]')).includes("D.5.E.1.g"));
check("home: Merkblatt link on ABC cards",
  await page.locator('.merkblatt-link[href="../merkheft/abc-tabelle.html"]').count() >= 2);
check("home: back-to-overview link present",
  await page.locator('.overview-link[href="../index.html"]').count() === 1);
await page.screenshot({ path: join(SHOTS_DIR, "01-home.png"), fullPage: true });

await playRound("b-abc");
check("round b-abc: completion shows XP", (await page.textContent(".reward-xp")).includes(`+${roundXp("b-abc", 8)} XP`));
check("round b-abc: no GA medal yet (needs both b cards clean)",
  !(await page.textContent(".done")).includes("Grundanspruch Zyklus 1"));
check("round b-abc: clean-run praise", (await page.textContent(".done-summary")).includes("Stark!"));
await page.screenshot({ path: join(SHOTS_DIR, "02-done.png"), fullPage: true });
await page.click('[data-action="home"]');
await page.waitForSelector(".stufen-list");
await playRound("b-hoeren");
check("round b-hoeren: GA medal once both b cards are clean",
  (await page.textContent(".done")).includes("Grundanspruch Zyklus 1"));
await page.click('[data-action="home"]');
await page.waitForSelector(".stufen-list");

await playRound("d-nachschlagen");
check("round d-nachschlagen: no GA medal yet (needs both d cards clean)",
  !(await page.textContent(".done")).includes("Grundanspruch Zyklus 2"));
await page.click('[data-action="home"]');
await page.waitForSelector(".stufen-list");
await playRound("d-stammregel");
check("round d-stammregel: GA medal once both d cards are clean",
  (await page.textContent(".done")).includes("Grundanspruch Zyklus 2"));
await page.click('[data-action="home"]');
await page.waitForSelector(".stufen-list");

await playRound("f");
check("round f: completion shows XP", (await page.textContent(".reward-xp")).includes(`+${roundXp("f", 8)} XP`));
check("round f: GA medal for Zyklus 3", (await page.textContent(".done")).includes("Grundanspruch Zyklus 3"));
await page.click('[data-action="home"]');
await page.waitForSelector(".stufen-list");

/* ── Persistence, mistake flow, reset ─────────────────────────────── */
await page.waitForSelector(".stats-strip");
const expectedXp = roundXp("b-abc", 8) + roundXp("b-hoeren", 8) + roundXp("d-nachschlagen", 8) + roundXp("d-stammregel", 8) + roundXp("f", 8);
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

/* ── Deep link (split sub-Stufe) ──────────────────────────────────── */
await page.goto(`${URL}?stufe=c-vokale`);
await page.waitForSelector(".task-area");
check("deep link: ?stufe=c-vokale starts the Stufe directly, query cleaned",
  (await page.textContent(".practice-meta")).includes("Stufe c")
  && (await page.evaluate(() => location.search)) === "");

check("console: no errors", consoleErrors.length === 0, consoleErrors.slice(0, 3).join(" | "));
check("network: no external requests", externalRequests.length === 0, externalRequests.slice(0, 3).join(", "));

await browser.close();
server.close();
console.log(failures === 0 ? "\nAll tests passed." : `\n${failures} test(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
