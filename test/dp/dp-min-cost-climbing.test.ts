import { test } from 'node:test';
import assert from 'node:assert/strict';
import { minCostClimbingStairs } from '../../src/algorithms/dp/dp-min-cost-climbing/impl.ts';

test('min-cost-climbing LeetCode 746 例 1', () => {
  assert.equal(minCostClimbingStairs([10, 15, 20]), 15);
});

test('min-cost-climbing LeetCode 746 例 2', () => {
  assert.equal(minCostClimbingStairs([1, 100, 1, 1, 1, 100, 1, 1, 100, 1]), 6);
});

test('min-cost-climbing 两阶', () => {
  assert.equal(minCostClimbingStairs([5, 10]), 5);
  assert.equal(minCostClimbingStairs([10, 5]), 5);
});

test('min-cost-climbing 单阶', () => {
  assert.equal(minCostClimbingStairs([7]), 0);
});

test('min-cost-climbing 空数组', () => {
  assert.equal(minCostClimbingStairs([]), 0);
});

test('min-cost-climbing 钩子', () => {
  let steps = 0;
  minCostClimbingStairs([1, 2, 3], { onStep: () => steps++ });
  assert.equal(steps, 3);
});
