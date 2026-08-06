// app.js — Merkheft: das Nachschlagewerk der Lehrplan-Familie.
// Reines Lesen: keine Gamification, kein localStorage. Navigation
// über location.hash, damit Apps einzelne Merkblätter direkt
// verlinken können (../merkheft/#wasserkreislauf).

import { PAGES, GRUPPEN, pageById } from './data.js?v=1';
import { render as renderIllu, init as initIllu } from './illustrations.js?v=1';

const app = document.getElementById('app');

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderHome() {
  document.title = 'Merkheft';
  app.innerHTML = `
    <header class="app-header">
      <h1 class="app-title"><svg class="title-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg>Merkheft</h1>
      <p class="tagline">Zuerst verstehen, dann üben: kurze Merkblätter zu den Konzepten der Übungs-Apps.</p>
    </header>
    ${GRUPPEN.map((g) => `
      <section class="gruppe">
        <h2 class="section-label">${esc(g)}</h2>
        <ul class="blatt-list">
          ${PAGES.filter((p) => p.gruppe === g).map((p) => `
            <li>
              <a class="blatt" href="#${p.id}">
                <span class="blatt-title">${esc(p.title)}</span>
                <span class="blatt-meta">${p.codes.map(esc).join(' · ')}</span>
                <svg class="chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
              </a>
            </li>`).join('')}
        </ul>
      </section>`).join('')}
    <footer class="app-footer">
      <p>Alle Texte und Bilder sind eigene, kindgerechte Erklärungen. Die Codes
      verweisen auf den Lehrplan 21 (Kanton Bern, Stand 01.08.2022).</p>
      <p><a class="quiet-link" href="../index.html">Zur App-Übersicht</a></p>
    </footer>`;
}

function renderPage(page) {
  document.title = `${page.title} · Merkheft`;
  app.innerHTML = `
    <nav class="page-nav">
      <a class="back" href="#">
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
        Alle Merkblätter
      </a>
    </nav>
    <article class="blatt-page">
      <header>
        <p class="blatt-gruppe">${esc(page.gruppe)}</p>
        <h1>${esc(page.title)}</h1>
      </header>
      ${page.intro.map((p) => `<p class="intro">${esc(p)}</p>`).join('')}
      <div class="illu-stage">${renderIllu(page.id)}</div>
      ${page.fakten.length ? `
        <h2 class="section-label">Kurz gemerkt</h2>
        <dl class="fakten">
          ${page.fakten.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}
        </dl>` : ''}
      <h2 class="section-label">Dazu üben</h2>
      <ul class="ueben-list">
        ${page.ueben.map((u) => `
          <li><a class="ueben-link" href="${u.href}">
            ${esc(u.name)}<span class="ueben-meta">Stufe ${esc(u.stufe)}</span>
          </a></li>`).join('')}
      </ul>
      <p class="code-line">Lehrplan 21: ${page.codes.map(esc).join(', ')}</p>
    </article>`;
  initIllu(page.id, app);
}

function route() {
  const id = location.hash.replace(/^#/, '');
  const page = id ? pageById(id) : null;
  if (page) renderPage(page);
  else renderHome();
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', route);
route();
