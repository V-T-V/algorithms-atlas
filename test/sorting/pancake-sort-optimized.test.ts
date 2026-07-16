import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pancakeSortOptimized } from '../../src/algorithms/sorting/pancake-sort-optimized/impl.ts';

test('pancakeSortOptimized 基本排序', () => {
  assert.deepEqual(pancakeSortOptimized([])[0], []);
  assert.deepEqual(pancakeSortOptimized([1])[0], [1]);
  assert.deepEqual(pancakeSortOptimized([4, 2, 5, 1, 3])[0], [1, 2, 3, 4, 5]);
  assert.deepEqual(pancakeSortOptimized([3, 1, 5, 2, 4])[0], [1, 2, 3, 4, 5]);
});

test('pancakeSortOptimized 已有序 / 逆序 / 重复', () => {
  assert.deepEqual(pancakeSortOptimized([1, 2, 3, 4, 5])[0], [1, 2, 3, 4, 5]);
  assert.deepEqual(pancakeSortOptimized([5, 4, 3, 2, 1])[0], [1, 2, 3, 4, 5]);
  assert.deepEqual(pancakeSortOptimized([3, 3, 1, 2, 2, 1])[0], [1, 1, 2, 2, 3, 3]);
});

test('pancakeSortOptimized 不修改原数组', () => {
  const input = [3, 1, 2];
  pancakeSortOptimized(input);
  assert.deepEqual(input, [3, 1, 2]);
});

test('pancakeSortOptimized 翻转次数 ≤ 2n−3', () => {
  for (const n of [5, 8, 12]) {
    const arr = Array.from({ length: n }, (_, i) => n - i); // 逆序，最坏情形之一
    const [, flips] = pancakeSortOptimized(arr);
    const bound = Math.max(0, 2 * n - 3);
    assert.ok(flips <= bound, `n=${n} flips=${flips} 超过上界 ${bound}`);
  }
});

test('pancakeSortOptimized 已有序时翻转 0 次', () => {
  const [, flips] = pancakeSortOptimized([1, 2, 3, 4, 5]);
  assert.equal(flips, 0);
});
