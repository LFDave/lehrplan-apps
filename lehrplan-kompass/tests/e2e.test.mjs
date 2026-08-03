// e2e.test.mjs — Playwright end-to-end tests for Lehrplan-Kompass.
//
// Run:
//   cd lehrplan-kompass/tests && npm install && node e2e.test.mjs
//
// Spawns its own static server (node, no external deps) and drives the
// real flows in Chromium: cycle switching, opening a subject, checking
// competencies, per-cycle persistence across reloads, browser back, and
// the reset confirmation. Exits non-zero if any check fails.
// Screenshots land in tests/screenshots/ (gitignored).

import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { mkdirSync, existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, extname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { SUBJECTS, subjectsForCycle, competencyCount } from "../data.js?v=1";
import { STRINGS } from "../strings.js?v=1";

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
      if (whole.includes("http") || whole.includes('"#')) continue;
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
        if (!c.text || c.text.length < 10) { ok = false; issues.push(`${c.code}: text too short`); }
      }
    }
  }
  check("data: subjects, areas and codes are consistent", ok, issues.slice(0, 5).join("; "));
  check("data: 358 competencies across 16 subjects", total === 358 && SUBJECTS.length === 16, `${total}/${SUBJECTS.length}`);

  const eszett = [];
  for (const s of SUBJECTS) {
    if ((s.name + (s.tag || "")).includes("ß")) eszett.push(s.id);
    for (const a of s.areas) {
      if (a.title.includes("ß")) eszett.push(a.id);
      for (const c of a.competencies) if (c.text.includes("ß")) eszett.push(c.code);
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
check("home: cycle 3 summary counts all cycle-3 competencies",
  (await page.textContent(".summary")).includes(
    `von ${subjectsForCycle(3).reduce((n, s) => n + competencyCount(s), 0)}`));
await page.screenshot({ path: join(SHOTS_DIR, "02-home-cycle3.png"), fullPage: true });

/* ── Subject view: checking competencies ──────────────────────────── */
await page.click('[data-cycle="2"]');
await page.waitForSelector('[data-cycle="2"][aria-pressed="true"]');
await page.click('a[href="#MA"]');
await page.waitForSelector(".competence");

const ma = SUBJECTS.find((s) => s.id === "MA");
check("subject: renders all MA competencies",
  await page.locator(".competence").count() === competencyCount(ma));
check("subject: progress starts at 0",
  (await page.textContent(".subject-progress")).includes(`0 von ${competencyCount(ma)}`));

await page.click('[data-code="MA.1.A.1"]');
await page.click('[data-code="MA.1.A.3"]');
check("subject: checked state toggles aria-pressed",
  await page.getAttribute('[data-code="MA.1.A.1"]', "aria-pressed") === "true");
check("subject: progress updates to 2",
  (await page.textContent(".subject-progress")).includes(`2 von ${competencyCount(ma)}`));
await page.screenshot({ path: join(SHOTS_DIR, "03-subject-ma-checked.png"), fullPage: false });

await page.click('[data-code="MA.1.A.3"]');
check("subject: unchecking works",
  (await page.textContent(".subject-progress")).includes(`1 von ${competencyCount(ma)}`));

/* ── Persistence across reload, per cycle ─────────────────────────── */
await page.reload();
await page.waitForSelector(".competence");
check("persistence: check survives reload",
  await page.getAttribute('[data-code="MA.1.A.1"]', "aria-pressed") === "true");

await page.goBack();
await page.waitForSelector(".subject-grid");
check("navigation: browser back returns to home",
  await page.locator(".cycle-grid").count() === 1);
const maCard = page.locator('a[href="#MA"] .progress-num');
check("home: MA card shows 1 checked", (await maCard.textContent()).trim() === `1/${competencyCount(ma)}`);

await page.click('[data-cycle="3"]');
await page.waitForSelector('[data-cycle="3"][aria-pressed="true"]');
check("cycles: checks are separate per cycle",
  (await page.locator('a[href="#MA"] .progress-num').textContent()).trim() === `0/${competencyCount(ma)}`);

/* ── Reset flow ───────────────────────────────────────────────────── */
await page.click('[data-action="reset-arm"]');
await page.waitForSelector(".reset-confirm");
check("reset: asks for confirmation and names the device storage",
  (await page.textContent(".reset-confirm p")).includes("Gerät"));
await page.screenshot({ path: join(SHOTS_DIR, "04-reset-confirm.png"), fullPage: true });

await page.click('[data-action="reset-cancel"]');
check("reset: cancel keeps progress", await page.locator(".reset-confirm").count() === 0);

await page.click('[data-cycle="2"]');
await page.click('[data-action="reset-arm"]');
await page.click('[data-action="reset-confirm"]');
await page.waitForSelector('[data-action="reset-arm"]');
check("reset: confirm clears all checks",
  (await page.locator('a[href="#MA"] .progress-num').textContent()).trim() === `0/${competencyCount(ma)}`);

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
