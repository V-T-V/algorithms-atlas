import { test } from 'node:test';
import assert from 'node:assert/strict';
import { slidingWindowMedian } from '../../src/algorithms/design/sliding-window-median/impl.ts';

test('swMedian 经典样例（k=3 奇数）', () => {
  assert.deepEqual(slidingWindowMedian([1, 3, -1, -3, 5, 3, 6, 7], 3), [1, -1, -1, 3, 5, 6]);
});

test('swMedian k=2 偶数取两中值平均', () => {
  // [1,2]→1.5; [2,3]→2.5; [3,4]→3.5
  assert.deepEqual(slidingWindowMedian([1, 2, 3, 4], 2), [1.5, 2.5, 3.5]);
});

test('swMedian k=1 中位数即自身', () => {
  assert.deepEqual(slidingWindowMedian([4, 2, 8, 1], 1), [4, 2, 8, 1]);
});

test('swMedian k=数组长度 只一个中位数', () => {
  assert.deepEqual(slidingWindowMedian([1, 5, 3, 9, 2], 5), [3]);
});

test('swMedian 全相同', () => {
  assert.deepEqual(slidingWindowMedian([5, 5, 5, 5], 2), [5, 5, 5]);
});

test('swMedian 含负数', () => {
  assert.deepEqual(slidingWindowMedian([-1, -2, -3, -4], 2), [-1.5, -2.5, -3.5]);
});

test('swMedian 与朴素法一致', () => {
  const arr = [9, 7, 8, 6, 4, 5, 2, 8, 1, 3];
  const k = 4;
  const naive: number[] = [];
  for (let i = 0; i + k <= arr.length; i++) {
    const win = arr.slice(i, i + k).sort((a, b) => a - b);
    naive.push(k % 2 === 1 ? win[(k - 1) / 2]! : (win[k / 2 - 1]! + win[k / 2]!) / 2);
  }
  assert.deepEqual(slidingWindowMedian(arr, k), naive);
});

test('swMedian 不修改原数组', () => {
  const input = [3, 1, 2];
  slidingWindowMedian(input, 2);
  assert.deepEqual(input, [3, 1, 2]);
});

test('swMedian 非法输入抛错', () => {
  assert.throws(() => slidingWindowMedian([1, 2, 3], 0));
  assert.throws(() => slidingWindowMedian([1, 2, 3], 5));
});
