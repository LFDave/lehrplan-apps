// e2e.test.mjs — Playwright end-to-end tests for Nordpfeil.
//
// Run:
//   cd nordpfeil/tests && npm install && node e2e.test.mjs
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
import { STUFEN } from "../data.js?v=2";
import { genRound } from "../gen.js?v=2";
import { LEVELS, MEDALS, roundXp } from "../game.js?v=2";
import { STRINGS } from "../strings.js?v=2";

const TESTS_DIR = dirname(fileURLToPath(import.meta.url));
const APP_DIR = join(TESTS_DIR, "..");
const SHOTS_DIR = join(TESTS_DIR, "screenshots");
const PORT = 8519;
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

// Unabhängige Nachrechnung: eigene Richtungs-Tabelle, eigene
// Massstab-Umrechnung, dazu eine neu aufgeschriebene Antwort-Tabelle
// für die Wissensfragen.
const RING = ["Norden", "Nordosten", "Osten", "Südosten", "Süden", "Südwesten", "Westen", "Nordwesten"];
const HAUPT = ["Norden", "Osten", "Süden", "Westen"];

const QA = {
  "Du beschreibst deinen Schulweg. Was hilft der zuhörenden Person am meisten?": "Merkpunkte wie Brunnen oder Bäckerei nennen",
  "«Beim roten Haus nach links» ist ein Beispiel für ...?": "einen Merkpunkt mit Richtung",
  "Was gehört in eine gute Wegbeschreibung?": "Reihenfolge, Richtungen und Merkpunkte",
  "Du erklärst den Weg zum Turnplatz. Womit beginnst du?": "beim Startpunkt",
  "Welche Angabe ist am genauesten?": "«nach der Post rechts abbiegen»",
  "Wozu merkst du dir Merkpunkte auf dem Weg?": "um den Weg wiederzuerkennen",
  "Auf dem Schulweg kommst du zuerst am Brunnen vorbei, dann an der Bäckerei. Was kommt zuerst?": "der Brunnen",
  "Welcher Satz beschreibt einen Weg?": "«Geradeaus bis zur Linde, dann rechts.»",
  "Du beschreibst den gleichen Weg zurück. Was ändert sich?": "aus links wird rechts",
  "Wo gehst du zu Fuss, wenn es ein Trottoir hat?": "auf dem Trottoir",
  "Was machst du vor dem Überqueren der Strasse?": "warten, schauen, horchen, dann gehen",
  "Wo überquerst du die Strasse am sichersten?": "am Fussgängerstreifen",
  "Die Ampel zeigt Rot. Was machst du?": "warten, bis es grün wird",
  "Warum ist helle Kleidung im Dunkeln wichtig?": "damit dich die Fahrzeuge früh sehen",
  "Eine Stelle ohne Trottoir und mit viel Verkehr ist ...?": "eine unsichere Stelle",
  "Ein Fussgängerstreifen mit Ampel ist ...?": "eine sichere Stelle",
  "Der Ball rollt auf die Strasse. Was machst du?": "stehen bleiben und zuerst schauen",
  "Hinter dem parkierten Auto siehst du die Strasse schlecht. Was ist das?": "eine unsichere Stelle",
  "Auf der Schatzkarte: «3 Schritte vom Baum zum Brunnen, dann 2 Schritte zum Stein.» Wo beginnst du?": "beim Baum",
  "Der Turnplatz liegt hinter dem Schulhaus. Du stehst vor dem Schulhaus. Siehst du den Turnplatz?": "Nein, das Schulhaus ist davor",
  "Auf dem Schulplan ist ein Bild von einer Rutschbahn. Was findest du an dieser Stelle?": "die Rutschbahn",
  "Was zeigt dir eine Schatzkarte?": "wo etwas liegt und wie du hinkommst",
  "Das Piktogramm mit dem Buch zeigt auf dem Schulplan ...?": "die Bibliothek",
  "Lisa sitzt zwischen Ben und Mia. Wer sitzt in der Mitte?": "Lisa",
  "Du gehst geradeaus, drehst dich dann zweimal nach links. Schaust du noch in die gleiche Richtung wie am Anfang?": "Nein, ich schaue in die Gegenrichtung",
  "Der Schatz liegt laut Karte unter dem grossen Baum. Wo gräbst du?": "unter dem grossen Baum",
  "Auf dem Plan ist der Sandkasten neben der Schaukel. Was hilft dir beim Suchen?": "zuerst die Schaukel finden",
  "Ein Plan zeigt das Zimmer ...?": "von oben",
  "Wie nennt man den Blick von oben?": "die Vogelperspektive",
  "Was gehört in eine Skizze vom Schulzimmer?": "die wichtigen Dinge wie Tische und Türe",
  "Warum zeichnet man einen Plan einfach und klar?": "damit andere ihn schnell verstehen",
  "Im Plan vom Zimmer ist das Bett ein Rechteck. Warum?": "von oben sieht das Bett so aus",
  "Du erklärst deinen Sitzplatz mit einer Skizze. Was zeichnest du zuerst?": "den Umriss des Zimmers",
  "Was fehlt auf einer guten Zimmer-Skizze sicher nicht?": "die Türe",
  "Dein Freund findet dank deiner Skizze den Weg. Wie war die Skizze?": "klar und verständlich",
  "Ein runder Tisch sieht im Plan von oben aus wie ...?": "ein Kreis",
  "Auf der Karte ist ein See eingezeichnet. Welche Farbe hat er?": "Blau",
  "Was bedeutet Grün auf der Karte meistens?": "Wald oder Wiese",
  "Was zeigen die braunen Linien auf der Wanderkarte?": "die Höhenkurven",
  "Was ist eine Signatur auf der Karte?": "ein Zeichen für ein Objekt",
  "Wo erfährst du, was die Zeichen auf der Karte bedeuten?": "in der Legende",
  "Eine blaue Fläche auf der Karte zeigt ...?": "einen See",
  "Was zeigt eine blaue Linie auf der Karte?": "einen Fluss oder Bach",
  "Was bedeuten die schwarzen Linien auf der Karte meistens?": "Wege und Strassen",
  "Was heisst «massstabsgetreu zeichnen»?": "alle Längen im gleichen Verhältnis verkleinern",
  "Im Plan ist der Tisch grösser als das Zimmer. Was stimmt nicht?": "die Grössenverhältnisse",
  "Das grössere Zimmer erscheint im massstabsgetreuen Plan ...?": "auch grösser",
  "Was liest du im Fahrplan ab?": "wann Bus oder Zug fahren",
  "Der Zug fährt um 09:00 Uhr ab und kommt um 09:45 Uhr an. Wie viele Minuten dauert die Fahrt?": "45",
  "Der Bus fährt alle 10 Minuten. Einer ist dir gerade davongefahren. Wie viele Minuten wartest du höchstens auf den nächsten?": "10",
  "Was gehört zur Sicherheit auf dem Velo?": "ein Helm und funktionierende Bremsen",
  "Was machst du vor dem Abbiegen mit dem Velo?": "zurückschauen und mit dem Arm zeigen",
  "Du steigst am Bahnhof um. Was suchst du?": "das richtige Gleis für den Anschlusszug",
  "Welches Licht braucht dein Velo im Dunkeln?": "vorne weiss, hinten rot",
  "Was ist im Bus während der Fahrt am sichersten?": "sitzen oder sich gut festhalten",
  "Wo wartest du auf den Bus?": "an der Haltestelle hinter der weissen Linie",
  "Du suchst eine Strasse in der Stadt. Welches Hilfsmittel passt?": "der Ortsplan",
  "Auf der topographischen Karte liegen die Höhenkurven eng beieinander. Was heisst das?": "das Gelände ist steil",
  "Die Höhenkurven liegen weit auseinander. Was heisst das?": "das Gelände ist flach",
  "Was zeigt der Verkehrsnetzplan?": "die Linien von Bus, Tram und Zug",
  "Auf fast allen Karten ist Norden ...?": "oben",
  "Auf der Karte ist Norden oben. Welche Himmelsrichtung ist rechts?": "Osten",
  "Auf der Karte ist Norden oben. Welche Himmelsrichtung ist unten?": "Süden",
  "Du willst wandern und die Steigung kennen. Welche Karte hilft?": "die topographische Karte",
  "Wohin zeigt die Kompassnadel?": "nach Norden",
  "Was bestimmt das GPS?": "deinen Standort",
  "Was liest du in der Legende ab?": "die Bedeutung der Kartenzeichen",
  "Karte und Gelände sollen übereinstimmen. Was machst du mit der Karte?": "sie nach Norden ausrichten",
};

