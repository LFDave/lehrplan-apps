#!/usr/bin/env python3
"""Layout-aware extraction of Lehrplan 21 Kompetenzstufen per cycle.

Reads the Kompetenzaufbau pages (100-534) and produces stufen.json:
{code: {"steps": [{"label", "cycle", "ga", "text"}], "pages": [...]}}

Geometry (A4 portrait, all subjects):
- cycle band: outer column x 42.5-55.3, fill orange=Z1, blue=Z2, green=Z3
- competency header: code word at x~45.4 (gray bar behind it)
- step labels: 'a'..'l' or '1a'/'2b' at x~85-95; statement numbers are
  '1.'/'2.' (with dot) in the same column and are excluded
- step text: words 100 < x0 < 462 (right of 465 is the Querverweise column)
- Grundanspruch: light sand rect (0.906,0.906,0.867) x0~68 over the step row
- Orientierungspunkt: dotted red line (many small curves, same top)
"""
import json
import re
import collections
import pdfplumber

CYCLE_COLORS = {
    (0.933333, 0.639216, 0.12549): 1,   # orange
    (0.172549, 0.560784, 0.807843): 2,  # blue
    (0.592157, 0.788235, 0.254902): 3,  # green
}
GA_COLOR = (0.905882, 0.905882, 0.866667)
OP_COLOR = (0.811765, 0.164706, 0.117647)

CODE_RE = re.compile(r'^[A-Z]{1,4}[0-9]?[A-Z]?\.\d{1,2}(\.[A-Z])?\.\d{1,2}$|^(NMG|NT|WAH|RZG|ERG|MI|BO|BS)\.\d{1,2}\.\d{1,2}$')
LABEL_RE = re.compile(r'^\d?[a-l]$')
NUM_RE = re.compile(r'^\d{1,2}\.$')


def close(a, b, tol=0.01):
    return a is not None and b is not None and all(abs(x - y) < tol for x, y in zip(a, b))


def cycle_of_color(col):
    if not col or len(col) != 3:
        return None
    for ref, cyc in CYCLE_COLORS.items():
        if close(col, ref):
            return cyc
    return None


