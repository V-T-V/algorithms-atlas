import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sieve } from '../../src/algorithms/math/math-sieve-2/impl.ts';

test('sieve(30) 素数列表', () => {
  const { primes } = sieve(30);
  assert.deepEqual(primes, [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]);
});

test('sieve(2) = [2]', () => {
  const { primes } = sieve(2);
  assert.deepEqual(primes, [2]);
});

test('sieve(1) 空', () => {
  const { primes } = sieve(1);
  assert.equal(primes.length, 0);
});

test('sieve isPrime 数组', () => {
  const { isPrime } = sieve(10);
  assert.equal(isPrime[0], false);
  assert.equal(isPrime[1], false);
  assert.equal(isPrime[2], true);
  assert.equal(isPrime[3], true);
  assert.equal(isPrime[4], false);
  assert.equal(isPrime[7], true);
});
