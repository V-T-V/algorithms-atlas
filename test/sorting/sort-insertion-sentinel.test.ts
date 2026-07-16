import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  insertionSortSentinel,
  type InsertSentinelHooks,
} from '../../src/algorithms/sorting/sort-insertion-sentinel/impl.ts';

test('sort-insertion-sentinel 基本排序', () => {
  assert.deepEqual(insertionSortSentinel([]), []);
  assert.deepEqual(insertionSortSentinel([1]), [1]);
  assert.deepEqual(insertionSortSentinel([2, 1]), [1, 2]);
  assert.deepEqual(insertionSortSentinel([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('sort-insertion-sentinel 逆序/重复', () => {
  assert.deepEqual(insertionSortSentinel([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(insertionSortSentinel([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('sort-insertion-sentinel 不修改原数组', () => {
  const input = [3, 1, 2];
  insertionSortSentinel(input);
  assert.deepEqual(input, [3, 1, 2]);
});
test('sort-insertion-sentinel 钩子', () => {
  let c = 0;
  insertionSortSentinel([3, 1, 2], { onCompare: () => c++ } as InsertSentinelHooks);
  assert.ok(c >= 1);
});
