import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isPrimeMillerRabin } from '../../src/algorithms/math/miller-rabin-deterministic/impl.ts';

test('isPrimeMillerRabin 小数', () => {
  assert.equal(isPrimeMillerRabin(0), false);
  assert.equal(isPrimeMillerRabin(1), false);
  assert.equal(isPrimeMillerRabin(2), true);
  assert.equal(isPrimeMillerRabin(3), true);
  assert.equal(isPrimeMillerRabin(4), false);
  assert.equal(isPrimeMillerRabin(17), true);
  assert.equal(isPrimeMillerRabin(18), false);
});

test('isPrimeMillerRabin 100 以内对照', () => {
  const sieve = new Set<number>();
  const composite = new Array(101).fill(false);
  for (let i = 2; i <= 100; i++) {
    if (!composite[i]) {
      sieve.add(i);
      for (let j = i * i; j <= 100; j += i) composite[j] = true;
    }
  }
  for (let i = 0; i <= 100; i++) {
    assert.equal(isPrimeMillerRabin(i), sieve.has(i), `${i}`);
  }
});

test('isPrimeMillerRabin 大素数', () => {
  assert.equal(isPrimeMillerRabin(998244353n), true);
  assert.equal(isPrimeMillerRabin(1000000007n), true);
  assert.equal(isPrimeMillerRabin(1000000008n), false);
  // 卡迈克尔数 561 = 3·11·17
  assert.equal(isPrimeMillerRabin(561n), false);
  // 强伪素数不应逃脱
  assert.equal(isPrimeMillerRabin(25326001n), false);
});

test('isPrimeMillerRabin 钩子', () => {
  let decomposed = false;
  let witnessCount = 0;
  isPrimeMillerRabin(998244353n, {
    onDecompose: () => (decomposed = true),
    onWitness: () => witnessCount++,
  });
  assert.ok(decomposed);
  assert.ok(witnessCount >= 1);
});
