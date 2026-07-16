import { test } from 'node:test';
import assert from 'node:assert/strict';
import { primeFactorize, formatFactors } from '../../src/algorithms/math/prime-factorize/impl.ts';

test('primeFactorize 经典分解', () => {
  assert.deepEqual(primeFactorize(2), [{ prime: 2, exp: 1 }]);
  assert.deepEqual(primeFactorize(12), [
    { prime: 2, exp: 2 },
    { prime: 3, exp: 1 },
  ]);
  assert.deepEqual(primeFactorize(360), [
    { prime: 2, exp: 3 },
    { prime: 3, exp: 2 },
    { prime: 5, exp: 1 },
  ]);
  assert.deepEqual(primeFactorize(17), [{ prime: 17, exp: 1 }]); // 素数
});

test('primeFactorize 素数幂', () => {
  assert.deepEqual(primeFactorize(1024), [{ prime: 2, exp: 10 }]);
  assert.deepEqual(primeFactorize(243), [{ prime: 3, exp: 5 }]);
});

test('primeFactorize 大于 √n 的最后一个质因子', () => {
  // 23 = 23（素数），97 素数
  assert.deepEqual(primeFactorize(23), [{ prime: 23, exp: 1 }]);
  // 2·47 = 94
  assert.deepEqual(primeFactorize(94), [
    { prime: 2, exp: 1 },
    { prime: 47, exp: 1 },
  ]);
});

test('primeFactorize 乘积可还原', () => {
  for (const n of [60, 360, 2024, 99991, 123456]) {
    const factors = primeFactorize(n);
    const product = factors.reduce((acc, f) => acc * f.prime ** f.exp, 1);
    assert.equal(product, n, `factors of ${n} should multiply back`);
  }
});

test('primeFactorize 非法输入抛错', () => {
  assert.throws(() => primeFactorize(0), RangeError);
  assert.throws(() => primeFactorize(1), RangeError);
  assert.throws(() => primeFactorize(-5), RangeError);
});

test('formatFactors 格式化', () => {
  assert.equal(
    formatFactors([
      { prime: 2, exp: 3 },
      { prime: 3, exp: 2 },
      { prime: 5, exp: 1 },
    ]),
    '2^3 · 3^2 · 5',
  );
  assert.equal(formatFactors([{ prime: 17, exp: 1 }]), '17');
});

test('primeFactorize 钩子被调用', () => {
  let tries = 0;
  let complete = 0;
  let done = 0;
  const factors = primeFactorize(360, {
    onTry: () => tries++,
    onFactorComplete: () => complete++,
    onDone: () => done++,
  });
  assert.equal(factors.length, 3); // 2,3,5
  assert.ok(tries >= 3, '应至少试除 2,3,5');
  assert.equal(complete, 3, '3 个完整因子项');
  assert.equal(done, 1);
});
