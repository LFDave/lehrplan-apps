// e2e.test.mjs — Playwright end-to-end tests for Wetterwarte.
//
// Run:
//   cd wetterwarte/tests && npm install && node e2e.test.mjs
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
const PORT = 8537;
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

// Unabhängige Nachrechnung: eigene Temperatur-Differenz und
// Blitz-Donner-Distanz, dazu eine neu aufgeschriebene
// Antwort-Tabelle für das Wetter- und Naturgefahren-Wissen.
const QA = {
  "Dicke weisse Flocken fallen vom Himmel. Welches Wetter ist das?": "Schneefall",
  "Es blitzt und donnert. Was ist das?": "ein Gewitter",
  "Du siehst kaum 50 Meter weit, alles ist grau. Was ist das?": "Nebel",
  "Die Blätter fliegen und die Äste biegen sich. Was ist das?": "starker Wind",
  "Wasser fällt in Tropfen vom Himmel. Was ist das?": "Regen",
  "Der Himmel ist blau und die Sonne scheint. Wie heisst dieses Wetter?": "sonnig",
  "Kleine Eiskörner prasseln vom Himmel. Was ist das?": "Hagel",
  "Nach Regen und Sonne siehst du bunte Farben am Himmel. Was ist das?": "ein Regenbogen",
  "Der Bauer will Heu ernten. Welches Wetter braucht er?": "trockenes, sonniges Wetter",
  "Was brauchst du zum Schlitteln?": "Schnee",
  "Die Pflanzen im Garten brauchen ...?": "Sonne und Regen",
  "Was gehört zu einem heissen Sommertag?": "Sonnenhut tragen und Wasser trinken",
  "Für wen ist die Wettervorhersage besonders wichtig?": "für Bäuerinnen, Piloten und Bergführer",
  "Es regnet am Wandertag. Was ändert sich?": "das Programm findet vielleicht drinnen statt",
  "Bei Glatteis auf dem Schulweg ...?": "gehst du langsam und vorsichtig",
  "Lange Trockenheit ist für die Landwirtschaft ...?": "ein Problem, die Felder brauchen Wasser",
  "Nieselregen ist ...?": "feiner, leichter Regen",
  "«Windstill» heisst ...?": "es weht kein Wind",
  "Der Himmel ist bedeckt. Was siehst du?": "nur Wolken, keine Sonne",
  "Was gehört alles zum Niederschlag?": "Regen, Schnee und Hagel",
  "Woran erkennst du die Windrichtung?": "an einer Windfahne oder Fahne",
  "Hohe Schäfchenwolken bedeuten meist ...?": "schönes Wetter",
  "Dunkle, hohe Wolkentürme am Sommernachmittag deuten auf ...?": "ein mögliches Gewitter",
  "Ein Wetterprotokoll hält fest ...?": "Wetter, Temperatur und Wind jeden Tag",
  "Hagel gibt es am ehesten ...?": "bei Sommergewittern",
  "Raureif und Bodennebel passen zu ...?": "Spätherbst und Winter",
  "Schnee fällt, wenn es ...?": "etwa 0 Grad oder kälter ist",
  "Gewitter gibt es am häufigsten ...?": "an heissen Sommertagen",
  "Im Frühling schmilzt der Schnee in den Bergen. Die Bäche führen dann ...?": "mehr Wasser",
  "Tau auf der Wiese entsteht ...?": "in klaren, kühlen Nächten",
  "Welche Jahreszeit hat bei uns die kürzesten Tage?": "der Winter",
  "Der Föhn ist ...?": "ein warmer, kräftiger Wind",
  "Womit misst man die Temperatur?": "mit dem Thermometer",
  "Womit misst man den Niederschlag?": "mit dem Regenmesser",
  "Womit misst man den Luftdruck?": "mit dem Barometer",
  "Womit misst man die Windstärke?": "mit dem Windmesser",
  "Wozu stellt man Messwerte in einem Diagramm dar?": "um Veränderungen auf einen Blick zu sehen",
  "Die Prognose sagt 90 Prozent Regenwahrscheinlichkeit. Was heisst das?": "Regen ist sehr wahrscheinlich",
  "Das Symbol zeigt eine Sonne hinter einer Wolke. Was bedeutet das?": "teilweise sonnig, teilweise bewölkt",
  "Für die Schulreise ist Gewitter gemeldet. Was ist klug?": "einen Plan für drinnen bereithalten",
  "Bei Gewitter im Freien ...?": "stellst du dich nicht unter einzelne Bäume",
  "Bei Sturmwarnung ...?": "bleibst du weg von Wäldern und Baustellen",
  "Bei Hagel auf dem Velo ...?": "suchst du einen Unterstand",
  "Wo findest du eine Wetterprognose?": "in Wetter-Apps, Radio und Zeitung",
  "Die Prognose hilft dir ...?": "Kleidung und Pläne anzupassen",
  "Die Sonne erwärmt das Wasser im See. Was passiert?": "Wasser verdunstet und steigt als Wasserdampf auf",
  "Woraus bestehen Wolken?": "aus vielen kleinen Wassertröpfchen",
  "Verdunsten, Wolken bilden, abregnen, zurück ins Meer: Wie heisst das?": "der Wasserkreislauf",
  "Warum hörst du den Donner erst nach dem Blitz?": "Licht ist viel schneller als Schall",
  "In einer Gewitterwolke steigt warme, feuchte Luft ...?": "schnell nach oben",
  "Eine Kaltfront bringt oft ...?": "Schauer und sinkende Temperaturen",
  "Viel Wasser tritt über die Ufer. Wie heisst das Ereignis?": "eine Überschwemmung",
  "Schnee rutscht den Berghang hinunter. Wie heisst das?": "eine Lawine",
  "Sehr starker Wind wirft Bäume um. Wie heisst das?": "ein Sturm",
  "Erde und Steine rutschen einen Hang hinab. Wie heisst das?": "ein Erdrutsch",
  "Grosse Eiskörner beschädigen Autos und Pflanzen. Was ist das?": "Hagel",
  "Der Boden zittert und wackelt. Wie heisst das?": "ein Erdbeben",
  "Ein Blitz kann ...?": "einen Brand auslösen",
  "Naturereignisse sind ...?": "Ereignisse der Natur wie Sturm und Hochwasser",
  "Ein Gewitter zieht auf, du bist im Schwimmbad. Was machst du?": "sofort aus dem Wasser gehen",
  "Der Bach führt nach starkem Regen viel Wasser. Was gilt?": "Abstand vom Ufer halten",
  "Der See ist zugefroren. Wann darfst du aufs Eis?": "nur wenn es offiziell freigegeben ist",
  "Es blitzt, du bist draussen auf dem Feld. Was machst du?": "ein Gebäude oder ein Auto aufsuchen",
  "Bei starkem Schneefall in den Bergen ...?": "bleibst du auf markierten Wegen und Pisten",
  "Bei Sturm fallen manchmal Äste. Wo bist du sicherer?": "weg von Bäumen, drinnen",
  "Wer sagt dir, was bei Gefahr zu tun ist?": "Eltern, Lehrpersonen und offizielle Warnungen",
  "Warnt eine Sirene oder eine Warnung auf dem Handy, dann ...?": "hörst du hin und folgst den Anweisungen",
  "Nach dem Sturm liegen Bäume kreuz und quer im Wald. Was war die Ursache?": "sehr starker Wind",
  "Der Bach hat Kies und Äste auf die Wiese getragen. Was war hier?": "Hochwasser",
  "Am Steilhang fehlt Erde und unten liegt ein Erdhaufen. Was ist passiert?": "ein Erdrutsch",
  "Was schützt ein Bergdorf vor Lawinen?": "Schutzwald und Lawinenverbauungen",
  "Was schützt ein Dorf am Fluss vor Hochwasser?": "Dämme und Rückhaltebecken",
  "Löcher in Blechdächern und kaputte Pflanzen nach einem Sommergewitter deuten auf ...?": "Hagel",
  "Warum ist der Wald am Hang wichtig?": "er hält Schnee und Boden zurück",
  "Ein verkohlter Baum nach dem Gewitter deutet auf ...?": "einen Blitzeinschlag",
  "Wann entstehen Lawinen am ehesten?": "nach starkem Schneefall an steilen Hängen",
  "Was macht Überschwemmungen wahrscheinlicher?": "lange, starke Regenfälle",
  "Womit warnen die Behörden heute vor Naturgefahren?": "mit offiziellen Warnungen, zum Beispiel in Apps",
  "Wie entsteht ein Erdrutsch oft?": "viel Regen weicht den Hang auf",
  "Warum baut man heute anders als früher an Flüssen?": "man kennt die Gefahrenzonen besser",
  "Was zeigt eine Gefahrenkarte?": "wo Naturgefahren besonders drohen",
  "Nach einem Waldbrand wächst der Wald ...?": "langsam über viele Jahre nach",
  "Ein Sturm wird gemeldet, wenn ...?": "sehr starke Winde erwartet werden",
  "Beim Wandern zieht ein Gewitter auf. Was ist richtig?": "absteigen und Schutz in einer Hütte suchen",
  "Es gilt Lawinengefahr. Was gilt beim Skifahren?": "auf den markierten, offenen Pisten bleiben",
  "Gewitterwarnung am Badesee. Was machst du?": "aus dem Wasser gehen und Schutz suchen",
  "In den Bergen ziehen dunkle Wolken auf. Was ist klug?": "früh umkehren oder eine Hütte ansteuern",
  "Hochwasserwarnung: Der Keller könnte volllaufen. Was gilt?": "nicht in den Keller gehen",
  "Beim Sturm bist du draussen. Was meidest du?": "Bäume, Baugerüste und lose Gegenstände",
  "Nach der Entwarnung ...?": "bleibst du trotzdem aufmerksam",
  "Warum übt die Schule Verhaltensregeln?": "damit alle im Ernstfall richtig handeln",
};

