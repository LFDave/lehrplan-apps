// e2e.test.mjs — Playwright end-to-end tests for Merkheft.
//
// Run:
//   cd merkheft/tests && npm install && node e2e.test.mjs
//
// Spawns its own static server and drives the real flows in Chromium:
// the index list, every Merkblatt as its own page, the interactive
// visuals (circuit states, globe slider, orbit toggle), the Dazu-üben
// links, back navigation, print styles, layout, console and network
// hygiene. The expectations are restated here independently of the
// pages themselves.

import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { mkdirSync, existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const TESTS_DIR = dirname(fileURLToPath(import.meta.url));
const APP_DIR = join(TESTS_DIR, "..");
const ROOT_DIR = join(APP_DIR, "..");
const SHOTS_DIR = join(TESTS_DIR, "screenshots");
const PORT = 8547;
const BASE = `http://localhost:${PORT}/merkheft`;

// Independent restatement of the wave-1 Merkheft contents: one HTML
// page per concept, its group, title, practice links and codes.
const BLAETTER = [
  { id: "masseinheiten", gruppe: "Mathematik", title: "Masseinheiten",
    ueben: [{ href: "../masswerk/", stufe: "e" }, { href: "../groessenwissen/", stufe: "f" }],
    codes: ["MA.3.A.1.f", "MA.3.A.2.e"], interactive: false },
  { id: "wasserkreislauf", gruppe: "Natur und Technik", title: "Der Wasserkreislauf",
    ueben: [{ href: "../wetterwarte/", stufe: "1g" }], codes: ["NMG.4.4.1g"], interactive: false },
  { id: "schaltungen", gruppe: "Natur und Technik", title: "Serie- und Parallelschaltung",
    ueben: [{ href: "../stromkreis/", stufe: "b" }], codes: ["NT.5.2.b"], interactive: true },
  { id: "mondphasen", gruppe: "Himmel und Weltall", title: "Die Mondphasen",
    ueben: [{ href: "../sternwarte/", stufe: "d" }], codes: ["NMG.4.5.d"], interactive: false },
  { id: "sonnensystem", gruppe: "Himmel und Weltall", title: "Das Sonnensystem",
    ueben: [{ href: "../sternwarte/", stufe: "e" }], codes: ["NMG.4.5.e"], interactive: true },
  { id: "gradnetz", gruppe: "Raum und Erde", title: "Das Gradnetz der Erde",
    ueben: [{ href: "../weltatlas/", stufe: "c" }], codes: ["RZG.4.1.c"], interactive: true },
];
const GRUPPEN = ["Mathematik", "Natur und Technik", "Himmel und Weltall", "Raum und Erde"];

const CHROMIUM = process.env.CHROMIUM_PATH
  || (existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined);

let failures = 0;
function check(name, condition, detail = "") {
  const ok = Boolean(condition);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok || !detail ? "" : ` — ${detail}`}`);
  if (!ok) failures++;
}

/* ── Static checks on the source files ────────────────────────────── */
{
  // Cache-busting: every local asset ref in every HTML page and JS
  // module carries the same ?v=N.
  const sources = [
    ["styles.css", readFileSync(join(APP_DIR, "styles.css"), "utf8")],
    ...readdirSync(APP_DIR).filter((f) => f.endsWith(".html") || f.endsWith(".js"))
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
      if (whole.includes("http") || whole.includes('"#') || whole.includes("${")
        || whole.includes("../") || /href="[a-z]+\.html"/.test(whole)) continue;
      if (m[2]) versions.add(m[2]);
      else unversioned.push(`${file}: ${whole}`);
    }
  }
  check("cache-busting: every local asset ref carries ?v=", unversioned.length === 0, unversioned.join("; "));
  check("cache-busting: one single version everywhere", versions.size === 1, [...versions].join(","));

  // One file per Merkblatt, practice targets exist, no ß anywhere.
  const issues = [];
  for (const b of BLAETTER) {
    const file = join(APP_DIR, `${b.id}.html`);
    if (!existsSync(file)) { issues.push(`${b.id}.html missing`); continue; }
    const text = readFileSync(file, "utf8");
    if (text.includes("ß")) issues.push(`${b.id}: ß found`);
    for (const c of b.codes) if (!text.includes(c)) issues.push(`${b.id}: code ${c} missing`);
    for (const u of b.ueben) {
      if (!text.includes(`href="${u.href}"`)) issues.push(`${b.id}: ueben link ${u.href} missing`);
      if (!existsSync(join(ROOT_DIR, u.href.replace("../", ""), "index.html")))
        issues.push(`${b.id}: ueben target missing ${u.href}`);
    }
  }
  check("pages: one file per Merkblatt, codes, valid Dazu-üben targets", issues.length === 0, issues.join("; "));

  // Print styles exist so every Merkblatt is printable as A4.
  const css = readFileSync(join(APP_DIR, "styles.css"), "utf8");
  check("print: @media print with light background and hidden chrome",
    /@media print/.test(css) && /\.illu-controls[^{}]*\{\s*display:\s*none/s.test(css.replace(/\n/g, " ")));
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

/* ── Index ────────────────────────────────────────────────────────── */
await page.goto(`${BASE}/index.html`);
await page.waitForSelector(".blatt-list");
check("index: title renders", (await page.textContent("h1")).includes("Merkheft"));
check("index: all pages listed in groups",
  await page.locator(".blatt").count() === BLAETTER.length
  && await page.locator(".gruppe").count() === GRUPPEN.length);
for (const b of BLAETTER) {
  check(`index: links ${b.id}.html`,
    await page.locator(`.blatt[href="${b.id}.html"]`).count() === 1);
}
await page.screenshot({ path: join(SHOTS_DIR, "01-home.png"), fullPage: true });

/* ── Every Merkblatt page ─────────────────────────────────────────── */
for (const b of BLAETTER) {
  await page.goto(`${BASE}/${b.id}.html`);
  await page.waitForSelector(".blatt-page");
  check(`page ${b.id}: title, group and visual render`,
    (await page.textContent("h1")).trim() === b.title
    && (await page.textContent(".blatt-gruppe")).trim() === b.gruppe
    && (await page.locator(".illu-stage svg, .illu-stage .orbits").count()) >= 1
    && (await page.title()).includes("Merkheft"));
  check(`page ${b.id}: Dazu-üben links present`,
    await page.locator(".ueben-link").count() === b.ueben.length);
  check(`page ${b.id}: back link to index`,
    await page.locator('.back[href="index.html"]').count() === 1);
}

/* ── Interactivity: circuit ───────────────────────────────────────── */
await page.goto(`${BASE}/schaltungen.html`);
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
await page.goto(`${BASE}/gradnetz.html`);
await page.waitForSelector("#illu-globe ellipse");
const rxBefore = await page.getAttribute("#illu-meridians ellipse", "rx");
await page.fill("#illu-spin", "90");
const rxAfter = await page.getAttribute("#illu-meridians ellipse", "rx");
check("globe: slider rotates meridians", rxBefore !== rxAfter);
await page.screenshot({ path: join(SHOTS_DIR, "03-gradnetz.png"), fullPage: true });

await page.goto(`${BASE}/sonnensystem.html`);
await page.waitForSelector("#illu-orbits");
check("orbits: paused by default", !(await page.locator("#illu-orbits.running").count()));
await page.click("#illu-orbit-play");
check("orbits: running after click", (await page.locator("#illu-orbits.running").count()) === 1);

/* ── Infographic: Masseinheiten ───────────────────────────────────── */
await page.goto(`${BASE}/masseinheiten.html`);
await page.waitForSelector("#ig-masseinheiten");
check("infographic: four unit ladders with 20 boxes and 16 factors",
  (await page.locator("#ig-masseinheiten .ig-box").count()) === 20
  && (await page.locator("#ig-masseinheiten .ig-factor").count()) === 16);
const igFactors = await page.locator("#ig-masseinheiten .ig-lane .ig-factor").allTextContents();
check("infographic: canonical conversion factors",
  JSON.stringify(igFactors) === JSON.stringify([
    "×1000", "×10", "×10", "×10",          // km m dm cm mm
    "×1000", "×1000", "×1000",             // t kg g mg
    "×100", "×10", "×10", "×10",           // hl l dl cl ml
    "×24", "×60", "×60",                   // Tag h min s
  ]), igFactors.join(" "));
await page.emulateMedia({ media: "print" });
const igPrint = await page.evaluate(() => ({
  box: getComputedStyle(document.querySelector(".ig-box")).fill,
  title: getComputedStyle(document.querySelector(".ig-title")).fill,
}));
check("infographic: print restyles boxes and text light",
  igPrint.box === "rgb(247, 244, 230)" && igPrint.title === "rgb(26, 34, 48)",
  JSON.stringify(igPrint));
await page.screenshot({ path: join(SHOTS_DIR, "06-print-masseinheiten.png"), fullPage: true });
await page.emulateMedia({ media: "screen" });
await page.screenshot({ path: join(SHOTS_DIR, "06-masseinheiten.png"), fullPage: true });

/* ── Back navigation ──────────────────────────────────────────────── */
await page.click(".back");
await page.waitForSelector(".blatt-list");
check("nav: back returns to the list", (await page.locator(".blatt").count()) === BLAETTER.length);

/* ── Print rendering ──────────────────────────────────────────────── */
await page.goto(`${BASE}/wasserkreislauf.html`);
await page.waitForSelector(".blatt-page");
await page.emulateMedia({ media: "print" });
const printState = await page.evaluate(() => ({
  bodyBg: getComputedStyle(document.body).backgroundColor,
  navHidden: getComputedStyle(document.querySelector(".page-nav")).display === "none",
}));
check("print: white background, chrome hidden",
  printState.bodyBg === "rgb(255, 255, 255)" && printState.navHidden,
  JSON.stringify(printState));
await page.screenshot({ path: join(SHOTS_DIR, "04-print-wasserkreislauf.png"), fullPage: true });
await page.emulateMedia({ media: "screen" });

/* ── Layout, console, network ─────────────────────────────────────── */
await page.setViewportSize({ width: 320, height: 700 });
await page.goto(`${BASE}/gradnetz.html`);
await page.waitForSelector(".blatt-page");
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
check("layout: no horizontal scrolling at 320px", overflow <= 0, `overflow ${overflow}px`);
check("console: no errors", consoleErrors.length === 0, consoleErrors.join(" | "));
check("network: no external requests", externalRequests.length === 0, externalRequests.join(", "));

await browser.close();
server.close();
console.log(failures ? `\n${failures} check(s) failed.` : "\nAll tests passed.");
process.exit(failures ? 1 : 0);
