import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  mergeSortInplace2,
  type MergeInplace2Hooks,
} from '../../src/algorithms/sorting/sort-merge-inplace-2/impl.ts';

test('mergeSortInplace2 基本', () => {
  assert.deepEqual(mergeSortInplace2([]), []);
  assert.deepEqual(mergeSortInplace2([1]), [1]);
  assert.deepEqual(mergeSortInplace2([2, 1]), [1, 2]);
  assert.deepEqual(mergeSortInplace2([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('mergeSortInplace2 逆序/重复', () => {
  assert.deepEqual(mergeSortInplace2([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(mergeSortInplace2([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('mergeSortInplace2 钩子', () => {
  let c = 0;
  mergeSortInplace2([3, 1, 2], { onMerge: () => c++ } as MergeInplace2Hooks);
  assert.ok(c >= 1);
});
