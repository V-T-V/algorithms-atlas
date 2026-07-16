import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyMaxPerformance } from '../../src/algorithms/greedy/greedy-max-performance/impl.ts';

test('greedy-max-performance 经典用例 1', () => {
  assert.equal(greedyMaxPerformance(6, [2, 10, 3, 1, 5, 8], [5, 4, 3, 9, 7, 2], 2), 60);
});

test('greedy-max-performance 经典用例 2', () => {
  assert.equal(greedyMaxPerformance(3, [2, 8, 2], [2, 7, 1], 2), 56);
});

test('greedy-max-performance k=n', () => {
  const r = greedyMaxPerformance(3, [2, 8, 2], [2, 7, 1], 3);
  assert.ok(r > 0);
});
