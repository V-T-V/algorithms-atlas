import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  naturalMergeSort,
  findRuns,
} from '../../src/algorithms/sorting/merge-sort-natural/impl.ts';

test('naturalMergeSort 基本排序', () => {
  assert.deepEqual(naturalMergeSort([]), []);
  assert.deepEqual(naturalMergeSort([1]), [1]);
  assert.deepEqual(naturalMergeSort([2, 1]), [1, 2]);
  assert.deepEqual(naturalMergeSort([1, 3, 5, 2, 4, 8, 6, 7, 0]), [0, 1, 2, 3, 4, 5, 6, 7, 8]);
});

test('naturalMergeSort 已有序 / 逆序 / 重复', () => {
  assert.deepEqual(naturalMergeSort([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
  assert.deepEqual(naturalMergeSort([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(naturalMergeSort([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});

test('findRuns 识别天然有序段', () => {
  assert.deepEqual(findRuns([]), [0]);
  assert.deepEqual(findRuns([5]), [0, 1]);
  // [1,3,5] [2,4,8] [6,7] [0]
  assert.deepEqual(findRuns([1, 3, 5, 2, 4, 8, 6, 7, 0]), [0, 3, 6, 8, 9]);
  assert.deepEqual(findRuns([1, 2, 3]), [0, 3]); // 整段有序
  assert.deepEqual(findRuns([3, 2, 1]), [0, 1, 2, 3]); // 每元素一段
});

test('naturalMergeSort 不修改原数组', () => {
  const input = [3, 1, 2];
  naturalMergeSort(input);
  assert.deepEqual(input, [3, 1, 2]);
});

test('naturalMergeSort 钩子被调用', () => {
  let runs = 0;
  let merges = 0;
  let rounds = 0;
  naturalMergeSort([3, 1, 2], {
    onRun: () => runs++,
    onMerge: () => merges++,
    onRound: () => rounds++,
  });
  assert.ok(runs >= 2, '应识别多个有序段');
  assert.ok(merges >= 1, '应发生至少一次归并');
  assert.ok(rounds >= 1, '应至少归并一轮');
});
