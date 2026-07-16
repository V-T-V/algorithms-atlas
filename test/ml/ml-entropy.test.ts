import { test } from 'node:test';
import assert from 'node:assert/strict';
import { entropy } from '../../src/algorithms/ml/ml-entropy/impl.ts';
test('熵 完全纯=0', () => {
  assert.equal(entropy([10, 0]), 0);
});
test('熵 均分二类=1', () => {
  assert.ok(Math.abs(entropy([5, 5]) - 1) < 1e-9);
});
