import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tilingDomino2xN } from '../../src/algorithms/dp/dp-tiling/impl.ts';

test('tiling 基础 Fibonacci 值', () => {
  // dp[0..6] = 1,1,2,3,5,8,13
  assert.equal(tilingDomino2xN(0).ways, 1);
  assert.equal(tilingDomino2xN(1).ways, 1);
  assert.equal(tilingDomino2xN(2).ways, 2);
  assert.equal(tilingDomino2xN(3).ways, 3);
  assert.equal(tilingDomino2xN(4).ways, 5);
  assert.equal(tilingDomino2xN(5).ways, 8);
  assert.equal(tilingDomino2xN(6).ways, 13);
});

test('tiling n=10 = 89', () => {
  assert.equal(tilingDomino2xN(10).ways, 89);
});

test('tiling 负数 = 0', () => {
  assert.equal(tilingDomino2xN(-1).ways, 0);
});

test('tiling 钩子被调用', () => {
  let steps = 0;
  tilingDomino2xN(5, { onStep: () => steps++ });
  assert.equal(steps, 6); // 0..5 共 6 步
});
