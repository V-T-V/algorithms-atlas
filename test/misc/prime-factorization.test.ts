import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  primeFactorization,
  productOf,
} from '../../src/algorithms/misc/prime-factorization/impl.ts';

test('primeFactorization 基本样例', () => {
  assert.deepEqual(primeFactorization(12), [
    { prime: 2, exponent: 2 },
    { prime: 3, exponent: 1 },
  ]);
  assert.deepEqual(primeFactorization(360), [
    { prime: 2, exponent: 3 },
    { prime: 3, exponent: 2 },
    { prime: 5, exponent: 1 },
  ]);
});

test('primeFactorization 质数输入', () => {
  assert.deepEqual(primeFactorization(2), [{ prime: 2, exponent: 1 }]);
  assert.deepEqual(primeFactorization(13), [{ prime: 13, exponent: 1 }]);
  assert.deepEqual(primeFactorization(97), [{ prime: 97, exponent: 1 }]);
});

test('primeFactorization 幂次', () => {
  assert.deepEqual(primeFactorization(1024), [{ prime: 2, exponent: 10 }]);
  assert.deepEqual(primeFactorization(81), [{ prime: 3, exponent: 4 }]);
});

test('primeFactorization productOf 还原', () => {
  for (const n of [2, 6, 12, 97, 360, 1024, 99991, 123456]) {
    const factors = primeFactorization(n);
    assert.equal(productOf(factors), n, `n=${n}`);
  }
});

test('primeFactorization 因子递增', () => {
  const factors = primeFactorization(2 * 2 * 3 * 5 * 7 * 7);
  for (let i = 1; i < factors.length; i++) {
    assert.ok(factors[i - 1]!.prime < factors[i]!.prime);
  }
});

test('primeFactorization 非法输入抛错', () => {
  assert.throws(() => primeFactorization(1));
  assert.throws(() => primeFactorization(0));
  assert.throws(() => primeFactorization(-5));
  assert.throws(() => primeFactorization(2.5));
});
