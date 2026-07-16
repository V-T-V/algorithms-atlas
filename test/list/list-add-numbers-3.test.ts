import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  addTwoNumbers,
} from '../../src/algorithms/list/list-add-numbers-3/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-add-numbers-3/trace.ts';
test('addTwoNumbers 正确', () => {
  assert.deepEqual(
    listToArray(addTwoNumbers(buildList([2, 4, 3]), buildList([5, 6, 4]))),
    [7, 0, 8],
  );
  assert.deepEqual(listToArray(addTwoNumbers(buildList([0]), buildList([0]))), [0]);
  assert.deepEqual(listToArray(addTwoNumbers(buildList([9, 9]), buildList([1]))), [0, 0, 1]);
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
