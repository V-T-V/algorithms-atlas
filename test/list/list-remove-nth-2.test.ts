import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  removeNthEnd,
} from '../../src/algorithms/list/list-remove-nth-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-remove-nth-2/trace.ts';
test('removeNthEnd 正确', () => {
  assert.deepEqual(listToArray(removeNthEnd(buildList([1, 2, 3, 4, 5]), 2)), [1, 2, 3, 5]);
  assert.deepEqual(listToArray(removeNthEnd(buildList([1, 2, 3]), 3)), [2, 3]);
  assert.deepEqual(listToArray(removeNthEnd(buildList([1]), 1)), []);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
