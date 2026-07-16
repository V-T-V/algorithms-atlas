import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  listSelectionSort,
} from '../../src/algorithms/list/list-sort-selection/impl.ts';

test('listSelectionSort 排序', () => {
  assert.deepEqual(listToArray(listSelectionSort(buildList([4, 2, 1, 3]))), [1, 2, 3, 4]);
  assert.deepEqual(listToArray(listSelectionSort(buildList([5, 4, 3, 2, 1]))), [1, 2, 3, 4, 5]);
  assert.deepEqual(listToArray(listSelectionSort(buildList([1]))), [1]);
  assert.deepEqual(listToArray(listSelectionSort(buildList([]))), []);
});

test('listSelectionSort 钩子', () => {
  const mins: number[] = [];
  listSelectionSort(buildList([3, 1, 2]), { onMin: (v) => mins.push(v) });
  assert.deepEqual(mins, [1, 2, 3]);
});
