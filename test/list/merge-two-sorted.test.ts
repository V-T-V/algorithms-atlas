import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  mergeTwoSorted,
} from '../../src/algorithms/list/merge-two-sorted/impl.ts';

test('mergeTwoSorted 合并', () => {
  assert.deepEqual(
    listToArray(mergeTwoSorted(buildList([1, 2, 4]), buildList([1, 3, 4]))),
    [1, 1, 2, 3, 4, 4],
  );
  assert.deepEqual(listToArray(mergeTwoSorted(buildList([]), buildList([0]))), [0]);
  assert.deepEqual(listToArray(mergeTwoSorted(buildList([1]), buildList([]))), [1]);
  assert.deepEqual(listToArray(mergeTwoSorted(buildList([]), buildList([]))), []);
});

test('mergeTwoSorted 钩子', () => {
  let compares = 0;
  mergeTwoSorted(buildList([1, 3]), buildList([2]), { onCompare: () => compares++ });
  assert.ok(compares > 0);
});
