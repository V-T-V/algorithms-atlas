import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyMinArrows } from '../../src/algorithms/greedy/greedy-min-arrows/impl.ts';

test('greedy-min-arrows 经典用例 = 2', () => {
  assert.equal(
    greedyMinArrows([
      [10, 16],
      [2, 8],
      [1, 6],
      [7, 12],
    ]),
    2,
  );
});

test('greedy-min-arrows 全重叠 = 1', () => {
  assert.equal(
    greedyMinArrows([
      [1, 5],
      [2, 4],
      [3, 6],
    ]),
    1,
  );
});

test('greedy-min-arrows 空 = 0', () => {
  assert.equal(greedyMinArrows([]), 0);
});
