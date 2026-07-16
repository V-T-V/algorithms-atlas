import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  insertSortList,
} from '../../src/algorithms/list/insert-sort-list/impl.ts';

test('insertSortList 排序', () => {
  assert.deepEqual(listToArray(insertSortList(buildList([4, 2, 1, 3]))), [1, 2, 3, 4]);
  assert.deepEqual(listToArray(insertSortList(buildList([-1, 5, 3, 4, 0]))), [-1, 0, 3, 4, 5]);
  assert.deepEqual(listToArray(insertSortList(buildList([1, 2, 3]))), [1, 2, 3]);
  assert.deepEqual(listToArray(insertSortList(buildList([]))), []);
  assert.deepEqual(listToArray(insertSortList(buildList([5]))), [5]);
});

test('insertSortList 钩子', () => {
  let picks = 0;
  insertSortList(buildList([4, 2, 1, 3]), { onPick: () => picks++ });
  assert.equal(picks, 4);
});
