import { test } from 'node:test';
import assert from 'node:assert/strict';
import { detectOutliers } from '../../src/algorithms/selection/sel-outlier-detect/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-outlier-detect/trace.ts';

test('outlier detect 100 是离群点', () => {
  const out = detectOutliers([1, 2, 3, 4, 5, 6, 7, 8, 100]);
  assert.deepEqual(out, [100]);
});
test('outlier detect 无离群点', () => {
  assert.deepEqual(detectOutliers([1, 2, 3, 4, 5]), []);
});
test('outlier detect trace 非空', () => assert.ok(buildTrace().length > 0));
