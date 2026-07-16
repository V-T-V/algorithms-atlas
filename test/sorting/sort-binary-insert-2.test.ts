import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  binaryInsertionSort2,
  type BinInsert2Hooks,
} from '../../src/algorithms/sorting/sort-binary-insert-2/impl.ts';

test('binaryInsertionSort2 基本', () => {
  assert.deepEqual(binaryInsertionSort2([]), []);
  assert.deepEqual(binaryInsertionSort2([1]), [1]);
  assert.deepEqual(binaryInsertionSort2([2, 1]), [1, 2]);
  assert.deepEqual(binaryInsertionSort2([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('binaryInsertionSort2 逆序/重复', () => {
  assert.deepEqual(binaryInsertionSort2([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(binaryInsertionSort2([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('binaryInsertionSort2 不修改原数组', () => {
  const input = [3, 1, 2];
  binaryInsertionSort2(input);
  assert.deepEqual(input, [3, 1, 2]);
});
test('binaryInsertionSort2 钩子', () => {
  let c = 0;
  binaryInsertionSort2([3, 1, 2], { onInsert: () => c++ } as BinInsert2Hooks);
  assert.ok(c >= 1);
});
