import { test } from 'node:test';
import assert from 'node:assert/strict';
import { r2Score } from '../../src/algorithms/ml/ml-r2-score/impl.ts';
test('R² 完美=1', () => {
  assert.equal(r2Score([1, 2, 3], [1, 2, 3]), 1);
});
