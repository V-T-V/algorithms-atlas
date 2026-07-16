import { test } from 'node:test';
import assert from 'node:assert/strict';
import { l2Regularization } from '../../src/algorithms/ml/ml-l2-regularize/impl.ts';
test('L2 (3,4) λ=1 = 12.5', () => {
  assert.equal(l2Regularization([3, 4], 1), 12.5);
});
