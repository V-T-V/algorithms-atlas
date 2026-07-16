import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pollardRho, factorize, bigGcd } from '../../src/algorithms/math/pollard-rho/impl.ts';

test('pollardRho 返回的因子非平凡且整除 n', () => {
  for (const n of [8051, 10403, 323, 561, 9999, 12, 49, 1001]) {
    const d = pollardRho(n);
    assert.ok(d > 1n && d < BigInt(n), `${n}: 因子应在 (1, n) 内，得到 ${d}`);
    assert.equal(BigInt(n) % d, 0n, `${n}: ${d} 应整除 ${n}`);
  }
});

test('pollardRho 偶数直接返回 2', () => {
  assert.equal(pollardRho(100), 2n);
  assert.equal(pollardRho(8), 2n);
});

test('pollardRho 素数返回自身', () => {
  assert.equal(pollardRho(97), 97n);
  assert.equal(pollardRho(13), 13n);
});

test('factorize 完全分解且乘积校验', () => {
  for (const n of [2, 12, 8051, 10403, 1001, 9999, 13195]) {
    const factors = factorize(n);
    const prod = factors.reduce((acc, f) => acc * f, 1n);
    assert.equal(prod, BigInt(n), `${n}: 因子乘积应等于 n`);
    assert.ok(factors.length > 0, `${n}: 至少一个因子`);
    // 因子应非降序
    for (let i = 1; i < factors.length; i++) {
      assert.ok(factors[i - 1]! <= factors[i]!, `${n}: 因子应升序`);
    }
  }
});

test('factorize 已知分解正确', () => {
  assert.deepEqual(factorize(12).map(String), ['2', '2', '3']); // 12 = 2²·3
  assert.deepEqual(factorize(8051).map(String), ['83', '97']); // 8051 = 83·97
  assert.deepEqual(factorize(13195).map(String), ['5', '7', '13', '29']); // 经典 Project Euler
  assert.deepEqual(factorize(2).map(String), ['2']);
  assert.deepEqual(factorize(1).map(String), []); // 1 无素因子
});

test('factorize 与试除法一致', () => {
  const trialFactorize = (n: number): bigint[] => {
    const res: bigint[] = [];
    let m = n;
    for (let p = 2; p * p <= m; p++) {
      while (m % p === 0) {
        res.push(BigInt(p));
        m /= p;
      }
    }
    if (m > 1) res.push(BigInt(m));
    return res;
  };
  for (let n = 2; n <= 1000; n++) {
    assert.deepEqual(factorize(n), trialFactorize(n), `mismatch at ${n}`);
  }
});

test('bigGcd 与 Number 版一致', () => {
  assert.equal(bigGcd(252n, 105n), 21n);
  assert.equal(bigGcd(1071n, 462n), 21n);
  assert.equal(bigGcd(17n, 5n), 1n);
});

test('pollardRho 钩子被调用', () => {
  let steps = 0;
  let factors = 0;
  let done = 0;
  factorize(8051, {
    onStep: () => steps++,
    onFactor: () => factors++,
    onDone: () => done++,
  });
  assert.ok(steps >= 1, '至少推进一步');
  assert.ok(factors >= 2, '8051 至少两个因子');
  assert.equal(done, 1, 'onDone 恰好一次');
});

test('pollardRho 大数分解', () => {
  // 两个大素数之积
  const p = 1000003n;
  const q = 1000033n;
  const n = p * q;
  const factors = factorize(n);
  assert.deepEqual(factors, [p, q]);
});