function solveTyped(expr) {
  let m;
  if ((m = expr.match(/^Karte im Massstab 1:(\d+'?\d*): 1 Zentimeter auf der Karte ist \d+ Meter in Wirklichkeit\. Du misst (\d+) Zentimeter\. Wie viele Meter sind das in Wirklichkeit\?$/))) {
    const scale = Number(m[1].replace(/'/g, ""));
    return String((scale / 100) * Number(m[2]));
  }
  if ((m = expr.match(/^Plan im Massstab 1:(\d+): 1 Meter im Zimmer wird im Plan zu .+\. Das Zimmer ist (\d+) Meter lang\. Wie viele Zentimeter sind das im Plan\?$/))) {
    return String((Number(m[2]) * 100) / Number(m[1]));
  }
  return QA[expr] ?? null;
}

function chooseOption(expr, options) {
  let m;
  if ((m = expr.match(/^Du schaust nach (\S+)\. Welche Himmelsrichtung liegt genau hinter dir\?$/))) {
    return options.indexOf(RING[(RING.indexOf(m[1]) + 4) % 8]);
  }
  if ((m = expr.match(/^Welche Himmelsrichtung ist das Gegenteil von (\S+)\?$/))) {
    return options.indexOf(RING[(RING.indexOf(m[1]) + 4) % 8]);
  }
  if ((m = expr.match(/^Du schaust nach (\S+) und drehst dich eine Vierteldrehung nach (rechts|links)\. Wohin schaust du jetzt\?$/))) {
    const i = HAUPT.indexOf(m[1]);
    return options.indexOf(HAUPT[(i + (m[2] === "rechts" ? 1 : 3)) % 4]);
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
  check("data: 11 Stufen cards (e and h split by topic)",
    STUFEN.length === 11
    && STUFEN.map((s) => s.code || s.id).join("") === "abcdeefghhi"
    && STUFEN.filter((s) => s.code === "e").length === 2
    && STUFEN.filter((s) => s.code === "h").length === 2
    && STUFEN.every((s) => s.kinds.length === 1));
  check("data: GA marks on c and both h cards",
    STUFEN.filter((s) => s.ga).map((s) => `${s.code || s.id}${s.cycle}`).join(",") === "c1,h2,h2");
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
    const rng = mulberry32(62 + stufe.id.charCodeAt(0));
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
check("home: title renders", (await page.textContent("h1")).trim() === "Nordpfeil");
check("home: 11 Stufen cards with GA badges on c and both h cards",
  await page.locator(".stufe").count() === 11 && await page.locator(".ga-badge").count() === 3);
check("home: competency code visible", (await page.textContent('[data-stufe="c"]')).includes("NMG.8.5.c"));
check("home: split cards show the official letter",
  (await page.textContent('[data-stufe="e-signaturen"]')).includes("NMG.8.5.e")
  && (await page.textContent('[data-stufe="e-massstab"]')).includes("NMG.8.5.e")
  && (await page.textContent('[data-stufe="h-karte"]')).includes("NMG.8.5.h")
  && (await page.textContent('[data-stufe="h-richtungen"]')).includes("NMG.8.5.h"));
check("home: Massstab Merkblatt on e-massstab and f",
  await page.locator('.merkblatt-link[href="../merkheft/massstab.html"]').count() === 2);
check("home: Höhenkurven Merkblatt on h-karte",
  await page.locator('.merkblatt-link[href="../merkheft/hoehenkurven.html"]').count() === 1);
check("home: Himmelsrichtungen Merkblatt on h-richtungen",
  await page.locator('.merkblatt-link[href="../merkheft/himmelsrichtungen.html"]').count() === 1);
await page.screenshot({ path: join(SHOTS_DIR, "01-home.png"), fullPage: true });

await playRound("c");
check("round c: completion shows XP", (await page.textContent(".reward-xp")).includes(`+${roundXp("c", 8)} XP`));
check("round c: GA medal for Zyklus 1", (await page.textContent(".done")).includes("Grundanspruch Zyklus 1"));
check("round c: clean-run praise", (await page.textContent(".done-summary")).includes("Stark!"));
await page.screenshot({ path: join(SHOTS_DIR, "02-done.png"), fullPage: true });
await page.click('[data-action="home"]');
await page.waitForSelector(".stufen-list");

await playRound("h-karte");
check("round h-karte: completion shows XP", (await page.textContent(".reward-xp")).includes(`+${roundXp("h-karte", 8)} XP`));
check("round h-karte: no GA medal yet (needs both h cards clean)",
  !(await page.textContent(".done")).includes("Grundanspruch Zyklus 2"));
await page.click('[data-action="home"]');
await page.waitForSelector(".stufen-list");
await playRound("h-richtungen");
check("round h-richtungen: GA medal once both h cards are clean",
  (await page.textContent(".done")).includes("Grundanspruch Zyklus 2"));
await page.click('[data-action="home"]');
await page.waitForSelector(".stufen-list");

/* ── Persistence, mistake flow, reset ─────────────────────────────── */
await page.waitForSelector(".stats-strip");
const expectedXp = roundXp("c", 8) + roundXp("h-karte", 8) + roundXp("h-richtungen", 8);
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

/* ── Deep link with topic focus (Merkheft «Dazu üben») ────────────── */
await page.goto(`${URL}?stufe=h-richtungen`);
await page.waitForSelector(".task-area");
check("deep link: ?stufe=h-richtungen starts Stufe h, query cleaned",
  (await page.textContent(".practice-meta")).includes("Stufe h")
  && (await page.evaluate(() => location.search)) === "");

check("console: no errors", consoleErrors.length === 0, consoleErrors.slice(0, 3).join(" | "));
check("network: no external requests", externalRequests.length === 0, externalRequests.slice(0, 3).join(", "));

await browser.close();
server.close();
console.log(failures === 0 ? "\nAll tests passed." : `\n${failures} test(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
