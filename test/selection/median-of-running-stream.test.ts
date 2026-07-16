import { test } from 'node:test';
import assert from 'node:assert/strict';
import { windowMedian } from '../../src/algorithms/selection/median-of-running-stream/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/median-of-running-stream/trace.ts';

test('windowMedian 经典 LeetCode 480 奇数 k', () => {
  const r = windowMedian([1, 3, -1, -3, 5, 3, 6, 7], 3);
  // 窗口 [1,3,-1]->1, [3,-1,-3]->-1, [-1,-3,5]->-1, [-3,5,3]->3, [5,3,6]->5, [3,6,7]->6
  assert.deepEqual(r.medians, [1, -1, -1, 3, 5, 6]);
});

test('windowMedian 偶数 k 取两中值平均', () => {
  const r = windowMedian([1, 2, 3, 4], 2);
  // [1,2]->1.5, [2,3]->2.5, [3,4]->3.5
  assert.deepEqual(r.medians, [1.5, 2.5, 3.5]);
});

test('windowMedian 窗口等于数组长度', () => {
  const r = windowMedian([5, 2, 8, 1], 4);
  assert.equal(r.count, 1);
  assert.equal(r.medians[0], 3.5); // (2+5)/2
});

test('windowMedian k=1 退化为原数组', () => {
  const r = windowMedian([4, 9, 2, 7], 1);
  assert.deepEqual(r.medians, [4, 9, 2, 7]);
});

test('windowMedian 含重复与负数', () => {
  const r = windowMedian([1, 1, 1, 1], 3);
  assert.deepEqual(r.medians, [1, 1]);
});

test('windowMedian k 非法抛错', () => {
  assert.throws(() => windowMedian([1, 2, 3], 0));
});

test('windowMedian 窗口大于数组返回空', () => {
  const r = windowMedian([1, 2], 5);
  assert.equal(r.count, 0);
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
  const last = frames[frames.length - 1]!;
  assert.ok(last.aux, '终帧应有 aux');
});
