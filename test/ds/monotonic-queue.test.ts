import { test } from 'node:test';
import assert from 'node:assert/strict';
import { monotonicQueue, slidingWindowMax } from '../../src/algorithms/ds/monotonic-queue/impl.ts';

test('slidingWindowMax 经典用例', () => {
  // LeetCode 239 样例：窗口 k=3
  assert.deepEqual(slidingWindowMax([1, 3, -1, -3, 5, 3, 6, 7], 3), [3, 3, 5, 5, 6, 7]);
});

test('slidingWindowMax k=1 返回原数组', () => {
  assert.deepEqual(slidingWindowMax([4, 2, 9, 1], 1), [4, 2, 9, 1]);
});

test('slidingWindowMax k=n 返回唯一最大值', () => {
  assert.deepEqual(slidingWindowMax([4, 2, 9, 1], 4), [9]);
  assert.deepEqual(slidingWindowMax([4, 2, 9, 1], 1), [4, 2, 9, 1]);
});

test('slidingWindowMax 递减序列（窗口最大即窗口首）', () => {
  assert.deepEqual(slidingWindowMax([9, 7, 5, 3, 1], 2), [9, 7, 5, 3]);
});

test('slidingWindowMax 递增序列（窗口最大即窗口尾）', () => {
  assert.deepEqual(slidingWindowMax([1, 3, 5, 7, 9], 3), [5, 7, 9]);
});

test('slidingWindowMax 非法 / 边界 k', () => {
  assert.deepEqual(slidingWindowMax([1, 2, 3], 0), []); // k=0
  assert.deepEqual(slidingWindowMax([1, 2, 3], 4), []); // k>n
  assert.deepEqual(slidingWindowMax([5], 1), [5]);
});

test('slidingWindowMax 钩子被调用', () => {
  const maxima: number[] = [];
  const windows: Array<[number, number]> = [];
  slidingWindowMax([1, 3, -1, -3, 5], 3, {
    onWindowMax: (lo, hi, mi) => {
      maxima.push([1, 3, -1, -3, 5][mi]!);
      windows.push([lo, hi]);
    },
  });
  // 窗口 [0,2] [1,3] [2,4]，最大值 3,3,5
  assert.deepEqual(maxima, [3, 3, 5]);
  assert.deepEqual(windows, [
    [0, 2],
    [1, 3],
    [2, 4],
  ]);
});

test('slidingWindowMax 队首过期触发 onPopFront', () => {
  let popFront = 0;
  // [5,4,3,2] k=2: 5 不会过期(只在 i=1 时窗口[0,1])；i=2 时队首0<lo=1 过期
  slidingWindowMax([5, 4, 3, 2], 2, { onPopFront: () => popFront++ });
  assert.ok(popFront > 0, '应有队首过期被移除');
});

test('monotonicQueue 默认 k=min(3,n)', () => {
  assert.deepEqual(monotonicQueue([1, 3, -1, -3, 5, 3, 6, 7]), [3, 3, 5, 5, 6, 7]);
  assert.deepEqual(monotonicQueue([1, 2]), [2]); // k=min(3,2)=2 → 单窗口
});
