import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, listToArray, zipLists } from '../../src/algorithms/list/list-zip-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-zip-2/trace.ts';
test('zipLists 正确', () => {
  assert.deepEqual(
    listToArray(zipLists(buildList([1, 3, 5]), buildList([2, 4, 6]))),
    [1, 2, 3, 4, 5, 6],
  );
  assert.deepEqual(listToArray(zipLists(buildList([1]), buildList([2, 3, 4]))), [1, 2, 3, 4]);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
