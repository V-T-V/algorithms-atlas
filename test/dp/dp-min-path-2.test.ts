import { test } from 'node:test';
import assert from 'node:assert/strict';
import { minPathSumObstacle } from '../../src/algorithms/dp/dp-min-path-2/impl.ts';

test('min-path 无障碍', () => {
  assert.equal(
    minPathSumObstacle(
      [
        [1, 3, 1],
        [1, 5, 1],
        [4, 2, 1],
      ],
      undefined,
    ),
    7,
  );
});

test('min-path 中央障碍', () => {
  assert.equal(
    minPathSumObstacle(
      [
        [1, 3, 1],
        [1, 5, 1],
        [4, 2, 1],
      ],
      [
        [false, false, false],
        [false, true, false],
        [false, false, false],
      ],
    ),
    9,
  );
});

test('min-path 终点障碍', () => {
  assert.equal(minPathSumObstacle([[1, 2]], [[false, true]]), -1);
});
