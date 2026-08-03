// e2e.test.mjs — Playwright end-to-end tests for Lehrplan-Kompass.
//
// Run:
//   cd lehrplan-kompass/tests && npm install && node e2e.test.mjs
//
// Spawns its own static server (node, no external deps) and drives the
// real flows in Chromium: cycle switching with per-cycle texts, opening
// a subject, checking competencies, per-cycle persistence across
// reloads, browser back, and the reset confirmation. Exits non-zero if
// any check fails. Screenshots land in tests/screenshots/ (gitignored).

import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { mkdirSync, existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { SUBJECTS, subjectsForCycle, areaCompetenciesForCycle, competencyCount } from "../data.js?v=3";
import { STRINGS } from "../strings.js?v=3";

const TESTS_DIR = dirname(fileURLToPath(import.meta.url));
const APP_DIR = join(TESTS_DIR, "..");
const SHOTS_DIR = join(TESTS_DIR, "screenshots");
const PORT = 8479;
const URL = `http://localhost:${PORT}/index.html`;

// Pre-installed Chromium (e.g. Claude Code remote env); falls back to
// Playwright's own browser resolution.
const CHROMIUM = process.env.CHROMIUM_PATH
  || (existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined);

let failures = 0;
function check(name, condition, detail = "") {
  const ok = Boolean(condition);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok || !detail ? "" : ` — ${detail}`}`);
  if (!ok) failures++;
}

/* ── Cache-busting version consistency ──────────────────────────────
   Every local asset reference (index.html, module imports and css
   font urls) must carry the same ?v= — a partial bump would serve
   mixed stale/new files. */
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
    const refs = [
      ...text.matchAll(/(?:href="[^"]+?|src="[^"]+?|from '\.\/[^']+?|url\('fonts\/[^']+?)(\?v=(\d+))?["')]/g),
    ];
    for (const m of refs) {
      const whole = m[0];
      if (whole.includes("http") || whole.includes('"#') || whole.includes("${")) continue;
      if (m[2]) versions.add(m[2]);
      else unversioned.push(`${file}: ${whole}`);
    }
  }
  check("cache-busting: every local asset ref carries ?v=", unversioned.length === 0, unversioned.join("; "));
  check("cache-busting: one single version everywhere", versions.size === 1, [...versions].join(","));
}

/* ── Data sanity ──────────────────────────────────────────────────── */
{
  const codes = new Set();
  let total = 0;
  let cycleTexts = 0;
  let ok = true;
  const issues = [];
  for (const s of SUBJECTS) {
    if (!s.cycles.length || s.cycles.some((c) => ![1, 2, 3].includes(c))) {
      ok = false; issues.push(`${s.id}: bad cycles`);
    }
    for (const a of s.areas) {
      if (!a.id.startsWith(s.id + ".")) { ok = false; issues.push(`${a.id} not in ${s.id}`); }
      for (const c of a.competencies) {
        total++;
        if (codes.has(c.code)) { ok = false; issues.push(`duplicate ${c.code}`); }
        codes.add(c.code);
        if (!c.code.startsWith(a.id + ".")) { ok = false; issues.push(`${c.code} not in ${a.id}`); }
        const cycles = Object.keys(c.texts).map(Number);
        if (!cycles.length) { ok = false; issues.push(`${c.code}: no cycle texts`); }
        if (cycles.some((cy) => !s.cycles.includes(cy))) {
          ok = false; issues.push(`${c.code}: text outside subject cycles`);
        }
        for (const t of Object.values(c.texts)) {
          cycleTexts++;
          if (!t || t.length < 15) { ok = false; issues.push(`${c.code}: text too short`); }
        }
        // per-cycle texts must actually differ (that was the v1 flaw)
        const values = Object.values(c.texts);
        if (new Set(values).size !== values.length) {
          ok = false; issues.push(`${c.code}: identical texts across cycles`);
        }
      }
    }
  }
  check("data: subjects, areas and codes are consistent", ok, issues.slice(0, 5).join("; "));
  check("data: 363 competencies across 16 subjects", total === 363 && SUBJECTS.length === 16, `${total}/${SUBJECTS.length}`);
  check("data: 721 cycle-specific texts", cycleTexts === 721, String(cycleTexts));
  check("data: per-cycle totals are 176/239/306",
    [1, 2, 3].map((cy) => subjectsForCycle(cy).reduce((n, s) => n + competencyCount(s, cy), 0)).join("/") === "176/239/306");

  // documented deviations from subject-level cycles
  const ttg = SUBJECTS.find((s) => s.id === "TTG");
  const ttgB1 = ttg.areas.flatMap((a) => a.competencies).find((c) => c.code === "TTG.3.B.1");
  check("data: TTG.3.B.1 has no cycle-1 text", !ttgB1.texts[1] && Boolean(ttgB1.texts[2]));
  const mu = SUBJECTS.find((s) => s.id === "MU");
  const mu3a1 = mu.areas.flatMap((a) => a.competencies).find((c) => c.code === "MU.3.A.1");
  check("data: MU.3.A.1 has no cycle-3 text", !mu3a1.texts[3] && Boolean(mu3a1.texts[2]));

  const eszett = [];
  for (const s of SUBJECTS) {
    for (const a of s.areas) {
      for (const c of a.competencies) {
        for (const t of Object.values(c.texts)) if (t.includes("ß")) eszett.push(c.code);
      }
    }
  }
  for (const [id, v] of Object.entries(STRINGS.de)) if (v.includes("ß")) eszett.push(id);
  check("data: Swiss standard German, no ß anywhere", eszett.length === 0, eszett.join(","));
}

/* ── Static server ────────────────────────────────────────────────── */
const MIME = {
  ".html": "text/html", ".css": "text/css", ".js": "text/javascript",
  ".svg": "image/svg+xml", ".woff2": "font/woff2",
};
const server = createServer(async (req, res) => {
  const path = req.url.split("?")[0].replace(/^\//, "") || "index.html";
  try {
    const data = await readFile(join(APP_DIR, path));
    res.writeHead(200, { "Content-Type": MIME[extname(path)] || "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404); res.end("not found");
  }
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

/* ── Home: cycle picker and subject grid ──────────────────────────── */
await page.goto(URL);
await page.waitForSelector(".subject-grid");

check("home: title renders", (await page.textContent("h1")).trim() === "Lehrplan-Kompass");
check("home: cycle 1 selected by default",
  await page.getAttribute('[data-cycle="1"]', "aria-pressed") === "true");
check("home: cycle 1 shows 8 subjects",
  await page.locator(".subject-card").count() === subjectsForCycle(1).length);
await page.screenshot({ path: join(SHOTS_DIR, "01-home-cycle1.png"), fullPage: true });

await page.click('[data-cycle="3"]');
await page.waitForSelector('[data-cycle="3"][aria-pressed="true"]');
check("home: cycle 3 shows 15 subjects",
  await page.locator(".subject-card").count() === subjectsForCycle(3).length);
check("home: cycle 3 summary counts cycle-3 entries only",
  (await page.textContent(".summary")).includes(
    `von ${subjectsForCycle(3).reduce((n, s) => n + competencyCount(s, 3), 0)}`));
await page.screenshot({ path: join(SHOTS_DIR, "02-home-cycle3.png"), fullPage: true });

/* ── Subject view: per-cycle texts ────────────────────────────────── */
const ma = SUBJECTS.find((s) => s.id === "MA");
const ma1a1 = ma.areas[0].competencies[0];

await page.click('[data-cycle="1"]');
await page.click('a[href="#MA"]');
await page.waitForSelector(".competence");
const textZ1 = await page.textContent('[data-code="MA.1.A.1"] .competence-text');
check("subject: cycle 1 renders the cycle-1 text", textZ1 === ma1a1.texts[1]);
check("subject: cycle 1 renders cycle-1 count",
  await page.locator(".competence").count() === competencyCount(ma, 1));

await page.goBack();
await page.waitForSelector(".cycle-grid");
await page.click('[data-cycle="2"]');
await page.click('a[href="#MA"]');
await page.waitForSelector(".competence");
const textZ2 = await page.textContent('[data-code="MA.1.A.1"] .competence-text');
check("subject: cycle 2 renders a different text for the same code",
  textZ2 === ma1a1.texts[2] && textZ2 !== textZ1);

/* ── TTG in cycle 1 hides TTG.3.B.1 ───────────────────────────────── */
await page.goto(URL);
await page.waitForSelector(".subject-grid");
await page.click('[data-cycle="1"]');
await page.click('a[href="#TTG"]');
await page.waitForSelector(".competence");
check("subject: TTG.3.B.1 is hidden in cycle 1",
  await page.locator('[data-code="TTG.3.B.1"]').count() === 0);
check("subject: TTG cycle-1 count matches data",
  await page.locator(".competence").count() === competencyCount(SUBJECTS.find((s) => s.id === "TTG"), 1));

/* ── Practice-app links ───────────────────────────────────────────── */
await page.goto(URL + "#MA");
await page.waitForSelector(".competence");
check("practice: MA shows three practice links",
  await page.locator(".practice-link").count() === 3);
check("practice: MA.1.A.2 links to Zahlensprung",
  await page.locator('.practice-link[href="../zahlensprung/"]').count() === 1
  && (await page.locator('.practice-link[href="../zahlensprung/"]').textContent()).includes("Zahlensprung"));
check("practice: MA.1.A.3 links to Rechenturm",
  await page.locator('.practice-link[href="../rechenturm/"]').count() === 1);
await page.goto(URL + "#D");
await page.waitForSelector(".competence");
check("practice: D.4.F.1 links to Wortwerkstatt",
  await page.locator('.practice-link[href="../wortwerkstatt/"]').count() === 1);

/* ── Checking and per-cycle persistence ───────────────────────────── */
await page.goto(URL + "#MA");
await page.waitForSelector(".competence");
// still cycle 1 from above
await page.click('[data-code="MA.1.A.1"]');
await page.click('[data-code="MA.1.A.3"]');
check("subject: checked state toggles aria-pressed",
  await page.getAttribute('[data-code="MA.1.A.1"]', "aria-pressed") === "true");
check("subject: progress updates to 2",
  (await page.textContent(".subject-progress")).includes(`2 von ${competencyCount(ma, 1)}`));
await page.screenshot({ path: join(SHOTS_DIR, "03-subject-ma-checked.png"), fullPage: false });

await page.click('[data-code="MA.1.A.3"]');
check("subject: unchecking works",
  (await page.textContent(".subject-progress")).includes(`1 von ${competencyCount(ma, 1)}`));

await page.reload();
await page.waitForSelector(".competence");
check("persistence: check survives reload",
  await page.getAttribute('[data-code="MA.1.A.1"]', "aria-pressed") === "true");

await page.goto(URL);
await page.waitForSelector(".subject-grid");
check("home: MA card shows 1 checked",
  (await page.locator('a[href="#MA"] .progress-num').textContent()).trim() === `1/${competencyCount(ma, 1)}`);

await page.click('[data-cycle="3"]');
await page.waitForSelector('[data-cycle="3"][aria-pressed="true"]');
check("cycles: checks are separate per cycle",
  (await page.locator('a[href="#MA"] .progress-num').textContent()).trim() === `0/${competencyCount(ma, 3)}`);

/* ── Reset flow ───────────────────────────────────────────────────── */
await page.click('[data-action="reset-arm"]');
await page.waitForSelector(".reset-confirm");
check("reset: asks for confirmation and names the device storage",
  (await page.textContent(".reset-confirm p")).includes("Gerät"));
await page.screenshot({ path: join(SHOTS_DIR, "04-reset-confirm.png"), fullPage: true });

await page.click('[data-action="reset-cancel"]');
check("reset: cancel keeps progress", await page.locator(".reset-confirm").count() === 0);

await page.click('[data-cycle="1"]');
await page.click('[data-action="reset-arm"]');
await page.click('[data-action="reset-confirm"]');
await page.waitForSelector('[data-action="reset-arm"]');
check("reset: confirm clears all checks",
  (await page.locator('a[href="#MA"] .progress-num').textContent()).trim() === `0/${competencyCount(ma, 1)}`);

/* ── Desktop layout and console health ────────────────────────────── */
await page.setViewportSize({ width: 1280, height: 900 });
await page.goto(URL);
await page.waitForSelector(".subject-grid");
await page.screenshot({ path: join(SHOTS_DIR, "05-home-desktop.png"), fullPage: true });

const noHorizScroll = await page.evaluate(() =>
  document.documentElement.scrollWidth <= document.documentElement.clientWidth);
check("layout: no horizontal scrolling on desktop", noHorizScroll);

await page.setViewportSize({ width: 320, height: 700 });
await page.goto(URL + "#NMG");
await page.waitForSelector(".competence");
const noHorizScrollNarrow = await page.evaluate(() =>
  document.documentElement.scrollWidth <= document.documentElement.clientWidth);
check("layout: no horizontal scrolling at 320px in subject view", noHorizScrollNarrow);
await page.screenshot({ path: join(SHOTS_DIR, "06-subject-nmg-narrow.png"), fullPage: false });

check("console: no errors", consoleErrors.length === 0, consoleErrors.slice(0, 3).join(" | "));
check("network: no external requests", externalRequests.length === 0, externalRequests.slice(0, 3).join(", "));

await browser.close();
server.close();

console.log(failures === 0 ? "\nAll tests passed." : `\n${failures} test(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
