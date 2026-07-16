import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  addTwoNumbers2,
  fromArray,
  toArray,
} from '../../src/algorithms/list/add-two-numbers-2/impl.ts';

test('addTwoNumbers2 基本用例', () => {
  // 7243 + 564 = 7807
  const r = addTwoNumbers2(fromArray([7, 2, 4, 3]), fromArray([5, 6, 4]));
  assert.deepEqual(toArray(r), [7, 8, 0, 7]);
});

test('addTwoNumbers2 进位到最高位', () => {
  // 999 + 1 = 1000
  const r = addTwoNumbers2(fromArray([9, 9, 9]), fromArray([1]));
  assert.deepEqual(toArray(r), [1, 0, 0, 0]);
});

test('addTwoNumbers2 长度不等', () => {
  const r = addTwoNumbers2(fromArray([1]), fromArray([9, 9, 9]));
  assert.deepEqual(toArray(r), [1, 0, 0, 0]);
});

test('addTwoNumbers2 全 0', () => {
  const r = addTwoNumbers2(fromArray([0]), fromArray([0]));
  assert.deepEqual(toArray(r), [0]);
});

test('addTwoNumbers2 大数', () => {
  // 123456789 + 987654321 = 1111111110
  const r = addTwoNumbers2(
    fromArray([1, 2, 3, 4, 5, 6, 7, 8, 9]),
    fromArray([9, 8, 7, 6, 5, 4, 3, 2, 1]),
  );
  assert.deepEqual(toArray(r), [1, 1, 1, 1, 1, 1, 1, 1, 1, 0]);
});

test('addTwoNumbers2 钩子被调用', () => {
  let prepends = 0;
  let adds = 0;
  addTwoNumbers2(fromArray([7, 2, 4, 3]), fromArray([5, 6, 4]), {
    onAddDigit: () => adds++,
    onPrepend: () => prepends++,
  });
  assert.equal(adds, 4, '应相加 4 位');
  assert.equal(prepends, 4, '应头插 4 次');
});
