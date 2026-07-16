import { test } from 'node:test';
import assert from 'node:assert/strict';
import { l1Regularization } from '../../src/algorithms/ml/ml-l1-regularize/impl.ts';
test('L1 (3,-4) λ=1 = 7', () => {
  assert.equal(l1Regularization([3, -4], 1), 7);
});
