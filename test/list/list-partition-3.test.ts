import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  partition,
} from '../../src/algorithms/list/list-partition-3/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-partition-3/trace.ts';
test('partition 正确', () => {
  assert.deepEqual(
    listToArray(partition(buildList([3, 5, 8, 5, 10, 2, 1]), 5)),
    [3, 2, 1, 5, 8, 5, 10],
  );
  assert.deepEqual(listToArray(partition(buildList([2, 1]), 2)), [1, 2]);
  assert.deepEqual(listToArray(partition(null, 1)), []);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
