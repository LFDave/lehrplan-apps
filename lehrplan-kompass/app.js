// app.js — Lehrplan-Kompass. Rendert Übersicht und Fachansicht, verwaltet
// Zykluswahl und Häkchen. Navigation läuft über location.hash, damit der
// Zurück-Knopf des Browsers funktioniert.

import { CYCLES, subjectsForCycle, subjectById, areaCompetenciesForCycle, competencyCount, PRACTICE_APPS } from './data.js?v=3';
import { STRINGS, t } from './strings.js?v=3';
import { icon } from './icons.js?v=3';

const STORE_CYCLE = 'kompass.cycle';
const STORE_CHECKED = 'kompass.checked';

const app = document.getElementById('app');

const state = {
  cycle: loadCycle(),
  checked: loadChecked(),
  resetArmed: false,
};

function loadCycle() {
  const raw = Number(localStorage.getItem(STORE_CYCLE));
  return CYCLES.includes(raw) ? raw : 1;
}

function loadChecked() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORE_CHECKED) || '{}');
    return raw && typeof raw === 'object' ? raw : {};
  } catch {
    return {};
  }
}

function saveState() {
  localStorage.setItem(STORE_CYCLE, String(state.cycle));
  localStorage.setItem(STORE_CHECKED, JSON.stringify(state.checked));
}

function checkKey(cycle, code) {
  return `${cycle}|${code}`;
}

function isChecked(code) {
  return Boolean(state.checked[checkKey(state.cycle, code)]);
}

function doneCount(subject) {
  let n = 0;
  for (const area of subject.areas) {
    for (const c of areaCompetenciesForCycle(area, state.cycle)) {
      if (isChecked(c.code)) n++;
    }
  }
  return n;
}

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ── Views ─────────────────────────────────────────────────────── */

