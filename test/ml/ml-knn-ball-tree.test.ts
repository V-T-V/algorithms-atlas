import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ballTreeKnn } from '../../src/algorithms/ml/ml-knn-ball-tree/impl.ts';
test('球树 KNN 距离', () => {
  const pts = [
    [0, 0],
    [1, 1],
    [5, 5],
    [6, 6],
  ];
  const d = ballTreeKnn(pts, [0.1, 0.1]);
  assert.ok(d < 0.2);
});
test('球树 空集', () => {
  assert.equal(ballTreeKnn([], [0, 0]), Infinity);
});
