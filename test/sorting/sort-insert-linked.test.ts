import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  insertionSortLinked,
  type InsertLinkedHooks,
} from '../../src/algorithms/sorting/sort-insert-linked/impl.ts';

test('insertionSortLinked 基本', () => {
  assert.deepEqual(insertionSortLinked([]), []);
  assert.deepEqual(insertionSortLinked([1]), [1]);
  assert.deepEqual(insertionSortLinked([2, 1]), [1, 2]);
  assert.deepEqual(insertionSortLinked([5, 2, 8, 1, 9, 3, 7, 4, 6]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
test('insertionSortLinked 逆序/重复', () => {
  assert.deepEqual(insertionSortLinked([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(insertionSortLinked([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('insertionSortLinked 不修改原数组', () => {
  const input = [3, 1, 2];
  insertionSortLinked(input);
  assert.deepEqual(input, [3, 1, 2]);
});
test('insertionSortLinked 钩子', () => {
  let c = 0;
  insertionSortLinked([3, 1, 2], { onShift: () => c++ } as InsertLinkedHooks);
  assert.ok(c >= 1);
});
