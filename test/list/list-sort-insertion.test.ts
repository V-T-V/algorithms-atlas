import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  listInsertionSort,
} from '../../src/algorithms/list/list-sort-insertion/impl.ts';

test('listInsertionSort 排序', () => {
  assert.deepEqual(listToArray(listInsertionSort(buildList([4, 2, 1, 3]))), [1, 2, 3, 4]);
  assert.deepEqual(listToArray(listInsertionSort(buildList([5, 4, 3, 2, 1]))), [1, 2, 3, 4, 5]);
  assert.deepEqual(listToArray(listInsertionSort(buildList([1]))), [1]);
  assert.deepEqual(listToArray(listInsertionSort(buildList([]))), []);
  assert.deepEqual(listToArray(listInsertionSort(buildList([3, 1, 2, 1]))), [1, 1, 2, 3]);
});

test('listInsertionSort 钩子', () => {
  let inserts = 0;
  listInsertionSort(buildList([3, 1, 2]), { onInsert: () => inserts++ });
  assert.equal(inserts, 3);
});
