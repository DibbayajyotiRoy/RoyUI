// Bundle-budget guard. Measures the gzipped size of each form-system subpath by
// walking its built ESM import graph (entry + every local chunk it pulls in,
// excluding react/react-dom and CSS) and fails if a subpath exceeds its budget.
// Run after `build`; wired into CI before publish so a regression can't ship.
//
// Note: the `./form` budget is intentionally larger than the engine alone — its
// FieldRenderer statically imports the whole control set, so the subpath is the
// batteries-included entry. Individual control subpaths stay tiny.

import { readFileSync, existsSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { dirname, resolve } from 'node:path';

const DIST = resolve('dist');
const KB = 1024;

const BUDGETS = {
  'components/form/index.js': 16 * KB,
  'components/textarea/index.js': 4 * KB,
  'components/checkbox/index.js': 4 * KB,
  'components/switch/index.js': 4 * KB,
  'components/radio-group/index.js': 4 * KB,
  'components/number-input/index.js': 4 * KB,
  'components/dropdown/index.js': 5 * KB,
};

const IMPORT_RE = /(?:import|export)\b[^'"]*?['"]([^'"]+)['"]/g;

/** Transitive closure of an entry's local .js import graph. */
function collectGraph(entryAbs) {
  const seen = new Set();
  const stack = [entryAbs];
  while (stack.length > 0) {
    const file = stack.pop();
    if (seen.has(file) || !existsSync(file)) continue;
    seen.add(file);
    const src = readFileSync(file, 'utf8');
    const dir = dirname(file);
    for (const m of src.matchAll(IMPORT_RE)) {
      const spec = m[1];
      if (!spec.startsWith('.') || !spec.endsWith('.js')) continue; // skip externals + css
      stack.push(resolve(dir, spec));
    }
  }
  return seen;
}

let failed = false;
const rows = [];
for (const [entry, budget] of Object.entries(BUDGETS)) {
  const files = collectGraph(resolve(DIST, entry));
  const buf = Buffer.concat([...files].map((f) => readFileSync(f)));
  const size = gzipSync(buf).length;
  const ok = size <= budget;
  if (!ok) failed = true;
  rows.push({ entry, size, budget, ok });
}

console.log('Bundle budgets (gzip, entry + chunk graph):\n');
for (const r of rows) {
  const kb = (r.size / KB).toFixed(2);
  const bkb = (r.budget / KB).toFixed(0);
  console.log(`  ${r.ok ? 'PASS' : 'FAIL'}  ${r.entry.padEnd(34)} ${kb.padStart(7)} KB / ${bkb} KB`);
}

if (failed) {
  console.error('\nBundle budget exceeded.');
  process.exit(1);
}
console.log('\nAll subpaths within budget.');
