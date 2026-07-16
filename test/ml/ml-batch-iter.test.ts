import { test } from 'node:test';
import assert from 'node:assert/strict';
import { miniBatchIter } from '../../src/algorithms/ml/ml-batch-iter/impl.ts';
test('Mini-Batch 切分', () => {
  const batches = Array.from(miniBatchIter([1, 2, 3, 4, 5], 2));
  assert.equal(batches.length, 3);
  assert.deepEqual(batches[2], [5]);
});
test('batch<=0 报错', () => {
  assert.throws(() => Array.from(miniBatchIter([1], 0)), RangeError);
});
