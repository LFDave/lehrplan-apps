// app.js — Spiegelraster. Ansichten: Übersicht (Stufenleiter), Übung,
// Abschluss, Medaillen. Eine Runde hat 8 Aufgaben; ausgewertet wird
// immer die ganze Antwort, nie einzelne Zeichen.

import { STUFEN, COMPETENCY, stufeById, nextStufe, cycleLabel } from './data.js?v=1';
import { genRound } from './gen.js?v=1';
import { roundXp, levelFor, nextLevel, earnedMedals, suggestsNextStufe, MEDALS } from './game.js?v=1';
import { t } from './strings.js?v=1';
import { icon } from './icons.js?v=1';

const STORE = 'spiegelraster.progress';
const ROUND_LENGTH = 8;
const TITLE_ICON = 'flip-horizontal';

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
  localStorage.setItem(STORE, JSON.stringify(state.progress));
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

/* ── Übersicht ────────────────────────────────────────────────── */

function renderHome() {
  const p = state.progress;
  const level = levelFor(p.xp);
  const next = nextLevel(p.xp);
  const pct = next ? Math.round(((p.xp - level.xp) / (next.xp - level.xp)) * 100) : 100;
  const medals = earnedMedals(p);

  app.innerHTML = `
    <header class="app-header">
      <h1 class="app-title">${icon(TITLE_ICON, 'title-icon')}${t('app.title')}</h1>
      <p class="tagline">${t('app.tagline')}</p>
    </header>

    <a class="stats-strip" href="#medaillen" aria-label="${esc(t('medals.title'))}">
      <span class="stats-level">
        <span>${t('home.level', { name: level.name })} · ${p.xp} XP</span>
        <span class="progress-track"><span class="progress-fill" style="width:${pct}%"></span></span>
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
          <li>
            <button class="stufe" data-stufe="${s.id}">
              <span class="stufe-letter" aria-hidden="true">${s.id}</span>
              <span class="stufe-body">
                <span class="stufe-title">${esc(s.title)}
                  ${s.ga ? `<span class="ga-badge">${icon('target')}${t('stufe.ga', { cycle: s.cycle })}</span>` : ''}
                  ${s.erweiterung ? `<span class="stufe-tag">${t('stufe.erweiterung')}</span>` : ''}
                </span>
                <span class="stufe-desc">${esc(s.desc)}</span>
                <span class="stufe-meta">${esc(cycleLabel(s.cycle))} · ${COMPETENCY}.${s.id}${ps.rounds ? ` · ${t('home.rounds', { n: ps.rounds })}` : ''}</span>
              </span>
              ${icon('chevron-right', 'subject-chevron')}
            </button>
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
    btn.addEventListener('click', () => startRound(btn.dataset.stufe));
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
    <header class="practice-header">
      <button class="btn secondary back-btn" data-action="abort">${icon('arrow-left')}${t('practice.abort')}</button>
      <p class="practice-meta">${esc(stufe.title)} · Stufe ${stufe.id} · ${t('practice.progress', { i: r.index + 1, n: r.tasks.length })}</p>
      <div class="progress-track wide"><div class="progress-fill" style="width:${Math.round((r.index / r.tasks.length) * 100)}%"></div></div>
    </header>
    <section class="task-area">
      <p class="task-question">${isTyped ? t('task.typed') : t('task.mc')}</p>
      ${task.svg ? `<div class="task-figure">${task.svg}</div>` : ''}
      <p class="sequence"><span class="term">${task.expr}${showsEquals ? ' = ?' : ''}</span></p>
      ${isTyped ? `
        <input class="typed-input" type="text" inputmode="${/[./-]/.test(task.answer) ? 'text' : 'numeric'}"
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

  app.querySelector('[data-action="abort"]').addEventListener('click', () => {
    state.round = null;
    renderHome();
  });

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

  app.innerHTML = `
    <section class="done">
      <h1 class="app-title">${icon(TITLE_ICON, 'title-icon')}${t('done.title')}</h1>
      <p class="done-summary" role="status">${t('done.tasks', { n: ROUND_LENGTH, stufe: stufe.id })}${res.clean ? ' ' + t('done.clean') : ''}</p>
      <div class="reward-block">
        <p class="reward-xp">${t('done.xp', { xp: res.xp })}</p>
        <p>${res.levelUp ? t('done.levelup', { name: level.name }) : t('done.level', { name: level.name })} · ${p.xp} XP</p>
        <div class="progress-track wide"><div class="progress-fill" style="width:${pct}%"></div></div>
        ${res.newMedals.map((m) => `<p class="reward-medal">${icon(m.icon)}${t('done.medal', { name: m.name })}</p>`).join('')}
      </div>
      ${res.suggestion ? `
        <div class="suggest">
          <p>${t('done.suggest', { stufe: res.suggestion.id })}</p>
          <button class="btn primary" data-action="suggest">${t('done.suggestGo', { stufe: res.suggestion.id })}</button>
        </div>
      ` : ''}
      <div class="done-actions">
        <button class="btn primary" data-action="again">${t('done.again')}</button>
        <button class="btn secondary" data-action="home">${t('done.home')}</button>
      </div>
    </section>
  `;

  app.querySelector('[data-action="again"]').addEventListener('click', () => startRound(res.stufeId));
  app.querySelector('[data-action="home"]').addEventListener('click', () => renderHome());
  const sug = app.querySelector('[data-action="suggest"]');
  if (sug) sug.addEventListener('click', () => startRound(res.suggestion.id));
}

/* ── Medaillen ────────────────────────────────────────────────── */

function renderMedals() {
  const earned = new Set(earnedMedals(state.progress).map((m) => m.key));
  app.innerHTML = `
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

function route() {
  state.resetArmed = false;
  if (location.hash === '#medaillen') {
    renderMedals();
  } else if (!state.round) {
    renderHome();
  }
}

window.addEventListener('hashchange', route);
document.documentElement.lang = 'de-CH';
route();
