import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mse } from '../../src/algorithms/ml/ml-mse-loss/impl.ts';
test('MSE 完美=0', () => {
  assert.equal(mse([1, 2, 3], [1, 2, 3]), 0);
});
test('MSE 计算', () => {
  assert.equal(mse([1, 2], [2, 3]), 1);
});
