import { test } from 'node:test';
import assert from 'node:assert/strict';
import { minkowskiDistance } from '../../src/algorithms/ml/ml-minkowski-dist/impl.ts';
test('L2 欧氏', () => {
  assert.equal(minkowskiDistance([0, 0], [3, 4], 2), 5);
});
test('L1 曼哈顿', () => {
  assert.equal(minkowskiDistance([0, 0], [3, 4], 1), 7);
});
test('Linf 切比雪夫', () => {
  assert.equal(minkowskiDistance([0, 0], [3, 4], Infinity), 4);
});
