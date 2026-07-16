import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nextPrime, isPrimeTrial } from '../../src/algorithms/math/math-next-prime/impl.ts';

test('next-prime 20 -> 23', () => {
  assert.equal(nextPrime(20), 23);
});

test('next-prime 2 -> 3', () => {
  assert.equal(nextPrime(2), 3);
});

test('next-prime 13 -> 17', () => {
  assert.equal(nextPrime(13), 17);
});

test('next-prime 0 -> 2', () => {
  assert.equal(nextPrime(0), 2);
});

test('next-prime 100 -> 101', () => {
  // 101 本身就是素数，所以 nextPrime(100)=101
  assert.equal(nextPrime(100), 101);
  assert.ok(isPrimeTrial(101));
});
