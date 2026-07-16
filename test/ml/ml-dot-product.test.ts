import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dot } from '../../src/algorithms/ml/ml-dot-product/impl.ts';
test('点积', () => {
  assert.equal(dot([1, 2, 3], [4, 5, 6]), 32);
});
test('点积 长度不匹配', () => {
  assert.throws(() => dot([1], [1, 2]), RangeError);
});
