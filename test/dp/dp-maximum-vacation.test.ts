import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maxVacationDays } from '../../src/algorithms/dp/dp-maximum-vacation/impl.ts';

test('maximum-vacation LeetCode 568 例 1', () => {
  assert.equal(
    maxVacationDays(
      [
        [0, 1, 1],
        [1, 0, 1],
        [1, 1, 0],
      ],
      [
        [1, 3, 1],
        [6, 0, 3],
        [3, 3, 3],
      ],
    ),
    12,
  );
});

test('maximum-vacation LeetCode 568 例 2', () => {
  assert.equal(
    maxVacationDays(
      [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ],
      [
        [1, 1, 1],
        [7, 7, 7],
        [7, 7, 7],
      ],
    ),
    3,
  );
});

test('maximum-vacation 单城单周', () => {
  assert.equal(maxVacationDays([[0]], [[5]]), 5);
});

test('maximum-vacation 单城多周', () => {
  assert.equal(maxVacationDays([[0]], [[2, 3, 4]]), 9);
});
