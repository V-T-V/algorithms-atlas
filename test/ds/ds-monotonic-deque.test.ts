import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  slidingWindowMax,
  slidingWindowMin,
} from '../../src/algorithms/ds/ds-monotonic-deque/impl.ts';

test('slidingWindowMax 经典例', () => {
  // [1,3,-1,-3,5,3,6,7], k=3 → [3,3,5,5,6,7]
  const { values, indices } = slidingWindowMax([1, 3, -1, -3, 5, 3, 6, 7], 3);
  assert.deepEqual(values, [3, 3, 5, 5, 6, 7]);
  assert.deepEqual(indices, [1, 1, 4, 4, 6, 7]);
});

test('slidingWindowMin', () => {
  const { values } = slidingWindowMin([1, 3, -1, -3, 5, 3, 6, 7], 3);
  assert.deepEqual(values, [-1, -3, -3, -3, 3, 3]);
});

test('slidingWindowMax k=1', () => {
  assert.deepEqual(slidingWindowMax([4, 2, 8, 1], 1).values, [4, 2, 8, 1]);
});

test('slidingWindowMax k=数组长度', () => {
  assert.deepEqual(slidingWindowMax([4, 2, 8, 1], 4).values, [8]);
});

test('slidingWindowMax 空数组', () => {
  assert.deepEqual(slidingWindowMax([], 3).values, []);
});

test('slidingWindowMax k=0 返回空', () => {
  assert.deepEqual(slidingWindowMax([1, 2, 3], 0).values, []);
});

test('slidingWindowMax 单调递增', () => {
  assert.deepEqual(slidingWindowMax([1, 2, 3, 4, 5], 3).values, [3, 4, 5]);
});

test('slidingWindowMax 单调递减', () => {
  assert.deepEqual(slidingWindowMax([5, 4, 3, 2, 1], 3).values, [5, 4, 3]);
});

test('slidingWindowMax 与朴素对照', () => {
  const arr = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];
  const k = 4;
  const naive = [];
  for (let i = 0; i + k <= arr.length; i++) naive.push(Math.max(...arr.slice(i, i + k)));
  assert.deepEqual(slidingWindowMax(arr, k).values, naive);
});
