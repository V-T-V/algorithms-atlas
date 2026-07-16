import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  mergeSortList,
} from '../../src/algorithms/list/list-sort-merge-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-sort-merge-2/trace.ts';
test('mergeSortList 正确', () => {
  assert.deepEqual(listToArray(mergeSortList(buildList([4, 2, 1, 3]))), [1, 2, 3, 4]);
  assert.deepEqual(listToArray(mergeSortList(buildList([5, 4, 3, 2, 1]))), [1, 2, 3, 4, 5]);
  assert.deepEqual(listToArray(mergeSortList(buildList([1]))), [1]);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
