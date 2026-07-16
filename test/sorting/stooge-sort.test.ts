import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stoogeSort } from '../../src/algorithms/sorting/stooge-sort/impl.ts';

test('stoogeSort 基本排序（小输入）', () => {
  assert.deepEqual(stoogeSort([]), []);
  assert.deepEqual(stoogeSort([1]), [1]);
  assert.deepEqual(stoogeSort([3, 1, 2]), [1, 2, 3]);
  assert.deepEqual(stoogeSort([4, 2, 5, 1, 3]), [1, 2, 3, 4, 5]);
});

test('stoogeSort 已有序 / 逆序 / 重复', () => {
  assert.deepEqual(stoogeSort([1, 2, 3]), [1, 2, 3]);
  assert.deepEqual(stoogeSort([3, 2, 1]), [1, 2, 3]);
  assert.deepEqual(stoogeSort([3, 3, 1, 2]), [1, 2, 3, 3]);
});

test('stoogeSort 不修改原数组', () => {
  const input = [3, 1, 2];
  stoogeSort(input);
  assert.deepEqual(input, [3, 1, 2]);
});

test('stoogeSort 钩子被调用', () => {
  let compares = 0;
  let swaps = 0;
  stoogeSort([3, 2, 1], {
    onCompare: () => compares++,
    onSwap: () => swaps++,
  });
  assert.ok(compares > 0, '应发生比较');
  assert.ok(swaps > 0, '应发生交换');
});
