import { test } from 'node:test';
import assert from 'node:assert/strict';
import { linearSieve, factorize } from '../../src/algorithms/math/linear-sieve/impl.ts';

test('linear-sieve 边界', () => {
  assert.deepEqual(linearSieve(0).primes, []);
  assert.deepEqual(linearSieve(1).primes, []);
  assert.deepEqual(linearSieve(2).primes, [2]);
});

test('linear-sieve 素数列表正确', () => {
  const { primes } = linearSieve(30);
  assert.deepEqual(primes, [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]);
});

test('linear-sieve 素数个数符合 π(n)', () => {
  const { primes } = linearSieve(100);
  assert.equal(primes.length, 25, '100 以内共 25 个素数');
  assert.equal(primes[0], 2);
  assert.equal(primes[24], 97);
});

test('linear-sieve spf 正确', () => {
  const { spf } = linearSieve(30);
  assert.equal(spf[1], 0);
  assert.equal(spf[2], 2);
  assert.equal(spf[13], 13);
  assert.equal(spf[15], 3, '15 的最小素因子是 3');
  assert.equal(spf[25], 5);
  assert.equal(spf[22], 2);
});

test('linear-sieve isComposite 与素数一致', () => {
  const { isComposite, primes } = linearSieve(40);
  const set = new Set(primes);
  for (let i = 2; i <= 40; i++) {
    assert.equal(isComposite[i], !set.has(i), `isComposite[${i}]`);
  }
});

test('linear-sieve 因式分解', () => {
  const { spf } = linearSieve(1000);
  assert.deepEqual(factorize(spf, 60), [2, 2, 3, 5]);
  assert.deepEqual(factorize(spf, 97), [97]);
  assert.deepEqual(factorize(spf, 360), [2, 2, 2, 3, 3, 5]);
  assert.deepEqual(factorize(spf, 1), []);
});

test('linear-sieve 拒绝非整数 / 负数', () => {
  assert.throws(() => linearSieve(-5), RangeError);
  assert.throws(() => linearSieve(1.1), RangeError);
});

test('linear-sieve 钩子被调用', () => {
  let primeEvents = 0;
  let marks = 0;
  let breaks = 0;
  let done = 0;
  linearSieve(20, {
    onPrime: () => primeEvents++,
    onMark: () => marks++,
    onBreak: () => breaks++,
    onDone: () => done++,
  });
  assert.equal(primeEvents, 8, '8 个素数');
  assert.ok(marks >= 8, '合数标记次数 ≥ 素数个数');
  assert.ok(breaks > 0, '应触发至少一次 break');
  assert.equal(done, 1);
});
