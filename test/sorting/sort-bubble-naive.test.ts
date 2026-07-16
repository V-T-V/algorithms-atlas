import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  bubbleSortNaive,
  type BubbleNaiveHooks,
} from '../../src/algorithms/sorting/sort-bubble-naive/impl.ts';

test('sort-bubble-naive 基本排序', () => {
  assert.deepEqual(bubbleSortNaive([]), []);
  assert.deepEqual(bubbleSortNaive([1]), [1]);
  assert.deepEqual(bubbleSortNaive([2, 1]), [1, 2]);
  assert.deepEqual(bubbleSortNaive([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('sort-bubble-naive 逆序/重复', () => {
  assert.deepEqual(bubbleSortNaive([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(bubbleSortNaive([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('sort-bubble-naive 不修改原数组', () => {
  const input = [3, 1, 2];
  bubbleSortNaive(input);
  assert.deepEqual(input, [3, 1, 2]);
});
test('sort-bubble-naive 钩子', () => {
  let c = 0;
  bubbleSortNaive([3, 1, 2], { onCompare: () => c++ } as BubbleNaiveHooks);
  assert.ok(c >= 1);
});
