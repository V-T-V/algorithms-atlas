import { test } from 'node:test';
import assert from 'node:assert/strict';
import { iqrOutliers } from '../../src/algorithms/ml/ml-iqr-outlier/impl.ts';
test('IQR 检测离群', () => {
  assert.equal(iqrOutliers([1, 2, 3, 4, 100])[4], true);
});
