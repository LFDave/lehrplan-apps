// app.js — Wordbau. Ansichten: Übersicht (Stufenleiter), Übung,
// Abschluss, Medaillen. Eine Runde hat 8 Aufgaben; ausgewertet wird
// immer die ganze Antwort, nie einzelne Zeichen.

import { STUFEN, COMPETENCY, stufeById, nextStufe, cycleLabel } from './data.js?v=7';
import { genRound } from './gen.js?v=7';
import { roundXp, levelFor, nextLevel, earnedMedals, suggestsNextStufe, MEDALS } from './game.js?v=7';
import { t } from './strings.js?v=7';
import { icon } from './icons.js?v=7';

const STORE = 'wordbau.progress';
const ROUND_LENGTH = 8;
const TITLE_ICON = 'layout-grid';

const app = document.getElementById('app');

function freshState() {
  return { xp: 0, rounds: 0, tasks: 0, stufen: {} };
}

function loadState() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORE) || 'null');
    return raw && typeof raw === 'object' ? { ...freshState(), ...raw } : freshState();
  } catch {
    return freshState();
  }
}

const state = {
  progress: loadState(),
  resetArmed: false,
  round: null,
  result: null,
};

function save() {
  // Privater Modus oder voller Speicher: die Runde läuft weiter, nur
  // ohne Speichern; der Fortschritt bleibt für diese Sitzung im state.
  try {
    localStorage.setItem(STORE, JSON.stringify(state.progress));
  } catch {
    /* nicht speicherbar */
  }
}

function perStufe(id) {
  if (!state.progress.stufen[id]) {
    state.progress.stufen[id] = { rounds: 0, cleanRuns: 0, cleanStreak: 0 };
  }
  return state.progress.stufen[id];
}

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ── Pfad ─────────────────────────────────────────────────────── */

// Ort in der App-Familie: Lehrplan-Apps › Übungs-Apps › App [› Ansicht].
// Die App-Ebene wird zum Link, sobald eine tiefere Ansicht offen ist.
function crumbs(current) {
  const sep = icon('chevron-right', 'crumb-sep');
  const items = [
    `<li><a href="../">${t('nav.site')}</a></li>`,
    `<li>${sep}<a href="../ueben/">${t('nav.apps')}</a></li>`,
    current
      ? `<li>${sep}<a href="#" data-nav="home">${t('app.title')}</a></li><li>${sep}<span aria-current="page">${esc(current)}</span></li>`
      : `<li>${sep}<span aria-current="page">${t('app.title')}</span></li>`,
  ];
  return `<nav class="crumbs" aria-label="${esc(t('nav.path'))}"><ol>${items.join('')}</ol></nav>`;
}

// In Runde und Abschluss verlässt der App-Link die Runde über den
// Verlauf (wie Abbrechen), statt einen neuen Eintrag anzuhängen.
function bindCrumbs() {
  const home = app.querySelector('[data-nav="home"]');
  if (home) home.addEventListener('click', (e) => { e.preventDefault(); leaveRound(); });
}

// Fortschrittsbalken: der alte Stand steht im Markup, der neue wird im
// übernächsten Frame gesetzt, damit der Übergang (transform) sichtbar
// wird. Bei reduzierter Bewegung springt der Balken (styles.css).
function growFill(fill, to) {
  if (!fill) return;
  requestAnimationFrame(() => requestAnimationFrame(() => fill.style.setProperty('--p', String(to))));
}

/* ── Übersicht ────────────────────────────────────────────────── */

