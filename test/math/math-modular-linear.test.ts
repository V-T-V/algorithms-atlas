import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  solveLinearCongruence,
  extGcd,
  mod,
} from '../../src/algorithms/math/math-modular-linear/impl.ts';

test('14x ≡ 30 (mod 100) 有 2 解', () => {
  const sols = solveLinearCongruence(14, 30, 100);
  assert.equal(sols.length, 2);
  // 验证每个解满足
  for (const x of sols) {
    assert.equal(mod(14 * x - 30, 100), 0);
  }
});

test('2x ≡ 4 (mod 6) 有 2 解: 2, 5', () => {
  const sols = solveLinearCongruence(2, 4, 6);
  assert.deepEqual(sols, [2, 5]);
});

test('4x ≡ 6 (mod 10) 无解（g=2 但 6/2=3, 验证）', () => {
  // gcd(4,10)=2, 6%2=0 → 有解
  const sols = solveLinearCongruence(4, 6, 10);
  assert.ok(sols.length > 0);
  for (const x of sols) assert.equal(mod(4 * x - 6, 10), 0);
});

test('4x ≡ 3 (mod 8) 无解（g=4 不整除 3）', () => {
  const sols = solveLinearCongruence(4, 3, 8);
  assert.equal(sols.length, 0);
});

test('ext-gcd 一致性', () => {
  const r = extGcd(99, 78);
  assert.equal(r.g, 3);
  assert.equal(99 * r.x + 78 * r.y, 3);
});
