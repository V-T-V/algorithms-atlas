import { test } from 'node:test';
import assert from 'node:assert/strict';
import { btConfusingNumber2 } from '../../src/algorithms/backtracking/bt-confusing-number-2/impl.ts';

test('bt-confusing-number-2 n=20', () => {
  // 6,9,10,16,18,19
  assert.equal(btConfusingNumber2(20), 6);
});

test('bt-confusing-number-2 n=100', () => {
  assert.equal(btConfusingNumber2(100), 19);
});

test('bt-confusing-number-2 n=1 为 0', () => {
  assert.equal(btConfusingNumber2(1), 0);
});

test('bt-confusing-number-2 单调性', () => {
  assert.ok(btConfusingNumber2(50) <= btConfusingNumber2(100));
});
