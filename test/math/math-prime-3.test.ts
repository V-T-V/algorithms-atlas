import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isPrime } from '../../src/algorithms/math/math-prime-3/impl.ts';

test('miller-rabin 素数', () => {
  assert.equal(isPrime(2), true);
  assert.equal(isPrime(97), true);
  assert.equal(isPrime(7919), true);
});

test('miller-rabin 合数', () => {
  assert.equal(isPrime(1), false);
  assert.equal(isPrime(561), false); // 卡迈克尔数
  assert.equal(isPrime(41041), false);
});

test('miller-rabin 大素数', () => {
  assert.equal(isPrime(1000000007), true);
});
