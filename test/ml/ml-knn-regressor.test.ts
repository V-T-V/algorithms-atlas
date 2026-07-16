import { test } from 'node:test';
import assert from 'node:assert/strict';
import { knnRegressor, type Sample } from '../../src/algorithms/ml/ml-knn-regressor/impl.ts';
test('KNN 回归 线性', () => {
  const train: Sample[] = [
    { x: [0], y: 0 },
    { x: [1], y: 1 },
    { x: [2], y: 2 },
  ];
  const p = knnRegressor(train, [1.5], 2);
  assert.ok(p >= 1 && p <= 2);
});
test('KNN 回归 空集报错', () => {
  assert.throws(() => knnRegressor([], [0], 1), RangeError);
});
