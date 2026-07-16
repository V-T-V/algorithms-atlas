import { test } from 'node:test';
import assert from 'node:assert/strict';
import { softmaxStable } from '../../src/algorithms/ml/ml-softmax-num-stable/impl.ts';
test('softmax 和为1', () => {
  assert.ok(Math.abs(softmaxStable([1, 2, 3]).reduce((a, b) => a + b, 0) - 1) < 1e-9);
});
test('softmax 大值不溢出', () => {
  assert.ok(softmaxStable([1000, 1000, 1000]).every((v) => v > 0 && v < 2));
});
test('softmax 空数组', () => {
  assert.deepEqual(softmaxStable([]), []);
});
