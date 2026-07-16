import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  bitonicSortIter,
  type BitonicIterHooks,
} from '../../src/algorithms/sorting/sort-bitonic-iter/impl.ts';

test('sort-bitonic-iter 基本排序', () => {
  assert.deepEqual(bitonicSortIter([]), []);
  assert.deepEqual(bitonicSortIter([1]), [1]);
  assert.deepEqual(bitonicSortIter([2, 1]), [1, 2]);
  assert.deepEqual(bitonicSortIter([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('sort-bitonic-iter 逆序/重复', () => {
  assert.deepEqual(bitonicSortIter([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(bitonicSortIter([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('sort-bitonic-iter 不修改原数组', () => {
  const input = [3, 1, 2];
  bitonicSortIter(input);
  assert.deepEqual(input, [3, 1, 2]);
});
test('sort-bitonic-iter 钩子', () => {
  let c = 0;
  bitonicSortIter([3, 1, 2], { onCompare: () => c++ } as BitonicIterHooks);
  assert.ok(c >= 1);
});
