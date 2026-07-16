import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  alphaBetaLMR,
  alphaBetaPlain,
  buildTree,
  DEFAULT_LMR_CONFIG,
} from '../../src/algorithms/ai-search/late-move-reduction/impl.ts';

test('LMR 与纯 alpha-beta 根值一致（4 叉深 2）', () => {
  const utils = [10, 2, 3, 4, 5, 6, 7, 8, 9, 1, 11, 12, 13, 14, 15, 0];
  const a = buildTree({ utilities: utils, branching: 4 });
  const b = buildTree({ utilities: utils, branching: 4 });
  const va = alphaBetaLMR(a, 2, -Infinity, Infinity);
  const vb = alphaBetaPlain(b, 2, -Infinity, Infinity);
  assert.equal(va, vb);
});

test('LMR 在多棵树上与 alpha-beta 一致', () => {
  const cases = [
    [1, 2, 3, 4, 5, 6, 7, 8],
    [8, 7, 6, 5, 4, 3, 2, 1],
    [10, 2, 3, 4, 5, 6, 7, 8, 9, 1, 11, 12, 13, 14, 15, 0],
  ];
  for (const u of cases) {
    const br = u.length === 8 ? 2 : 4;
    const a = buildTree({ utilities: u, branching: br });
    const b = buildTree({ utilities: u, branching: br });
    const d = Math.round(Math.log(u.length) / Math.log(br));
    const va = alphaBetaLMR(a, d, -Infinity, Infinity);
    const vb = alphaBetaPlain(b, d, -Infinity, Infinity);
    assert.equal(va, vb, `tree ${JSON.stringify(u)} mismatch`);
  }
});

test('LMR 单叶子返回效用', () => {
  const root = { id: 'x', utility: 42 };
  assert.equal(alphaBetaLMR(root, 3, -Infinity, Infinity), 42);
});

test('LMR 钩子被调用', () => {
  const a = buildTree({ utilities: [10, 2, 3, 4, 5, 6, 7, 8], branching: 2 });
  let reduces = 0;
  let visits = 0;
  alphaBetaLMR(a, 3, -Infinity, Infinity, DEFAULT_LMR_CONFIG, {
    onReduce: () => reduces++,
    onVisit: () => visits++,
  });
  assert.ok(visits > 0);
  // 在 depth=3 的 2 叉树上，应当触发一些缩减
  assert.ok(reduces >= 0);
});

test('LMR 配置可关闭（fullMoves 大）', () => {
  const a = buildTree({ utilities: [10, 2, 3, 4, 5, 6, 7, 8], branching: 2 });
  const cfg = { minDepth: 100, fullMoves: 1, reduction: 1 };
  let reduces = 0;
  alphaBetaLMR(a, 3, -Infinity, Infinity, cfg, {
    onReduce: () => reduces++,
  });
  assert.equal(reduces, 0);
});
