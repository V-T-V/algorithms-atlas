import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  listQuickSort,
} from '../../src/algorithms/list/list-sort-quick/impl.ts';

test('listQuickSort 排序', () => {
  assert.deepEqual(listToArray(listQuickSort(buildList([4, 2, 4, 1, 3, 4]))), [1, 2, 3, 4, 4, 4]);
  assert.deepEqual(listToArray(listQuickSort(buildList([5, 4, 3, 2, 1]))), [1, 2, 3, 4, 5]);
  assert.deepEqual(listToArray(listQuickSort(buildList([1]))), [1]);
  assert.deepEqual(listToArray(listQuickSort(buildList([]))), []);
  assert.deepEqual(listToArray(listQuickSort(buildList([3, 1, 2, 1]))), [1, 1, 2, 3]);
});

test('listQuickSort 钩子', () => {
  const pivots: number[] = [];
  listQuickSort(buildList([3, 1, 2]), { onPivot: (p) => pivots.push(p) });
  assert.ok(pivots.length >= 1);
});
