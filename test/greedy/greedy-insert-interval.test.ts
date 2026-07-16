import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyInsertInterval } from '../../src/algorithms/greedy/greedy-insert-interval/impl.ts';

test('greedy-insert-interval 经典用例', () => {
  assert.deepEqual(
    greedyInsertInterval(
      [
        [1, 3],
        [6, 9],
      ],
      [2, 5],
    ),
    [
      [1, 5],
      [6, 9],
    ],
  );
});

test('greedy-insert-interval 无重叠', () => {
  assert.deepEqual(
    greedyInsertInterval(
      [
        [1, 2],
        [5, 6],
      ],
      [3, 4],
    ),
    [
      [1, 2],
      [3, 4],
      [5, 6],
    ],
  );
});

test('greedy-insert-interval 全合并', () => {
  assert.deepEqual(
    greedyInsertInterval(
      [
        [1, 2],
        [3, 4],
      ],
      [0, 5],
    ),
    [[0, 5]],
  );
});
