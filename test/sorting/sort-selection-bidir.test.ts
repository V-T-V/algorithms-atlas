import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  selectionSortBidir,
  type SelectionBidirHooks,
} from '../../src/algorithms/sorting/sort-selection-bidir/impl.ts';

test('sort-selection-bidir 基本排序', () => {
  assert.deepEqual(selectionSortBidir([]), []);
  assert.deepEqual(selectionSortBidir([1]), [1]);
  assert.deepEqual(selectionSortBidir([2, 1]), [1, 2]);
  assert.deepEqual(selectionSortBidir([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('sort-selection-bidir 逆序/重复', () => {
  assert.deepEqual(selectionSortBidir([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(selectionSortBidir([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('sort-selection-bidir 不修改原数组', () => {
  const input = [3, 1, 2];
  selectionSortBidir(input);
  assert.deepEqual(input, [3, 1, 2]);
});
test('sort-selection-bidir 钩子', () => {
  let c = 0;
  selectionSortBidir([3, 1, 2], { onCompare: () => c++ } as SelectionBidirHooks);
  assert.ok(c >= 1);
});
