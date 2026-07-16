import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  countInRange,
  type CountRangeHooks,
} from '../../src/algorithms/searching/search-count-range/impl.ts';

const A = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
test('countInRange 基本', () => {
  assert.equal(countInRange(A, 3, 7), 5);
  assert.equal(countInRange(A, 1, 10), 10);
  assert.equal(countInRange(A, 5, 5), 1);
});
test('countInRange 区间外', () => {
  assert.equal(countInRange(A, 0, 0), 0);
  assert.equal(countInRange(A, 11, 20), 0);
  assert.equal(countInRange(A, 5, 4), 0);
});
test('countInRange 边界', () => {
  assert.equal(countInRange([], 1, 2), 0);
  assert.equal(countInRange([5], 5, 5), 1);
});
test('countInRange 钩子', () => {
  let c = 0;
  countInRange(A, 3, 7, { onBound: () => c++ } as CountRangeHooks);
  assert.ok(c >= 1);
});