function currentSubject() {
  const id = decodeURIComponent(location.hash.replace(/^#/, ''));
  return id ? subjectById(id) : null;
}

function render() {
  const subject = currentSubject();
  if (subject) {
    renderSubject(subject);
  } else {
    renderHome();
  }
}

function renderHome() {
  const subjects = subjectsForCycle(state.cycle);
  const total = subjects.reduce((n, s) => n + competencyCount(s, state.cycle), 0);
  const done = subjects.reduce((n, s) => n + doneCount(s), 0);

  app.innerHTML = `
    <header class="app-header">
      <h1 class="app-title">${icon('compass', 'title-icon')}${t('app.title')}</h1>
      <p class="tagline">${t('app.tagline')}</p>
    </header>

    <section class="cycle-section" aria-label="${esc(t('cycle.label'))}">
      <h2 class="section-label" id="cycle-label">${t('cycle.label')}</h2>
      <div class="cycle-grid" role="group" aria-labelledby="cycle-label">
        ${CYCLES.map((c) => `
          <button class="cycle-choice${c === state.cycle ? ' selected' : ''}"
                  data-cycle="${c}" aria-pressed="${c === state.cycle}">
            <span class="cycle-title">${t(`cycle.${c}.title`)}</span>
            <span class="cycle-range">${t(`cycle.${c}.range`)}</span>
          </button>
        `).join('')}
      </div>
    </section>

    <section class="subjects-section">
      <div class="subjects-head">
        <h2 class="section-label">${t('home.subjects')}</h2>
        <p class="summary" role="status">${t('home.summary', { done, total })}</p>
      </div>
      <ul class="subject-grid">
        ${subjects.map((s) => {
          const sTotal = competencyCount(s, state.cycle);
          const sDone = doneCount(s);
          const pct = sTotal ? Math.round((sDone / sTotal) * 100) : 0;
          return `
            <li>
              <a class="subject-card" href="#${s.id}">
                ${icon(s.icon, 'subject-icon')}
                <span class="subject-body">
                  <span class="subject-name">${esc(s.name)}${s.tag ? ` <span class="subject-tag">${esc(s.tag)}</span>` : ''}</span>
                  <span class="subject-meta">${t('subject.competencies', { n: sTotal })}</span>
                  <span class="progress-row">
                    <span class="progress-track"><span class="progress-fill" style="width:${pct}%"></span></span>
                    <span class="progress-num">${sDone}/${sTotal}</span>
                  </span>
                </span>
                ${icon('chevron-right', 'subject-chevron')}
              </a>
            </li>
          `;
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

  for (const btn of app.querySelectorAll('[data-cycle]')) {
    btn.addEventListener('click', () => {
      state.cycle = Number(btn.dataset.cycle);
      state.resetArmed = false;
      saveState();
      render();
    });
  }
  bindResetActions();
}

function renderSubject(subject) {
  if (!subject.cycles.includes(state.cycle)) {
    state.cycle = subject.cycles[0];
    saveState();
  }
  const total = competencyCount(subject, state.cycle);
  const done = doneCount(subject);
  const pct = total ? Math.round((done / total) * 100) : 0;

  app.innerHTML = `
    <header class="subject-header">
      <a class="btn secondary back-btn" href="#">${icon('arrow-left')}${t('subject.back')}</a>
      <h1 class="subject-title">${icon(subject.icon, 'title-icon')}${esc(subject.name)}</h1>
      <p class="subject-progress" role="status">${t('subject.progress', { done, total })}</p>
      <div class="progress-track wide"><div class="progress-fill" style="width:${pct}%"></div></div>
      <p class="cycle-note">${t('subject.cycleNote', { cycle: t(`cycle.${state.cycle}.title`) })}</p>
    </header>

    ${subject.areas.map((area) => {
      const competencies = areaCompetenciesForCycle(area, state.cycle);
      if (!competencies.length) return '';
      return `
      <section class="area" aria-label="${esc(area.title)}">
        <h2 class="area-title">${esc(area.title)} <span class="code-chip">${area.id}</span></h2>
        <ul class="competence-list">
          ${competencies.map((c) => {
            const practice = PRACTICE_APPS[c.code];
            return `
            <li>
              <button class="competence${isChecked(c.code) ? ' checked' : ''}"
                      data-code="${c.code}" aria-pressed="${isChecked(c.code)}">
                <span class="checkbox" aria-hidden="true">${icon('check')}</span>
                <span class="competence-text">${esc(c.texts[state.cycle])}</span>
                <span class="code-chip">${c.code}</span>
              </button>
              ${practice ? `
              <a class="practice-link" href="${practice.href}">
                ${icon('play')}${t('subject.practice', { name: practice.name })}
              </a>` : ''}
            </li>
          `;
          }).join('')}
        </ul>
      </section>
    `;
    }).join('')}
  `;

  for (const btn of app.querySelectorAll('[data-code]')) {
    btn.addEventListener('click', () => {
      const key = checkKey(state.cycle, btn.dataset.code);
      if (state.checked[key]) {
        delete state.checked[key];
      } else {
        state.checked[key] = true;
      }
      saveState();
      btn.classList.toggle('checked');
      btn.setAttribute('aria-pressed', btn.classList.contains('checked'));
      updateSubjectProgress(subject);
    });
  }
}

function updateSubjectProgress(subject) {
  const total = competencyCount(subject, state.cycle);
  const done = doneCount(subject);
  const pct = total ? Math.round((done / total) * 100) : 0;
  const label = app.querySelector('.subject-progress');
  const fill = app.querySelector('.subject-header .progress-fill');
  if (label) label.textContent = t('subject.progress', { done, total });
  if (fill) fill.style.width = `${pct}%`;
}

function bindResetActions() {
  for (const btn of app.querySelectorAll('[data-action]')) {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      if (action === 'reset-arm') state.resetArmed = true;
      if (action === 'reset-cancel') state.resetArmed = false;
      if (action === 'reset-confirm') {
        state.checked = {};
        state.resetArmed = false;
        saveState();
      }
      render();
    });
  }
}

window.addEventListener('hashchange', () => {
  state.resetArmed = false;
  render();
});

document.documentElement.lang = 'de-CH';
render();
