import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  bubbleSortLastSwap,
  type BubbleLastSwapHooks,
} from '../../src/algorithms/sorting/sort-bubble-lastswap/impl.ts';

test('sort-bubble-lastswap 基本排序', () => {
  assert.deepEqual(bubbleSortLastSwap([]), []);
  assert.deepEqual(bubbleSortLastSwap([1]), [1]);
  assert.deepEqual(bubbleSortLastSwap([2, 1]), [1, 2]);
  assert.deepEqual(bubbleSortLastSwap([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('sort-bubble-lastswap 逆序/重复', () => {
  assert.deepEqual(bubbleSortLastSwap([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(bubbleSortLastSwap([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('sort-bubble-lastswap 不修改原数组', () => {
  const input = [3, 1, 2];
  bubbleSortLastSwap(input);
  assert.deepEqual(input, [3, 1, 2]);
});
test('sort-bubble-lastswap 钩子', () => {
  let c = 0;
  bubbleSortLastSwap([3, 1, 2], { onCompare: () => c++ } as BubbleLastSwapHooks);
  assert.ok(c >= 1);
});
