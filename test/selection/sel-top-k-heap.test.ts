import { test } from 'node:test';
import assert from 'node:assert/strict';
import { topKHeap } from '../../src/algorithms/selection/sel-top-k-heap/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/sel-top-k-heap/trace.ts';

test('sel-top-k-heap 前三大', () => {
  assert.deepEqual(topKHeap([3, 1, 4, 1, 5, 9, 2, 6], 3), [9, 6, 5]);
});

test('sel-top-k-heap k>=n 返回全部降序', () => {
  assert.deepEqual(topKHeap([3, 1, 2], 5), [3, 2, 1]);
});

test('sel-top-k-heap k=0 返回空', () => {
  assert.deepEqual(topKHeap([1, 2, 3], 0), []);
});

test('sel-top-k-heap 重复元素', () => {
  const r = topKHeap([5, 5, 5, 1], 2);
  assert.deepEqual(r, [5, 5]);
});

test('sel-top-k-heap trace', () => {
  assert.ok(buildTrace().length > 2);
});
