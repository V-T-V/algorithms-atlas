import { test } from 'node:test';
import assert from 'node:assert/strict';
import { slidingWindowDistinct } from '../../src/algorithms/design/sliding-window-distinct/impl.ts';

test('swDistinct 经典样例', () => {
  // [1,2,1,3]→3, [2,1,3,2]→3, [1,3,2,4]→4, [3,2,4,1]→4
  assert.deepEqual(slidingWindowDistinct([1, 2, 1, 3, 2, 4, 1], 4), [3, 3, 4, 4]);
});

test('swDistinct k=1 全为 1', () => {
  assert.deepEqual(slidingWindowDistinct([4, 2, 8, 1], 1), [1, 1, 1, 1]);
});

test('swDistinct k=数组长度', () => {
  assert.deepEqual(slidingWindowDistinct([1, 1, 2, 2, 3], 5), [3]);
});

test('swDistinct 全相同', () => {
  assert.deepEqual(slidingWindowDistinct([5, 5, 5, 5], 2), [1, 1, 1]);
});

test('swDistinct 全不同', () => {
  assert.deepEqual(slidingWindowDistinct([1, 2, 3, 4], 3), [3, 3]);
});

test('swDistinct 与朴素法一致', () => {
  const arr = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3];
  const k = 5;
  const naive: number[] = [];
  for (let i = 0; i + k <= arr.length; i++) {
    naive.push(new Set(arr.slice(i, i + k)).size);
  }
  assert.deepEqual(slidingWindowDistinct(arr, k), naive);
});

test('swDistinct 含负数', () => {
  // 窗口 [-1,-1]→1, [-1,-2]→2, [-2,-2]→1
  assert.deepEqual(slidingWindowDistinct([-1, -1, -2, -2], 2), [1, 2, 1]);
});

test('swDistinct 不修改原数组', () => {
  const input = [1, 2, 3];
  slidingWindowDistinct(input, 2);
  assert.deepEqual(input, [1, 2, 3]);
});

test('swDistinct 非法输入抛错', () => {
  assert.throws(() => slidingWindowDistinct([1, 2, 3], 0));
  assert.throws(() => slidingWindowDistinct([1, 2, 3], 5));
});
