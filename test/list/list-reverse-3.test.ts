import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  reverseList,
} from '../../src/algorithms/list/list-reverse-3/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-reverse-3/trace.ts';
test('reverseList 正确', () => {
  assert.deepEqual(listToArray(reverseList(buildList([1, 2, 3, 4, 5]))), [5, 4, 3, 2, 1]);
  assert.deepEqual(listToArray(reverseList(buildList([1]))), [1]);
  assert.deepEqual(listToArray(reverseList(null)), []);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
