import { test } from 'node:test';
import assert from 'node:assert/strict';
import { knapsack01 } from '../../src/algorithms/dp/dp-knap-4/impl.ts';

test('knap 经典', () => {
  assert.equal(knapsack01([2, 3, 4, 5], [3, 4, 5, 6], 8), 10);
});
test('knap 容量0', () => {
  assert.equal(knapsack01([1, 2], [5, 6], 0), 0);
});
test('knap 全装不下', () => {
  assert.equal(knapsack01([10], [100], 5), 0);
});
