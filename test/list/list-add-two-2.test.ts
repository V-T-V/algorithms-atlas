import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildList, listToArray, addTwo2 } from '../../src/algorithms/list/list-add-two-2/impl.ts';

test('addTwo2 相加', () => {
  // 342 + 465 = 807 -> 7,0,8
  assert.deepEqual(listToArray(addTwo2(buildList([2, 4, 3]), buildList([5, 6, 4]))), [7, 0, 8]);
  // 0 + 0 = 0
  assert.deepEqual(listToArray(addTwo2(buildList([0]), buildList([0]))), [0]);
  // 9999999 + 9999 = 10009998 -> 8,9,9,9,0,0,0,1
  assert.deepEqual(
    listToArray(addTwo2(buildList([9, 9, 9, 9, 9, 9, 9]), buildList([9, 9, 9, 9]))),
    [8, 9, 9, 9, 0, 0, 0, 1],
  );
});

test('addTwo2 钩子', () => {
  let digits = 0;
  addTwo2(buildList([2, 4]), buildList([5, 6, 4]), { onDigit: () => digits++ });
  assert.equal(digits, 3);
});
