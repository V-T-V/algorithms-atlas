import { test } from 'node:test';
import assert from 'node:assert/strict';
import { covarianceMatrix } from '../../src/algorithms/ml/ml-covariance-matrix/impl.ts';
test('协方差对称', () => {
  const c = covarianceMatrix([
    [1, 2],
    [3, 4],
    [5, 6],
  ]);
  assert.equal(c[0]![1]!, c[1]![0]!);
});
