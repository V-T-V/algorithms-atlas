import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  rotateLeft,
} from '../../src/algorithms/list/list-rotate-left-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-rotate-left-2/trace.ts';
test('rotateLeft 正确', () => {
  assert.deepEqual(listToArray(rotateLeft(buildList([1, 2, 3, 4, 5]), 2)), [3, 4, 5, 1, 2]);
  assert.deepEqual(listToArray(rotateLeft(buildList([1, 2, 3]), 5)), [3, 1, 2]);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
