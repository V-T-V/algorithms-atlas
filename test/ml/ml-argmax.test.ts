import { test } from 'node:test';
import assert from 'node:assert/strict';
import { argmax, argmin } from '../../src/algorithms/ml/ml-argmax/impl.ts';
test('argmax', () => {
  assert.equal(argmax([1, 5, 3]), 1);
});
test('argmin', () => {
  assert.equal(argmin([1, 5, 3]), 0);
});
test('空数组报错', () => {
  assert.throws(() => argmax([]), RangeError);
});
