import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  insertionSortList,
} from '../../src/algorithms/list/list-insert-sort-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-insert-sort-2/trace.ts';
test('insertionSortList 正确', () => {
  assert.deepEqual(listToArray(insertionSortList(buildList([4, 2, 1, 3]))), [1, 2, 3, 4]);
  assert.deepEqual(listToArray(insertionSortList(buildList([3, 2, 1]))), [1, 2, 3]);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
