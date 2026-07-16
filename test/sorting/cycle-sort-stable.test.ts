import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  cycleSortStable,
  cycleSortStableIndices,
} from '../../src/algorithms/sorting/cycle-sort-stable/impl.ts';

test('cycleSortStable 基本排序', () => {
  assert.deepEqual(cycleSortStable([]), []);
  assert.deepEqual(cycleSortStable([1]), [1]);
  assert.deepEqual(cycleSortStable([4, 2, 5, 1, 3]), [1, 2, 3, 4, 5]);
  assert.deepEqual(cycleSortStable([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('cycleSortStable 已有序 / 逆序 / 重复', () => {
  assert.deepEqual(cycleSortStable([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
  assert.deepEqual(cycleSortStable([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(cycleSortStable([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});

test('cycleSortStable 不修改原数组', () => {
  const input = [3, 1, 2];
  cycleSortStable(input);
  assert.deepEqual(input, [3, 1, 2]);
});

test('cycleSortStable 保持等值原始顺序（稳定性）', () => {
  // 三个 2 分别来自原下标 0,2,4；排序后它们的原始下标应保持升序
  const idx = cycleSortStableIndices([2, 1, 2, 3, 2, 1]);
  // 找出结果里值=2 的位置对应的原下标
  const arr = [2, 1, 2, 3, 2, 1];
  const sortedPairs = arr
    .map((v, i) => ({ v, i }))
    .sort((a, b) => (a.v !== b.v ? a.v - b.v : a.i - b.i));
  assert.deepEqual(
    idx,
    sortedPairs.map((p) => p.i),
  );
  // 两个 1 的原下标 1,5 也应保持升序
  assert.deepEqual(
    idx.filter((i) => arr[i] === 1).sort((a, b) => a - b),
    [1, 5],
  );
});
