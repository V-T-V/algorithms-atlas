import { test } from 'node:test';
import assert from 'node:assert/strict';
import { solveCongruenceSystem } from '../../src/algorithms/math/math-modular-system/impl.ts';

test('经典 CRT: x≡2(3), x≡3(5), x≡2(7) → 23 mod 105', () => {
  const r = solveCongruenceSystem([
    { remainder: 2, modulus: 3 },
    { remainder: 3, modulus: 5 },
    { remainder: 2, modulus: 7 },
  ]);
  assert.equal(r.remainder, 23);
  assert.equal(r.modulus, 105);
});

test('非互素合并: x≡2(4), x≡4(6) → x≡? (mod 12)', () => {
  // x≡2 (mod 4) → x∈{2,6,10}; x≡4 (mod 6) → {4,10}; 共同解 10 mod 12
  const r = solveCongruenceSystem([
    { remainder: 2, modulus: 4 },
    { remainder: 4, modulus: 6 },
  ]);
  assert.equal(r.remainder, 10);
  assert.equal(r.modulus, 12);
});

test('冲突无解: x≡1(2), x≡0(2)', () => {
  const r = solveCongruenceSystem([
    { remainder: 1, modulus: 2 },
    { remainder: 0, modulus: 2 },
  ]);
  assert.equal(r.remainder, null);
});

test('单方程', () => {
  const r = solveCongruenceSystem([{ remainder: 5, modulus: 7 }]);
  assert.equal(r.remainder, 5);
  assert.equal(r.modulus, 7);
});

test('空组返回 0 mod 1', () => {
  const r = solveCongruenceSystem([]);
  assert.equal(r.remainder, 0);
  assert.equal(r.modulus, 1);
});
