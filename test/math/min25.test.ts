import { test } from 'node:test';
import assert from 'node:assert/strict';
import { min25 } from '../../src/algorithms/math/min25/impl.ts';
import { linearSieve } from '../../src/algorithms/math/linear-sieve/impl.ts';

/** 暴力 Σ_{p≤n} p（小数据交叉校验）。 */
function brutePrimeSum(n: number): bigint {
  const { primes } = linearSieve(n);
  let s = 0n;
  for (const p of primes) s += BigInt(p);
  return s;
}

test('min25 边界', () => {
  assert.equal(min25(1), 0n);
  assert.equal(min25(2), 2n);
  assert.equal(min25(3), 5n); // 2+3
});

test('min25 小数据与暴力一致', () => {
  for (const n of [4, 5, 10, 15, 20, 30, 50, 100, 200, 500, 1000]) {
    assert.equal(min25(n), brutePrimeSum(n), `Σ_{p≤${n}} p`);
  }
});

test('min25 中等数据正确', () => {
  // 100 以内素数和 = 1060
  assert.equal(min25(100), 1060n);
  // 1000 以内素数和 = 76127
  assert.equal(min25(1000), 76127n);
  // 10000 以内素数和 = 5736396
  assert.equal(min25(10000), 5736396n);
});

test('min25 大数据 (10^9) 与已知值一致', () => {
  // Σ_{p≤10^9} p = 24739512092254535（已知值）
  assert.equal(min25(1_000_000_000), 24739512092254535n);
});

test('min25 拒绝非整数 / 负数', () => {
  assert.throws(() => min25(0), RangeError);
  assert.throws(() => min25(-3), RangeError);
  assert.throws(() => min25(2.5), RangeError);
});

test('min25 钩子被调用', () => {
  let init = 0;
  let relax = 0;
  let done = 0;
  min25(100, {
    onInit: () => init++,
    onRelaxPrime: () => relax++,
    onDone: () => done++,
  });
  assert.equal(init, 1);
  // √100 = 10，≤10 的素数有 2,3,5,7 共 4 个
  assert.equal(relax, 4);
  assert.equal(done, 1);
});
