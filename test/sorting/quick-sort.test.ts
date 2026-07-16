import { test } from 'node:test';
import assert from 'node:assert/strict';
import { quickSort } from '../../src/algorithms/sorting/quick-sort/impl.ts';

test('quickSort 基本排序', () => {
  assert.deepEqual(quickSort([]), []);
  assert.deepEqual(quickSort([1]), [1]);
  assert.deepEqual(quickSort([2, 1]), [1, 2]);
  assert.deepEqual(quickSort([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('quickSort 已有序 / 逆序 / 重复', () => {
  assert.deepEqual(quickSort([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
  assert.deepEqual(quickSort([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(quickSort([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});

test('quickSort 不修改原数组', () => {
  const input = [3, 1, 2];
  quickSort(input);
  assert.deepEqual(input, [3, 1, 2]);
});

test('quickSort 钩子被调用', () => {
  let swaps = 0;
  let pinned = 0;
  quickSort([3, 2, 1], {
    onSwap: () => swaps++,
    onPinned: () => pinned++,
  });
  assert.ok(swaps > 0, '应发生至少一次交换');
  assert.ok(pinned > 0, '应标记至少一个就位');
});
