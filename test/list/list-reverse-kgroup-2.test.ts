import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  reverseKGroup,
} from '../../src/algorithms/list/list-reverse-kgroup-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-reverse-kgroup-2/trace.ts';
test('reverseKGroup 正确', () => {
  assert.deepEqual(listToArray(reverseKGroup(buildList([1, 2, 3, 4, 5]), 2)), [2, 1, 4, 3, 5]);
  assert.deepEqual(listToArray(reverseKGroup(buildList([1, 2, 3, 4, 5]), 3)), [3, 2, 1, 4, 5]);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
