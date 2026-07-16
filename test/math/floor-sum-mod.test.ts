import { test } from 'node:test';
import assert from 'node:assert/strict';
import { floorSum } from '../../src/algorithms/math/floor-sum-mod/impl.ts';

test('floorSum 朴素对照', () => {
  const naive = (n: bigint, m: bigint, a: bigint, b: bigint): bigint => {
    let s = 0n;
    for (let i = 0n; i < n; i++) s += (a * i + b) / m;
    return s;
  };
  for (const [n, m, a, b] of [
    [10n, 4n, 3n, 2n],
    [20n, 7n, 5n, 1n],
    [100n, 13n, 9n, 6n],
    [1n, 5n, 2n, 3n],
  ] as const) {
    assert.equal(floorSum(n, m, a, b), naive(n, m, a, b), `(${n},${m},${a},${b})`);
  }
});

test('floorSum 大数', () => {
  // 朴素对大数不可行，验证已知模式：n=1000000000, m=1, a=1, b=0 → n(n-1)/2
  const n = 1000000000n;
  assert.equal(floorSum(n, 1n, 1n, 0n), (n * (n - 1n)) / 2n);
});

test('floorSum 边界', () => {
  assert.equal(floorSum(0, 5, 3, 2), 0n);
  assert.equal(floorSum(1, 5, 3, 2), 0n); // ⌊2/5⌋=0
  assert.equal(floorSum(1, 5, 3, 7), 1n); // ⌊7/5⌋=1
});

test('floorSum 错误输入', () => {
  assert.throws(() => floorSum(-1, 5, 3, 2), RangeError);
  assert.throws(() => floorSum(5, 0, 3, 2), RangeError);
});
