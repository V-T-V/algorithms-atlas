import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bubbleSort } from '../../src/algorithms/sorting/bubble-sort/impl.ts';

test('bubbleSort 基本排序', () => {
  assert.deepEqual(bubbleSort([]), []);
  assert.deepEqual(bubbleSort([1]), [1]);
  assert.deepEqual(bubbleSort([2, 1]), [1, 2]);
  assert.deepEqual(bubbleSort([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('bubbleSort 已有序 / 逆序 / 重复', () => {
  assert.deepEqual(bubbleSort([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
  assert.deepEqual(bubbleSort([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(bubbleSort([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});

test('bubbleSort 不修改原数组', () => {
  const input = [3, 1, 2];
  bubbleSort(input);
  assert.deepEqual(input, [3, 1, 2]);
});

test('bubbleSort 钩子被调用', () => {
  let compares = 0;
  let swaps = 0;
  let sorted = 0;
  bubbleSort([3, 2, 1], {
    onCompare: () => compares++,
    onSwap: () => swaps++,
    onSorted: () => sorted++,
  });
  assert.ok(compares > 0, '应发生至少一次比较');
  assert.ok(swaps > 0, '应发生至少一次交换');
  assert.equal(sorted, 3, '应标记 3 个位置就位');
});
