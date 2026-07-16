import { test } from 'node:test';
import assert from 'node:assert/strict';
import { zscoreOutliers, mean, std } from '../../src/algorithms/selection/sel-zscore/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-zscore/trace.ts';

test('mean/std 基础', () => {
  assert.equal(mean([1, 2, 3]), 2);
  assert.ok(Math.abs(std([1, 2, 3]) - 0.8165) < 0.001);
});
test('zscore 检测 100', () => {
  assert.deepEqual(zscoreOutliers([1, 2, 3, 4, 5, 6, 7, 8, 100], 2), [100]);
});
test('zscore 常数数组无离群点', () => assert.deepEqual(zscoreOutliers([5, 5, 5, 5]), []));
test('zscore trace 非空', () => assert.ok(buildTrace().length > 0));
