import { test } from 'node:test';
import assert from 'node:assert/strict';
import { quickselectLomuto } from '../../src/algorithms/selection/quickselect-lomuto/impl.ts';

test('quickselectLomuto 基本选择', () => {
  const arr = [5, 2, 8, 1, 9, 3, 7, 4, 6];
  assert.equal(quickselectLomuto(arr, 0), 1);
  assert.equal(quickselectLomuto(arr, 4), 5);
  assert.equal(quickselectLomuto(arr, 8), 9);
});

test('quickselectLomuto 与排序一致', () => {
  const arr = [7, 3, 9, 1, 5, 8, 2, 6, 4, 0];
  const sorted = [...arr].sort((a, b) => a - b);
  for (let k = 0; k < arr.length; k++) {
    assert.equal(quickselectLomuto(arr, k), sorted[k]);
  }
});

test('quickselectLomuto 不修改原数组', () => {
  const input = [3, 1, 2];
  quickselectLomuto(input, 0);
  assert.deepEqual(input, [3, 1, 2]);
});

test('quickselectLomuto 越界抛错', () => {
  assert.throws(() => quickselectLomuto([1], -1));
  assert.throws(() => quickselectLomuto([1], 1));
});
