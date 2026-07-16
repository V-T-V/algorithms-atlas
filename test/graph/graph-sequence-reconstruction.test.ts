import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sequenceReconstruction } from '../../src/algorithms/graph/graph-sequence-reconstruction/impl.ts';

test('sequence-reconstruction LeetCode 444 例 1', () => {
  assert.equal(
    sequenceReconstruction(
      [4, 1, 5, 2, 6, 3],
      [
        [5, 2, 6, 3],
        [4, 1, 5, 2],
      ],
    ),
    true,
  );
});

test('sequence-reconstruction LeetCode 444 例 2', () => {
  assert.equal(
    sequenceReconstruction(
      [1, 2, 3],
      [
        [1, 2],
        [1, 3],
      ],
    ),
    false,
  );
});

test('sequence-reconstruction LeetCode 444 例 3', () => {
  assert.equal(sequenceReconstruction([1, 2, 3], [[1, 2]]), false);
});

test('sequence-reconstruction 单元素', () => {
  assert.equal(sequenceReconstruction([1], [[1]]), true);
});

test('sequence-reconstruction 空', () => {
  assert.equal(sequenceReconstruction([], []), true);
});