function solveTyped(expr) {
  let m;
  if ((m = expr.match(/^Das Thermometer zeigt am Morgen (-?\d+) Grad, am Mittag (-?\d+) Grad\. Um wie viele Grad ist es wärmer geworden\?$/))) {
    return String(Number(m[2]) - Number(m[1]));
  }
  if ((m = expr.match(/^Zwischen Blitz und Donner zählst du (\d+) Sekunden\. Der Schall braucht 3 Sekunden pro Kilometer\. Wie viele Kilometer ist das Gewitter entfernt\?$/))) {
    return String(Number(m[1]) / 3);
  }
  return QA[expr] ?? null;
}

function chooseOption(expr, options) {
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
  check("data: 12 Stufen 1a-2e", STUFEN.length === 12 && STUFEN.map((s) => s.id).join("") === "1a1b1c1d1e1f1g2a2b2c2d2e");
  check("data: GA marks on 1b and 1f and 2b and 2e",
    STUFEN.filter((s) => s.ga).map((s) => s.id).join(",") === "1b,1f,2b,2e");
  const eszett = [];
  for (const [id, v] of Object.entries(STRINGS.de)) if (v.includes("ß")) eszett.push(id);
  for (const s of STUFEN) if ((s.title + s.desc).includes("ß")) eszett.push(s.id);
  for (const m of MEDALS) if ((m.name + m.desc).includes("ß")) eszett.push(m.key);
  check("copy: Swiss standard German, no ß anywhere", eszett.length === 0, eszett.join(","));
  check("game: second level reachable within a first session", LEVELS[1].xp <= 3 * roundXp("1a", 8));
}

