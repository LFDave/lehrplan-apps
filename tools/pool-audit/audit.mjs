// Dev tool: checks every practice app against the pool rule in CLAUDE.md.
// A Stufe that draws from a fixed pool must hold clearly more items than a
// round has tasks (at least 12 for a round of 8), so two rounds never show
// the same set. The script imports each app's gen.js and data.js, generates
// 40 seeded rounds per Stufe and counts distinct tasks.
//
//   node tools/pool-audit/audit.mjs            # report
//   node tools/pool-audit/audit.mjs formenreich  # one app
import { readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const only = process.argv.slice(2);
const apps = readdirSync(ROOT)
  .filter((d) => existsSync(`${ROOT}/${d}/gen.js`) && existsSync(`${ROOT}/${d}/data.js`))
  .filter((d) => !only.length || only.includes(d))
  .sort();
const ROUNDS = 40;
const LENGTH = 8;
const MIN_POOL = 12;

function rngFrom(seed) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
const keyOf = (t) =>
  (t.expr ?? t.prompt ?? t.question ?? JSON.stringify(t).slice(0, 80)) + '|' +
  (t.options ? [...t.options].sort().join('|') : (t.answer ?? '')) + '|' + (t.svg || '');

const rows = [];
const errors = [];
for (const app of apps) {
  let gen, data;
  try {
    gen = await import(`${ROOT}/${app}/gen.js`);
    data = await import(`${ROOT}/${app}/data.js`);
  } catch (e) { errors.push(`${app}: ${String(e).split('\n')[0]}`); continue; }
  const skipped = new Set(data.SKIPPED || []);
  for (const st of data.STUFEN) {
    if (skipped.has(st.id) || st.skipped) continue;
    const distinct = new Set();
    let sizes = 0, dupRounds = 0;
    try {
      for (let r = 0; r < ROUNDS; r++) {
        const tasks = gen.genRound(rngFrom(1000 + r * 7919), st, LENGTH);
        sizes += tasks.length;
        const keys = tasks.map(keyOf);
        if (new Set(keys).size !== keys.length) dupRounds++;
        keys.forEach((k) => distinct.add(k));
      }
    } catch (e) { errors.push(`${app}/${st.id}: ${String(e).split('\n')[0]}`); continue; }
    rows.push({ app, stufe: st.id, distinct: distinct.size, avg: sizes / ROUNDS, dupRounds });
  }
}

const bad = rows.filter((r) => r.distinct < MIN_POOL || r.avg < LENGTH || r.dupRounds);
console.log(`apps: ${apps.length}, stufen: ${rows.length}, below rule: ${bad.length}`);
console.log(`\nBELOW RULE (fewer than ${MIN_POOL} distinct tasks over ${ROUNDS} rounds, short rounds, or a question twice in one round):`);
for (const r of bad) {
  console.log(`  ${r.app.padEnd(17)} ${String(r.stufe).padEnd(14)} distinct=${String(r.distinct).padStart(3)}  avgLen=${r.avg.toFixed(1)}  dupRounds=${r.dupRounds}`);
}
if (errors.length) { console.log('\nERRORS:'); errors.forEach((e) => console.log('  ' + e)); }
process.exitCode = bad.length || errors.length ? 1 : 0;
