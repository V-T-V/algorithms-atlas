import { test } from 'node:test';
import assert from 'node:assert/strict';
import { discreteLog } from '../../src/algorithms/math/discrete-log-baby/impl.ts';

function powMod(base: bigint, exp: bigint, m: bigint): bigint {
  let b = base % m;
  let e = exp;
  let r = 1n;
  while (e > 0n) {
    if (e & 1n) r = (r * b) % m;
    b = (b * b) % m;
    e >>= 1n;
  }
  return r;
}

test('discreteLog 基本例', () => {
  // 3^x ≡ 13 mod 17：3^4=81=4*17+13 → x=4
  assert.equal(discreteLog(3n, 13n, 17n), 4n);
});

test('discreteLog 验证结果', () => {
  for (const [a, x, m] of [
    [5n, 7n, 101n],
    [2n, 11n, 97n],
  ] as const) {
    const b = powMod(a, x, m);
    const got = discreteLog(a, b, m)!;
    assert.equal(powMod(a, got, m), b);
    assert.ok(got <= x); // 最小解
  }
});

test('discreteLog b=1 返回 0', () => {
  assert.equal(discreteLog(3n, 1n, 17n), 0n);
});

test('discreteLog 无解', () => {
  // 2 是模 7 的二次非剩余 → 2^x 永远不会等于某个非剩余？需具体：2^x mod 7 周期 3 取 {1,2,4}
  // 取 b=3：无解
  assert.equal(discreteLog(2n, 3n, 7n), null);
});

test('discreteLog 大模数', () => {
  // 5^x ≡ ? mod 1000000007
  const x = discreteLog(5n, powMod(5n, 12345n, 1000000007n), 1000000007n)!;
  assert.equal(powMod(5n, x, 1000000007n), powMod(5n, 12345n, 1000000007n));
});
