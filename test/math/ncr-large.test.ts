import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nCrLarge } from '../../src/algorithms/math/ncr-large/impl.ts';

test('nCrLarge 小值与朴素一致', () => {
  assert.equal(nCrLarge(0, 0), 1n);
  assert.equal(nCrLarge(5, 2), 10n);
  assert.equal(nCrLarge(10, 3), 120n);
  assert.equal(nCrLarge(20, 10), 184756n);
});

test('nCrLarge 对称性', () => {
  for (const [n, r] of [
    [20, 5],
    [30, 12],
    [40, 17],
  ] as const) {
    assert.equal(nCrLarge(n, r), nCrLarge(n, n - r));
  }
});

test('nCrLarge 越界', () => {
  assert.equal(nCrLarge(5, -1), 0n);
  assert.equal(nCrLarge(5, 6), 0n);
});

test('nCrLarge 大数（超过 Number 安全范围）', () => {
  // C(100, 50) = 100891344545564193334812497256
  assert.equal(nCrLarge(100, 50), 100891344545564193334812497256n);
});

test('nCrLarge 递推关系 C(n,r)=C(n-1,r-1)+C(n-1,r)', () => {
  const n = 30;
  for (const r of [5, 10, 15]) {
    assert.equal(nCrLarge(n, r), nCrLarge(n - 1, r - 1) + nCrLarge(n - 1, r));
  }
});

test('nCrLarge 钩子', () => {
  let factorCount = 0;
  nCrLarge(20, 10, { onFactor: () => factorCount++ });
  assert.ok(factorCount >= 1);
});
