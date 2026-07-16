import { test } from 'node:test';
import assert from 'node:assert/strict';
import { slidingWindowMax } from '../../src/algorithms/design/sliding-window-max/impl.ts';

test('slidingWindowMax 经典样例', () => {
  assert.deepEqual(slidingWindowMax([1, 3, -1, -3, 5, 3, 6, 7], 3), [3, 3, 5, 5, 6, 7]);
});

test('slidingWindowMax 窗口=1', () => {
  assert.deepEqual(slidingWindowMax([4, 2, 8, 1], 1), [4, 2, 8, 1]);
});

test('slidingWindowMax 窗口=数组长度', () => {
  assert.deepEqual(slidingWindowMax([1, 5, 3, 9, 2], 5), [9]);
});

test('slidingWindowMax 全相同', () => {
  assert.deepEqual(slidingWindowMax([5, 5, 5, 5], 2), [5, 5, 5]);
});

test('slidingWindowMax 单调递增', () => {
  assert.deepEqual(slidingWindowMax([1, 2, 3, 4, 5], 3), [3, 4, 5]);
});

test('slidingWindowMax 单调递减', () => {
  assert.deepEqual(slidingWindowMax([5, 4, 3, 2, 1], 3), [5, 4, 3]);
});

test('slidingWindowMax 与朴素法一致', () => {
  const arr = [9, 7, 8, 6, 4, 5, 2, 8, 1, 3];
  const k = 4;
  const naive: number[] = [];
  for (let i = 0; i + k <= arr.length; i++) {
    let m = arr[i]!;
    for (let j = i + 1; j < i + k; j++) m = Math.max(m, arr[j]!);
    naive.push(m);
  }
  assert.deepEqual(slidingWindowMax(arr, k), naive);
});

test('slidingWindowMax 不修改原数组', () => {
  const input = [1, 2, 3];
  slidingWindowMax(input, 2);
  assert.deepEqual(input, [1, 2, 3]);
});

test('slidingWindowMax 非法输入抛错', () => {
  assert.throws(() => slidingWindowMax([1, 2, 3], 0));
  assert.throws(() => slidingWindowMax([1, 2, 3], 5));
});
