import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  oddEvenList,
} from '../../src/algorithms/list/list-oddeven-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-oddeven-2/trace.ts';
test('oddEvenList 正确', () => {
  assert.deepEqual(listToArray(oddEvenList(buildList([1, 2, 3, 4, 5]))), [1, 3, 5, 2, 4]);
  assert.deepEqual(
    listToArray(oddEvenList(buildList([2, 1, 3, 5, 6, 4, 7]))),
    [2, 3, 6, 7, 1, 5, 4],
  );
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
