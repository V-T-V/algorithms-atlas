import { test } from 'node:test';
import assert from 'node:assert/strict';
import { eulerSieve } from '../../src/algorithms/math/math-euler-3/impl.ts';

test('euler-sieve 基本值', () => {
  const phi = eulerSieve(10);
  assert.equal(phi[1], 1);
  assert.equal(phi[2], 1);
  assert.equal(phi[6], 2); // 1,5
  assert.equal(phi[7], 6); // 素数
  assert.equal(phi[9], 6);
  assert.equal(phi[10], 4);
});

test('euler-sieve φ(12)=4', () => {
  const phi = eulerSieve(12);
  assert.equal(phi[12], 4);
});
