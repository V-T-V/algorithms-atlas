import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  removeElements,
} from '../../src/algorithms/list/list-delete-val-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-delete-val-2/trace.ts';
test('removeElements 正确', () => {
  assert.deepEqual(
    listToArray(removeElements(buildList([1, 2, 6, 3, 4, 6, 5]), 6)),
    [1, 2, 3, 4, 5],
  );
  assert.deepEqual(listToArray(removeElements(buildList([7, 7, 7]), 7)), []);
  assert.deepEqual(listToArray(removeElements(null, 1)), []);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
