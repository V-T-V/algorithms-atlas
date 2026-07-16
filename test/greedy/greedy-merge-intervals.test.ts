import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyMergeIntervals } from '../../src/algorithms/greedy/greedy-merge-intervals/impl.ts';

test('greedy-merge-intervals 经典用例', () => {
  assert.deepEqual(
    greedyMergeIntervals([
      [1, 3],
      [2, 6],
      [8, 10],
      [15, 18],
    ]),
    [
      [1, 6],
      [8, 10],
      [15, 18],
    ],
  );
});

test('greedy-merge-intervals 全重叠合并', () => {
  assert.deepEqual(
    greedyMergeIntervals([
      [1, 4],
      [4, 5],
    ]),
    [[1, 5]],
  );
});

test('greedy-merge-intervals 空', () => {
  assert.deepEqual(greedyMergeIntervals([]), []);
});
