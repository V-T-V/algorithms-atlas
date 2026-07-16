import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sigmoid } from '../../src/algorithms/ml/ml-sigmoid-activation/impl.ts';
test('sigmoid(0)=0.5', () => {
  assert.ok(Math.abs(sigmoid(0) - 0.5) < 1e-9);
});
test('sigmoid 大正数≈1', () => {
  assert.ok(sigmoid(100) > 0.99);
});
