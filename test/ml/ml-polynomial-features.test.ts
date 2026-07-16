import { test } from 'node:test';
import assert from 'node:assert/strict';
import { polynomialFeatures } from '../../src/algorithms/ml/ml-polynomial-features/impl.ts';
test('多项式 2^0..2^3', () => {
  assert.deepEqual(polynomialFeatures(2, 3), [1, 2, 4, 8]);
});
