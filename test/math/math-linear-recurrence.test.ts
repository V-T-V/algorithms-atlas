import { test } from 'node:test';
import assert from 'node:assert/strict';
import { linearRecurrence } from '../../src/algorithms/math/math-linear-recurrence/impl.ts';

test('斐波那契 F(10) = 55', () => {
  const v = linearRecurrence({ coefs: [1, 1], seeds: [0, 1] }, 10);
  assert.equal(v, 55n);
});

test('斐波那契 F(0) = 0', () => {
  const v = linearRecurrence({ coefs: [1, 1], seeds: [0, 1] }, 0);
  assert.equal(v, 0n);
});

test('斐波那契 F(1) = 1', () => {
  const v = linearRecurrence({ coefs: [1, 1], seeds: [0, 1] }, 1);
  assert.equal(v, 1n);
});

test('F(90) 大数取模', () => {
  // F(90) mod 1e9+7
  const v = linearRecurrence({ coefs: [1, 1], seeds: [0, 1] }, 90);
  assert.equal(v, 2880067194370816120n % 1000000007n);
});

test('3阶递推 a_n=2a_{n-1}+a_{n-2}-a_{n-3}', () => {
  // seeds: a_0=1, a_1=2, a_2=4; a_3 = 2*4+2-1 = 9
  const v = linearRecurrence({ coefs: [2, 1, -1], seeds: [1, 2, 4] }, 3);
  assert.equal(v, 9n);
});
