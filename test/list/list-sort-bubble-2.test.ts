import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  bubbleSortList,
} from '../../src/algorithms/list/list-sort-bubble-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-sort-bubble-2/trace.ts';
test('bubbleSortList 正确', () => {
  assert.deepEqual(listToArray(bubbleSortList(buildList([4, 2, 1, 3]))), [1, 2, 3, 4]);
  assert.deepEqual(listToArray(bubbleSortList(buildList([3, 1, 2]))), [1, 2, 3]);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
