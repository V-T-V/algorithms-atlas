import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kFoldIndices } from '../../src/algorithms/ml/ml-kfold-cv/impl.ts';
test('K-Fold k=5', () => {
  const folds = kFoldIndices(10, 5);
  assert.equal(folds.length, 5);
  for (const f of folds) assert.equal(f.trainIdx.length + f.testIdx.length, 10);
});
