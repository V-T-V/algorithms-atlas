import { test } from 'node:test';
import assert from 'node:assert/strict';
import { leakyRelu } from '../../src/algorithms/ml/ml-leaky-relu/impl.ts';
test('LeakyReLU 正数不变', () => {
  assert.equal(leakyRelu(3), 3);
});
test('LeakyReLU 负数缩放', () => {
  assert.ok(Math.abs(leakyRelu(-4, 0.01) - -0.04) < 1e-9);
});
