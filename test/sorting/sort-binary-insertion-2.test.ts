import { test } from 'node:test';
import assert from 'node:assert/strict';
import { binaryInsertionSort2 } from '../../src/algorithms/sorting/sort-binary-insertion-2/impl.ts';

test('binaryInsertionSort2 基本排序', () => {
  assert.deepEqual(binaryInsertionSort2([]), []);
  assert.deepEqual(binaryInsertionSort2([1]), [1]);
  assert.deepEqual(binaryInsertionSort2([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('binaryInsertionSort2 已有序/逆序/重复', () => {
  assert.deepEqual(binaryInsertionSort2([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
  assert.deepEqual(binaryInsertionSort2([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(binaryInsertionSort2([3, 1, 3, 2, 1]), [1, 1, 2, 3, 3]);
});

test('binaryInsertionSort2 不修改原数组', () => {
  const input = [3, 1, 2];
  binaryInsertionSort2(input);
  assert.deepEqual(input, [3, 1, 2]);
});

test('binaryInsertionSort2 钩子被调用', () => {
  let searches = 0;
  let shifts = 0;
  binaryInsertionSort2([3, 1, 2], { onSearchStart: () => searches++, onShift: () => shifts++ });
  assert.ok(searches >= 1);
  assert.ok(shifts >= 1);
});
