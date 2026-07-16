import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findPaths } from '../../src/algorithms/dp/dp-out-of-boundary/impl.ts';

test('out-of-boundary LeetCode 576 例', () => {
  assert.equal(findPaths(2, 2, 2, 0, 0), 4);
  assert.equal(findPaths(1, 3, 3, 0, 1), 12);
});

test('out-of-boundary maxMove=0', () => {
  assert.equal(findPaths(3, 3, 0, 1, 1), 0);
});

test('out-of-boundary 角落一步', () => {
  // 2x2 角 (0,0)，1 步可向上、向左出界 → 2
  assert.equal(findPaths(2, 2, 1, 0, 0), 2);
});

test('out-of-boundary 单格', () => {
  // 1x1 任意一步都出界 → 4 步内每次 4 方向
  assert.equal(findPaths(1, 1, 1, 0, 0), 4);
  assert.equal(findPaths(1, 1, 2, 0, 0), 12); // 4 + 4*2 = 12
});

test('out-of-boundary 中心无法一步出界', () => {
  assert.equal(findPaths(3, 3, 1, 1, 1), 0);
});

test('out-of-boundary 钩子', () => {
  let steps = 0;
  findPaths(2, 2, 2, 0, 0, 1_000_000_007, { onStep: () => steps++ });
  assert.equal(steps, 2);
});
