// e2e.test.mjs — Playwright end-to-end tests for the site shell:
// the root overview with its five entries (Lehrplan 21, Kompass,
// Merkheft, Übungs-Apps, Nachfragen), the Lehrplan-21 page, the
// Nachfragen page, the Übungs-Apps list, breadcrumbs across the family, the
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
  for (const f of ["index.html", "ueben/index.html", "lehrplan21/index.html", "nachfragen/index.html", "site.css", "nachfragen/styles.css"]) {
    const text = readFileSync(join(ROOT_DIR, f), "utf8");
    for (const m of text.matchAll(/(?:href="[^"]+?|url\('fonts\/[^']+?)(\?v=(\d+))?["')]/g)) {
      const whole = m[0];
      if (whole.includes("http") || whole.includes('"#') || /href="(\.\.\/|[a-z0-9-]+\/)+"/.test(whole)) continue;
      if (m[2]) versions.add(m[2]);
      else unversioned.push(`${f}: ${whole}`);
    }
  }
  for (const f of ["nachfragen/index.html", "nachfragen/app.js"]) {
    const text = readFileSync(join(ROOT_DIR, f), "utf8");
    for (const m of text.matchAll(/(?:src="|from ')[^"']+?\.js(\?v=(\d+))?["']/g)) {
      if (m[2]) versions.add(m[2]); else unversioned.push(`${f}: ${m[0]}`);
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
  // Nachfragen: the APPS list in data.js mirrors the Übungs-Apps list.
  const nachData = readFileSync(join(ROOT_DIR, "nachfragen", "data.js"), "utf8");
  const nachApps = [...nachData.matchAll(/\{ id: "([a-z-]+)", name: "[^"]+", code: "([A-Z0-9.]+)"/g)].map((m) => `${m[1]} ${m[2]}`);
  const uebenApps = [...ueben.matchAll(/href="\.\.\/([a-z-]+)\/".*?<span class="row-meta">([A-Z0-9.]+)<\/span>/gs)].map((m) => `${m[1]} ${m[2]}`);
  check("nachfragen: APPS in data.js equals the Übungs-Apps list (id and code)",
    nachApps.length === 31 && nachApps.join("|") === uebenApps.join("|"), `${nachApps.length} vs ${uebenApps.length}`);
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

/* ── Root: five entries ───────────────────────────────────────────── */
await page.goto(`${BASE}/`);
await page.waitForSelector(".entry-list");
check("root: title renders", (await page.textContent("h1")).trim() === "Lehrplan-Apps");
check("root: exactly five entries: Lehrplan 21, Kompass, Merkheft, Übungs-Apps, Nachfragen",
  await page.locator(".entry-list .row").count() === 5
  && await page.locator('.row[href="lehrplan21/"]').count() === 1
  && await page.locator('.row[href="lehrplan-kompass/"]').count() === 1
  && await page.locator('.row[href="ueben/"]').count() === 1
  && await page.locator('.row[href="merkheft/"]').count() === 1
  && await page.locator('.row[href="nachfragen/"]').count() === 1);
check("root: no breadcrumb on the root itself", await page.locator(".crumbs").count() === 0);
check("root: entries read Lehrplan 21 → Kompass → Merkheft → Übungs-Apps → Nachfragen",
  (await page.locator(".entry-list .row").evaluateAll((els) => els.map((e) => e.getAttribute("href")))).join(",") === "lehrplan21/,lehrplan-kompass/,merkheft/,ueben/,nachfragen/");
check("root: every entry has icon, name, description and meta",
  await page.locator(".entry .row-icon").count() === 5
  && await page.locator(".entry .row-name").count() === 5
  && await page.locator(".entry .row-desc").count() === 5
  && await page.locator(".entry .row-meta").count() === 5);
await page.screenshot({ path: join(SHOTS_DIR, "01-root.png"), fullPage: true });

/* ── Lehrplan 21: the explainer page ──────────────────────────────── */
await page.click('.row[href="lehrplan21/"]');
await page.waitForSelector(".text-page");
check("lehrplan21: breadcrumb links the overview and names the page",
  await page.locator('.crumbs a[href="../"]').count() === 1 && (await crumbCurrent()) === "Der Lehrplan 21");
check("lehrplan21: title renders", (await page.textContent("h1")).trim() === "Der Lehrplan 21");
const sectionIds = await page.locator(".text-page section").evaluateAll((els) => els.map((e) => e.id));
check("lehrplan21: sections cover concept, Zyklen, Aufbau, Stufen, Verbindlichkeiten, Prim/Sek, Beurteilung, Apps, Glossar, Quelle",
  sectionIds.join(",") === "was,ansatz,zyklen,laufbahn,aufbau,stufen,verbindlich,primsek,beurteilung,uebertritt,apps,glossar,quellen", sectionIds.join(","));
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
check("lehrplan21: three schemata as labelled inline SVG (Zyklen timeline, Schullaufbahn, Stufen ladder)",
  await page.locator('.figure svg[role="img"][aria-label]').count() === 3
  && await page.locator(".figure figcaption").count() === 3);
check("lehrplan21: the Schullaufbahn schema shows all eleven years, the three Sek I levels, both Gymnasium decisions and Sekundarstufe II",
  await page.locator("#laufbahn svg").evaluate((svg) => {
    const t = svg.textContent;
    return ["Real", "Sek", "spez.", "Übertrittsentscheid", "Gymnasium", "Sekundarstufe II", "Grundanspruch", "Orientierungspunkt", "Bericht ohne Noten", "Bericht mit Noten 1 bis 6"].every((w) => t.includes(w))
      && (t.match(/>?\bKG\b/g) || []).length >= 2 && ["1.", "2.", "3.", "4.", "5.", "6.", "7.", "8.", "9."].every((y) => t.includes(y));
  })
  && await page.locator("#laufbahn .pairs dt").count() === 4
  && (await page.textContent("#laufbahn")).includes("spezielle Sekundarschule"));
check("lehrplan21: the Übertrittsverfahren lists ten milestones from the 5th class to the decision, the Kontrollprüfung rules, and only be.ch documents",
  await page.locator("#uebertritt .milestones li").count() === 10
  && (await page.locator("#uebertritt .milestones").textContent()).includes("20. Februar")
  && (await page.textContent("#uebertritt")).includes("55 Punkten")
  && await page.locator("#uebertritt .doc-list .row").count() === 17
  && (await page.locator("#uebertritt .doc-list .row").evaluateAll((els) => els.map((a) => a.href))).every((h) => /^https:\/\/[a-z.-]+\.be\.ch\//.test(h) && h.endsWith(".pdf"))
  && await page.locator('#uebertritt .doc-list .row[href*="uebertrittsprotokoll"]').count() === 1
  && await page.locator('#uebertritt .doc-list .row[href*="beurteilung-klasse-4-5-6"]').count() === 1);
check("lehrplan21: the BKD page on Beurteilung und Übertritte is linked as a source",
  await page.locator('#quellen a[href$="beurteilung-uebertritte.html"]').count() === 1);
check("lehrplan21: Beurteilung names when there are Noten: none before the 4th class, 1 to 6 from then on, with a table of all eleven years",
  bodyText.includes("Wann gibt es Noten?") && bodyText.includes("Die Noten gehen von 1 bis 6")
  && await page.locator("#beurteilung .years tbody tr").count() === 11
  && (await page.locator("#beurteilung .years tbody tr td:last-child").allTextContents()).join(",") === "keine,keine,keine,keine,keine,1 bis 6,1 bis 6,1 bis 6,1 bis 6,1 bis 6,1 bis 6"
  && await page.locator('#quellen a[href*="beurteilung-lp21-elterninformation"]').count() === 1);
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

/* ── Nachfragen mit KI: button-built prompts ───────────────────────── */
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, permissions: ["clipboard-read", "clipboard-write"] });
  const np = await ctx.newPage();
  np.on("console", (msg) => { if (msg.type() === "error") consoleErrors.push(msg.text()); });
  np.on("pageerror", (err) => consoleErrors.push(String(err)));
  const external = [];
  np.on("request", (req) => { if (!req.url().startsWith(BASE)) external.push(req.url()); });
  await np.goto(`${BASE}/`);
  await np.click('.row[href="nachfragen/"]');
  await np.waitForSelector(".prompt-card");
  check("nachfragen: breadcrumb links the overview and names the page",
    await np.locator('.crumbs a[href="../"]').count() === 1 && (await np.textContent('.crumbs [aria-current="page"]')).trim() === "Nachfragen mit KI");
  check("nachfragen: four prompt cards, each with visible text, copy button and the four providers",
    await np.locator(".prompt-card").count() === 4
    && await np.locator(".prompt-card .prompt-text").count() === 4
    && await np.locator(".prompt-card [data-copy]").count() === 4
    && (await np.locator(".prompt-card a[data-provider]").evaluateAll((els) => els.map((a) => a.dataset.provider).join(","))) === ["chatgpt", "claude", "perplexity", "lechat"].join(",").repeat(1) + ("," + ["chatgpt", "claude", "perplexity", "lechat"].join(",")).repeat(3));
  const texts = await np.locator(".prompt-text").allTextContents();
  check("nachfragen: the three Lehrplan prompts name the small chapter PDFs as the only source and forbid other websites",
    texts.slice(0, 3).every((x) => x.includes("BE_Ueberblick.pdf") && x.includes("Einzige Quelle") && x.includes("keine andere Website") && x.includes("Erfinde keine Kompetenzstufen") && x.includes("72 MB")));
  check("nachfragen: the check prompt lists every Fachbereich PDF, the explainer the Grundlagen and AHB",
    ["BE_DE_Fachbereich_SPR.pdf", "BE_DE_Fachbereich_MA.pdf", "BE_DE_Fachbereich_NMG.pdf", "BE_DE_Fachbereich_GES.pdf", "BE_DE_Fachbereich_MU.pdf", "BE_DE_Fachbereich_BS.pdf", "BE_DE_Modul_MI.pdf", "BE_DE_Modul_BO.pdf"].every((f) => texts[2].includes(f))
    && texts[0].includes("BE_Grundlagen.pdf") && texts[0].includes("fb_id=92"));
  check("nachfragen: the material prompt needs no PDF, marks the list as verified and carries a link per app",
    texts[3].includes("kein PDF und keine Website") && texts[3].includes("brauchen kein (?)")
    && (texts[3].match(/https:\/\/lfdave\.github\.io\/lehrplan-apps\/[a-z-]+\/$/gm) || []).length === 31);
  check("nachfragen: the code rule asks for codes only where a Kompetenz is named, and (?) only for unchecked Stufen",
    texts.slice(0, 3).every((x) => x.includes("Allgemeine Aussagen brauchen keinen Code") && x.includes("Markiere mit (?) nur Aussagen zu Kompetenzstufen")));
  check("nachfragen: the explainer prompt asks when there are Noten in Bern and states the facts to verify",
    texts[0].includes("Wann es im Kanton Bern Noten gibt") && texts[0].includes("Ab der 4. Klasse") && texts[0].includes("Noten von 1 bis 6"));
  check("nachfragen: every prompt ends with the answer language, German by default",
    texts.every((x) => x.trim().endsWith("Antworte auf Deutsch.")));
  check("nachfragen: prompts stay within the length limits (text ≤ 5000, URL ≤ 7000)",
    texts.every((x) => x.length <= 5000 && encodeURIComponent(x).length <= 7000), texts.map((x) => `${x.length}/${encodeURIComponent(x).length}`).join(","));
  check("nachfragen: the material prompt lists all 31 apps with their codes",
    (texts[3].match(/^- [^(]+ \([A-Z0-9.]+\): /gm) || []).length === 31 && texts[3].includes("Zahlen und Rechnen"));
  check("nachfragen: provider links carry exactly the shown text, URL-encoded, and open safely",
    await np.locator(".prompt-card").evaluateAll((cards) => cards.every((c) => {
      const text = c.querySelector(".prompt-text").textContent;
      return [...c.querySelectorAll("a[data-provider]")].every((a) => {
        const q = new URL(a.href).searchParams.get("q");
        return q === text && a.target === "_blank" && a.rel.includes("noopener") && a.getAttribute("referrerpolicy") === "no-referrer";
      });
    })));
  check("nachfragen: no ß and no em dash in prompts or UI",
    !(await np.textContent("#app")).includes("ß") && !(await np.textContent("#app")).includes("—"));
  // Check points: only the five official markers, default end of 6th class.
  const checks = await np.locator('#einschaetzen [data-choice="check"]').evaluateAll((els) => els.map((b) => `${b.dataset.value}:${b.getAttribute("aria-pressed")}`));
  check("nachfragen: check points are exactly the five official markers, default Ende 6. Klasse",
    checks.join(",") === "ga1:false,op4:false,ga2:true,op8:false,ga3:false", checks.join(","));
  check("nachfragen: default check prompt speaks of the Grundanspruch of Zyklus 2",
    texts[2].includes("Ende der 6. Klasse") && texts[2].includes("Grundanspruch des 2. Zyklus"));
  await np.click('#einschaetzen [data-choice="check"][data-value="op4"]');
  const op4 = await np.locator('[data-prompt="einschaetzen"]').textContent();
  check("nachfragen: an Orientierungspunkt prompt asks for caution («bearbeitet», not «erreicht»)",
    op4.includes("Ende der 4. Klasse") && op4.includes("Orientierungspunkt") && op4.includes("kein Grundanspruch") && op4.includes("«bearbeitet»") && op4.includes("was am Orientierungspunkt erwartet wird"));
  check("nachfragen: every check point says what report and which Noten exist at that time",
    op4.includes("ersten Beurteilungsbericht mit Noten") && texts[2].includes("Beurteilungsbericht mit Noten")
    && await np.locator('#einschaetzen [data-choice="check"]').count() === 5);
  await np.click('#einschaetzen [data-choice="check"][data-value="ga1"]');
  check("nachfragen: the end-of-2nd-class check says the report carries no Noten",
    (await np.locator('[data-prompt="einschaetzen"]').textContent()).includes("Beurteilungsbericht ohne Noten"));
  await np.click('#einschaetzen [data-choice="check"][data-value="op4"]');
  // Language: the closing line follows the chosen answer language.
  await np.click('[data-choice="lang"][data-value="fr"]');
  check("nachfragen: choosing Français changes the closing line of every prompt",
    (await np.locator(".prompt-text").allTextContents()).every((x) => x.trim().endsWith("Antworte auf Französisch.")));
  // Andere Sprache: the one free-text field, feeding only the closing line.
  check("nachfragen: the language field is hidden until «Andere» is chosen",
    await np.locator("#lang-other").isHidden());
  await np.click('[data-choice="lang"][data-value="other"]');
  check("nachfragen: «Andere» reveals the field, focuses it, and falls back to German while empty",
    await np.locator("#lang-other").isVisible()
    && await np.evaluate(() => document.activeElement.id === "lang-other-input")
    && (await np.locator(".prompt-text").allTextContents()).every((x) => x.trim().endsWith("Antworte auf Deutsch.")));
  await np.fill("#lang-other-input", "  Ukrainisch \n");
  check("nachfragen: a typed language name lands, cleaned, in the closing line of every prompt",
    (await np.locator(".prompt-text").allTextContents()).every((x) => x.trim().endsWith("Antworte auf Ukrainisch.")));
  check("nachfragen: the provider links follow the typed language",
    (await np.locator('a[data-for="erklaeren"][data-provider="chatgpt"]').getAttribute("href")).includes(encodeURIComponent("Antworte auf Ukrainisch.")));
  await np.click('[data-choice="lang"][data-value="fr"]');
  check("nachfragen: choosing a listed language hides the field again", await np.locator("#lang-other").isHidden());
  // Zyklus: both Zyklus cards follow the same choice.
  await np.click('#koennen [data-choice="zyklus"][data-value="3"]');
  check("nachfragen: choosing Zyklus 3 updates the child prompt and the material prompt together",
    (await np.locator('[data-prompt="koennen"]').textContent()).includes("im 3. Zyklus (7. bis 9. Klasse)")
    && (await np.locator('[data-prompt="material"]').textContent()).includes("im 3. Zyklus (7. bis 9. Klasse)")
    && await np.locator('#material [data-choice="zyklus"][data-value="3"][aria-pressed="true"]').count() === 1);
  // Copy writes the shown text to the clipboard and reports it.
  await np.click('[data-copy="erklaeren"]');
  const clip = await np.evaluate(() => navigator.clipboard.readText());
  check("nachfragen: Kopieren puts the shown prompt on the clipboard and shows a persistent status",
    clip === (await np.locator('[data-prompt="erklaeren"]').textContent()) && (await np.textContent('[data-status="erklaeren"]')).startsWith("Kopiert."));
  await np.screenshot({ path: join(SHOTS_DIR, "08-nachfragen.png"), fullPage: true });
  // Choices survive a reload.
  await np.reload();
  await np.waitForSelector(".prompt-card");
  check("nachfragen: language, Zyklus and check point survive a reload",
    await np.locator('[data-choice="lang"][data-value="fr"][aria-pressed="true"]').count() === 1
    && await np.locator('#koennen [data-choice="zyklus"][data-value="3"][aria-pressed="true"]').count() === 1
    && await np.locator('#einschaetzen [data-choice="check"][data-value="op4"][aria-pressed="true"]').count() === 1);
  await np.click('[data-choice="lang"][data-value="other"]');
  check("nachfragen: the typed language survives a reload and applies again when «Andere» is chosen",
    await np.inputValue("#lang-other-input") === "Ukrainisch"
    && (await np.locator('[data-prompt="koennen"]').textContent()).trim().endsWith("Antworte auf Ukrainisch."));
  check("nachfragen: the page makes no external request before a click", external.length === 0, external.slice(0, 3).join(", "));
  await ctx.close();
}

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
for (const [url, ready, label] of [[`${BASE}/`, ".entry-list", "start page"], [`${BASE}/lehrplan21/`, ".text-page", "Lehrplan 21"], [`${BASE}/nachfragen/`, ".prompt-card", "Nachfragen"], [`${BASE}/ueben/`, ".row-list", "Übungs-Apps"], [`${BASE}/zahlenwissen/`, ".stufen-list", "app home"], [`${BASE}/merkheft/zahlenstrahl.html`, ".blatt-page", "Merkblatt"]]) {
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
await page.goto(`${BASE}/nachfragen/`);
await page.waitForSelector(".prompt-card");
check("layout: Nachfragen page has no horizontal scrolling at 320px", await noHorizScroll());
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
await page.goto(`${BASE}/nachfragen/`);
await page.waitForSelector(".prompt-card");
await page.screenshot({ path: join(SHOTS_DIR, "09-nachfragen-desktop.png"), fullPage: true });

check("console: no errors", consoleErrors.length === 0, consoleErrors.slice(0, 3).join(" | "));
check("network: no external requests", externalRequests.length === 0, externalRequests.slice(0, 3).join(", "));

await browser.close();
server.close();
console.log(failures === 0 ? "\nAll tests passed." : `\n${failures} test(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
