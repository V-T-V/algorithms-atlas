import { test } from 'node:test';
import assert from 'node:assert/strict';
import { combSortOptimized } from '../../src/algorithms/sorting/comb-sort-optimized/impl.ts';

test('combSortOptimized 基本排序', () => {
  assert.deepEqual(combSortOptimized([]), []);
  assert.deepEqual(combSortOptimized([1]), [1]);
  assert.deepEqual(combSortOptimized([4, 2, 5, 1, 3]), [1, 2, 3, 4, 5]);
  assert.deepEqual(combSortOptimized([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('combSortOptimized 已有序 / 逆序 / 重复', () => {
  assert.deepEqual(combSortOptimized([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
  assert.deepEqual(combSortOptimized([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(combSortOptimized([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});

test('combSortOptimized 不修改原数组', () => {
  const input = [3, 1, 2];
  combSortOptimized(input);
  assert.deepEqual(input, [3, 1, 2]);
});

test('combSortOptimized 钩子被调用且冒泡短路生效', () => {
  let lastPhase: 'comb' | 'bubble' = 'comb';
  let bubbleNoSwap = false;
  combSortOptimized([5, 1, 4, 2, 8], {
    onGap: (_g, phase) => {
      lastPhase = phase;
    },
    onPassEnd: (swapped) => {
      if (lastPhase === 'bubble' && !swapped) bubbleNoSwap = true;
    },
  });
  assert.ok(bubbleNoSwap, 'gap=1 时应有一次无交换即停');
});
