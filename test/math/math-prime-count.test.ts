import { test } from 'node:test';
import assert from 'node:assert/strict';
import { primeCount } from '../../src/algorithms/math/math-prime-count/impl.ts';

test('prime-count π(10)=4', () => {
  assert.equal(primeCount(10), 4); // 2,3,5,7
});

test('prime-count π(2)=1', () => {
  assert.equal(primeCount(2), 1);
});

test('prime-count π(1)=0', () => {
  assert.equal(primeCount(1), 0);
});

test('prime-count π(0)=0', () => {
  assert.equal(primeCount(0), 0);
});

test('prime-count π(100)=25', () => {
  assert.equal(primeCount(100), 25);
});

test('prime-count π(30)=10', () => {
  assert.equal(primeCount(30), 10);
});
