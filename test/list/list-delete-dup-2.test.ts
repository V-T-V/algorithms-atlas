import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  deleteDuplicates,
} from '../../src/algorithms/list/list-delete-dup-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-delete-dup-2/trace.ts';
test('deleteDuplicates 正确', () => {
  assert.deepEqual(listToArray(deleteDuplicates(buildList([1, 1, 2, 3, 3, 4]))), [1, 2, 3, 4]);
  assert.deepEqual(listToArray(deleteDuplicates(buildList([1, 1, 1]))), [1]);
  assert.deepEqual(listToArray(deleteDuplicates(null)), []);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
