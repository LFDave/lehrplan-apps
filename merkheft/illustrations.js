// illustrations.js — Interaktivität für die Merkblätter mit Modellen
// (schaltungen, gradnetz, sonnensystem). Das SVG-Markup steht statisch
// in der jeweiligen HTML-Seite; init(id, document) verdrahtet es,
// nach den illustration-Tokens aus DESIGN.md: Bewegung nur
// transform/opacity, startet erst auf Klick und respektiert
// reduzierte Bewegung. Rein statische Merkblätter laden dieses Modul
// nicht.

const NS = 'http://www.w3.org/2000/svg';
function el(name, attrs, parent) {
  const n = document.createElementNS(NS, name);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  parent.appendChild(n);
  return n;
}

const INITS = {
  schaltungen(root) {
    const wires = root.querySelector('#illu-wires');
    const parts = root.querySelector('#illu-parts');
    const swBtn = root.querySelector('#illu-sw');
    const modeBtn = root.querySelector('#illu-mode');
    const brokenBox = root.querySelector('#illu-broken');
    const status = root.querySelector('#illu-circuit-status');
    let closed = false, parallel = false;

    function renderCircuit() {
      wires.innerHTML = ''; parts.innerHTML = '';
      const l1 = !brokenBox.checked;
      const lit1 = closed && l1;
      const lit2 = parallel ? closed : (closed && l1);
      const flow = parallel ? closed : (closed && l1);
      wires.setAttribute('stroke', flow ? '#D8C47A' : '#8FA1B4');

      el('line', { x1: 30, y1: 80, x2: 30, y2: 60 }, wires);
      el('line', { x1: 30, y1: 110, x2: 30, y2: 130 }, wires);
      el('line', { x1: 18, y1: 80, x2: 42, y2: 80, stroke: '#C5D0DD', 'stroke-width': 2 }, parts);
      el('line', { x1: 24, y1: 92, x2: 36, y2: 92, stroke: '#C5D0DD', 'stroke-width': 4 }, parts);
      el('text', { x: 8, y: 100, 'text-anchor': 'start' }, parts).textContent = '+';
      el('line', { x1: 30, y1: 60, x2: 30, y2: 30 }, wires);
      el('line', { x1: 30, y1: 30, x2: 90, y2: 30 }, wires);
      el('line', { x1: 30, y1: 130, x2: 130, y2: 130 }, wires);
      el('line', { x1: 130, y1: 130, x2: 160, y2: closed ? 130 : 112 }, wires);
      el('circle', { cx: 130, cy: 130, r: 3.5, fill: '#C5D0DD', stroke: 'none' }, parts);
      el('circle', { cx: 162, cy: 130, r: 3.5, fill: '#C5D0DD', stroke: 'none' }, parts);
      el('line', { x1: 164, y1: 130, x2: 290, y2: 130 }, wires);
      el('line', { x1: 290, y1: 130, x2: 290, y2: 30 }, wires);

      function lamp(cx, cy, on, label, broken) {
        el('circle', { cx, cy, r: 14, fill: on ? '#F4E7B1' : 'none', 'fill-opacity': on ? 0.5 : 0, stroke: '#C5D0DD', 'stroke-width': 2 }, parts);
        el('line', { x1: cx - 8, y1: cy - 8, x2: cx + 8, y2: cy + 8, stroke: '#C5D0DD', 'stroke-width': 2 }, parts);
        el('line', { x1: cx - 8, y1: cy + 8, x2: cx + 8, y2: cy - 8, stroke: '#C5D0DD', 'stroke-width': 2 }, parts);
        if (broken) el('line', { x1: cx - 18, y1: cy + 16, x2: cx + 18, y2: cy - 16, stroke: '#E58C8A', 'stroke-width': 2.5 }, parts);
        el('text', { x: cx, y: cy - 22, 'text-anchor': 'middle' }, parts).textContent = label;
      }

      if (!parallel) {
        el('line', { x1: 90, y1: 30, x2: 146, y2: 30 }, wires);
        el('line', { x1: 174, y1: 30, x2: 232, y2: 30 }, wires);
        el('line', { x1: 260, y1: 30, x2: 290, y2: 30 }, wires);
        lamp(160, 30, lit1, 'Lampe 1', brokenBox.checked);
        lamp(246, 30, lit2, 'Lampe 2', false);
      } else {
        el('line', { x1: 90, y1: 30, x2: 290, y2: 30 }, wires);
        el('line', { x1: 130, y1: 30, x2: 130, y2: 62 }, wires);
        el('line', { x1: 130, y1: 90, x2: 130, y2: 108 }, wires);
        el('line', { x1: 130, y1: 108, x2: 220, y2: 108 }, wires);
        el('line', { x1: 220, y1: 30, x2: 220, y2: 62 }, wires);
        el('line', { x1: 220, y1: 90, x2: 220, y2: 108 }, wires);
        el('line', { x1: 175, y1: 108, x2: 175, y2: 130 }, wires);
        lamp(130, 76, lit1, 'Lampe 1', brokenBox.checked);
        lamp(220, 76, lit2, 'Lampe 2', false);
      }
      if (!closed) status.textContent = 'Der Kreis ist offen: keine Lampe leuchtet.';
      else if (parallel) status.textContent = brokenBox.checked
        ? 'Parallel: Lampe 2 leuchtet weiter, obwohl Lampe 1 defekt ist.'
        : 'Parallel: beide Lampen leuchten unabhängig.';
      else status.textContent = brokenBox.checked
        ? 'Serie: Die defekte Lampe unterbricht den Kreis, beide sind dunkel.'
        : 'Serie: Der Strom fliesst durch beide Lampen nacheinander.';
    }
    swBtn.addEventListener('click', () => {
      closed = !closed;
      swBtn.setAttribute('aria-pressed', String(closed));
      swBtn.textContent = closed ? 'Schalter öffnen' : 'Schalter schliessen';
      renderCircuit();
    });
    modeBtn.addEventListener('click', () => {
      parallel = !parallel;
      modeBtn.setAttribute('aria-pressed', String(parallel));
      modeBtn.textContent = parallel ? 'In Serie schalten' : 'Parallel schalten';
      renderCircuit();
    });
    brokenBox.addEventListener('change', renderCircuit);
    renderCircuit();
  },

  gradnetz(root) {
    const meridians = root.querySelector('#illu-meridians');
    const spin = root.querySelector('#illu-spin');
    const play = root.querySelector('#illu-globe-play');
    const COUNT = 6;
    const ells = [];
    for (let i = 0; i < COUNT; i++) {
      const e = el('ellipse', {
        cx: 0, cy: 0, ry: 110, fill: 'none', stroke: '#3A4B5F', 'stroke-width': 1.5,
      }, meridians);
      ells.push(e);
    }
    function renderGlobe(deg) {
      ells.forEach((e, i) => {
        const a = (deg + i * 180 / COUNT) * Math.PI / 180;
        e.setAttribute('rx', Math.max(0.5, Math.abs(110 * Math.sin(a))));
        e.setAttribute('opacity', Math.cos(a) >= 0 ? '1' : '0.35');
      });
    }
    renderGlobe(Number(spin.value));
    spin.addEventListener('input', () => renderGlobe(Number(spin.value)));
    let timer = null;
    play.addEventListener('click', () => {
      if (timer) {
        clearInterval(timer); timer = null;
        play.setAttribute('aria-pressed', 'false');
        play.textContent = 'Abspielen';
      } else {
        timer = setInterval(() => {
          spin.value = String((Number(spin.value) + 1) % 361);
          renderGlobe(Number(spin.value));
        }, 50);
        play.setAttribute('aria-pressed', 'true');
        play.textContent = 'Anhalten';
      }
    });
  },

  sonnensystem(root) {
    const orbits = root.querySelector('#illu-orbits');
    const play = root.querySelector('#illu-orbit-play');
    play.addEventListener('click', () => {
      const running = orbits.classList.toggle('running');
      play.setAttribute('aria-pressed', String(running));
      play.textContent = running ? 'Anhalten' : 'Abspielen';
    });
  },
};

export function init(id, root) {
  if (INITS[id]) INITS[id](root);
}
