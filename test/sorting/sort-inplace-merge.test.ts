import { test } from 'node:test';
import assert from 'node:assert/strict';
import { inplaceMergeSort } from '../../src/algorithms/sorting/sort-inplace-merge/impl.ts';

test('inplaceMergeSort 基本排序', () => {
  assert.deepEqual(inplaceMergeSort([]), []);
  assert.deepEqual(inplaceMergeSort([1]), [1]);
  assert.deepEqual(inplaceMergeSort([5, 2, 8, 1, 9, 3, 7, 4]), [1, 2, 3, 4, 5, 7, 8, 9]);
});

test('inplaceMergeSort 已有序/逆序/重复', () => {
  assert.deepEqual(inplaceMergeSort([1, 2, 3, 4]), [1, 2, 3, 4]);
  assert.deepEqual(inplaceMergeSort([4, 3, 2, 1]), [1, 2, 3, 4]);
  assert.deepEqual(inplaceMergeSort([2, 2, 1, 1]), [1, 1, 2, 2]);
});

test('inplaceMergeSort 不修改原数组', () => {
  const input = [3, 1, 2];
  inplaceMergeSort(input);
  assert.deepEqual(input, [3, 1, 2]);
});

test('inplaceMergeSort 钩子被调用', () => {
  let merges = 0;
  inplaceMergeSort([3, 1, 2], { onMerge: () => merges++ });
  assert.ok(merges >= 1);
});
