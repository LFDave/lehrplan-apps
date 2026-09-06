#!/usr/bin/env python3
"""Convert the official Lehrplan 21 PDF (Ausgabe Kanton Bern) to Markdown
for local, development-time reading only.

Writes one Markdown file per top-level chapter of the PDF outline into
markdown/ (for example 01-einleitende-kapitel-ahb.md, 06-kompetenzaufbau-ma.md)
plus 00-index.md with the chapter list and page ranges. Headings come
from the PDF outline (level 1-3 become #, ##, ###); every page starts
with an HTML comment naming its PDF page number so a statement can be
traced back. Running page furniture (the "Kanton Bern" footer, the
version date, the chapter code in the corner, bare page numbers) is
dropped.

The output contains official Lehrplan wording and is therefore
gitignored: it is a working copy for this machine, never committed and
never published. Claude sessions in this repo take Lehrplan facts from
these files (and from stufen.json), not from web search or memory.

Usage:
    pip install pymupdf
    curl -o lehrplan21_be.pdf https://be.lehrplan.ch/container/BE_DE_Gesamtausgabe.pdf
    python3 to_markdown.py            # reads lehrplan21_be.pdf next to it
    python3 to_markdown.py other.pdf  # any path; output still goes to markdown/
"""
import re
import sys
from pathlib import Path

try:
    import pymupdf
except ImportError:  # older installs expose the same API as fitz
    import fitz as pymupdf

HERE = Path(__file__).resolve().parent
PDF = Path(sys.argv[1]) if len(sys.argv) > 1 else HERE / 'lehrplan21_be.pdf'
OUT = HERE / 'markdown'

FOOTER_RE = re.compile(r'^(Kanton Bern|\d{2}\.\d{2}\.\d{4}|[A-ZÄÖÜ]{1,4}|\d{1,3})$')


def slug(text):
    text = text.lower()
    for a, b in (('ä', 'ae'), ('ö', 'oe'), ('ü', 'ue'), ('ß', 'ss')):
        text = text.replace(a, b)
    return re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', text)).strip('-')[:60]


def clean_page(text):
    """Drop the running footer/header lines and collapse blank runs."""
    lines = []
    for raw in text.splitlines():
        line = raw.rstrip()
        stripped = line.strip()
        if FOOTER_RE.match(stripped):
            continue
        # Running header such as "Überblick  | Lehrplan 21 |  Aufbau Lehrplan 21"
        if '| Lehrplan 21 |' in stripped or '|  Lehrplan 21 |' in stripped:
            continue
        lines.append(line)
    out = []
    for line in lines:
        if line.strip() == '' and out and out[-1] == '':
            continue
        out.append(line.strip())
    return '\n'.join(out).strip()


def main():
    if not PDF.exists():
        sys.exit(f'PDF not found: {PDF} (download it from be.lehrplan.ch first)')
    doc = pymupdf.open(str(PDF))
    toc = doc.get_toc()  # [level, title, page]
    if not toc:
        sys.exit('The PDF has no outline; nothing to structure.')
    OUT.mkdir(exist_ok=True)
    for old in OUT.glob('*.md'):
        old.unlink()

    # Top-level chapters and their page ranges.
    tops = [(i, e) for i, e in enumerate(toc) if e[0] == 1]
    chapters = []
    for n, (i, (lvl, title, page)) in enumerate(tops):
        title = title.replace('Ã\x9cB', 'ÜB')  # mojibake in the PDF outline
        end = tops[n + 1][1][2] - 1 if n + 1 < len(tops) else len(doc)
        chapters.append((n + 1, title, page, end, i))

    # Headings by page: {page: [(level, title), ...]}
    by_page = {}
    for lvl, title, page in toc:
        if lvl <= 3:
            by_page.setdefault(page, []).append((lvl, title))

    index = ['# Lehrplan 21, Ausgabe Kanton Bern (lokale Markdown-Kopie)', '',
             f'Quelle: {PDF.name}, {len(doc)} Seiten. Nicht veröffentlichen.', '',
             '| Datei | Kapitel | PDF-Seiten |', '| --- | --- | --- |']
    for num, title, start, end, _ in chapters:
        name = f'{num:02d}-{slug(title)}.md'
        parts = [f'# {title}', '', f'PDF-Seiten {start} bis {end}. Lokale Arbeitskopie, nicht veröffentlichen.', '']
        for p in range(start, end + 1):
            for lvl, head in by_page.get(p, []):
                if lvl == 1:
                    continue
                parts.append(f'{"#" * lvl} {head}')
                parts.append('')
            parts.append(f'<!-- PDF-Seite {p} -->')
            body = clean_page(doc[p - 1].get_text())
            if body:
                parts.append(body)
            parts.append('')
        (OUT / name).write_text('\n'.join(parts), encoding='utf-8')
        index.append(f'| {name} | {title} | {start} bis {end} |')
        print(f'{name:48s} pages {start}-{end}')
    (OUT / '00-index.md').write_text('\n'.join(index) + '\n', encoding='utf-8')
    print(f'{len(chapters)} chapters written to {OUT}')


if __name__ == '__main__':
    main()
