import { test } from 'node:test';
import assert from 'node:assert/strict';
import { meanVector } from '../../src/algorithms/ml/ml-mean-vector/impl.ts';
test('均值向量', () => {
  assert.deepEqual(
    meanVector([
      [1, 2],
      [3, 4],
    ]),
    [2, 3],
  );
});
test('空矩阵', () => {
  assert.deepEqual(meanVector([]), []);
});
