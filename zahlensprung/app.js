// app.js — Zahlensprung. Ansichten: Übersicht (Stufenleiter), Übung,
// Abschluss, Medaillen. Eine Runde hat 8 Aufgaben; ausgewertet wird
// immer die ganze Antwort, nie einzelne Zeichen.

import { STUFEN, COMPETENCY, stufeById, nextStufe, cycleLabel } from './data.js?v=1';
import { genRound } from './gen.js?v=1';
import { roundXp, levelFor, nextLevel, earnedMedals, cleanStreak, suggestsNextStufe } from './game.js?v=1';
import { t } from './strings.js?v=1';
import { icon } from './icons.js?v=1';

const STORE = 'zahlensprung.progress';
const ROUND_LENGTH = 8;

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
  round: null, // { stufeId, tasks, index, mistakes, taskMistakes, solved }
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
      <h1 class="app-title">${icon('footprints', 'title-icon')}${t('app.title')}</h1>
      <p class="tagline">${t('app.tagline')}</p>
    </header>

    <a class="stats-strip" href="#medaillen" aria-label="${esc(t('medals.title'))}">
      <span class="stats-level">
        <span>${t('home.level', { name: levelFor(p.xp).name })} · ${p.xp} XP</span>
        <span class="progress-track"><span class="progress-fill" style="width:${pct}%"></span></span>
      </span>
      <span class="stats-medals">${icon('medal')}${t('home.medals', { n: medals.length })}</span>
      ${icon('chevron-right', 'subject-chevron')}
    </a>

    <section class="stufen-section">
      <h2 class="section-label">${t('home.stufen')}</h2>
      <ul class="stufen-list">
        ${STUFEN.map((s) => {
          const ps = state.progress.stufen[s.id] || { rounds: 0, cleanRuns: 0 };
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
    picks: [],
  };
  renderTask();
}

function currentTask() {
  return state.round.tasks[state.round.index];
}

function renderTask() {
  const r = state.round;
  const task = currentTask();
  const stufe = stufeById(r.stufeId);

  let taskHtml = '';
  if (task.type === 'count') {
    taskHtml = `
      <p class="task-question">${t('task.count')}</p>
      <div class="dots" aria-label="${task.dots} Punkte">
        ${Array.from({ length: task.dots }, () => '<span class="dot"></span>').join('')}
      </div>
      ${typedInput(task.answer)}
    `;
  } else if (task.type === 'sequence') {
    taskHtml = `
      <p class="task-question">${t('task.sequence')}</p>
      <p class="sequence">${task.terms.map((x) => `<span class="term">${x}</span>`).join('')}<span class="term blank">?</span></p>
      ${typedInput(task.answer)}
    `;
  } else if (task.type === 'order') {
    taskHtml = `
      <p class="task-question">${t('task.order')}</p>
      <div class="order-slots" aria-hidden="true">
        ${task.items.map((_, i) => `<span class="slot" data-slot="${i}"></span>`).join('')}
      </div>
      <div class="choices order-choices">
        ${task.items.map((x, i) => `<button class="choice" data-pick="${i}">${x}</button>`).join('')}
      </div>
      <button class="btn secondary small" data-action="undo">${icon('delete')}</button>
      <p class="advisory">${t('task.orderhint')}</p>
    `;
  } else {
    taskHtml = `
      <p class="task-question">${t('task.estimate')}</p>
      <p class="sequence"><span class="term">${task.expr} ≈ ?</span></p>
      <div class="choices">
        ${task.options.map((x, i) => `<button class="choice" data-option="${i}">${x}</button>`).join('')}
      </div>
    `;
  }

  app.innerHTML = `
    <header class="practice-header">
      <button class="btn secondary back-btn" data-action="abort">${icon('arrow-left')}${t('practice.abort')}</button>
      <p class="practice-meta">${esc(stufe.title)} · Stufe ${stufe.id} · ${t('practice.progress', { i: r.index + 1, n: r.tasks.length })}</p>
      <div class="progress-track wide"><div class="progress-fill" style="width:${Math.round((r.index / r.tasks.length) * 100)}%"></div></div>
    </header>
    <section class="task-area">${taskHtml}</section>
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
  }
  for (const btn of app.querySelectorAll('[data-option]')) {
    btn.addEventListener('click', () => evaluateChoice(btn, task));
  }
  r.picks = [];
  for (const btn of app.querySelectorAll('[data-pick]')) {
    btn.addEventListener('click', () => pickOrder(btn, task));
  }
  const undo = app.querySelector('[data-action="undo"]');
  if (undo) undo.addEventListener('click', () => undoOrder());
}

function typedInput(answer) {
  const decimal = /[.\-]/.test(answer);
  return `
    <input class="typed-input" type="text" inputmode="${decimal ? 'decimal' : 'numeric'}"
           autocomplete="off" aria-label="Antwort" maxlength="${answer.length + 2}">
    <p class="advisory">${t('task.autocheck')}</p>
  `;
}

function normalize(s) {
  return s.replace(/\s/g, '').replace(/,/g, '.').replace(/’/g, "'");
}

function evaluateTyped(input, value, task) {
  if (state.round.taskDone) return;
  if (normalize(value) === normalize(task.answer)) {
    input.disabled = true;
    input.classList.add('correct');
    taskSolved();
  } else {
    input.classList.add('wrong');
    countMistake();
    feedback(t('feedback.almost'));
    input.addEventListener('input', () => input.classList.remove('wrong'), { once: true });
  }
}

function evaluateChoice(btn, task) {
  if (state.round.taskDone) return;
  const idx = Number(btn.dataset.option);
  if (idx === task.answer) {
    btn.classList.add('correct');
    for (const b of app.querySelectorAll('[data-option]')) b.disabled = true;
    taskSolved();
  } else {
    btn.classList.add('wrong');
    btn.disabled = true;
    countMistake();
    feedback(t('feedback.almost'));
  }
}

function pickOrder(btn, task) {
  if (state.round.taskDone || btn.disabled) return;
  const r = state.round;
  r.picks.push(Number(btn.dataset.pick));
  btn.disabled = true;
  btn.classList.add('picked');
  const slot = app.querySelector(`[data-slot="${r.picks.length - 1}"]`);
  if (slot) slot.textContent = task.items[r.picks[r.picks.length - 1]];
  if (r.picks.length === task.items.length) {
    const chosen = r.picks.map((i) => task.items[i]);
    if (chosen.join('|') === task.answer.join('|')) {
      taskSolved();
    } else {
      countMistake();
      feedback(t('feedback.solution'));
      for (const i of r.picks) {
        const b = app.querySelector(`[data-pick="${i}"]`);
        b.disabled = false;
        b.classList.remove('picked');
      }
      r.picks = [];
      for (const s of app.querySelectorAll('.slot')) s.textContent = '';
    }
  }
}

function undoOrder() {
  const r = state.round;
  if (state.round.taskDone || !r.picks.length) return;
  const last = r.picks.pop();
  const b = app.querySelector(`[data-pick="${last}"]`);
  b.disabled = false;
  b.classList.remove('picked');
  const slot = app.querySelector(`[data-slot="${r.picks.length}"]`);
  if (slot) slot.textContent = '';
}

function countMistake() {
  state.round.mistakes++;
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
      <h1 class="app-title">${icon('footprints', 'title-icon')}${t('done.title')}</h1>
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
  const p = state.progress;
  const earned = new Set(earnedMedals(p).map((m) => m.key));
  import('./game.js?v=1').then(({ MEDALS }) => {
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
  });
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