function renderHome() {
  const p = state.progress;
  const level = levelFor(p.xp);
  const next = nextLevel(p.xp);
  const pct = next ? Math.round(((p.xp - level.xp) / (next.xp - level.xp)) * 100) : 100;
  const medals = earnedMedals(p);

  app.innerHTML = `
    ${crumbs()}
    <header class="app-header">
      <h1 class="app-title">${icon(TITLE_ICON, 'title-icon')}${t('app.title')}</h1>
      <p class="tagline">${t('app.tagline')}</p>
    </header>

    <a class="stats-strip" href="#medaillen" aria-label="${esc(t('medals.title'))}">
      <span class="stats-level">
        <span>${t('home.level', { name: level.name })} · ${p.xp} XP</span>
        <span class="progress-track"><span class="progress-fill" style="--p:${pct / 100}"></span></span>
      </span>
      <span class="stats-medals">${icon('medal')}${t('home.medals', { n: medals.length })}</span>
      ${icon('chevron-right', 'subject-chevron')}
    </a>

    <section class="stufen-section">
      <h2 class="section-label">${t('home.stufen')}</h2>
      <ul class="stufen-list">
        ${STUFEN.map((s) => {
          const ps = state.progress.stufen[s.id] || { rounds: 0 };
          return `
          <li class="stufe-item">
            <button class="stufe" data-stufe="${s.id}">
              <span class="stufe-letter" aria-hidden="true">${s.id}</span>
              <span class="stufe-body">
                <span class="stufe-title">${esc(s.title)}
                  ${s.ga ? `<span class="ga-badge">${icon('target')}${t('stufe.ga', { cycle: s.cycle })}</span>` : ''}
                  ${s.erweiterung ? `<span class="stufe-tag">${t('stufe.erweiterung')}</span>` : ''}
                </span>
                <span class="stufe-desc">${esc(s.desc)}</span>
                <span class="stufe-meta">${esc(cycleLabel(s.cycle))} · <span class="code">${COMPETENCY}.${s.id}</span>${ps.rounds ? ` · ${t('home.rounds', { n: ps.rounds })}` : ''}</span>
              </span>
              ${icon('chevron-right', 'subject-chevron')}
            </button>
            ${s.merkblatt ? `<a class="merkblatt-link" href="../merkheft/${s.merkblatt.id}.html"><svg class="merkblatt-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg><span>Merkblatt: ${esc(s.merkblatt.name)}</span></a>` : ''}
          </li>`;
        }).join('')}
      </ul>
    </section>

    <footer class="app-footer">
      ${state.resetArmed ? `
        <div class="reset-confirm" role="alertdialog" aria-label="${esc(t('reset.button'))}">
          <p>${t('reset.question')}</p>
          <div class="reset-actions">
            <button class="btn danger" data-action="reset-confirm">${t('reset.confirm')}</button>
            <button class="btn secondary" data-action="reset-cancel">${t('reset.cancel')}</button>
          </div>
        </div>
      ` : `
        <button class="btn secondary" data-action="reset-arm">${icon('rotate-ccw')}${t('reset.button')}</button>
      `}
      <p class="storage-note">${t('storage.note')}</p>
      <p class="source-note">${t('app.source')}</p>
    </footer>
  `;

  for (const btn of app.querySelectorAll('[data-stufe]')) {
    btn.addEventListener('click', () => openStufe(btn.dataset.stufe));
  }
  for (const btn of app.querySelectorAll('[data-action]')) {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      if (action === 'reset-arm') state.resetArmed = true;
      if (action === 'reset-cancel') state.resetArmed = false;
      if (action === 'reset-confirm') {
        state.progress = freshState();
        state.resetArmed = false;
        save();
      }
      renderHome();
    });
  }
  if (state.resetArmed) app.querySelector('.reset-confirm button')?.focus();
}

/* ── Übung ────────────────────────────────────────────────────── */

function startRound(stufeId) {
  const stufe = stufeById(stufeId);
  state.round = {
    stufeId,
    tasks: genRound(Math.random, stufe, ROUND_LENGTH),
    index: 0,
    mistakes: 0,
    taskDone: false,
  };
  renderTask();
}

