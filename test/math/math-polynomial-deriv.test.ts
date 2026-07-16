import { test } from 'node:test';
import assert from 'node:assert/strict';
import { polynomialDerivative } from '../../src/algorithms/math/math-polynomial-deriv/impl.ts';

test('d/dx (5+3x+2x²+x³) = 3+4x+3x²', () => {
  assert.deepEqual(polynomialDerivative([5, 3, 2, 1]), [3, 4, 3]);
});

test('d/dx 常数 = 空', () => {
  assert.deepEqual(polynomialDerivative([7]), []);
});

test('d/dx x = 1', () => {
  assert.deepEqual(polynomialDerivative([0, 1]), [1]);
});

test('d/dx x² = 2x', () => {
  assert.deepEqual(polynomialDerivative([0, 0, 1]), [0, 2]);
});
