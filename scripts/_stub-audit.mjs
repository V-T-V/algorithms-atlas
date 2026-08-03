import { readdirSync, existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

function dirs(p) { return existsSync(p) ? readdirSync(p, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name) : []; }

const cats = dirs(path.join(root, 'src/algorithms'));
const stubs = [];
for (const cat of cats) {
  for (const id of dirs(path.join(root, 'src/algorithms', cat))) {
    const impl = path.join(root, 'src/algorithms', cat, id, 'impl.ts');
    if (!existsSync(impl)) continue;
    const stat = statSync(impl);
    const txt = readFileSync(impl, 'utf8');
    const lines = txt.split('\n').length;
    // heuristic: very small impl OR contains only a trivial return body
    const isTrivial = /^\s*return\s+\[\[?\w+\]?\];?\s*$/m.test(txt) || /^\s*return\s+\w+;\s*$/m.test(txt);
    const hasHook = /Hooks|hooks/.test(txt);
    if (lines < 12 || (isTrivial && !hasHook)) {
      stubs.push({ cat, id, lines, isTrivial, hasHook });
    }
  }
}
console.log(`potential stubs: ${stubs.length}`);
stubs.sort((a, b) => a.lines - b.lines);
for (const s of stubs.slice(0, 50)) {
  console.log(`  ${s.cat}/${s.id}  (${s.lines} lines, trivial=${s.isTrivial}, hooks=${s.hasHook})`);
}
