import { test } from 'node:test';
import assert from 'node:assert/strict';
import { quickselectDualPivot } from '../../src/algorithms/selection/quickselect-dual-pivot/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/quickselect-dual-pivot/trace.ts';

test('quickselectDualPivot 与排序一致', () => {
  const arr = [8, 3, 11, 7, 2, 9, 5, 12, 6, 4, 10, 1];
  const sorted = [...arr].sort((a, b) => a - b);
  for (let k = 0; k < arr.length; k++) {
    assert.equal(quickselectDualPivot(arr, k), sorted[k], `k=${k}`);
  }
});

test('quickselectDualPivot 边界', () => {
  const arr = [3, 1, 2, 5, 4];
  assert.equal(quickselectDualPivot(arr, 0), 1);
  assert.equal(quickselectDualPivot(arr, arr.length - 1), 5);
});

test('quickselectDualPivot 不修改原数组', () => {
  const input = [3, 1, 2];
  quickselectDualPivot(input, 0);
  assert.deepEqual(input, [3, 1, 2]);
});

test('quickselectDualPivot 重复元素', () => {
  const arr = [4, 2, 4, 2, 4];
  const sorted = [...arr].sort((a, b) => a - b);
  for (let k = 0; k < arr.length; k++) {
    assert.equal(quickselectDualPivot(arr, k), sorted[k], `k=${k}`);
  }
});

test('quickselectDualPivot 越界抛错', () => {
  assert.throws(() => quickselectDualPivot([1], -1));
  assert.throws(() => quickselectDualPivot([1], 1));
});

test('quickselectDualPivot 钩子触发 partition', () => {
  let parts = 0;
  quickselectDualPivot([5, 2, 8, 1, 9, 3], 2, { onPartition: () => parts++ });
  assert.ok(parts >= 1);
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
});
