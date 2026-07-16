#!/usr/bin/env node
// =============================================================================
// 算法脚手架生成器
//   node scripts/new-algorithm.mjs <category> <id> <titleEn> [titleZh]
//
// 例如：
//   node scripts/new-algorithm.mjs sorting merge-sort "Merge Sort" "归并排序"
//
// 生成（meta 与演示代码分文件，保证懒加载分块）：
//   src/algorithms/<category>/<id>/{meta.ts, index.ts, impl.ts, trace.ts}
//   test/<category>/<id>.test.ts
// 并校验 category 合法、id 不重复。
// =============================================================================

import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const [, , category, id, titleEn, titleZhRaw] = process.argv;

function usage() {
  console.error(
    '用法: node scripts/new-algorithm.mjs <category> <id> <titleEn> [titleZh]\n' +
      '例如: node scripts/new-algorithm.mjs sorting merge-sort "Merge Sort" "归并排序"',
  );
  process.exit(1);
}

if (!category || !id || !titleEn) usage();

const KEBAB = /^[a-z][a-z0-9-]*$/;
if (!KEBAB.test(id)) {
  console.error(`id 必须是 kebab-case（小写字母/数字/连字符）：${id}`);
  process.exit(1);
}

// 校验 category 合法
const taxonomySrc = readFileSync(join(ROOT, 'src', 'taxonomy.ts'), 'utf8');
const categoryIds = new Set(
  [...taxonomySrc.matchAll(/id:\s*['"]([^'"]+)['"]/g)].map((m) => m[1]),
);
if (!categoryIds.has(category)) {
  console.error(`未知 category '${category}'。可选：\n  ${[...categoryIds].join(', ')}`);
  process.exit(1);
}

// 校验 id 不重复
const idDir = join(ROOT, 'src', 'algorithms', category, id);
if (existsSync(idDir)) {
  console.error(`已存在：${idDir}`);
  process.exit(1);
}

const titleZh = titleZhRaw || titleEn;
const titleEnEsc = titleEn.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
const titleZhEsc = titleZh.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
const fn = camel(id);

mkdirSync(idDir, { recursive: true });

// —— meta.ts：静态元数据（打进首包）——
writeFileSync(
  join(idDir, 'meta.ts'),
  `// ${titleZh}（${titleEn}）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: '${id}',
  categoryId: '${category}',
  title: { zh: '${titleZhEsc}', en: '${titleEnEsc}' },
  summary: {
    zh: '${titleZhEsc}的一句话简介（待补充）。',
    en: '${titleEnEsc} — one-line summary (TODO).',
  },
  description: {
    zh: '${titleZhEsc}的原理与步骤说明（待补充）。\\n\\n- 第一步\\n- 第二步',
    en: 'Principle and steps of ${titleEnEsc} (TODO).\\n\\n- Step one\\n- Step two',
  },
  tags: ['todo'],
  complexity: { time: 'O(?)', space: 'O(?)' },
};
`,
);

// —— impl.ts：纯算法 ——
writeFileSync(
  join(idDir, 'impl.ts'),
  `// ${titleZh}（${titleEn}）· 纯算法实现（零 DOM 依赖，可独立单测）

/**
 * ${titleEn} 主函数。
 * @param input 输入（按需替换签名）
 * @returns 输出
 */
export function ${fn}(input: number[]): number[] {
  // TODO: 实现算法。这里给出一个「原样返回」占位。
  return [...input];
}
`,
);

// —— trace.ts：录制帧序列 ——
writeFileSync(
  join(idDir, 'trace.ts'),
  `// ${titleZh} · 录制帧序列

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ${fn} } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: \`初始数组：\${input.join(', ')}\`, en: \`Initial: \${input.join(', ')}\` })
    .setBars(rec.barsFrom(input))
    .commit();

  // TODO: 在调用算法的过程中，于关键步骤 rec.begin(...).setBars(...).commit()
  const out = ${fn}(input);
  rec
    .begin({ zh: '完成', en: 'Done' })
    .setBars(out.map((v) => ({ value: v, role: 'final' })))
    .commit();

  return rec.build();
}
`,
);

// —— index.ts：懒加载入口 ——
writeFileSync(
  join(idDir, 'index.ts'),
  `// ${titleZh}（${titleEn}）· 模块入口（懒加载）
// meta 单独放 meta.ts（静态收集进首包），本文件仅演示代码，按需分块。

import type { Demo } from '../../../types.ts';
import { buildTrace } from './trace.ts';

export { meta } from './meta.ts';

export async function createDemo(): Promise<Demo> {
  const { meta } = await import('./meta.ts');
  return { meta, buildTrace };
}
`,
);

// —— 测试 ——
const testDir = join(ROOT, 'test', category);
mkdirSync(testDir, { recursive: true });
writeFileSync(
  join(testDir, `${id}.test.ts`),
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ${fn} } from '../../src/algorithms/${category}/${id}/impl.ts';

test('${id} 基本行为', () => {
  assert.deepEqual(${fn}([]), []);
  assert.deepEqual(${fn}([1]), [1]);
  // TODO: 补充该算法的期望输出断言
});
`,
);

console.log(`✓ 已创建 ${idDir.replace(/\\\\/g, '/')}/{meta,index,impl,trace}.ts`);
console.log(`✓ 已创建 test/${category}/${id}.test.ts`);
console.log(`\n下一步：编辑 impl.ts 实现算法，编辑 trace.ts 录制演示，编辑 meta.ts 补全 meta。`);

function camel(s) {
  return s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
}
