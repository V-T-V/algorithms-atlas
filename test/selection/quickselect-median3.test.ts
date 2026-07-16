import { test } from 'node:test';
import assert from 'node:assert/strict';
import { quickselectMedian3 } from '../../src/algorithms/selection/quickselect-median3/impl.ts';
import { buildTrace } from '../../src/algorithms/selection/quickselect-median3/trace.ts';

test('quickselectMedian3 与排序一致', () => {
  const arr = [9, 8, 7, 6, 5, 4, 3, 2, 1];
  const sorted = [...arr].sort((a, b) => a - b);
  for (let k = 0; k < arr.length; k++) {
    assert.equal(quickselectMedian3(arr, k), sorted[k], `k=${k}`);
  }
});

test('quickselectMedian3 已序输入不退化', () => {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  assert.equal(quickselectMedian3(arr, 4), 5);
  assert.equal(quickselectMedian3(arr, 0), 1);
});

test('quickselectMedian3 不修改原数组', () => {
  const input = [3, 1, 2];
  quickselectMedian3(input, 0);
  assert.deepEqual(input, [3, 1, 2]);
});

test('quickselectMedian3 越界抛错', () => {
  assert.throws(() => quickselectMedian3([1], -1));
  assert.throws(() => quickselectMedian3([1], 1));
});

test('quickselectMedian3 钩子触发 pivotChoice', () => {
  let pivotChoices = 0;
  quickselectMedian3([3, 1, 4, 1, 5, 9, 2, 6], 3, {
    onPivotChoice: () => pivotChoices++,
  });
  assert.ok(pivotChoices >= 1);
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
});
