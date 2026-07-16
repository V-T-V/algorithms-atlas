import { test } from 'node:test';
import assert from 'node:assert/strict';
import { prevPrime } from '../../src/algorithms/math/math-prev-prime/impl.ts';

test('prev-prime 20 -> 19', () => {
  assert.equal(prevPrime(20), 19);
});

test('prev-prime 3 -> 2', () => {
  assert.equal(prevPrime(3), 2);
});

test('prev-prime 100 -> 97', () => {
  assert.equal(prevPrime(100), 97);
});

test('prev-prime 2 -> -1', () => {
  assert.equal(prevPrime(2), -1);
});

test('prev-prime 1 -> -1', () => {
  assert.equal(prevPrime(1), -1);
});
