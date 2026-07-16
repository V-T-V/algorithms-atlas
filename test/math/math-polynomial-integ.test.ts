import { test } from 'node:test';
import assert from 'node:assert/strict';
import { polynomialIntegral } from '../../src/algorithms/math/math-polynomial-integ/impl.ts';

test('∫(3+4x+3x²)dx = 0+3x+2x²+x³', () => {
  assert.deepEqual(polynomialIntegral([3, 4, 3]), [0, 3, 2, 1]);
});

test('∫ 常数 5 dx = 0 + 5x', () => {
  assert.deepEqual(polynomialIntegral([5]), [0, 5]);
});

test('∫ x dx = 0 + 0.5x²', () => {
  assert.deepEqual(polynomialIntegral([0, 1]), [0, 0, 0.5]);
});

test('∫ 空数组 = [0]', () => {
  assert.deepEqual(polynomialIntegral([]), [0]);
});
