import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  sortedDifference,
} from '../../src/algorithms/list/list-sorted-diff-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-sorted-diff-2/trace.ts';
test('sortedDifference 正确', () => {
  assert.deepEqual(
    listToArray(sortedDifference(buildList([1, 2, 3, 5]), buildList([2, 4]))),
    [1, 3, 5],
  );
  assert.deepEqual(listToArray(sortedDifference(buildList([1, 2]), buildList([1, 2, 3]))), []);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
