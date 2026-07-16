import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  mergeSortInsert,
  type MergeInsertHooks,
} from '../../src/algorithms/sorting/sort-merge-insert/impl.ts';

test('mergeSortInsert 基本', () => {
  assert.deepEqual(mergeSortInsert([]), []);
  assert.deepEqual(mergeSortInsert([1]), [1]);
  assert.deepEqual(mergeSortInsert([2, 1]), [1, 2]);
  assert.deepEqual(mergeSortInsert([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('mergeSortInsert 逆序/重复', () => {
  assert.deepEqual(mergeSortInsert([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(mergeSortInsert([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('mergeSortInsert 大数组', () => {
  const big = Array.from({ length: 100 }, (_, i) => (i * 37) % 100);
  const sorted = [...big].sort((a, b) => a - b);
  assert.deepEqual(mergeSortInsert(big), sorted);
});
test('mergeSortInsert 钩子', () => {
  let c = 0;
  mergeSortInsert(
    Array.from({ length: 50 }, (_, i) => 50 - i),
    { onMerge: () => c++ } as MergeInsertHooks,
  );
  assert.ok(c >= 1);
});
