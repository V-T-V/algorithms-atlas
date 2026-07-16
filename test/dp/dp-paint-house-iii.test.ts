import { test } from 'node:test';
import assert from 'node:assert/strict';
import { minCostPaintHouseIII } from '../../src/algorithms/dp/dp-paint-house-iii/impl.ts';

test('paint-house-iii LeetCode 1473 例 1', () => {
  assert.equal(
    minCostPaintHouseIII(
      [0, 0, 0, 0, 0],
      [
        [1, 10],
        [10, 1],
        [10, 1],
        [1, 10],
        [5, 1],
      ],
      2,
      3,
    ),
    9,
  );
});

test('paint-house-iii LeetCode 1473 例 2', () => {
  assert.equal(
    minCostPaintHouseIII(
      [0, 2, 1, 2, 0],
      [
        [1, 10],
        [10, 1],
        [10, 1],
        [1, 10],
        [5, 1],
      ],
      2,
      3,
    ),
    11,
  );
});

test('paint-house-iii 不可行返回 -1', () => {
  assert.equal(
    minCostPaintHouseIII(
      [0, 0, 0, 0, 0],
      [
        [1, 10],
        [10, 1],
        [10, 1],
        [1, 10],
        [5, 1],
      ],
      2,
      5,
    ),
    -1,
  );
});

test('paint-house-iii 单栋单色', () => {
  assert.equal(minCostPaintHouseIII([0], [[5]], 1, 1), 5);
});
