import { test } from 'node:test';
import assert from 'node:assert/strict';
import { singleNumber, singleNumberK } from '../../src/algorithms/bitwise/single-number/impl.ts';

test('singleNumber 基本用例', () => {
  assert.equal(singleNumber([4, 1, 2, 1, 2]), 4);
  assert.equal(singleNumber([2, 2, 1]), 1);
  assert.equal(singleNumber([1]), 1);
  assert.equal(singleNumber([0, 0, 5]), 5);
});

test('singleNumber 含负数', () => {
  assert.equal(singleNumber([-1, -1, -2]), -2);
});

test('singleNumberK 其余出现3次', () => {
  assert.equal(singleNumberK([2, 2, 3, 2], 3), 3);
  assert.equal(singleNumberK([0, 1, 0, 1, 0, 1, 99], 3), 99);
});

test('singleNumber 钩子被调用', () => {
  let calls = 0;
  singleNumber([4, 1, 2, 1, 2], { onXor: () => calls++ });
  assert.equal(calls, 5);
});
