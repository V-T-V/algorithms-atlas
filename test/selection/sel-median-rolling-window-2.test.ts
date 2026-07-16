import { test } from 'node:test';
import assert from 'node:assert/strict';
import { medianSlidingWindow } from '../../src/algorithms/selection/sel-median-rolling-window-2/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-median-rolling-window-2/trace.ts';

test('sel-median-rolling-window-2 奇数窗口', () => {
  assert.deepEqual(medianSlidingWindow([1, 3, -1, 5, 3, 6, 7], 3), [1, 3, 3, 5, 6]);
});

test('sel-median-rolling-window-2 偶数窗口取平均', () => {
  assert.deepEqual(medianSlidingWindow([1, 2, 3, 4], 2), [1.5, 2.5, 3.5]);
});

test('sel-median-rolling-window-2 单元素窗口', () => {
  assert.deepEqual(medianSlidingWindow([5, 1, 3], 1), [5, 1, 3]);
});

test('sel-median-rolling-window-2 越界抛错', () => {
  assert.throws(() => medianSlidingWindow([1, 2], 0));
  assert.throws(() => medianSlidingWindow([1, 2], 5));
});

test('sel-median-rolling-window-2 trace', () => {
  assert.ok(buildTrace().length > 2);
});
