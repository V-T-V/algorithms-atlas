import { test } from 'node:test';
import assert from 'node:assert/strict';
import { longestIncreasingPath } from '../../src/algorithms/dp/dp-longest-increasing-path/impl.ts';

test('lip LeetCode 329 例', () => {
  assert.equal(
    longestIncreasingPath([
      [9, 9, 4],
      [6, 6, 8],
      [2, 1, 1],
    ]),
    4, // 1->2->6->9
  );
});

test('lip 单格', () => {
  assert.equal(longestIncreasingPath([[5]]), 1);
});

test('lip 全相同', () => {
  assert.equal(
    longestIncreasingPath([
      [1, 1],
      [1, 1],
    ]),
    1,
  );
});

test('lip 严格递增链', () => {
  assert.equal(
    longestIncreasingPath([
      [1, 2, 3],
      [6, 5, 4],
      [7, 8, 9],
    ]),
    9,
  );
});

test('lip 空矩阵', () => {
  assert.equal(longestIncreasingPath([]), 0);
});

test('lip 钩子', () => {
  let visits = 0;
  longestIncreasingPath(
    [
      [1, 2],
      [3, 4],
    ],
    { onVisit: () => visits++ },
  );
  assert.equal(visits, 4);
});
