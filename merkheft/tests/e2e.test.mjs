// e2e.test.mjs — Playwright end-to-end tests for Merkheft.
//
// Run:
//   cd merkheft/tests && npm install && node e2e.test.mjs
//
// Spawns its own static server and drives the real flows in Chromium:
// home list, every Merkblatt via hash deep link, the interactive
// visuals (circuit states, globe slider, orbit toggle), the Dazu-üben
// links, back navigation, layout, console and network hygiene.

import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { mkdirSync, existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { PAGES, GRUPPEN, pageById } from "../data.js?v=1";

const TESTS_DIR = dirname(fileURLToPath(import.meta.url));
const APP_DIR = join(TESTS_DIR, "..");
const ROOT_DIR = join(APP_DIR, "..");
const SHOTS_DIR = join(TESTS_DIR, "screenshots");
const PORT = 8547;
const URL = `http://localhost:${PORT}/merkheft/index.html`;

const CHROMIUM = process.env.CHROMIUM_PATH
  || (existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined);

let failures = 0;
function check(name, condition, detail = "") {
  const ok = Boolean(condition);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok || !detail ? "" : ` — ${detail}`}`);
  if (!ok) failures++;
}

/* ── Cache-busting consistency ────────────────────────────────────── */
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
      if (whole.includes("http") || whole.includes('"#') || whole.includes("${") || whole.includes("../")) continue;
      if (m[2]) versions.add(m[2]);
      else unversioned.push(`${file}: ${whole}`);
    }
  }
  check("cache-busting: every local asset ref carries ?v=", unversioned.length === 0, unversioned.join("; "));
  check("cache-busting: one single version everywhere", versions.size === 1, [...versions].join(","));
}

/* ── Data sanity ──────────────────────────────────────────────────── */
{
  const ids = new Set();
  const issues = [];
  for (const p of PAGES) {
    if (ids.has(p.id)) issues.push(`duplicate ${p.id}`);
    ids.add(p.id);
    if (!p.intro.length) issues.push(`${p.id}: no intro`);
    if (!p.ueben.length) issues.push(`${p.id}: no ueben links`);
    if (!p.codes.length) issues.push(`${p.id}: no codes`);
    for (const u of p.ueben) {
      const target = join(ROOT_DIR, u.href.replace("../", ""), "index.html");
      if (!existsSync(target)) issues.push(`${p.id}: ueben target missing ${u.href}`);
    }
    for (const t of [...p.intro, p.title]) if (t.includes("ß")) issues.push(`${p.id}: ß found`);
  }
  check("data: five wave-1 Merkblätter with valid links", PAGES.length === 5 && issues.length === 0, issues.join("; "));
  check("data: pageById resolves every id", PAGES.every((p) => pageById(p.id) === p));
}

/* ── Static server ────────────────────────────────────────────────── */
const MIME = {
  ".html": "text/html", ".css": "text/css", ".js": "text/javascript",
  ".svg": "image/svg+xml", ".woff2": "font/woff2",
};
const server = createServer(async (req, res) => {
  const path = req.url.split("?")[0].replace(/^\//, "") || "index.html";
  try {
    const data = await readFile(join(ROOT_DIR, path));
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

/* ── Home ─────────────────────────────────────────────────────────── */
await page.goto(URL);
await page.waitForSelector(".blatt-list");
check("home: title renders", (await page.textContent("h1")).includes("Merkheft"));
check("home: all pages listed in groups",
  await page.locator(".blatt").count() === PAGES.length
  && await page.locator(".gruppe").count() === GRUPPEN.length);
await page.screenshot({ path: join(SHOTS_DIR, "01-home.png"), fullPage: true });

/* ── Every Merkblatt via hash ─────────────────────────────────────── */
for (const p of PAGES) {
  await page.goto(`${URL}#${p.id}`);
  await page.waitForSelector(".blatt-page");
  check(`page ${p.id}: title and visual render`,
    (await page.textContent("h1")).trim() === p.title
    && (await page.locator(".illu-stage svg, .illu-stage .orbits").count()) >= 1);
  check(`page ${p.id}: Dazu-üben links present`,
    await page.locator(".ueben-link").count() === p.ueben.length);
}

/* ── Interactivity: circuit ───────────────────────────────────────── */
await page.goto(`${URL}#schaltungen`);
await page.waitForSelector("#illu-circuit");
const stat = async () => (await page.textContent("#illu-circuit-status")).trim();
check("circuit: open at start", (await stat()).includes("offen"));
await page.click("#illu-sw");
check("circuit: series both lit", (await stat()).includes("nacheinander"));
await page.check("#illu-broken");
check("circuit: series broken goes dark", (await stat()).includes("unterbricht"));
await page.click("#illu-mode");
check("circuit: parallel survives broken lamp", (await stat()).includes("leuchtet weiter"));
await page.screenshot({ path: join(SHOTS_DIR, "02-schaltungen.png"), fullPage: true });

/* ── Interactivity: globe and orbits ──────────────────────────────── */
await page.goto(`${URL}#gradnetz`);
await page.waitForSelector("#illu-globe");
const rxBefore = await page.getAttribute("#illu-meridians ellipse", "rx");
await page.fill("#illu-spin", "90");
const rxAfter = await page.getAttribute("#illu-meridians ellipse", "rx");
check("globe: slider rotates meridians", rxBefore !== rxAfter);
await page.screenshot({ path: join(SHOTS_DIR, "03-gradnetz.png"), fullPage: true });

await page.goto(`${URL}#sonnensystem`);
await page.waitForSelector("#illu-orbits");
check("orbits: paused by default", !(await page.locator("#illu-orbits.running").count()));
await page.click("#illu-orbit-play");
check("orbits: running after click", (await page.locator("#illu-orbits.running").count()) === 1);

/* ── Back navigation and unknown hash ─────────────────────────────── */
await page.click(".back");
await page.waitForSelector(".blatt-list");
check("nav: back returns to the list", (await page.locator(".blatt").count()) === PAGES.length);
await page.goto(`${URL}#gibtsnicht`);
await page.waitForSelector(".blatt-list");
check("nav: unknown hash falls back to home", (await page.locator(".blatt").count()) === PAGES.length);

/* ── Layout, console, network ─────────────────────────────────────── */
await page.setViewportSize({ width: 320, height: 700 });
await page.goto(`${URL}#gradnetz`);
await page.waitForSelector(".blatt-page");
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
check("layout: no horizontal scrolling at 320px", overflow <= 0, `overflow ${overflow}px`);
check("console: no errors", consoleErrors.length === 0, consoleErrors.join(" | "));
check("network: no external requests", externalRequests.length === 0, externalRequests.join(", "));

await browser.close();
server.close();
console.log(failures ? `\n${failures} check(s) failed.` : "\nAll tests passed.");
process.exit(failures ? 1 : 0);
