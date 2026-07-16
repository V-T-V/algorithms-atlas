import { test } from 'node:test';
import assert from 'node:assert/strict';
import { precisionRecall } from '../../src/algorithms/ml/ml-precision-recall/impl.ts';
test('PR 计算', () => {
  const r = precisionRecall([1, 1, 0, 0], [1, 0, 0, 0]);
  assert.equal(r.precision, 1);
  assert.equal(r.recall, 0.5);
});
