import { test } from 'node:test';
import assert from 'node:assert/strict';
import { phiSieve, primesUpTo } from '../../src/algorithms/math/phi-sieve/impl.ts';

test('phi-sieve 边界', () => {
  assert.deepEqual(phiSieve(0), [0]);
  assert.deepEqual(phiSieve(1), [0, 1]); // phi(0)=0, phi(1)=1
});

test('phi-sieve 已知值', () => {
  // OEIS A000010: 0,1,1,2,2,4,2,6,4,6,4,10,...
  const phi = phiSieve(12);
  assert.deepEqual(phi, [0, 1, 1, 2, 2, 4, 2, 6, 4, 6, 4, 10, 4]);
});

test('phi-sieve 满足 φ(p)=p-1（素数判定）', () => {
  const phi = phiSieve(50);
  for (const p of [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]) {
    assert.equal(phi[p], p - 1, `φ(${p}) 应为 ${p - 1}`);
  }
});

test('phi-sieve 满足 Σ_{d|n} φ(d) = n', () => {
  const phi = phiSieve(60);
  for (const n of [1, 6, 12, 28, 30, 60]) {
    let sum = 0;
    for (let d = 1; d <= n; d++) if (n % d === 0) sum += phi[d]!;
    assert.equal(sum, n, `Σ φ(d) over divisors of ${n}`);
  }
});

test('phi-sieve 与素数表一致', () => {
  const primes = primesUpTo(30);
  assert.deepEqual(primes, [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]);
});

test('phi-sieve 拒绝非整数 / 负数', () => {
  assert.throws(() => phiSieve(-1), RangeError);
  assert.throws(() => phiSieve(2.5), RangeError);
});

test('phi-sieve 钩子被调用', () => {
  let primes = 0;
  let marks = 0;
  let done = 0;
  phiSieve(20, {
    onPrime: () => primes++,
    onMark: () => marks++,
    onDone: () => done++,
  });
  assert.equal(primes, 8, '2..20 有 8 个素数');
  assert.ok(marks > 0, '应至少一次松弛');
  assert.equal(done, 1, 'onDone 恰好一次');
});
