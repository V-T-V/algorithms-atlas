import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  deleteAt,
} from '../../src/algorithms/list/list-delete-at-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-delete-at-2/trace.ts';
test('deleteAt 正确', () => {
  assert.deepEqual(listToArray(deleteAt(buildList([1, 2, 3, 4]), 2)), [1, 2, 4]);
  assert.deepEqual(listToArray(deleteAt(buildList([1, 2, 3]), 0)), [2, 3]);
  assert.deepEqual(listToArray(deleteAt(buildList([1]), 0)), []);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
