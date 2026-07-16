import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  mergeKLists,
} from '../../src/algorithms/list/list-merge-k-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-merge-k-2/trace.ts';
test('mergeKLists 正确', () => {
  const r = mergeKLists([buildList([1, 4, 5]), buildList([1, 3, 4]), buildList([2, 6])]);
  assert.deepEqual(listToArray(r), [1, 1, 2, 3, 4, 4, 5, 6]);
  assert.equal(mergeKLists([]), null);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
