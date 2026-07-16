import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isPrime } from '../../src/algorithms/numerical/num-is-prime-trial/impl.ts';
test('17 是素数', () => {
  assert.equal(isPrime(17), true);
});
test('15 不是', () => {
  assert.equal(isPrime(15), false);
});
test('1 不是', () => {
  assert.equal(isPrime(1), false);
});
