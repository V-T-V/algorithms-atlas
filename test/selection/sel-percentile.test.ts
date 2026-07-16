import { test } from 'node:test';
import assert from 'node:assert/strict';
import { percentile, percentiles } from '../../src/algorithms/selection/sel-percentile/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-percentile/trace.ts';

test('sel-percentile 中位数 p=50', () => {
  assert.equal(percentile([1, 2, 3, 4, 5], 50), 3);
});

test('sel-percentile p=0 和 p=100', () => {
  assert.equal(percentile([3, 1, 2], 0), 1);
  assert.equal(percentile([3, 1, 2], 100), 3);
});

test('sel-percentile 插值', () => {
  // [1..10], p=25 -> rank=2.25 -> 3 + 0.25*(4-3) = 3.25
  assert.equal(percentile([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 25), 3.25);
});

test('sel-percentile 多个', () => {
  assert.deepEqual(percentiles([1, 2, 3, 4, 5], [0, 50, 100]), [1, 3, 5]);
});

test('sel-percentile 越界抛错', () => {
  assert.throws(() => percentile([1], -1));
  assert.throws(() => percentile([1], 101));
});

test('sel-percentile trace', () => {
  assert.ok(buildTrace().length > 2);
});
