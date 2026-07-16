import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mobiusSieve, mobiusInvert } from '../../src/algorithms/math/mobius-inversion/impl.ts';
import { phiSieve } from '../../src/algorithms/math/phi-sieve/impl.ts';

test('mobius-sieve 已知值', () => {
  // OEIS A008683: 1,-1,-1,0,-1,1,-1,0,0,1,-1,0,-1,1,1,0,-1,0,-1,0,1,1,...
  const mu = mobiusSieve(21);
  assert.deepEqual(
    mu.slice(1),
    [1, -1, -1, 0, -1, 1, -1, 0, 0, 1, -1, 0, -1, 1, 1, 0, -1, 0, -1, 0, 1],
  );
});

test('mobius-sieve 平方因子为零', () => {
  const mu = mobiusSieve(100);
  for (const n of [4, 8, 9, 12, 16, 18, 25, 27, 36, 49, 72, 100]) {
    assert.equal(mu[n], 0, `μ(${n}) 应为 0（含平方因子）`);
  }
});

test('mobius-sieve 无平方因子为 ±1', () => {
  const mu = mobiusSieve(50);
  for (const n of [1, 2, 3, 5, 6, 7, 10, 30, 42]) {
    assert.ok(Math.abs(mu[n]!) === 1, `|μ(${n})| 应为 1`);
  }
});

test('mobius-sieve Σ_{d|n} μ(d) = (n==1 ? 1 : 0)', () => {
  const mu = mobiusSieve(60);
  for (const n of [1, 6, 12, 30, 60]) {
    let sum = 0;
    for (let d = 1; d <= n; d++) if (n % d === 0) sum += mu[d]!;
    assert.equal(sum, n === 1 ? 1 : 0, `Σ μ(d) for n=${n}`);
  }
});

test('mobius 反演：g(n)=n → f(n)=φ(n)', () => {
  const mu = mobiusSieve(100);
  const g = Array.from({ length: 101 }, (_, i) => i);
  const phi = phiSieve(100);
  for (const n of [1, 2, 6, 12, 30, 60, 97, 100]) {
    const f = mobiusInvert(g, n, mu);
    assert.equal(f, phi[n], `反演 φ(${n})`);
  }
});

test('mobius 反演：g(n)=d(n) 约数个数 → f(n)=1', () => {
  // d(n) = Σ_{m|n} 1, 所以 f(n)=1 对所有 n
  const mu = mobiusSieve(100);
  for (const n of [1, 6, 12, 28, 60]) {
    let dn = 0;
    for (let m = 1; m <= n; m++) if (n % m === 0) dn++;
    assert.equal(
      mobiusInvert(
        Array.from({ length: n + 1 }, (_, i) => i),
        1,
        mu,
      ),
      1,
    );
    void dn;
  }
});

test('mobius-sieve 拒绝非整数 / 负数', () => {
  assert.throws(() => mobiusSieve(-1), RangeError);
  assert.throws(() => mobiusSieve(2.5), RangeError);
});

test('mobius-sieve 钩子被调用', () => {
  let primes = 0;
  let marks = 0;
  let done = 0;
  mobiusSieve(20, {
    onPrime: () => primes++,
    onMark: () => marks++,
    onDone: () => done++,
  });
  assert.equal(primes, 8);
  assert.ok(marks > 0);
  assert.equal(done, 1);
});
