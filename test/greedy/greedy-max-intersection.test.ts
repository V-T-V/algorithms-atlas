import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyMaxIntersection } from '../../src/algorithms/greedy/greedy-max-intersection/impl.ts';

test('greedy-max-intersection 经典用例', () => {
  const r = greedyMaxIntersection([
    [1, 5],
    [2, 6],
    [3, 8],
    [4, 7],
  ]);
  assert.equal(r.maxCount, 4);
});

test('greedy-max-intersection 无重叠', () => {
  const r = greedyMaxIntersection([
    [1, 2],
    [3, 4],
  ]);
  assert.equal(r.maxCount, 1);
});

test('greedy-max-intersection 单区间', () => {
  const r = greedyMaxIntersection([[0, 10]]);
  assert.equal(r.maxCount, 1);
});
