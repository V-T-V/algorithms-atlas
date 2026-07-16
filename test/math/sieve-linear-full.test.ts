import { test } from 'node:test';
import assert from 'node:assert/strict';
import { linearSieveFull } from '../../src/algorithms/math/sieve-linear-full/impl.ts';

test('linearSieveFull 素数正确', () => {
  const { primes } = linearSieveFull(30);
  assert.deepEqual(primes, [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]);
});

test('linearSieveFull φ 正确', () => {
  const { phi } = linearSieveFull(20);
  // φ 值对照表
  const expected = [0, 1, 1, 2, 2, 4, 2, 6, 4, 6, 4, 10, 4, 12, 6, 8, 8, 16, 6, 18, 8];
  for (let i = 0; i <= 20; i++) assert.equal(phi[i], expected[i], `phi[${i}]`);
});

test('linearSieveFull φ 与定义一致（100）', () => {
  const { phi } = linearSieveFull(100);
  const phiNaive = (k: number): number => {
    let result = k;
    for (let i = 2; i * i <= k; i++) {
      if (k % i === 0) {
        while (k % i === 0) k /= i;
        result -= result / i;
      }
    }
    if (k > 1) result -= result / k;
    return result;
  };
  for (let i = 1; i <= 100; i++) assert.equal(phi[i], phiNaive(i), `phi[${i}]`);
});

test('linearSieveFull 边界', () => {
  assert.deepEqual(linearSieveFull(1).primes, []);
  assert.deepEqual(linearSieveFull(2).primes, [2]);
});