def main():
    result = {}
    order = []
    current = None  # code currently being continued across pages

    with pdfplumber.open('lehrplan21_be.pdf') as pdf:
        for pno in range(100, len(pdf.pages)):
            page = pdf.pages[pno]
            words = page.extract_words()

            bands = []  # (cycle, top, bottom) from outer column
            for r in page.rects:
                if abs(r['x0'] - 42.5) < 1 and abs(r['x1'] - 55.3) < 1:
                    cyc = cycle_of_color(r.get('non_stroking_color'))
                    if cyc:
                        bands.append((cyc, r['top'], r['bottom']))
            # inner column as fallback for band edges
            inner = []
            for r in page.rects:
                if abs(r['x0'] - 55.3) < 1 and abs(r['x1'] - 68.0) < 1:
                    cyc = cycle_of_color(r.get('non_stroking_color'))
                    if cyc:
                        inner.append((cyc, r['top'], r['bottom']))

            ga_rects = [r for r in page.rects
                        if close(r.get('non_stroking_color'), GA_COLOR)
                        and abs(r['x0'] - 68.0) < 1]

            # dotted OP lines: cluster small red curves by top
            red_tops = collections.Counter()
            for c in page.curves:
                if close(c.get('non_stroking_color'), OP_COLOR) and (c['x1'] - c['x0']) < 5 and c['x0'] > 60:
                    red_tops[round(c['top'])] += 1
            op_tops = sorted(t for t, n in red_tops.items() if n >= 20)

            headers = []   # (top, code)
            labels = []    # (top, label)
            stops = []     # statement-number tops (region separators)
            text_words = []
            for w in words:
                x0, top, txt = w['x0'], w['top'], w['text']
                if 44 <= x0 <= 47 and CODE_RE.match(txt):
                    headers.append((top, txt))
                elif 84 <= x0 <= 96 and LABEL_RE.match(txt):
                    labels.append((top, txt))
                elif 84 <= x0 <= 96 and NUM_RE.match(txt):
                    stops.append(top)
                elif 99 <= x0 <= 462 and 45 < top < 795:
                    text_words.append(w)

            headers.sort()
            labels.sort()
            stops.sort()

            def region_owner(top):
                """Which competency owns vertical position `top` on this page."""
                owner = current
                owner_top = -1
                for htop, code in headers:
                    if htop <= top and htop > owner_top:
                        owner, owner_top = code, htop
                # a statement number between the last header and `top` means
                # we are already in the *next* competency's intro text
                for stop in stops:
                    if owner_top < stop <= top:
                        return None
                return owner

            def band_of(top, column):
                for cyc, btop, bbot in column:
                    if btop - 2 <= top <= bbot + 2:
                        return cyc
                best, bestd = None, 1e9
                for cyc, btop, bbot in column:
                    d = min(abs(top - btop), abs(top - bbot))
                    if d < bestd:
                        best, bestd = cyc, d
                return best if bestd < 30 else None

            def cycles_of(top):
                """A step in the staggered transition zone (outer column already
                shows the next cycle, inner still the previous) belongs to both
                cycles; otherwise inner and outer agree."""
                cyc_outer = band_of(top, bands)
                cyc_inner = band_of(top, inner)
                cycles = sorted(c for c in {cyc_outer, cyc_inner} if c)
                return cycles or [None]

            def in_ga(top):
                return any(r['top'] - 3 <= top <= r['bottom'] for r in ga_rects)

            # assign text words to steps
            page_steps = []
            for i, (ltop, label) in enumerate(labels):
                owner = region_owner(ltop)
                if not owner:
                    continue
                next_top = labels[i + 1][0] if i + 1 < len(labels) else 1e9
                # stop at next header or statement number too
                for htop, _ in headers:
                    if ltop < htop < next_top:
                        next_top = htop
                for stop in stops:
                    if ltop < stop < next_top:
                        next_top = stop
                ws = [w for w in text_words if ltop - 3 <= w['top'] < next_top - 1]
                ws.sort(key=lambda w: (round(w['top']), w['x0']))
                text = ' '.join(w['text'] for w in ws)
                page_steps.append({
                    'code': owner, 'label': label, 'top': ltop,
                    'cycles': cycles_of(ltop), 'ga': in_ga(ltop), 'text': text,
                })

            # words on this page belonging to the carried-over competency but
            # positioned above the first label (continuation of previous step)
            if page_steps and current and labels:
                first_ltop = labels[0][0]
                cont = [w for w in text_words if w['top'] < first_ltop - 3
                        and region_owner(w['top']) == current]
                if cont and current in result and result[current]['steps']:
                    cont.sort(key=lambda w: (round(w['top']), w['x0']))
                    result[current]['steps'][-1]['text'] += ' ' + ' '.join(w['text'] for w in cont)

            for s in page_steps:
                code = s['code']
                if code not in result:
                    result[code] = {'steps': [], 'pages': []}
                    order.append(code)
                if pno not in result[code]['pages']:
                    result[code]['pages'].append(pno)
                result[code]['steps'].append({
                    'label': s['label'], 'cycles': s['cycles'],
                    'ga': s['ga'], 'text': s['text'],
                })

            # OP positions: record per owning competency
            for otop in op_tops:
                owner = region_owner(otop)
                if owner and owner in result:
                    result[owner].setdefault('op', []).append(pno)

            if headers:
                current = headers[-1][1]
            elif labels and current is None:
                pass  # nothing to carry

            # keep carrying `current` even without headers

    json.dump({'order': order, 'competencies': result}, open('stufen.json', 'w'),
              ensure_ascii=False, indent=1)

    # sanity report
    total = sum(len(v['steps']) for v in result.values())
    nocyc = [c for c, v in result.items() if any(s['cycles'] == [None] for s in v['steps'])]
    ga_count = sum(1 for v in result.values() for s in v['steps'] if s['ga'])
    empty = [c for c, v in result.items() if any(len(s['text']) < 5 for s in v['steps'])]
    print(f'competencies: {len(result)}  steps: {total}  GA steps: {ga_count}')
    print(f'steps without cycle: {len(nocyc)} -> {nocyc[:10]}')
    print(f'competencies with near-empty step text: {len(empty)} -> {empty[:10]}')
    by_sub = collections.Counter(c.split('.')[0] for c in result)
    print(dict(by_sub))


if __name__ == '__main__':
    main()