function renderTask() {
  const r = state.round;
  const task = r.tasks[r.index];
  const stufe = stufeById(r.stufeId);

  const isTyped = task.type === 'typed';
  const showsEquals = isTyped && !task.expr.includes('?') && !task.expr.includes(':')
    && !task.expr.startsWith('Das ') && !task.expr.startsWith('Die ');

  app.innerHTML = `
    ${crumbs(t('nav.stufe', { id: stufe.id }))}
    <header class="practice-header">
      <button class="btn secondary back-btn" data-action="abort">${icon('arrow-left')}${t('practice.abort')}</button>
      <h1 class="practice-meta">${esc(stufe.title)} · Stufe ${stufe.id} · ${t('practice.progress', { i: r.index + 1, n: r.tasks.length })}</h1>
      <div class="progress-track wide"><div class="progress-fill" style="--p:${Math.max(0, r.index - 1) / r.tasks.length}"></div></div>
    </header>
    <section class="task-area">
      <h2 class="task-question">${isTyped ? t('task.typed') : t('task.mc')}</h2>
      <p class="sequence"><span class="term">${task.expr}${showsEquals ? ' = ?' : ''}</span></p>
      ${isTyped ? `
        <input class="typed-input" type="text" inputmode="${/^\d+$/.test(task.answer) ? 'numeric' : 'text'}"
               autocomplete="off" aria-label="Antwort" maxlength="${task.answer.length + 2}">
        <p class="advisory">${t('task.autocheck')}</p>
      ` : `
        <div class="choices">
          ${task.options.map((x, i) => `<button class="choice" data-option="${i}">${x}</button>`).join('')}
        </div>
      `}
    </section>
    <div class="feedback" role="status" id="feedback"></div>
    <div class="task-actions" id="task-actions"></div>
  `;

  growFill(app.querySelector('.practice-header .progress-fill'), r.index / r.tasks.length);
  app.querySelector('[data-action="abort"]').addEventListener('click', leaveRound);
  bindCrumbs();

  const input = app.querySelector('.typed-input');
  if (input) {
    input.focus();
    input.addEventListener('input', () => {
      const value = input.value.trim();
      if (value.length >= task.answer.length) evaluateTyped(input, value, task);
    });
    input.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      // Default-Aktivierung unterdrücken: sonst löst dasselbe Enter den
      // frisch fokussierten Weiter-Knopf aus und überspringt das Feedback.
      e.preventDefault();
      if (input.value.trim()) evaluateTyped(input, input.value.trim(), task);
    });
  }
  if (!input) app.querySelector('[data-option], [data-pick]')?.focus();
  for (const btn of app.querySelectorAll('[data-option]')) {
    btn.addEventListener('click', () => evaluateChoice(btn, task));
  }
}

function normalize(s) {
  return s.replace(/\s/g, '').replace(/,/g, '.').replace(/’/g, "'");
}

