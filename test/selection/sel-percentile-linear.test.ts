import { test } from 'node:test';
import assert from 'node:assert/strict';
import { percentileLinear } from '../../src/algorithms/selection/sel-percentile-linear/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-percentile-linear/trace.ts';

test('percentile linear p50 = 中位数', () => {
  assert.equal(percentileLinear([1, 2, 3, 4, 5], 50), 3);
});
test('percentile linear p0 = 最小', () => assert.equal(percentileLinear([5, 1, 3], 0), 1));
test('percentile linear p100 = 最大', () => assert.equal(percentileLinear([5, 1, 3], 100), 5));
test('percentile linear 插值', () => assert.equal(percentileLinear([1, 2], 50), 1.5));
test('percentile linear trace 非空', () => assert.ok(buildTrace().length > 0));
