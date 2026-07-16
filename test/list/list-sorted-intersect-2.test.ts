import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  sortedIntersect,
} from '../../src/algorithms/list/list-sorted-intersect-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-sorted-intersect-2/trace.ts';
test('sortedIntersect 正确', () => {
  assert.deepEqual(
    listToArray(sortedIntersect(buildList([1, 2, 3, 5]), buildList([2, 3, 4, 5, 6]))),
    [2, 3, 5],
  );
  assert.deepEqual(listToArray(sortedIntersect(buildList([1, 2]), buildList([3, 4]))), []);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
