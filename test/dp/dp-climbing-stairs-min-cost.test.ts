import { test } from 'node:test';
import assert from 'node:assert/strict';
import { climbingStairsMinCost } from '../../src/algorithms/dp/dp-climbing-stairs-min-cost/impl.ts';

test('stairs-min-cost LeetCode 746 例 1', () => {
  assert.equal(climbingStairsMinCost([10, 15, 20]), 15);
});

test('stairs-min-cost LeetCode 746 例 2', () => {
  assert.equal(climbingStairsMinCost([1, 100, 1, 1, 1, 100, 1, 1, 100, 1]), 6);
});

test('stairs-min-cost 两阶', () => {
  assert.equal(climbingStairsMinCost([5, 10]), 5);
  assert.equal(climbingStairsMinCost([10, 5]), 5);
});

test('stairs-min-cost 单阶', () => {
  assert.equal(climbingStairsMinCost([7]), 0);
});

test('stairs-min-cost 空', () => {
  assert.equal(climbingStairsMinCost([]), 0);
});

test('stairs-min-cost 钩子', () => {
  let steps = 0;
  climbingStairsMinCost([1, 2, 3], { onStep: () => steps++ });
  assert.equal(steps, 3);
});
