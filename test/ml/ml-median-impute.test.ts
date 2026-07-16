import { test } from 'node:test';
import assert from 'node:assert/strict';
import { medianImpute } from '../../src/algorithms/ml/ml-median-impute/impl.ts';
test('中位数填充', () => {
  assert.deepEqual(medianImpute([1, null, 3]), [1, 2, 3]);
});
