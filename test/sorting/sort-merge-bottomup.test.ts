import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  mergeSortBottomUp,
  type MergeBottomUpHooks,
} from '../../src/algorithms/sorting/sort-merge-bottomup/impl.ts';

test('mergeSortBottomUp 基本', () => {
  assert.deepEqual(mergeSortBottomUp([]), []);
  assert.deepEqual(mergeSortBottomUp([1]), [1]);
  assert.deepEqual(mergeSortBottomUp([2, 1]), [1, 2]);
  assert.deepEqual(mergeSortBottomUp([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('mergeSortBottomUp 逆序/重复', () => {
  assert.deepEqual(mergeSortBottomUp([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(mergeSortBottomUp([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('mergeSortBottomUp 不修改原数组', () => {
  const input = [3, 1, 2];
  mergeSortBottomUp(input);
  assert.deepEqual(input, [3, 1, 2]);
});
test('mergeSortBottomUp 钩子', () => {
  let c = 0;
  mergeSortBottomUp([3, 1, 2], { onMerge: () => c++ } as MergeBottomUpHooks);
  assert.ok(c >= 1);
});
