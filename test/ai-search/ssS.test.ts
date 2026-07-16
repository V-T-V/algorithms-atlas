import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  sssStar,
  minimaxRef,
  buildTree,
  DEFAULT_SSS_CONFIG,
} from '../../src/algorithms/ai-search/ssS/impl.ts';

test('SSS* 与 minimax 一致（3 叉深 2）', () => {
  const utils = [3, 5, 2, 9, 1, 7, 4, 6, 8];
  const a = buildTree(utils, 3);
  const b = buildTree(utils, 3);
  const va = sssStar(a, DEFAULT_SSS_CONFIG);
  const vb = minimaxRef(b);
  assert.equal(va, vb);
});

test('SSS* 单叶子返回效用', () => {
  const root = { id: 'x', type: 'max' as const, utility: 42 };
  assert.equal(sssStar(root), 42);
});

test('SSS* 在多棵小树上与 minimax 一致', () => {
  const cases = [
    [1, 2, 3, 4],
    [9, 3, 7, 1, 6, 2, 8, 4],
    [10, 2, 8, 4, 6, 1, 9, 3],
  ];
  for (const u of cases) {
    const br = u.length === 4 ? 2 : 2;
    const a = buildTree(u, br);
    const b = buildTree(u, br);
    const va = sssStar(a, DEFAULT_SSS_CONFIG);
    const vb = minimaxRef(b);
    assert.equal(va, vb, `tree ${JSON.stringify(u)} mismatch`);
  }
});

test('SSS* 钩子被调用', () => {
  const a = buildTree([1, 2, 3, 4], 2);
  let pops = 0;
  let leaves = 0;
  sssStar(a, DEFAULT_SSS_CONFIG, {
    onPop: () => pops++,
    onLeaf: () => leaves++,
  });
  assert.ok(pops > 0);
  assert.ok(leaves >= 1);
});

test('SSS* 二叉深度 3 与 minimax 一致', () => {
  const utils = [10, 2, 8, 4, 6, 1, 9, 3];
  const a = buildTree(utils, 2);
  const b = buildTree(utils, 2);
  assert.equal(sssStar(a, DEFAULT_SSS_CONFIG), minimaxRef(b));
});
