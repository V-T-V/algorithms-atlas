import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  mergeSortTopDown,
  type MergeTopDownHooks,
} from '../../src/algorithms/sorting/sort-merge-topdown/impl.ts';

test('mergeSortTopDown 基本', () => {
  assert.deepEqual(mergeSortTopDown([]), []);
  assert.deepEqual(mergeSortTopDown([1]), [1]);
  assert.deepEqual(mergeSortTopDown([2, 1]), [1, 2]);
  assert.deepEqual(mergeSortTopDown([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('mergeSortTopDown 逆序/重复', () => {
  assert.deepEqual(mergeSortTopDown([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(mergeSortTopDown([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('mergeSortTopDown 不修改原数组', () => {
  const input = [3, 1, 2];
  mergeSortTopDown(input);
  assert.deepEqual(input, [3, 1, 2]);
});
test('mergeSortTopDown 钩子', () => {
  let c = 0;
  mergeSortTopDown([3, 1, 2], { onMerge: () => c++ } as MergeTopDownHooks);
  assert.ok(c >= 1);
});
