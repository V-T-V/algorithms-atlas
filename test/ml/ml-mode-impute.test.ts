import { test } from 'node:test';
import assert from 'node:assert/strict';
import { modeImpute } from '../../src/algorithms/ml/ml-mode-impute/impl.ts';
test('众数填充', () => {
  assert.deepEqual(modeImpute([1, null, 1, null]), [1, 1, 1, 1]);
});
