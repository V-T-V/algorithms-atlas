import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kthLargest } from '../../src/algorithms/selection/kth-largest/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/kth-largest/trace.ts';

test('kthLargest 经典 LeetCode 215', () => {
  assert.equal(kthLargest([3, 2, 1, 5, 6, 4], 2), 5);
  assert.equal(kthLargest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4), 4);
});

test('kthLargest k=1 即最大', () => {
  assert.equal(kthLargest([1, 9, 2, 8, 3], 1), 9);
});

test('kthLargest k=n 即最小', () => {
  assert.equal(kthLargest([1, 9, 2, 8, 3], 5), 1);
});

test('kthLargest 与排序（降序）一致', () => {
  const arr = [7, 10, 4, 3, 20, 15];
  const desc = [...arr].sort((a, b) => b - a);
  for (let k = 1; k <= arr.length; k++) {
    assert.equal(kthLargest(arr, k), desc[k - 1], `k=${k}`);
  }
});

test('kthLargest 越界抛错', () => {
  assert.throws(() => kthLargest([1, 2, 3], 0));
  assert.throws(() => kthLargest([1, 2, 3], 4));
});

test('kthLargest 不修改原数组', () => {
  const input = [3, 1, 2];
  kthLargest(input, 1);
  assert.deepEqual(input, [3, 1, 2]);
});

test('kthLargest 钩子触发', () => {
  let pushes = 0;
  let evicts = 0;
  kthLargest([5, 2, 8, 1, 9, 3], 3, {
    onPush: () => pushes++,
    onEvict: () => evicts++,
  });
  assert.ok(pushes >= 3);
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
});
