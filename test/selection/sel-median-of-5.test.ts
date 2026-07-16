import { test } from 'node:test';
import assert from 'node:assert/strict';
import { medianOf5 } from '../../src/algorithms/selection/sel-median-of-5/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-median-of-5/trace.ts';

test('median of 5 正确', () => {
  assert.equal(medianOf5([1, 2, 3, 4, 5]), 3);
  assert.equal(medianOf5([5, 4, 3, 2, 1]), 3);
  assert.equal(medianOf5([9, 3, 7, 1, 8]), 7);
  assert.equal(medianOf5([10, 20, 30, 40, 50]), 30);
});
test('median of 5 重复元素', () => {
  assert.equal(medianOf5([2, 2, 2, 2, 2]), 2);
});
test('median of 5 trace 非空', () => assert.ok(buildTrace().length > 0));
