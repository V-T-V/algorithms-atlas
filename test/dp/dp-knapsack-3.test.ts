import { test } from 'node:test';
import assert from 'node:assert/strict';
import { knapsack01 } from '../../src/algorithms/dp/dp-knapsack-3/impl.ts';

test('knapsack01 经典例', () => {
  assert.equal(knapsack01([2, 3, 4, 5], [3, 4, 5, 6], 8), 10);
});

test('knapsack01 单物品', () => {
  assert.equal(knapsack01([5], [10], 5), 10);
});

test('knapsack01 容量不足', () => {
  assert.equal(knapsack01([5, 6], [10, 20], 4), 0);
});

test('knapsack01 空', () => {
  assert.equal(knapsack01([], [], 10), 0);
});
