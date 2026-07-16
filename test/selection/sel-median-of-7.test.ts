import { test } from 'node:test';
import assert from 'node:assert/strict';
import { medianOf7 } from '../../src/algorithms/selection/sel-median-of-7/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-median-of-7/trace.ts';

test('median of 7 正确', () => {
  assert.equal(medianOf7([1, 2, 3, 4, 5, 6, 7]), 4);
  assert.equal(medianOf7([7, 6, 5, 4, 3, 2, 1]), 4);
  assert.equal(medianOf7([9, 3, 7, 1, 8, 5, 2]), 5);
});
test('median of 7 重复', () => assert.equal(medianOf7([3, 3, 3, 3, 3, 3, 3]), 3));
test('median of 7 trace 非空', () => assert.ok(buildTrace().length > 0));
