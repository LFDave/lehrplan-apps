// illustrations.js — Inline-SVG-Bilder und interaktive Modelle für
// die Merkblätter, nach den illustration-Tokens aus DESIGN.md:
// Strichbreite 2, runde Enden, gedeckte 26-Alpha-Flächen, ruhige
// Beschriftung. Bewegung nur transform/opacity, startet erst auf
// Klick und respektiert reduzierte Bewegung. render(id) liefert das
// Markup, init(id, root) verdrahtet die Interaktivität.

const RENDERERS = {
  wasserkreislauf: () => `
    <svg viewBox="0 0 340 180" class="illu" role="img"
         aria-label="Wasserkreislauf: Die Sonne erwärmt das Meer, Wasser verdunstet, bildet Wolken, regnet ab und fliesst zurück">
      <circle cx="46" cy="40" r="18" fill="#D8C47A26" stroke="#D8C47A" stroke-width="2"/>
      <path d="M20 150 Q 85 132 170 150 T 320 150 L 320 170 L 20 170 Z"
            fill="#9FBBD726" stroke="#9FBBD7" stroke-width="2"/>
      <path d="M198 52 a14 14 0 0 1 27 -5 a12 12 0 0 1 17 11 a11 11 0 0 1 -11 12 h-44 a11 11 0 0 1 -4 -21 a14 14 0 0 1 15 3"
            fill="#1B2A3C" stroke="#C5D0DD" stroke-width="2"/>
      <g stroke="#C5D0DD" stroke-width="2" fill="none" stroke-linecap="round">
        <path d="M120 138 C 128 112 122 92 138 66"/>
        <path d="M148 140 C 156 114 150 94 166 68"/>
      </g>
      <g stroke="#9FBBD7" stroke-width="2" stroke-linecap="round">
        <line x1="212" y1="82" x2="206" y2="102"/>
        <line x1="228" y1="82" x2="222" y2="102"/>
        <line x1="244" y1="82" x2="238" y2="102"/>
      </g>
      <text x="46" y="76" text-anchor="middle">Sonne</text>
      <text x="118" y="120" text-anchor="end">verdunsten</text>
      <text x="226" y="34" text-anchor="middle">Wolke</text>
      <text x="258" y="100" text-anchor="start">Regen</text>
      <text x="70" y="165" fill="#9FBBD7">Meer und Fluss</text>
    </svg>`,

  mondphasen: () => `
    <svg viewBox="0 0 340 90" class="illu" role="img"
         aria-label="Vier Mondphasen: Neumond, zunehmender Halbmond, Vollmond, abnehmender Halbmond">
      <g id="illu-moons"></g>
      <text x="50" y="82" text-anchor="middle">Neumond</text>
      <text x="130" y="82" text-anchor="middle">zunehmend</text>
      <text x="210" y="82" text-anchor="middle">Vollmond</text>
      <text x="290" y="82" text-anchor="middle">abnehmend</text>
    </svg>`,

  schaltungen: () => `
    <svg id="illu-circuit" viewBox="0 0 320 190" class="illu" role="img"
         aria-label="Schaltbild mit Batterie, Schalter und zwei Lampen">
      <g id="illu-wires" stroke="#8FA1B4" stroke-width="2.5" fill="none"></g>
      <g id="illu-parts"></g>
    </svg>
    <div class="illu-controls">
      <button id="illu-sw" aria-pressed="false">Schalter schliessen</button>
      <button id="illu-mode" aria-pressed="false">Parallel schalten</button>
      <label><input type="checkbox" id="illu-broken"> Lampe 1 ist defekt</label>
    </div>
    <p class="illu-status" id="illu-circuit-status" role="status"></p>`,

  gradnetz: () => `
    <svg id="illu-globe" viewBox="-130 -130 260 260" class="illu illu-square" role="img"
         aria-label="Drehbarer Globus mit Gradnetz: Äquator, Breitenkreise und Meridiane">
      <circle r="110" fill="#13202E" stroke="#3A4B5F" stroke-width="2"/>
      <g id="illu-meridians"></g>
      <g stroke="#3A4B5F" stroke-width="1.5">
        <line x1="-95.3" y1="-55" x2="95.3" y2="-55"/>
        <line x1="-95.3" y1="55" x2="95.3" y2="55"/>
        <line x1="-55" y1="-95.3" x2="55" y2="-95.3"/>
        <line x1="-55" y1="95.3" x2="55" y2="95.3"/>
      </g>
      <line x1="-110" y1="0" x2="110" y2="0" stroke="#D8C47A" stroke-width="2.5"/>
      <circle cx="0" cy="-110" r="3.5" fill="#C5D0DD"/>
      <circle cx="0" cy="110" r="3.5" fill="#C5D0DD"/>
      <text x="0" y="-118" text-anchor="middle">Nordpol</text>
      <text x="0" y="126" text-anchor="middle">Südpol</text>
      <text x="0" y="16" text-anchor="middle" fill="#D8C47A">Äquator</text>
    </svg>
    <div class="illu-controls">
      <label for="illu-spin">Drehen</label>
      <input type="range" id="illu-spin" min="0" max="360" value="20" step="1"
             aria-label="Globus drehen in Grad">
      <button id="illu-globe-play" aria-pressed="false">Abspielen</button>
    </div>`,

  sonnensystem: () => `
    <div class="orbits" id="illu-orbits" role="img"
         aria-label="Modell: Merkur, Venus, Erde und Mars kreisen unterschiedlich schnell um die Sonne">
      <div class="sun"></div>
      <div class="orbit" style="width:26%;height:26%"></div>
      <div class="orbit" style="width:46%;height:46%"></div>
      <div class="orbit" style="width:66%;height:66%"></div>
      <div class="orbit" style="width:88%;height:88%"></div>
      <div class="carrier" style="width:26%;height:26%;animation-duration:4s"><div class="planet" style="background:#C5D0DD"></div></div>
      <div class="carrier" style="width:46%;height:46%;animation-duration:8s"><div class="planet" style="background:#D8C47A"></div></div>
      <div class="carrier" style="width:66%;height:66%;animation-duration:13s"><div class="planet" style="background:#9FBBD7"></div></div>
      <div class="carrier" style="width:88%;height:88%;animation-duration:24s"><div class="planet" style="background:#D99A8B"></div></div>
    </div>
    <div class="illu-controls">
      <button id="illu-orbit-play" aria-pressed="false">Abspielen</button>
      <span class="illu-status">Merkur (hell), Venus (gelblich), Erde (blau), Mars (rötlich)</span>
    </div>`,
};

