# Lehrplan-Extraktion

Derives the grounding data for new practice apps from the official
Lehrplan 21 PDF (Bern edition). **Only the script lives in the repo** —
the PDF and the extracted `stufen.json` contain official Lehrplan text
and are not committed for copyright reasons. Re-derive them locally
when starting a new app.

## Usage

```bash
pip install pdfplumber
curl -o lehrplan21_be.pdf https://be.lehrplan.ch/container/BE_DE_Gesamtausgabe.pdf
python3 extract_stufen.py   # expects lehrplan21_be.pdf next to it, writes stufen.json
```

`stufen.json` maps every competency code to its official
Kompetenzstufen: per step the label (a-l), the cycle(s) from the
colored band geometry, the Grundanspruch flag from the sand-shaded row,
and the step text. This is the source of truth for a new app's
`data.js` (Stufen order, cycles, GA markers) and for choosing task
generators — the app itself ships only child-friendly paraphrases,
never the extracted text.

## How the geometry decoding works

See the docstring in `extract_stufen.py`: cycle bands are color-coded
columns (orange = Zyklus 1, blue = 2, green = 3; a staggered band means
the step belongs to both cycles), the Grundanspruch is a sand-colored
row highlight, Orientierungspunkte are dotted red lines. Page range
100-534 covers all Kompetenzaufbau pages.
