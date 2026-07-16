import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  insertAt,
} from '../../src/algorithms/list/list-insert-at-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-insert-at-2/trace.ts';
test('insertAt 正确', () => {
  assert.deepEqual(listToArray(insertAt(buildList([1, 2, 4]), 2, 3)), [1, 2, 3, 4]);
  assert.deepEqual(listToArray(insertAt(buildList([1, 2]), 0, 0)), [0, 1, 2]);
  assert.deepEqual(listToArray(insertAt(null, 0, 5)), [5]);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
