import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  selectionSortNaive,
  type SelectionNaiveHooks,
} from '../../src/algorithms/sorting/sort-selection-naive/impl.ts';

test('sort-selection-naive 基本排序', () => {
  assert.deepEqual(selectionSortNaive([]), []);
  assert.deepEqual(selectionSortNaive([1]), [1]);
  assert.deepEqual(selectionSortNaive([2, 1]), [1, 2]);
  assert.deepEqual(selectionSortNaive([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('sort-selection-naive 逆序/重复', () => {
  assert.deepEqual(selectionSortNaive([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(selectionSortNaive([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('sort-selection-naive 不修改原数组', () => {
  const input = [3, 1, 2];
  selectionSortNaive(input);
  assert.deepEqual(input, [3, 1, 2]);
});
test('sort-selection-naive 钩子', () => {
  let c = 0;
  selectionSortNaive([3, 1, 2], { onCompare: () => c++ } as SelectionNaiveHooks);
  assert.ok(c >= 1);
});
