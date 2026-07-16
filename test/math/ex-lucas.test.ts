import { test } from 'node:test';
import assert from 'node:assert/strict';
import { exLucas } from '../../src/algorithms/math/ex-lucas/impl.ts';

/** 暴力求 C(n,m) mod M（仅用于小数据交叉校验）。 */
function brute(n: bigint, m: bigint, mod: bigint): bigint {
  if (m < 0n || m > n) return 0n;
  let num = 1n;
  let den = 1n;
  for (let i = 0n; i < m; i++) {
    num *= n - i;
    den *= i + 1n;
  }
  // num/den 必为整数
  return (((num / den) % mod) + mod) % mod;
}

test('ex-lucas 素数模（与卢卡斯退化一致）', () => {
  // C(10,4)=210; 210 mod 7 = 0 (因 7|210)
  assert.equal(exLucas(10n, 4n, 7n), 0n);
  // 210 mod 11 = 1
  assert.equal(exLucas(10n, 4n, 11n), 1n);
});

test('ex-lucas 合数模 C(10,4) mod 12', () => {
  // 210 mod 12 = 6
  assert.equal(exLucas(10n, 4n, 12n), 6n);
});

test('ex-lucas 合数模 C(20,10) mod 999', () => {
  // 184756 mod 999
  assert.equal(exLucas(20n, 10n, 999n), 184756n % 999n);
});

test('ex-lucas 与暴力交叉校验', () => {
  const cases: Array<[bigint, bigint, bigint]> = [
    [15n, 5n, 100n],
    [20n, 10n, 360n],
    [12n, 6n, 144n],
    [25n, 12n, 1000n],
    [18n, 9n, 72n],
    [30n, 5n, 2310n],
  ];
  for (const [n, m, M] of cases) {
    assert.equal(exLucas(n, m, M), brute(n, m, M), `C(${n},${m}) mod ${M}`);
  }
});

test('ex-lucas 模数含多个不同素因子', () => {
  // M=2*3*5*7=210
  assert.equal(exLucas(10n, 3n, 210n), 120n % 210n); // C(10,3)=120
  assert.equal(exLucas(14n, 7n, 210n), 3432n % 210n); // C(14,7)=3432
});

test('ex-lucas m>n 或 m<0 返回 0', () => {
  assert.equal(exLucas(5n, 6n, 10n), 0n);
  assert.equal(exLucas(5n, -1n, 10n), 0n);
  assert.equal(exLucas(5n, 0n, 10n), 1n);
  assert.equal(exLucas(5n, 5n, 10n), 1n);
});

test('ex-lucas 拒绝非正模数', () => {
  assert.throws(() => exLucas(5n, 2n, 0n), RangeError);
});

test('ex-lucas 钩子被调用', () => {
  let factors = 0;
  let subs = 0;
  let crts = 0;
  let done = 0;
  exLucas(10n, 4n, 12n, {
    onFactor: () => factors++,
    onSubResult: () => subs++,
    onCrt: () => crts++,
    onDone: () => done++,
  });
  // 12 = 2^2 * 3 → 2 个因子
  assert.equal(factors, 2);
  assert.equal(subs, 2);
  assert.equal(crts, 2);
  assert.equal(done, 1);
});
