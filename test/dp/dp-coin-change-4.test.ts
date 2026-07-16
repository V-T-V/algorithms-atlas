import { test } from 'node:test';
import assert from 'node:assert/strict';
import { coinChangeCompare } from '../../src/algorithms/dp/dp-coin-change-4/impl.ts';

test('coin-change 贪心失败示例 [1,3,4] amount=6', () => {
  const r = coinChangeCompare([1, 3, 4], 6);
  assert.equal(r.dp, 2);
  assert.equal(r.greedy, 3);
  assert.equal(r.greedyOptimal, false);
});

test('coin-change 贪心最优示例 [1,5,10,25] amount=41', () => {
  const r = coinChangeCompare([1, 5, 10, 25], 41);
  assert.equal(r.dp, 5);
  assert.equal(r.greedyOptimal, true);
});

test('coin-change 无法凑出', () => {
  const r = coinChangeCompare([2], 3);
  assert.equal(r.dp, -1);
});
