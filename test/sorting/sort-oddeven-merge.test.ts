import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  oddEvenMergeSort,
  type OddEvenMergeHooks,
} from '../../src/algorithms/sorting/sort-oddeven-merge/impl.ts';

test('sort-oddeven-merge 基本排序', () => {
  assert.deepEqual(oddEvenMergeSort([]), []);
  assert.deepEqual(oddEvenMergeSort([1]), [1]);
  assert.deepEqual(oddEvenMergeSort([2, 1]), [1, 2]);
  assert.deepEqual(oddEvenMergeSort([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('sort-oddeven-merge 逆序/重复', () => {
  assert.deepEqual(oddEvenMergeSort([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(oddEvenMergeSort([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('sort-oddeven-merge 不修改原数组', () => {
  const input = [3, 1, 2];
  oddEvenMergeSort(input);
  assert.deepEqual(input, [3, 1, 2]);
});
test('sort-oddeven-merge 钩子', () => {
  let c = 0;
  oddEvenMergeSort([3, 1, 2], { onCompare: () => c++ } as OddEvenMergeHooks);
  assert.ok(c >= 1);
});
