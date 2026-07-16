import { test } from 'node:test';
import assert from 'node:assert/strict';
import { minPathSum } from '../../src/algorithms/dp/dp-minpath-3/impl.ts';

test('minpath 经典', () => {
  assert.equal(
    minPathSum([
      [1, 3, 1],
      [1, 5, 1],
      [4, 2, 1],
    ]),
    7,
  );
});
test('minpath 1x1', () => {
  assert.equal(minPathSum([[5]]), 5);
});
test('minpath 单行', () => {
  assert.equal(minPathSum([[1, 2, 3]]), 6);
});
