import { test } from 'node:test';
import assert from 'node:assert/strict';
import { quickselectHoare } from '../../src/algorithms/selection/quickselect-hoare/impl.ts';

test('quickselectHoare 基本选择', () => {
  const arr = [5, 2, 8, 1, 9, 3, 7, 4, 6];
  assert.equal(quickselectHoare(arr, 0), 1);
  assert.equal(quickselectHoare(arr, 4), 5);
  assert.equal(quickselectHoare(arr, 8), 9);
});

test('quickselectHoare 与排序一致', () => {
  const arr = [7, 3, 9, 1, 5, 8, 2, 6, 4, 0];
  const sorted = [...arr].sort((a, b) => a - b);
  for (let kk = 0; kk < arr.length; kk++) {
    assert.equal(quickselectHoare(arr, kk), sorted[kk]);
  }
});

test('quickselectHoare 重复元素', () => {
  const arr = [4, 2, 4, 1, 4, 2];
  const sorted = [...arr].sort((a, b) => a - b);
  for (let kk = 0; kk < arr.length; kk++) {
    assert.equal(quickselectHoare(arr, kk), sorted[kk]);
  }
});

test('quickselectHoare 不修改原数组', () => {
  const input = [3, 1, 2];
  quickselectHoare(input, 0);
  assert.deepEqual(input, [3, 1, 2]);
});

test('quickselectHoare 越界抛错', () => {
  assert.throws(() => quickselectHoare([1], -1));
  assert.throws(() => quickselectHoare([1], 1));
});
