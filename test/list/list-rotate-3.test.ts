import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  rotateRight,
} from '../../src/algorithms/list/list-rotate-3/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-rotate-3/trace.ts';
test('rotateRight 正确', () => {
  assert.deepEqual(listToArray(rotateRight(buildList([1, 2, 3, 4, 5]), 2)), [4, 5, 1, 2, 3]);
  assert.deepEqual(listToArray(rotateRight(buildList([1, 2, 3]), 4)), [3, 1, 2]);
  assert.deepEqual(listToArray(rotateRight(buildList([1]), 5)), [1]);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
