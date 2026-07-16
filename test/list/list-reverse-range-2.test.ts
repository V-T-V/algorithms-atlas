import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  reverseBetween,
} from '../../src/algorithms/list/list-reverse-range-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-reverse-range-2/trace.ts';
test('reverseBetween 正确', () => {
  assert.deepEqual(listToArray(reverseBetween(buildList([1, 2, 3, 4, 5]), 2, 4)), [1, 4, 3, 2, 5]);
  assert.deepEqual(listToArray(reverseBetween(buildList([1, 2, 3]), 1, 3)), [3, 2, 1]);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
