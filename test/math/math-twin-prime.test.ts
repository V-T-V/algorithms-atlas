import { test } from 'node:test';
import assert from 'node:assert/strict';
import { twinPrimes } from '../../src/algorithms/math/math-twin-prime/impl.ts';

test('twin-prime n=20', () => {
  const { pairs } = twinPrimes(20);
  assert.deepEqual(pairs, [
    [3, 5],
    [5, 7],
    [11, 13],
    [17, 19],
  ]);
});

test('twin-prime n=10', () => {
  const { pairs } = twinPrimes(10);
  assert.deepEqual(pairs, [
    [3, 5],
    [5, 7],
  ]);
});

test('twin-prime n=5', () => {
  const { pairs } = twinPrimes(5);
  assert.deepEqual(pairs, [[3, 5]]);
});

test('twin-prime n=2 空', () => {
  const { pairs } = twinPrimes(2);
  assert.equal(pairs.length, 0);
});

test('twin-prime n=1 空', () => {
  const { pairs } = twinPrimes(1);
  assert.equal(pairs.length, 0);
});
