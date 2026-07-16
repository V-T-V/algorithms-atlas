import { test } from 'node:test';
import assert from 'node:assert/strict';
import { minHeightShelves } from '../../src/algorithms/dp/dp-filling-bookcase/impl.ts';

test('filling-bookcase LeetCode 1105 例 1', () => {
  assert.equal(
    minHeightShelves(
      [
        [1, 1],
        [2, 3],
        [2, 3],
        [1, 1],
        [1, 1],
        [1, 1],
        [1, 2],
      ],
      4,
    ),
    6,
  );
});

test('filling-bookcase 单本书', () => {
  assert.equal(minHeightShelves([[3, 5]], 4), 5);
});

test('filling-bookcase 每本一层', () => {
  assert.equal(
    minHeightShelves(
      [
        [4, 2],
        [4, 3],
        [4, 1],
      ],
      4,
    ),
    6,
  );
});

test('filling-bookcase 全放一层', () => {
  assert.equal(
    minHeightShelves(
      [
        [1, 2],
        [1, 3],
        [1, 1],
      ],
      10,
    ),
    3,
  );
});

test('filling-bookcase 空', () => {
  assert.equal(minHeightShelves([], 4), 0);
});
