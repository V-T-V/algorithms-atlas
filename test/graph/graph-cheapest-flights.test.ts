import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findCheapestPrice } from '../../src/algorithms/graph/graph-cheapest-flights/impl.ts';

test('cheapest-flights LeetCode 787 例 1', () => {
  assert.equal(
    findCheapestPrice(
      4,
      [
        [0, 1, 100],
        [1, 2, 100],
        [2, 0, 100],
        [1, 3, 600],
        [2, 3, 200],
      ],
      0,
      3,
      1,
    ),
    700,
  );
});

test('cheapest-flights LeetCode 787 例 2', () => {
  assert.equal(
    findCheapestPrice(
      3,
      [
        [0, 1, 100],
        [1, 2, 100],
        [0, 2, 500],
      ],
      0,
      2,
      1,
    ),
    200,
  );
});

test('cheapest-flights LeetCode 787 例 3', () => {
  assert.equal(
    findCheapestPrice(
      3,
      [
        [0, 1, 100],
        [1, 2, 100],
        [0, 2, 500],
      ],
      0,
      2,
      0,
    ),
    500,
  );
});

test('cheapest-flights 不可达', () => {
  assert.equal(findCheapestPrice(3, [[0, 1, 100]], 0, 2, 2), -1);
});

test('cheapest-flights src=dst', () => {
  assert.equal(findCheapestPrice(3, [[0, 1, 100]], 0, 0, 1), 0);
});
