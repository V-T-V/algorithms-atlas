import { test } from 'node:test';
import assert from 'node:assert/strict';
import { relu, reluArray } from '../../src/algorithms/ml/ml-relu-activation/impl.ts';
test('ReLU 负数为0', () => {
  assert.equal(relu(-5), 0);
});
test('ReLU 数组', () => {
  assert.deepEqual(reluArray([-1, 0, 2]), [0, 0, 2]);
});