function evaluateTyped(input, value, task) {
  if (state.round.taskDone) return;
  // Zahlwerte zählen auch ohne Endnullen als richtig (39.9 = 39.90);
  // Uhrzeiten mit ':' werden immer als Text verglichen.
  const a = normalize(value).replace(/'/g, '');
  const b = normalize(task.answer).replace(/'/g, '');
  const numericSame = !task.answer.includes(':')
    && a !== '' && Number.isFinite(Number(a)) && Number.isFinite(Number(b))
    && Number(a) === Number(b);
  if (normalize(value) === normalize(task.answer) || numericSame) {
    input.disabled = true;
    input.classList.add('correct');
    taskSolved();
  } else {
    input.classList.add('wrong');
    state.round.mistakes++;
    feedback(t('feedback.almost'));
    input.addEventListener('input', () => input.classList.remove('wrong'), { once: true });
  }
}

function evaluateChoice(btn, task) {
  if (state.round.taskDone) return;
  if (Number(btn.dataset.option) === task.answer) {
    btn.classList.add('correct');
    for (const b of app.querySelectorAll('[data-option]')) b.disabled = true;
    taskSolved();
  } else {
    btn.classList.add('wrong');
    btn.disabled = true;
    state.round.mistakes++;
    feedback(t('feedback.almost'));
  }
}

function feedback(text) {
  document.getElementById('feedback').textContent = text;
}

function taskSolved() {
  const r = state.round;
  r.taskDone = true;
  feedback(t('feedback.correct'));
  const actions = document.getElementById('task-actions');
  actions.innerHTML = `<button class="btn primary" data-action="next">${t('next')}${icon('chevron-right')}</button>`;
  const btn = actions.querySelector('button');
  btn.addEventListener('click', () => {
    r.index++;
    r.taskDone = false;
    if (r.index >= r.tasks.length) {
      finishRound();
    } else {
      renderTask();
    }
  });
  btn.focus();
}

/* ── Abschluss ────────────────────────────────────────────────── */

function finishRound() {
  const r = state.round;
  const p = state.progress;
  const clean = r.mistakes === 0;
  const before = { level: levelFor(p.xp).key, medals: new Set(earnedMedals(p).map((m) => m.key)) };

  const xp = roundXp(r.stufeId, r.tasks.length);
  p.xp += xp;
  p.rounds += 1;
  p.tasks += r.tasks.length;
  const ps = perStufe(r.stufeId);
  ps.rounds += 1;
  if (clean) {
    ps.cleanRuns += 1;
    ps.cleanStreak += 1;
  } else {
    ps.cleanStreak = 0; // leise, ohne Meldung; volle XP gibt es trotzdem
  }
  save();

  const level = levelFor(p.xp);
  const newMedals = earnedMedals(p).filter((m) => !before.medals.has(m.key));
  const suggestion = suggestsNextStufe(p, r.stufeId) ? nextStufe(r.stufeId) : null;

  state.result = { stufeId: r.stufeId, xp, clean, levelUp: level.key !== before.level, newMedals, suggestion };
  state.round = null;
  renderDone();
}

function renderDone() {
  const res = state.result;
  const p = state.progress;
  const stufe = stufeById(res.stufeId);
  const level = levelFor(p.xp);
  const next = nextLevel(p.xp);
  const pct = next ? Math.round(((p.xp - level.xp) / (next.xp - level.xp)) * 100) : 100;

  // Der Balken startet beim Stand vor der Runde und wächst auf den neuen.
  const xpBefore = p.xp - res.xp;
  const pctBefore = res.levelUp ? 0 : (next ? Math.max(0, Math.round(((xpBefore - level.xp) / (next.xp - level.xp)) * 100)) : 100);

  app.innerHTML = `
    ${crumbs(t('nav.stufe', { id: stufe.id }))}
    <section class="done">
      <h1 class="app-title">${icon(TITLE_ICON, 'title-icon')}${t('done.title')}</h1>
      <p class="done-summary" role="status">${t('done.tasks', { n: ROUND_LENGTH, stufe: stufe.id })}${res.clean ? ' ' + t('done.clean') : ''}</p>
      ${!res.clean && stufe.merkblatt ? `<a class="merkblatt-link" href="../merkheft/${stufe.merkblatt.id}.html"><svg class="merkblatt-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg><span>Zum Nachlesen: ${esc(stufe.merkblatt.name)}</span></a>` : ''}
      <div class="reward-block">
        <p class="reward-xp">${t('done.xp', { xp: res.xp })}</p>
        <p>${res.levelUp ? t('done.levelup', { name: level.name }) : t('done.level', { name: level.name })} · ${p.xp} XP</p>
        <div class="progress-track wide"><div class="progress-fill" style="--p:${pctBefore / 100}"></div></div>
        ${res.newMedals.map((m) => `<p class="reward-medal">${icon(m.icon)}${t('done.medal', { name: m.name })}</p>`).join('')}
      </div>
      ${res.suggestion ? `
        <div class="suggest">
          <p>${t('done.suggest', { stufe: res.suggestion.id })}</p>
          <button class="btn primary" data-action="suggest">${t('done.suggestGo', { stufe: res.suggestion.id })}</button>
        </div>
      ` : ''}
      <div class="done-actions">
        <button class="btn ${res.suggestion ? 'secondary' : 'primary'}" data-action="again">${t('done.again')}</button>
        <button class="btn secondary" data-action="home">${t('done.home')}</button>
      </div>
    </section>
  `;

  growFill(app.querySelector('.reward-block .progress-fill'), pct / 100);
  app.querySelector('[data-action="again"]').addEventListener('click', () => startRound(res.stufeId));
  app.querySelector('[data-action="home"]').addEventListener('click', leaveRound);
  const sug = app.querySelector('[data-action="suggest"]');
  if (sug) sug.addEventListener('click', () => replaceStufe(res.suggestion.id));
  bindCrumbs();
}

/* ── Medaillen ────────────────────────────────────────────────── */

function renderMedals() {
  const earned = new Set(earnedMedals(state.progress).map((m) => m.key));
  app.innerHTML = `
    ${crumbs(t('medals.title'))}
    <header class="subject-header">
      <a class="btn secondary back-btn" href="#">${icon('arrow-left')}${t('medals.back')}</a>
      <h1 class="app-title">${icon('medal', 'title-icon')}${t('medals.title')}</h1>
    </header>
    <ul class="medal-list">
      ${MEDALS.map((m) => `
        <li class="medal-row${earned.has(m.key) ? ' earned' : ''}">
          ${icon(m.icon, 'medal-icon')}
          <span class="medal-body">
            <span class="medal-name">${esc(m.name)}</span>
            <span class="medal-desc">${esc(m.desc)}${earned.has(m.key) ? '' : ` · ${t('medals.locked')}`}</span>
          </span>
          ${earned.has(m.key) ? icon('check', 'medal-check') : ''}
        </li>
      `).join('')}
    </ul>
  `;
}

/* ── Navigation ───────────────────────────────────────────────── */

// Jede Runde ist ein eigener Verlaufseintrag (#stufe/<id>): Browser-
// Zurück verlässt die Runde zur Übersicht, ein weiteres Zurück führt
// dorthin, woher man kam (zum Beispiel ins Merkblatt). navDepth zählt
// die selbst gesetzten Einträge, damit Abbrechen sie wieder abbaut,
// statt neue anzuhängen.
let navDepth = 0;

function openStufe(id) {
  history.pushState(null, '', `#stufe/${id}`);
  navDepth++;
  startRound(id);
}

function replaceStufe(id) {
  history.replaceState(null, '', `#stufe/${id}`);
  startRound(id);
}

function leaveRound() {
  state.round = null;
  if (navDepth > 0) {
    navDepth--;
    history.back();
  } else {
    history.replaceState(null, '', location.pathname);
    renderHome();
  }
}

function route() {
  state.resetArmed = false;
  const m = location.hash.match(/^#stufe\/(.+)$/);
  const id = m ? decodeURIComponent(m[1]) : null;
  if (location.hash === '#medaillen') {
    renderMedals();
  } else if (id && STUFEN.some((s) => s.id === id)) {
    startRound(id);
  } else {
    state.round = null;
    renderHome();
  }
}

window.addEventListener('hashchange', route);
document.documentElement.lang = 'de-CH';

// Deep-Link aus dem Merkheft: ?stufe=<id> startet die Stufe direkt.
// Die Query wird sofort aus der Adresse entfernt, damit sie beim
// Neuladen oder Weitergeben nicht kleben bleibt; die Runde bekommt
// ihren eigenen Verlaufseintrag hinter der Übersicht.
const deepStufe = new URLSearchParams(location.search).get('stufe');
if (deepStufe && STUFEN.some((s) => s.id === deepStufe)) {
  history.replaceState(null, '', location.pathname);
  openStufe(deepStufe);
} else {
  if (deepStufe) history.replaceState(null, '', location.pathname + location.hash);
  route();
}
