import { test } from 'node:test';
import assert from 'node:assert/strict';
import { zScoreOutliers } from '../../src/algorithms/ml/ml-outlier-zscore/impl.ts';
test('检测离群点', () => {
  const flags = zScoreOutliers([1, 2, 3, 4, 5, 50], 2);
  assert.equal(flags[5], true);
  assert.equal(flags[0], false);
});
