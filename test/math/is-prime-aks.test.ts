import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isPrimeAks } from '../../src/algorithms/math/is-prime-aks/impl.ts';

test('aks 小素数', () => {
  for (const p of [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31]) {
    assert.equal(isPrimeAks(p), true, `${p} 应为素数`);
  }
});

test('aks 合数', () => {
  for (const c of [4, 6, 8, 9, 10, 15, 21, 25, 49, 121]) {
    assert.equal(isPrimeAks(c), false, `${c} 应为合数`);
  }
});

test('aks 边界', () => {
  assert.equal(isPrimeAks(0), false);
  assert.equal(isPrimeAks(1), false);
  assert.equal(isPrimeAks(2), true);
});

test('aks 完全幂判合数', () => {
  // 27 = 3^3, 16 = 2^4, 25 = 5^2
  assert.equal(isPrimeAks(27), false);
  assert.equal(isPrimeAks(16), false);
  assert.equal(isPrimeAks(25), false);
});

test('aks 与试除一致', async () => {
  const { isPrime } = await import('../../src/algorithms/math/is-prime/impl.ts');
  for (let n = 2; n <= 50; n++) {
    assert.equal(isPrimeAks(n), isPrime(n), `n=${n}`);
  }
});

test('aks 钩子', () => {
  let coeffs = 0;
  isPrimeAks(7, { onCoefficient: () => coeffs++ });
  assert.ok(coeffs > 0);
});
