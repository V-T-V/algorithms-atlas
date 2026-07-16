import { test } from 'node:test';
import assert from 'node:assert/strict';
import { blockMergeSort } from '../../src/algorithms/sorting/sort-block-merge/impl.ts';

test('blockMergeSort 基本排序', () => {
  assert.deepEqual(blockMergeSort([]), []);
  assert.deepEqual(blockMergeSort([1]), [1]);
  assert.deepEqual(blockMergeSort([5, 2, 8, 1, 9, 3, 7, 4, 6, 0]), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('blockMergeSort 已有序/逆序/重复', () => {
  assert.deepEqual(blockMergeSort([1, 2, 3, 4]), [1, 2, 3, 4]);
  assert.deepEqual(blockMergeSort([4, 3, 2, 1]), [1, 2, 3, 4]);
  assert.deepEqual(blockMergeSort([3, 1, 3, 2, 1]), [1, 1, 2, 3, 3]);
});

test('blockMergeSort 不修改原数组', () => {
  const input = [3, 1, 2];
  blockMergeSort(input);
  assert.deepEqual(input, [3, 1, 2]);
});

test('blockMergeSort 钩子被调用', () => {
  let blocks = 0;
  let merges = 0;
  blockMergeSort([3, 1, 2, 5, 4], {
    onBlockSorted: () => blocks++,
    onBlocksMerged: () => merges++,
  });
  assert.ok(blocks >= 1);
  assert.ok(merges >= 1);
});
