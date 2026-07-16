import { test } from 'node:test';
import assert from 'node:assert/strict';
import { polynomialMultiply } from '../../src/algorithms/math/math-polynomial-mult/impl.ts';

test('(1+2x+3x²)(2+x) = 2+5x+8x²+3x³', () => {
  const c = polynomialMultiply([1, 2, 3], [2, 1]);
  assert.deepEqual(c, [2, 5, 8, 3]);
});

test('(x+1)(x-1) = x²-1', () => {
  const c = polynomialMultiply([1, 1], [-1, 1]);
  assert.deepEqual(c, [-1, 0, 1]);
});

test('(2)(3) = 6 常数相乘', () => {
  const c = polynomialMultiply([2], [3]);
  assert.deepEqual(c, [6]);
});

test('(x)(x²) = x³', () => {
  const c = polynomialMultiply([0, 1], [0, 0, 1]);
  assert.deepEqual(c, [0, 0, 0, 1]);
});
