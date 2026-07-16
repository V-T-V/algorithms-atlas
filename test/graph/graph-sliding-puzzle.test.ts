import { test } from 'node:test';
import assert from 'node:assert/strict';
import { slidingPuzzle } from '../../src/algorithms/graph/graph-sliding-puzzle/impl.ts';

test('sliding-puzzle LeetCode 773 例 1', () => {
  assert.equal(
    slidingPuzzle([
      [1, 2, 3],
      [4, 0, 5],
    ]),
    1,
  );
});

test('sliding-puzzle LeetCode 773 例 2', () => {
  assert.equal(
    slidingPuzzle([
      [1, 2, 3],
      [5, 4, 0],
    ]),
    -1,
  );
});

test('sliding-puzzle LeetCode 773 例 3', () => {
  assert.equal(
    slidingPuzzle([
      [4, 1, 2],
      [5, 0, 3],
    ]),
    5,
  );
});

test('sliding-puzzle 已是目标', () => {
  assert.equal(
    slidingPuzzle([
      [1, 2, 3],
      [4, 5, 0],
    ]),
    0,
  );
});