/* ── Generator sanity against the oracle (seeded) ─────────────────── */
{
  const issues = [];
  for (const stufe of STUFEN) {
    const rng = mulberry32(71 + stufe.id.split("").reduce((n, ch, i) => n + ch.charCodeAt(0) * (i + 1), 0));
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
check("home: title renders", (await page.textContent("h1")).trim() === "Wetterwarte");
check("home: all Stufen with GA badges",
  await page.locator(".stufe").count() === 12 && await page.locator(".ga-badge").count() === 4);
check("home: competency code visible", (await page.textContent('[data-stufe="1b"]')).includes("NMG.4.4.1b"));
check("home: Merkblatt link on Stufe 1g",
  await page.locator('.merkblatt-link[href="../merkheft/wasserkreislauf.html"]').count() === 1);
await page.screenshot({ path: join(SHOTS_DIR, "01-home.png"), fullPage: true });

await playRound("1b");
check("round 1b: completion shows XP", (await page.textContent(".reward-xp")).includes(`+${roundXp("1b", 8)} XP`));
check("round 1b: GA medal for Zyklus 1", (await page.textContent(".done")).includes("Grundanspruch Zyklus 1"));
check("round 1b: clean-run praise", (await page.textContent(".done-summary")).includes("Stark!"));
await page.screenshot({ path: join(SHOTS_DIR, "02-done.png"), fullPage: true });
await page.click('[data-action="home"]');
await page.waitForSelector(".stufen-list");

await playRound("1f");
check("round 1f: completion shows XP", (await page.textContent(".reward-xp")).includes(`+${roundXp("1f", 8)} XP`));
check("round 1f: GA medal for Zyklus 2", (await page.textContent(".done")).includes("Grundanspruch Zyklus 2"));
await page.click('[data-action="home"]');
await page.waitForSelector(".stufen-list");

await playRound("2b");
check("round 2b: completion shows XP", (await page.textContent(".reward-xp")).includes(`+${roundXp("2b", 8)} XP`));
check("round 2b: GA medal for Zyklus 1", (await page.textContent(".done")).includes("Grundanspruch Zyklus 1"));
await page.click('[data-action="home"]');
await page.waitForSelector(".stufen-list");

await playRound("2e");
check("round 2e: completion shows XP", (await page.textContent(".reward-xp")).includes(`+${roundXp("2e", 8)} XP`));
check("round 2e: GA medal for Zyklus 2", (await page.textContent(".done")).includes("Grundanspruch Zyklus 2"));
await page.click('[data-action="home"]');
await page.waitForSelector(".stufen-list");

/* ── Persistence, mistake flow, reset ─────────────────────────────── */
await page.waitForSelector(".stats-strip");
const expectedXp = roundXp("1b", 8) + roundXp("1f", 8) + roundXp("2b", 8) + roundXp("2e", 8);
check("home: stats strip shows accumulated XP", (await page.textContent(".stats-strip")).includes(`${expectedXp} XP`));
await page.reload();
await page.waitForSelector(".stats-strip");
check("persistence: XP survives reload", (await page.textContent(".stats-strip")).includes(`${expectedXp} XP`));

await page.click('[data-stufe="1a"]');
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

/* ── Deep link (Merkheft «Dazu üben») ─────────────────────────────── */
await page.goto(`${URL}?stufe=1g`);
await page.waitForSelector(".task-area");
check("deep link: ?stufe=1g starts the Stufe directly, query cleaned",
  (await page.textContent(".practice-meta")).includes("Stufe 1g")
  && (await page.evaluate(() => location.search)) === "");

check("console: no errors", consoleErrors.length === 0, consoleErrors.slice(0, 3).join(" | "));
check("network: no external requests", externalRequests.length === 0, externalRequests.slice(0, 3).join(", "));

await browser.close();
server.close();
console.log(failures === 0 ? "\nAll tests passed." : `\n${failures} test(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
