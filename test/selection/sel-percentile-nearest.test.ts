import { test } from 'node:test';
import assert from 'node:assert/strict';
import { percentileNearest } from '../../src/algorithms/selection/sel-percentile-nearest/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-percentile-nearest/trace.ts';

test('percentile nearest p50', () => {
  const v = percentileNearest([1, 2, 3, 4, 5], 50);
  assert.ok(v === 3 || v === 4); // ceil(0.5*5)=3 → index 2 = 3
});
test('percentile nearest p100 = 最大', () => assert.equal(percentileNearest([5, 1, 3], 100), 5));
test('percentile nearest p0', () => assert.equal(percentileNearest([5, 1, 3], 0), 1));
test('percentile nearest trace 非空', () => assert.ok(buildTrace().length > 0));
