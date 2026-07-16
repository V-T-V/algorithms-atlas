import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  addTwoNumbers,
  fromArray,
  toArray,
} from '../../src/algorithms/list/add-two-numbers/impl.ts';

test('addTwoNumbers 基本用例', () => {
  // 342 + 465 = 807 → [7,0,8]
  assert.deepEqual(toArray(addTwoNumbers(fromArray([2, 4, 3]), fromArray([5, 6, 4]))), [7, 0, 8]);
});

test('addTwoNumbers 不同长度', () => {
  // 999 + 1 = 1000 → [0,0,0,1]
  assert.deepEqual(toArray(addTwoNumbers(fromArray([9, 9, 9]), fromArray([1]))), [0, 0, 0, 1]);
});

test('addTwoNumbers 含零', () => {
  assert.deepEqual(toArray(addTwoNumbers(fromArray([0]), fromArray([0]))), [0]);
});

test('addTwoNumbers 无进位', () => {
  assert.deepEqual(toArray(addTwoNumbers(fromArray([1, 2]), fromArray([3, 4]))), [4, 6]);
});

test('addTwoNumbers 钩子被调用', () => {
  let calls = 0;
  addTwoNumbers(fromArray([2, 4, 3]), fromArray([5, 6, 4]), { onAddDigit: () => calls++ });
  assert.equal(calls, 3);
});
