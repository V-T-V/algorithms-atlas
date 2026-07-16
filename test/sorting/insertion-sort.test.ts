import { test } from 'node:test';
import assert from 'node:assert/strict';
import { insertionSort } from '../../src/algorithms/sorting/insertion-sort/impl.ts';

test('insertionSort 基本排序', () => {
  assert.deepEqual(insertionSort([]), []);
  assert.deepEqual(insertionSort([1]), [1]);
  assert.deepEqual(insertionSort([2, 1]), [1, 2]);
  assert.deepEqual(insertionSort([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('insertionSort 已有序 / 逆序 / 重复', () => {
  assert.deepEqual(insertionSort([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
  assert.deepEqual(insertionSort([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(insertionSort([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});

test('insertionSort 不修改原数组', () => {
  const input = [3, 1, 2];
  insertionSort(input);
  assert.deepEqual(input, [3, 1, 2]);
});

test('insertionSort 钩子被调用', () => {
  let picks = 0;
  let shifts = 0;
  let places = 0;
  insertionSort([3, 2, 1], {
    onPick: () => picks++,
    onShift: () => shifts++,
    onPlace: () => places++,
  });
  assert.equal(picks, 2, '应挑选 2 个待插入元素');
  assert.ok(shifts > 0, '应发生至少一次右移');
  assert.equal(places, 2, '应放置 2 次');
});

test('insertionSort 已有序时不发生右移', () => {
  let shifts = 0;
  insertionSort([1, 2, 3, 4, 5], { onShift: () => shifts++ });
  assert.equal(shifts, 0, '已有序数组无需右移');
});
