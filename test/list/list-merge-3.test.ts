import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  mergeSorted,
} from '../../src/algorithms/list/list-merge-3/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-merge-3/trace.ts';
test('mergeSorted 正确', () => {
  assert.deepEqual(
    listToArray(mergeSorted(buildList([1, 3, 5]), buildList([2, 4, 6]))),
    [1, 2, 3, 4, 5, 6],
  );
  assert.deepEqual(listToArray(mergeSorted(buildList([]), buildList([1, 2]))), [1, 2]);
  assert.deepEqual(listToArray(mergeSorted(buildList([1]), buildList([]))), [1]);
  assert.deepEqual(listToArray(mergeSorted(null, null)), []);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
