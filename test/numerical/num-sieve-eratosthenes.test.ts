import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sievePrimes } from '../../src/algorithms/numerical/num-sieve-eratosthenes/impl.ts';
test('≤20 的素数', () => {
  assert.deepEqual(sievePrimes(20), [2, 3, 5, 7, 11, 13, 17, 19]);
});
test('<2 返回空', () => {
  assert.deepEqual(sievePrimes(1), []);
});