export function render(id) {
  return RENDERERS[id] ? RENDERERS[id]() : '';
}

const NS = 'http://www.w3.org/2000/svg';
function el(name, attrs, parent) {
  const n = document.createElementNS(NS, name);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  parent.appendChild(n);
  return n;
}

const INITS = {
  mondphasen(root) {
    const moons = root.querySelector('#illu-moons');
    const phases = [
      { x: 50, light: 0 }, { x: 130, light: 0.5, side: 'right' },
      { x: 210, light: 1 }, { x: 290, light: 0.5, side: 'left' },
    ];
    for (const p of phases) {
      el('circle', { cx: p.x, cy: 38, r: 22, fill: '#13202E', stroke: '#C5D0DD', 'stroke-width': 2 }, moons);
      if (p.light === 1) {
        el('circle', { cx: p.x, cy: 38, r: 20, fill: '#F4E7B1', 'fill-opacity': 0.55, stroke: 'none' }, moons);
      } else if (p.light === 0.5) {
        el('path', {
          d: p.side === 'right'
            ? `M ${p.x} 18 a 20 20 0 0 1 0 40 Z`
            : `M ${p.x} 18 a 20 20 0 0 0 0 40 Z`,
          fill: '#F4E7B1', 'fill-opacity': 0.55, stroke: 'none',
        }, moons);
      }
    }
  },

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
