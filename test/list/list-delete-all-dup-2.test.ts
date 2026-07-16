import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  deleteAllDuplicates,
} from '../../src/algorithms/list/list-delete-all-dup-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-delete-all-dup-2/trace.ts';
test('deleteAllDuplicates 正确', () => {
  assert.deepEqual(listToArray(deleteAllDuplicates(buildList([1, 2, 3, 3, 4, 4, 5]))), [1, 2, 5]);
  assert.deepEqual(listToArray(deleteAllDuplicates(buildList([1, 1, 1]))), []);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
