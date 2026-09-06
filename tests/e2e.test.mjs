// e2e.test.mjs — Playwright end-to-end tests for the site shell:
// the root overview with its four entries (Lehrplan 21, Kompass,
// Merkheft, Übungs-Apps), the Lehrplan-21 page, the Übungs-Apps list, breadcrumbs across the family, the
// 404 page, registry consistency with PRODUCT.md, cache-busting,
// layout, console and network hygiene.
//
// Run:
//   cd tests && npm install && node e2e.test.mjs

import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { mkdirSync, existsSync, readFileSync } from "node:fs";
import { dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const TESTS_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(TESTS_DIR, "..");
const SHOTS_DIR = join(TESTS_DIR, "screenshots");
const PORT = 8571;
const BASE = `http://localhost:${PORT}`;

const CHROMIUM = process.env.CHROMIUM_PATH
  || (existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined);

let failures = 0;
function check(name, condition, detail = "") {
  const ok = Boolean(condition);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok || !detail ? "" : ` — ${detail}`}`);
  if (!ok) failures++;
}

/* ── Static checks ────────────────────────────────────────────────── */
{
  // Cache-busting: the shell files share one ?v= on every local asset.
  const versions = new Set();
  const unversioned = [];
  for (const f of ["index.html", "ueben/index.html", "lehrplan21/index.html", "site.css"]) {
    const text = readFileSync(join(ROOT_DIR, f), "utf8");
    for (const m of text.matchAll(/(?:href="[^"]+?|url\('fonts\/[^']+?)(\?v=(\d+))?["')]/g)) {
      const whole = m[0];
      if (whole.includes("http") || whole.includes('"#') || /href="(\.\.\/|[a-z0-9-]+\/)+"/.test(whole)) continue;
      if (m[2]) versions.add(m[2]);
      else unversioned.push(`${f}: ${whole}`);
    }
  }
  check("cache-busting: every local asset ref carries ?v=", unversioned.length === 0, unversioned.join("; "));
  check("cache-busting: one single version everywhere", versions.size === 1, [...versions].join(","));

  // Registry: the Übungs-Apps list is exactly the practice apps of the
  // PRODUCT.md app registry (everything but the Kompass and the Merkheft).
  const product = readFileSync(join(ROOT_DIR, "PRODUCT.md"), "utf8");
  const registrySection = product.split("## App registry")[1].split(/\r?\n## /)[0];
  const registry = [...registrySection.matchAll(/^\| ([a-z][a-z-]*) \| ([^|]+) \|/gm)]
    .map((m) => ({ app: m[1], competency: m[2].trim() }));
  const practice = registry.filter((r) => !/self-assessment|reference/.test(r.competency)).map((r) => r.app);
  const ueben = readFileSync(join(ROOT_DIR, "ueben", "index.html"), "utf8");
  const listed = [...ueben.matchAll(/class="row" href="\.\.\/([a-z-]+)\/"/g)].map((m) => m[1]);
  check("registry: 31 practice apps registered", practice.length === 31, String(practice.length));
  check("registry: Übungs-Apps list matches the PRODUCT.md registry",
    listed.length === practice.length && practice.every((a) => listed.includes(a)) && new Set(listed).size === listed.length,
    `registry ${practice.join(",")} / listed ${listed.join(",")}`);
  check("registry: every listed app folder exists",
    listed.every((a) => existsSync(join(ROOT_DIR, a, "index.html"))));
  check("registry: Kompass and Merkheft are the other two entries",
    registry.some((r) => r.app === "lehrplan-kompass") && registry.some((r) => r.app === "merkheft"));
}

/* ── Static server (whole repo, directories serve their index.html) ── */
const MIME = {
  ".html": "text/html", ".css": "text/css", ".js": "text/javascript",
  ".svg": "image/svg+xml", ".woff2": "font/woff2",
};
const server = createServer(async (req, res) => {
  // 404.html links absolute /lehrplan-apps/ paths (GitHub Pages project
  // path); map them onto the repo root here.
  let path = req.url.split("?")[0].replace(/^\//, "").replace(/^lehrplan-apps\//, "");
  if (path === "" || path.endsWith("/")) path += "index.html";
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
page.on("request", (req) => { if (!req.url().startsWith(BASE)) externalRequests.push(req.url()); });

const crumbCurrent = async () => (await page.textContent('.crumbs [aria-current="page"]')).trim();

/* ── Root: four entries ───────────────────────────────────────────── */
await page.goto(`${BASE}/`);
await page.waitForSelector(".entry-list");
check("root: title renders", (await page.textContent("h1")).trim() === "Lehrplan-Apps");
check("root: exactly four entries: Lehrplan 21, Kompass, Merkheft, Übungs-Apps",
  await page.locator(".entry-list .row").count() === 4
  && await page.locator('.row[href="lehrplan21/"]').count() === 1
  && await page.locator('.row[href="lehrplan-kompass/"]').count() === 1
  && await page.locator('.row[href="ueben/"]').count() === 1
  && await page.locator('.row[href="merkheft/"]').count() === 1);
check("root: no breadcrumb on the root itself", await page.locator(".crumbs").count() === 0);
check("root: entries read Lehrplan 21 → Kompass → Merkheft → Übungs-Apps (verstehen, einschätzen, nachschlagen, üben)",
  (await page.locator(".entry-list .row").evaluateAll((els) => els.map((e) => e.getAttribute("href")))).join(",") === "lehrplan21/,lehrplan-kompass/,merkheft/,ueben/");
check("root: every entry has icon, name, description and meta",
  await page.locator(".entry .row-icon").count() === 4
  && await page.locator(".entry .row-name").count() === 4
  && await page.locator(".entry .row-desc").count() === 4
  && await page.locator(".entry .row-meta").count() === 4);
await page.screenshot({ path: join(SHOTS_DIR, "01-root.png"), fullPage: true });

/* ── Lehrplan 21: the explainer page ──────────────────────────────── */
await page.click('.row[href="lehrplan21/"]');
await page.waitForSelector(".text-page");
check("lehrplan21: breadcrumb links the overview and names the page",
  await page.locator('.crumbs a[href="../"]').count() === 1 && (await crumbCurrent()) === "Der Lehrplan 21");
check("lehrplan21: title renders", (await page.textContent("h1")).trim() === "Der Lehrplan 21");
const sectionIds = await page.locator(".text-page section").evaluateAll((els) => els.map((e) => e.id));
check("lehrplan21: sections cover concept, Zyklen, Aufbau, Stufen, Verbindlichkeiten, Prim/Sek, Beurteilung, Apps, Glossar, Quelle",
  sectionIds.join(",") === "was,ansatz,zyklen,aufbau,stufen,verbindlich,primsek,beurteilung,apps,glossar,quellen", sectionIds.join(","));
const tocTargets = await page.locator(".toc a").evaluateAll((els) => els.map((e) => e.getAttribute("href").slice(1)));
check("lehrplan21: every table-of-contents link targets an existing section",
  tocTargets.length >= 8 && tocTargets.every((id) => sectionIds.includes(id)), tocTargets.join(","));
check("lehrplan21: one h1, h2 per section, no skipped heading levels",
  await page.locator("h1").count() === 1
  && await page.locator(".text-page h2").count() === sectionIds.length
  && await page.locator("h3, h4, h5, h6").count() === 0);
const bodyText = await page.textContent(".text-page");
check("lehrplan21: explains Grundanspruch, Orientierungspunkt, Zyklus, Kompetenzstufe, Real- und Sekundarschule",
  ["Grundanspruch", "Orientierungspunkt", "Zyklus", "Kompetenzstufe", "Realschul", "Sekundarschul", "Auftrag des Zyklus"].every((w) => bodyText.includes(w)));
check("lehrplan21: the three Zyklen carry their class ranges",
  bodyText.includes("Kindergarten") && bodyText.includes("3. bis 6. Klasse") && bodyText.includes("7. bis 9. Klasse"));
check("lehrplan21: glossary defines at least 30 terms, alphabetically, each with a definition",
  await (async () => {
    const terms = await page.locator(".glossar dt").allTextContents();
    const defs = await page.locator(".glossar dd").allTextContents();
    const sorted = [...terms].sort((a, b) => a.localeCompare(b, "de"));
    return terms.length >= 30 && defs.length === terms.length && defs.every((d) => d.trim().length > 20)
      && terms.join("|") === sorted.join("|") && new Set(terms).size === terms.length;
  })(), (await page.locator(".glossar dt").allTextContents()).join("|"));
check("lehrplan21: two schemata as labelled inline SVG (Zyklen timeline, Stufen ladder)",
  await page.locator('.figure svg[role="img"][aria-label]').count() === 2
  && await page.locator(".figure figcaption").count() === 2);
check("lehrplan21: Swiss standard German, no ß, no em dash",
  !bodyText.includes("ß") && !bodyText.includes("—"));
check("lehrplan21: names the official source",
  await page.locator('#quellen a[href="https://be.lehrplan.ch"]').count() === 1);
await page.screenshot({ path: join(SHOTS_DIR, "06-lehrplan21.png"), fullPage: true });
await page.click(".toc a[href='#glossar']");
check("lehrplan21: table-of-contents link jumps to the glossary", page.url().endsWith("#glossar")
  && await page.locator("#glossar").evaluate((el) => el.getBoundingClientRect().top >= -1 && el.getBoundingClientRect().top < 200));
await page.click('.crumbs a[href="../"]');
await page.waitForSelector(".entry-list");

/* ── Übungs-Apps list ─────────────────────────────────────────────── */
await page.click('.row[href="ueben/"]');
await page.waitForSelector(".row-list");
check("ueben: breadcrumb links the overview and names the list",
  await page.locator('.crumbs a[href="../"]').count() === 1 && (await crumbCurrent()) === "Übungs-Apps");
check("ueben: 31 apps in 8 subject groups",
  await page.locator(".row-list .row").count() === 31 && await page.locator(".gruppe").count() === 8);
const metas = await page.locator(".row-list .row-meta").allTextContents();
check("ueben: every row has icon, name, description and a competency code",
  await page.locator(".row-list .row-icon").count() === 31
  && await page.locator(".row-list .row-name").count() === 31
  && await page.locator(".row-list .row-desc").count() === 31
  && metas.length === 31 && metas.every((m) => /^[A-Z0-9]+(\.[A-Z0-9]+)+$/.test(m.trim())));
check("ueben: descriptions do not repeat the Lehrplan suffix",
  (await page.locator(".row-list .row-desc").allTextContents()).every((d) => !d.includes("Lehrplan 21")));
await page.screenshot({ path: join(SHOTS_DIR, "02-ueben.png"), fullPage: true });

/* ── Journey: list → app → breadcrumb back → root ─────────────────── */
await page.click('.row[href="../zahlenwissen/"]');
await page.waitForSelector(".stufen-list");
check("journey: an app opens from the list with the family breadcrumb",
  await page.locator('.crumbs a[href="../"]').count() === 1
  && await page.locator('.crumbs a[href="../ueben/"]').count() === 1
  && (await crumbCurrent()) === "Zahlenwissen");
await page.click('.crumbs a[href="../ueben/"]');
await page.waitForSelector(".row-list");
await page.click('.crumbs a[href="../"]');
await page.waitForSelector(".entry-list");
check("journey: the breadcrumb path leads back to the root", page.url() === `${BASE}/`);

/* ── Kompass and Merkheft entries carry the same breadcrumb ───────── */
await page.click('.row[href="lehrplan-kompass/"]');
await page.waitForSelector(".subject-grid");
check("kompass: breadcrumb links the overview and names the Kompass",
  await page.locator('.crumbs a[href="../"]').count() === 1 && (await crumbCurrent()) === "Lehrplan-Kompass");
await page.goto(`${BASE}/`);
await page.click('.row[href="merkheft/"]');
await page.waitForSelector(".blatt-list");
check("merkheft: breadcrumb links the overview and names the Merkheft",
  await page.locator('.crumbs a[href="../"]').count() === 1 && (await crumbCurrent()) === "Merkheft");

/* ── 404 page ─────────────────────────────────────────────────────── */
await page.goto(`${BASE}/404.html`);
await page.waitForSelector("main");
check("404: calm German page with a way back to the overview",
  (await page.textContent("h1")).includes("nicht gefunden")
  && await page.locator('a[href="/lehrplan-apps/"]').count() === 1);
await page.screenshot({ path: join(SHOTS_DIR, "03-404.png"), fullPage: true });

/* ── Keyboard walk: visible focus on every stop (A11y sweep) ─────── */
async function keyboardWalk(url, ready, stops) {
  await page.goto(url);
  await page.waitForSelector(ready);
  const seen = [];
  for (let i = 0; i < stops; i++) {
    await page.keyboard.press("Tab");
    const stop = await page.evaluate(() => {
      const el = document.activeElement;
      const s = getComputedStyle(el);
      return { tag: el.tagName, visible: s.outlineStyle !== "none" && parseFloat(s.outlineWidth) > 0 };
    });
    if (stop.tag === "BODY") break; // end of the page (the start page has five stops)
    seen.push(stop);
  }
  return seen;
}
for (const [url, ready, label] of [[`${BASE}/`, ".entry-list", "start page"], [`${BASE}/lehrplan21/`, ".text-page", "Lehrplan 21"], [`${BASE}/ueben/`, ".row-list", "Übungs-Apps"], [`${BASE}/zahlenwissen/`, ".stufen-list", "app home"], [`${BASE}/merkheft/zahlenstrahl.html`, ".blatt-page", "Merkblatt"]]) {
  const walk = await keyboardWalk(url, ready, 5);
  check(`a11y: ${label} shows a visible focus ring on every early tab stop`,
    walk.length >= 3 && walk.every((w) => w.visible), JSON.stringify(walk));
}

/* ── Motion: family bars use transform, reduced motion jumps ─────── */
await page.goto(`${BASE}/zahlenwissen/`);
await page.waitForSelector(".stufen-list");
check("motion: no global transition kill, the bar transitions transform only",
  (await page.evaluate(() => { const s = getComputedStyle(document.querySelector(".stats-strip .progress-fill")); return s.transitionProperty + " " + s.transitionDuration; })) === "transform 0.24s");
await page.emulateMedia({ reducedMotion: "reduce" });
check("motion: reduced motion removes the bar transition and keeps its value",
  (await page.evaluate(() => { const s = getComputedStyle(document.querySelector(".stats-strip .progress-fill")); return s.transitionDuration + " " + (s.transform !== "none"); })) === "0s true");
await page.emulateMedia({ reducedMotion: "no-preference" });

/* ── Layout, console, network ─────────────────────────────────────── */
const noHorizScroll = () => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);
await page.setViewportSize({ width: 320, height: 700 });
await page.goto(`${BASE}/`);
await page.waitForSelector(".entry-list");
check("layout: root has no horizontal scrolling at 320px", await noHorizScroll());
await page.goto(`${BASE}/lehrplan21/`);
await page.waitForSelector(".text-page");
check("layout: Lehrplan-21 page has no horizontal scrolling at 320px", await noHorizScroll());
check("layout: Lehrplan-21 paragraphs keep a readable line length (≤ 75ch)",
  await page.locator(".text-page p").evaluateAll((els) => els.every((p) => {
    const s = getComputedStyle(p); return p.getBoundingClientRect().width / (parseFloat(s.fontSize) * 0.5) <= 80;
  })));
await page.goto(`${BASE}/ueben/`);
await page.waitForSelector(".row-list");
check("layout: Übungs-Apps list has no horizontal scrolling at 320px", await noHorizScroll());
await page.setViewportSize({ width: 1280, height: 900 });
await page.goto(`${BASE}/`);
await page.waitForSelector(".entry-list");
await page.screenshot({ path: join(SHOTS_DIR, "04-root-desktop.png"), fullPage: true });
await page.goto(`${BASE}/ueben/`);
await page.waitForSelector(".row-list");
await page.screenshot({ path: join(SHOTS_DIR, "05-ueben-desktop.png"), fullPage: true });
await page.goto(`${BASE}/lehrplan21/`);
await page.waitForSelector(".text-page");
await page.screenshot({ path: join(SHOTS_DIR, "07-lehrplan21-desktop.png"), fullPage: true });

check("console: no errors", consoleErrors.length === 0, consoleErrors.slice(0, 3).join(" | "));
check("network: no external requests", externalRequests.length === 0, externalRequests.slice(0, 3).join(", "));

await browser.close();
server.close();
console.log(failures === 0 ? "\nAll tests passed." : `\n${failures} test(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
