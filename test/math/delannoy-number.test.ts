import { test } from 'node:test';
import assert from 'node:assert/strict';
import { delannoyTable, delannoy } from '../../src/algorithms/math/delannoy-number/impl.ts';

test('delannoy 已知值', () => {
  // D(2,2)=13, D(3,3)=63
  assert.equal(delannoy(2, 2), 13n);
  assert.equal(delannoy(3, 3), 63n);
  assert.equal(delannoy(1, 1), 3n);
});

test('delannoy 边界', () => {
  assert.equal(delannoy(0, 5), 1n);
  assert.equal(delannoy(5, 0), 1n);
  assert.equal(delannoy(0, 0), 1n);
});

test('delannoy 与显式公式一致', () => {
  const binom = (n: number, k: number): bigint => {
    if (k < 0 || k > n) return 0n;
    let r = 1n;
    for (let i = 0; i < k; i++) r = (r * BigInt(n - i)) / BigInt(i + 1);
    return r;
  };
  const explicit = (m: number, n: number): bigint => {
    let s = 0n;
    for (let k = 0; k <= Math.min(m, n); k++) s += binom(m, k) * binom(n, k) * 2n ** BigInt(k);
    return s;
  };
  for (const [m, n] of [
    [3, 4],
    [5, 5],
    [6, 3],
  ] as const) {
    assert.equal(delannoy(m, n), explicit(m, n), `D(${m},${n})`);
  }
});

test('delannoy 中心序列', () => {
  const t = delannoyTable(6, 6);
  // 中心 Delannoy: 1,3,13,63,321,1683,8989
  const central = [1n, 3n, 13n, 63n, 321n, 1683n, 8989n];
  for (let k = 0; k <= 6; k++) assert.equal(t[k]![k], central[k]);
});
