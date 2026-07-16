import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  quickSortMedian3,
  type QuickMedian3Hooks,
} from '../../src/algorithms/sorting/sort-quick-median3/impl.ts';

test('quickSortMedian3 基本', () => {
  assert.deepEqual(quickSortMedian3([]), []);
  assert.deepEqual(quickSortMedian3([1]), [1]);
  assert.deepEqual(quickSortMedian3([2, 1]), [1, 2]);
  assert.deepEqual(quickSortMedian3([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('quickSortMedian3 已排序不退化', () => {
  assert.deepEqual(quickSortMedian3([1, 2, 3, 4, 5, 6, 7, 8, 9]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  assert.deepEqual(quickSortMedian3([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
});
test('quickSortMedian3 重复', () => {
  assert.deepEqual(quickSortMedian3([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('quickSortMedian3 钩子', () => {
  let c = 0;
  quickSortMedian3([3, 1, 2], { onPartition: () => c++ } as QuickMedian3Hooks);
  assert.ok(c >= 1);
});
