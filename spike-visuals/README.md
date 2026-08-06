# Spike: Interactive 3D and rich visuals + SVG illustrations

Time-boxed exploration of BACKLOG items 9 (interactive 3D / rich
visual elements) and 10 (illustrations for complex concepts). This
folder is a spike, not an app: it is not registered in the overview,
has no gamification, no PRD and no e2e suite. `index.html` holds four
working prototypes, all inline SVG/CSS/JS with DESIGN.md tokens, zero
libraries, zero external requests.

## What was built

1. **Globus mit Gradnetz (SVG + JS, ~40 lines of JS).** Orthographic
   globe with equator, parallels and animated meridians. Rotation via
   slider (user-driven, reduced-motion-safe); autoplay only on click.
   Directly usable for Weltatlas Stufe c (Gradnetz) and Sternwarte.
2. **Sonnensystem in Bewegung (pure CSS).** Four inner planets on
   dashed orbits, periods scaled (outer = slower), transform-only
   animation, paused by default, `prefers-reduced-motion` honored.
   Directly usable for Sternwarte Stufe e.
3. **Stromkreis zum Anfassen (SVG + JS, ~90 lines of JS).** Battery,
   switch, two lamps; toggle Serie/Parallel, break a lamp, watch the
   consequences; a `role="status"` line states the physics in words.
   All five states verified in the browser. Directly usable for
   Stromkreis Stufe b — this is the strongest teaching win of the
   four.
4. **Statischer Illustrationsstil.** Wasserkreislauf and Mondphasen
   drawn to a fixed style: stroke 2, round caps, token colors, soft
   26-alpha fills, quiet labels. The style is now captured token-only
   in DESIGN.md under `illustration`.

## Findings

- **Everything we actually need is reachable without any library.**
  The four prototypes total roughly 350 lines including markup and
  cover the concrete wishes behind the backlog items (globe, orbits,
  buildable circuit, concept illustrations). They are DOM/SVG, so
  they inherit tokens, are inspectable, styleable, screen-reader
  labelable (`role="img"` + `aria-label`), print fine, and weigh a
  few kilobytes.
- **three.js would buy free-camera 3D at a real cost.** A vendored
  `three.module.js` is ~600 KB (~150 KB gzipped) per app or a shared
  copy that breaks the "each app is one folder" rule; WebGL canvases
  are opaque to assistive tech (a11y must be rebuilt beside the
  canvas); reduced-motion, focus and token-styling all become manual;
  and none of the currently planned teaching moments needs a free
  camera. Textured Earth or true 3D animal models would additionally
  need image/model assets, which conflicts with "no external
  requests" unless we ship megabytes per app.
- **The line between "illustration" and "task" matters.** The circuit
  prototype is interactive but still an explainer: it never evaluates
  the child. Keeping explainers separate from tasks preserves the
  family's input rules (auto-check, mc evaluation) untouched.
- **Motion rules held up.** Transform/opacity-only animation, paused
  by default, play on click, `prefers-reduced-motion` respected —
  all fit the existing DESIGN.md motion tokens; the new
  `illustration.motion` group writes that down.

## Decisions (recorded in PRODUCT.md and BACKLOG.md)

- **D1 — SVG/CSS first, no 3D library.** Interactive visuals are
  built with inline SVG and CSS only. three.js (or any render
  library) is not adopted. Revisit only if a competency genuinely
  requires free 3D manipulation, as its own PRODUCT.md decision.
- **D2 — Illustration style is a token group.** DESIGN.md gained an
  `illustration` group (stroke, fills, labels, motion). All future
  in-app graphics follow it.
- **D3 — Visuals live in the Merkheft, apps stay pure.** (Revised
  after review: the first idea was optional explainer panels inside
  the apps; that mixes explaining into surfaces that are for testing
  and practising.) All explaining — text, illustrations, interactive
  visuals — lives in a wiki-style reference app (working title
  Merkheft, one Merkblatt per concept). Apps link to the matching
  Merkblatt from the Stufe card and, supportively, from the done
  screen after a round with mistakes; the Merkblatt links back
  ("Dazu üben"). The integrated plan, including Merkblatt wave 1
  harvesting these prototypes, is in BACKLOG.md items 9–11.

## Try it

```bash
cd spike-visuals && python3 -m http.server 8000
# http://localhost:8000
```

Once Merkblatt wave 1 has landed in the Merkheft app, this folder
can be deleted.
