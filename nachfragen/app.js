// app.js — Nachfragen mit KI. Baut aus Knöpfen fertige Fragen und
// reicht sie per Kopieren oder per vorausgefülltem Link an einen
// KI-Dienst weiter. Kein Formular, kein Freitext: was der Dienst
// über das Kind wissen muss, fragt er selbst nach.

import { STRINGS, t } from './strings.js?v=3';
import { PROVIDERS, LANGS, ZYKLEN, CHECKS, APPS, MERKHEFT_GROUPS, SOURCE_BLOCK, PROMPTS, SITE_URL } from './data.js?v=3';

const STORE = {
  lang: 'nachfragen.lang',
  zyklus: 'nachfragen.zyklus',
  check: 'nachfragen.check',
};

function load(key, allowed, fallback) {
  try {
    const v = localStorage.getItem(key);
    return allowed.includes(v) ? v : fallback;
  } catch { return fallback; }
}
function save(key, value) {
  try { localStorage.setItem(key, value); } catch { /* Speicher nicht verfügbar */ }
}

const state = {
  lang: load(STORE.lang, LANGS.map((l) => l.id), 'de'),
  zyklus: load(STORE.zyklus, ZYKLEN.map((z) => z.id), '2'),
  check: load(STORE.check, CHECKS.map((c) => c.id), 'ga2'),
};

/* ── Prompt-Aufbau ─────────────────────────────────────────────────── */

const langAnswer = () => LANGS.find((l) => l.id === state.lang).answer;
const zyklus = () => ZYKLEN.find((z) => z.id === state.zyklus);
const check = () => CHECKS.find((c) => c.id === state.check);

function fill(template, vars) {
  return template.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
}

export function buildPrompt(id) {
  const vars = {
    lang: langAnswer(),
    zyklus: zyklus().text,
    n: zyklus().id,
    check: check().text,
    marker: check().kind === 'ga' ? 'Grundanspruch' : 'Orientierungspunkt',
    site: SITE_URL,
    apps: APPS.map((a) => `- ${a.id} ${a.code} ${a.desc}`).join('\n'),
    merkheft: MERKHEFT_GROUPS.join('; '),
  };
  return fill(PROMPTS[id], vars) + '\n\n' + fill(SOURCE_BLOCK, vars);
}

/* ── Rendering ─────────────────────────────────────────────────────── */

const ICON = {
  chevron: '<svg class="crumb-sep" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>',
  title: '<svg class="title-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>',
  copy: '<svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>',
  external: '<svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>',
};

const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function choiceGrid(name, options, current, label) {
  return `<div class="choice-block" role="group" aria-label="${esc(label)}">
    <span class="choice-label">${esc(label)}</span>
    <div class="choice-grid">${options.map((o) => `
      <button type="button" class="choice" data-choice="${name}" data-value="${o.id}" aria-pressed="${o.id === current}">
        <span class="choice-main">${esc(o.label)}</span>${o.sub ? `<span class="choice-sub">${esc(o.sub)}</span>` : o.range ? `<span class="choice-sub">${esc(o.range)}</span>` : ''}
      </button>`).join('')}
    </div>
  </div>`;
}

function card(id, choices) {
  return `<section class="prompt-card" id="${id}" aria-labelledby="${id}-title">
    <h2 id="${id}-title">${esc(t(`card.${id}.title`))}</h2>
    <p class="card-desc">${esc(t(`card.${id}.desc`))}</p>
    ${choices}
    ${t(`card.${id}.hint`) !== `card.${id}.hint` ? `<p class="card-hint">${esc(t(`card.${id}.hint`))}</p>` : ''}
    <details class="prompt-details" open>
      <summary>${esc(t('prompt.label'))}</summary>
      <pre class="prompt-text" data-prompt="${id}"></pre>
    </details>
    <div class="actions">
      <button type="button" class="btn-primary" data-copy="${id}">${ICON.copy}${esc(t('action.copy'))}</button>
      <span class="actions-label">${esc(t('action.open'))}</span>
      ${PROVIDERS.map((p) => `<a class="btn-secondary" data-provider="${p.id}" data-for="${id}" href="${p.url}" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer">${esc(p.name)}${ICON.external}</a>`).join('')}
    </div>
    <p class="copy-status" role="status" data-status="${id}"></p>
  </section>`;
}

function render() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <nav class="crumbs" aria-label="Pfad"><ol>
      <li><a href="../">${esc(t('nav.site'))}</a></li>
      <li>${ICON.chevron}<span aria-current="page">${esc(t('nav.page'))}</span></li>
    </ol></nav>
    <header class="app-header">
      <h1 class="app-title">${ICON.title}${esc(t('title'))}</h1>
      <p class="tagline">${esc(t('tagline'))}</p>
      <p class="note">${esc(t('note.privacy'))}</p>
    </header>
    <section class="lang-block" aria-labelledby="lang-title">
      <h2 id="lang-title" class="section-label">${esc(t('lang.title'))}</h2>
      <p class="card-desc">${esc(t('lang.desc'))}</p>
      <div class="choice-grid choice-grid-lang">${LANGS.map((l) => `
        <button type="button" class="choice choice-compact" data-choice="lang" data-value="${l.id}" aria-pressed="${l.id === state.lang}" lang="${l.id}">${esc(l.label)}</button>`).join('')}
      </div>
    </section>
    <div class="cards">
      ${card('erklaeren', '')}
      ${card('koennen', choiceGrid('zyklus', ZYKLEN, state.zyklus, t('choice.zyklus')))}
      ${card('einschaetzen', choiceGrid('check', CHECKS, state.check, t('choice.check')))}
      ${card('material', choiceGrid('zyklus', ZYKLEN, state.zyklus, t('choice.zyklus')))}
    </div>
    <footer class="app-footer">
      <p>${esc(t('footer.honest'))}</p>
      <p>${esc(t('footer.storage'))}</p>
      <p>${esc(t('footer.source'))} <a class="quiet-link" href="https://github.com/LFDave/lehrplan-apps">${esc(t('footer.code'))}</a></p>
    </footer>`;
  updatePrompts();
}

function updatePrompts() {
  for (const pre of document.querySelectorAll('[data-prompt]')) {
    const id = pre.dataset.prompt;
    const text = buildPrompt(id);
    pre.textContent = text;
    const q = encodeURIComponent(text);
    for (const a of document.querySelectorAll(`a[data-for="${id}"]`)) {
      const p = PROVIDERS.find((x) => x.id === a.dataset.provider);
      a.href = p.url + q;
    }
  }
  for (const b of document.querySelectorAll('[data-choice]')) {
    b.setAttribute('aria-pressed', String(state[b.dataset.choice] === b.dataset.value));
  }
}

async function copy(id) {
  const text = buildPrompt(id);
  const status = document.querySelector(`[data-status="${id}"]`);
  try {
    await navigator.clipboard.writeText(text);
    status.textContent = t('action.copied');
  } catch {
    status.textContent = t('action.copyFailed');
  }
}

document.addEventListener('click', (e) => {
  const choice = e.target.closest('[data-choice]');
  if (choice) {
    const key = choice.dataset.choice;
    state[key] = choice.dataset.value;
    save(STORE[key], state[key]);
    for (const s of document.querySelectorAll('.copy-status')) s.textContent = '';
    updatePrompts();
    return;
  }
  const cp = e.target.closest('[data-copy]');
  if (cp) copy(cp.dataset.copy);
});

document.documentElement.lang = 'de-CH';
render();
