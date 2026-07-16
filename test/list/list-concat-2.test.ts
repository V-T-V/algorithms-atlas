import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  concatList,
} from '../../src/algorithms/list/list-concat-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-concat-2/trace.ts';
test('concatList 正确', () => {
  assert.deepEqual(
    listToArray(concatList(buildList([1, 2]), buildList([3, 4, 5]))),
    [1, 2, 3, 4, 5],
  );
  assert.deepEqual(listToArray(concatList(null, buildList([1, 2]))), [1, 2]);
  assert.deepEqual(listToArray(concatList(buildList([1, 2]), null)), [1, 2]);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
