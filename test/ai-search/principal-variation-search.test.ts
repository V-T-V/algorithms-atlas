import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  pvs,
  alphaBetaRef,
  buildTree,
} from '../../src/algorithms/ai-search/principal-variation-search/impl.ts';

test('PVS 与 alpha-beta 结果一致（3 叶深 2 树）', () => {
  const utils = [3, 5, 2, 9, 1, 7, 4, 6, 8];
  const a = buildTree([...utils], 3);
  const b = buildTree([...utils], 3);
  const va = pvs(a, 2, -Infinity, Infinity);
  const vb = alphaBetaRef(b, 2, -Infinity, Infinity);
  assert.equal(va, vb);
});

test('PVS 单叶子返回效用', () => {
  const root = { id: 'x', utility: 42 };
  assert.equal(pvs(root, 3, -Infinity, Infinity), 42);
});

test('PVS 在多棵随机小树上与 alpha-beta 一致', () => {
  const cases = [
    [1, 2, 3, 4, 5, 6, 7, 8],
    [9, 3, 7, 1, 6, 2, 8, 4],
    [5, 5, 5, 5, 5, 5, 5, 5],
  ];
  for (const u of cases) {
    const a = buildTree([...u], 2);
    const b = buildTree([...u], 2);
    assert.equal(
      pvs(a, 3, -Infinity, Infinity),
      alphaBetaRef(b, 3, -Infinity, Infinity),
      `tree ${JSON.stringify(u)} mismatch`,
    );
  }
});

test('PVS 钩子被调用', () => {
  let enters = 0;
  let evals = 0;
  let returns = 0;
  const root = buildTree([1, 2, 3, 4, 5, 6, 7, 8, 9], 3);
  pvs(root, 2, -Infinity, Infinity, {
    onEnter: () => enters++,
    onEvaluate: () => evals++,
    onReturn: () => returns++,
  });
  assert.ok(enters > 0);
  assert.ok(evals >= 2);
  assert.ok(returns > 0);
});

test('PVS 二叉树深度 3 与 alpha-beta 一致', () => {
  const utils = [10, 2, 8, 4, 6, 1, 9, 3];
  const a = buildTree([...utils], 2);
  const b = buildTree([...utils], 2);
  assert.equal(pvs(a, 3, -Infinity, Infinity), alphaBetaRef(b, 3, -Infinity, Infinity));
});
