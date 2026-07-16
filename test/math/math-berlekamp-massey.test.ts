import { test } from 'node:test';
import assert from 'node:assert/strict';
import { berlekampMassey } from '../../src/algorithms/math/math-berlekamp-massey/impl.ts';

test('斐波那契 → [1, 1]', () => {
  const c = berlekampMassey([1, 1, 2, 3, 5, 8, 13, 21, 34]);
  assert.deepEqual(c, [1n, 1n]);
});

test('a_n = 2 a_{n-1} + 3 a_{n-2} → [2, 3]', () => {
  // seeds: 1, 1; 1, 3, 9, 27 (验证)
  // a_n = 2a_{n-1}+3a_{n-2}: 1,1,5,13,41,121
  const seq = [1, 1, 5, 13, 41, 121, 365];
  const c = berlekampMassey(seq);
  assert.deepEqual(c, [2n, 3n]);
});

test('几何 a_n = 2^n → [2]', () => {
  const c = berlekampMassey([1, 2, 4, 8, 16, 32]);
  assert.deepEqual(c, [2n]);
});

test('常数序列 a_n = 5 → [1]', () => {
  // 5,5,5,5 → a_n = a_{n-1}
  const c = berlekampMassey([5, 5, 5, 5, 5]);
  assert.deepEqual(c, [1n]);
});
