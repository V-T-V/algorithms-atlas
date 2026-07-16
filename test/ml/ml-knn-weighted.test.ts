import { test } from 'node:test';
import assert from 'node:assert/strict';
import { weightedKnn, type Sample } from '../../src/algorithms/ml/ml-knn-weighted/impl.ts';
test('加权KNN 分类', () => {
  const train: Sample[] = [
    { x: [0, 0], y: 0 },
    { x: [0.1, 0.1], y: 0 },
    { x: [5, 5], y: 1 },
    { x: [5.1, 5.1], y: 1 },
  ];
  assert.equal(weightedKnn(train, [0.2, 0.2], 3), 0);
  assert.equal(weightedKnn(train, [4.9, 4.9], 3), 1);
});
