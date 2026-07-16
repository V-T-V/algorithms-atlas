import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kmeansPlusPlusInit } from '../../src/algorithms/ml/ml-kmeans-init-pp/impl.ts';
test('K-Means++ 选 k 个中心', () => {
  assert.equal(
    kmeansPlusPlusInit(
      [
        [0, 0],
        [1, 1],
        [5, 5],
        [6, 6],
      ],
      2,
      42,
    ).length,
    2,
  );
});
test('K-Means++ 可复现', () => {
  assert.deepEqual(
    kmeansPlusPlusInit([[0], [1], [2]], 2, 7),
    kmeansPlusPlusInit([[0], [1], [2]], 2, 7),
  );
});
