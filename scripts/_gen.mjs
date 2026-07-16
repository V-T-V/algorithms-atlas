// Generic per-algorithm file generator.
// Each algo entry provides: id, titleZh, titleEn, summaryZh, summaryEn,
// descZh, descEn, tags[], time, space, impl(string), trace(string), test(string)
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'D:/M_X_M/algorithms-atlas';

export function gen(category, algos) {
  let created = 0;
  for (const a of algos) {
    const dir = join(ROOT, 'src', 'algorithms', category, a.id);
    if (existsSync(dir)) { console.log('SKIP', category, a.id); continue; }
    mkdirSync(dir, { recursive: true });
    const meta = `// ${a.titleZh}（${a.titleEn}）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: '${a.id}',
  categoryId: '${category}',
  title: { zh: ${JSON.stringify(a.titleZh)}, en: ${JSON.stringify(a.titleEn)} },
  summary: {
    zh: ${JSON.stringify(a.summaryZh)},
    en: ${JSON.stringify(a.summaryEn)},
  },
  description: {
    zh: ${JSON.stringify(a.descZh)},
    en: ${JSON.stringify(a.descEn)},
  },
  tags: ${JSON.stringify(a.tags)},
  complexity: { time: ${JSON.stringify(a.time)}, space: ${JSON.stringify(a.space)} },
};
`;
    const index = `import type { Demo } from '../../../types.ts';
import { buildTrace } from './trace.ts';
export { meta } from './meta.ts';
export async function createDemo(): Promise<Demo> {
  const { meta } = await import('./meta.ts');
  return { meta, buildTrace };
}
`;
    writeFileSync(join(dir, 'meta.ts'), meta);
    writeFileSync(join(dir, 'index.ts'), index);
    writeFileSync(join(dir, 'impl.ts'), a.impl);
    writeFileSync(join(dir, 'trace.ts'), a.trace);
    mkdirSync(join(ROOT, 'test', category), { recursive: true });
    writeFileSync(join(ROOT, 'test', category, `${a.id}.test.ts`), a.test);
    created++;
    console.log('OK', category, a.id);
  }
  console.log(`-- ${category}: created ${created} / ${algos.length}`);
}

// CLI: node scripts/_gen.mjs <category>
const arg = process.argv[2];
if (arg) {
  const mod = await import(`./_data_${arg}.mjs`);
  gen(arg, mod.algos);
}
