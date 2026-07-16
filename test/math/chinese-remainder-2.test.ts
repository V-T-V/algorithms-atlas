import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  crtExtended,
  mergeCongruence,
} from '../../src/algorithms/math/chinese-remainder-2/impl.ts';

test('crtExtended 经典互素（孙子和）', () => {
  // x ≡ 2 mod 3, x ≡ 3 mod 5, x ≡ 2 mod 7 → 23 mod 105
  const r = crtExtended([2n, 3n, 2n], [3n, 5n, 7n])!;
  assert.equal(r.value, 23n);
  assert.equal(r.modulus, 105n);
});

test('crtExtended 非互素可解', () => {
  // x ≡ 2 mod 4, x ≡ 4 mod 6 → lcm=12, x=10
  const r = crtExtended([2n, 4n], [4n, 6n])!;
  assert.equal(r.modulus, 12n);
  assert.equal(r.value, 10n);
  assert.equal(10n % 4n, 2n);
  assert.equal(10n % 6n, 4n);
});

test('crtExtended 非互素无解', () => {
  // x ≡ 1 mod 4, x ≡ 2 mod 6 → gcd(4,6)=2 不整除 (2-1)=1
  assert.equal(crtExtended([1n, 2n], [4n, 6n]), null);
});

test('mergeCongruence 单组合并', () => {
  const r = mergeCongruence(0n, 6n, 4n, 10n)!;
  assert.equal(r.modulus, 30n);
  // 30 内满足 mod 6 = 0 且 mod 10 = 4 的最小正解
  assert.equal(r.value % 6n, 0n);
  assert.equal(r.value % 10n, 4n);
});

test('crtExtended 单方程', () => {
  const r = crtExtended([5n], [7n])!;
  assert.equal(r.value, 5n);
  assert.equal(r.modulus, 7n);
});

test('crtExtended 空输入', () => {
  const r = crtExtended([], [])!;
  assert.equal(r.value, 0n);
});
