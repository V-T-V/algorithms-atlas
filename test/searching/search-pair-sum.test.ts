import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  twoSumSorted,
  type PairSumHooks,
} from '../../src/algorithms/searching/search-pair-sum/impl.ts';

test('twoSumSorted 命中', () => {
  assert.deepEqual(twoSumSorted([2, 7, 11, 15, 20, 25], 22), [1, 2]);
  assert.deepEqual(twoSumSorted([2, 7, 11, 15], 9), [0, 1]);
  assert.deepEqual(twoSumSorted([2, 7, 11, 15], 26), [2, 3]);
});
test('twoSumSorted 未命中', () => {
  assert.deepEqual(twoSumSorted([2, 7, 11, 15], 100), [-1, -1]);
  assert.deepEqual(twoSumSorted([2, 7, 11, 15], 10), [-1, -1]);
});
test('twoSumSorted 边界', () => {
  assert.deepEqual(twoSumSorted([], 1), [-1, -1]);
  assert.deepEqual(twoSumSorted([5], 5), [-1, -1]);
});
test('twoSumSorted 钩子', () => {
  let c = 0;
  twoSumSorted([2, 7, 11, 15], 9, { onCompare: () => c++ } as PairSumHooks);
  assert.ok(c >= 1);
});
