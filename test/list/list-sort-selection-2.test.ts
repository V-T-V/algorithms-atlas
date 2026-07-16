import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  selectionSortList,
} from '../../src/algorithms/list/list-sort-selection-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-sort-selection-2/trace.ts';
test('selectionSortList 正确', () => {
  assert.deepEqual(listToArray(selectionSortList(buildList([4, 2, 1, 3]))), [1, 2, 3, 4]);
  assert.deepEqual(listToArray(selectionSortList(buildList([3, 1, 2]))), [1, 2, 3]);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
