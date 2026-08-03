// =============================================================================
// Registry Guard —— 文件系统层面不变量测试
// （不依赖 Vite 的 import.meta.glob，可在 node --test 下运行）
//
// 校验每个 src/algorithms/<category>/<id>/：
//   1. categoryId 必须存在于 taxonomy
//   2. 文件夹名（id）全小写、kebab-case、全局唯一
//   3. 文件齐全：meta.ts / impl.ts / index.ts
//   4. meta.ts 导出 const meta，含全部必填字段
//   5. index.ts 导出 createDemo()
// =============================================================================

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = dirname(fileURLToPath(import.meta.url));
const ALGOS_DIR = join(ROOT, '..', 'src', 'algorithms');
const TAXONOMY_PATH = join(ROOT, '..', 'src', 'taxonomy.ts');

/** 读取 taxonomy.ts，提取所有合法的 categoryId。 */
function readCategoryIds(): Set<string> {
  const src = readFileSync(TAXONOMY_PATH, 'utf8');
  const ids = new Set<string>();
  for (const m of src.matchAll(/id:\s*['"]([^'"]+)['"]/g)) {
    ids.add(m[1]!);
  }
  return ids;
}

/** 列出所有算法模块：<category>/<id>。 */
function listModules(): Array<{ category: string; id: string; dir: string }> {
  if (!existsSync(ALGOS_DIR)) return [];
  const out: Array<{ category: string; id: string; dir: string }> = [];
  for (const category of readdirSync(ALGOS_DIR)) {
    const catDir = join(ALGOS_DIR, category);
    if (!statSync(catDir).isDirectory()) continue;
    for (const id of readdirSync(catDir)) {
      const idDir = join(catDir, id);
      if (!statSync(idDir).isDirectory()) continue;
      out.push({ category, id, dir: idDir });
    }
  }
  return out;
}

const KEBAB = /^[a-z][a-z0-9-]*$/;

test('taxonomy 含至少 30 个分类', () => {
  const ids = readCategoryIds();
  assert.ok(ids.size >= 30, `期望 ≥30 个分类，实际 ${ids.size}`);
});

test('每个算法模块目录结构合法、id 唯一、categoryId 合法', () => {
  const categoryIds = readCategoryIds();
  const modules = listModules();
  assert.ok(modules.length > 0, '尚未有任何算法模块');

  const seenIds = new Map<string, string>(); // id → dir
  for (const mod of modules) {
    assert.match(mod.id, KEBAB, `id 非法（须 kebab-case）：${mod.id}`);
    const prev = seenIds.get(mod.id);
    assert.ok(!prev, `id 重复：${mod.id}（${mod.dir} 与 ${prev}）`);
    seenIds.set(mod.id, mod.dir);

    assert.ok(
      categoryIds.has(mod.category),
      `未知 categoryId '${mod.category}'（在 ${mod.dir}）；须在 taxonomy.ts 中定义`,
    );

    const indexTs = join(mod.dir, 'index.ts');
    const metaTs = join(mod.dir, 'meta.ts');
    const implTs = join(mod.dir, 'impl.ts');
    assert.ok(existsSync(indexTs), `缺少 index.ts：${mod.dir}`);
    assert.ok(existsSync(metaTs), `缺少 meta.ts：${mod.dir}`);
    assert.ok(existsSync(implTs), `缺少 impl.ts：${mod.dir}`);

    const indexSrc = readFileSync(indexTs, 'utf8');
    assert.ok(
      /export\s+(async\s+)?function\s+createDemo\b/.test(indexSrc),
      `${indexTs} 必须导出 \`createDemo()\``,
    );
  }
});

test('每个算法的 meta 必须声明全部必填字段', () => {
  const modules = listModules();
  const REQUIRED = ['id', 'categoryId', 'title', 'summary', 'description', 'complexity', 'tags'];
  for (const mod of modules) {
    const metaSrc = readFileSync(join(mod.dir, 'meta.ts'), 'utf8');
    assert.ok(
      /export\s+const\s+meta\b/.test(metaSrc),
      `${mod.dir}/meta.ts 必须导出 \`const meta\``,
    );
    for (const field of REQUIRED) {
      assert.ok(
        new RegExp(`\\b${field}\\s*:`).test(metaSrc),
        `${mod.dir}/meta.ts 缺少 meta.${field}`,
      );
    }
  }
});

// ---------------------------------------------------------------------------
// 数量一致性：算法模块数、测试文件数、README/product-check 三方对齐。
// 防止「新增算法但忘改文档/课程导出」这类漂移。
// ---------------------------------------------------------------------------
function countTestFiles(): number {
  const testRoot = join(ROOT, '..', 'test');
  if (!existsSync(testRoot)) return 0;
  let n = 0;
  const stack: string[] = [testRoot];
  while (stack.length > 0) {
    const cur = stack.pop()!;
    for (const entry of readdirSync(cur, { withFileTypes: true })) {
      const p = join(cur, entry.name);
      if (entry.isDirectory()) stack.push(p);
      else if (entry.name.endsWith('.test.ts')) n++;
    }
  }
  return n;
}

test('算法模块数 ≥ 3000，覆盖全部 30 大类', () => {
  const modules = listModules();
  const cats = new Set(modules.map((m) => m.category));
  assert.ok(
    modules.length >= 3000,
    `期望 ≥3000 个算法模块，实际 ${modules.length}`,
  );
  assert.ok(cats.size >= 30, `期望 ≥30 个分类，实际 ${cats.size}`);
});

test('测试文件数与算法模块数相当（覆盖率 ≥ 95%）', () => {
  const modules = listModules();
  const tests = countTestFiles();
  const ratio = tests / modules.length;
  assert.ok(
    ratio >= 0.95,
    `测试文件 ${tests} 个 vs 算法 ${modules.length} 个，覆盖率 ${(ratio * 100).toFixed(1)}% < 95%`,
  );
});

test('README 与 curriculum 导出的算法数与实际模块数一致', () => {
  const modules = listModules();
  const readme = readFileSync(join(ROOT, '..', 'README.md'), 'utf8');
  assert.ok(
    readme.includes(`${modules.length} 个完整算法`),
    `README 未声明当前算法数 ${modules.length}`,
  );
  const curriculumPath = join(ROOT, '..', 'curriculum', 'learning-paths.json');
  if (existsSync(curriculumPath)) {
    const curriculum = JSON.parse(readFileSync(curriculumPath, 'utf8')) as {
      totalAlgorithms: number;
    };
    assert.equal(
      curriculum.totalAlgorithms,
      modules.length,
      `curriculum/learning-paths.json 的 totalAlgorithms(${curriculum.totalAlgorithms}) 与实际模块数(${modules.length})不一致，请重跑 npm run product:curriculum`,
    );
  }
});
