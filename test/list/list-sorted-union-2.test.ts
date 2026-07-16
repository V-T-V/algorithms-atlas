import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  sortedUnion,
} from '../../src/algorithms/list/list-sorted-union-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-sorted-union-2/trace.ts';
test('sortedUnion 正确', () => {
  assert.deepEqual(
    listToArray(sortedUnion(buildList([1, 2, 3]), buildList([2, 3, 4, 5]))),
    [1, 2, 3, 4, 5],
  );
  assert.deepEqual(listToArray(sortedUnion(buildList([1]), buildList([1]))), [1]);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
