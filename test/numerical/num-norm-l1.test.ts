import { test } from 'node:test';
import assert from 'node:assert/strict';
import { l1Norm, l2Norm, linfNorm } from '../../src/algorithms/numerical/num-norm-l1/impl.ts';
test('L1', () => {
  assert.equal(l1Norm([3, -4]), 7);
});
test('L2', () => {
  assert.equal(l2Norm([3, 4]), 5);
});
test('Linf', () => {
  assert.equal(linfNorm([3, -5, 2]), 5);
});
