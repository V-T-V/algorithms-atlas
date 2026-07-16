import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyBoatsLife } from '../../src/algorithms/greedy/greedy-boats-life/impl.ts';

test('greedy-boats-life [1,2] limit=3 = 1', () => {
  assert.equal(greedyBoatsLife([1, 2], 3), 1);
});

test('greedy-boats-life [3,2,2,1] limit=3 = 3', () => {
  assert.equal(greedyBoatsLife([3, 2, 2, 1], 3), 3);
});

test('greedy-boats-life [3,5,3,4] limit=5 = 4', () => {
  assert.equal(greedyBoatsLife([3, 5, 3, 4], 5), 4);
});

test('greedy-boats-life 每人独占', () => {
  assert.equal(greedyBoatsLife([5, 5, 5, 5], 5), 4);
});
