import { test } from 'node:test';
import assert from 'node:assert/strict';
import { polynomialEval } from '../../src/algorithms/math/math-polynomial-eval-2/impl.ts';

test('1+2x+3x² at x=2 = 17', () => {
  assert.equal(polynomialEval([1, 2, 3], 2), 17);
});

test('常数 5 = 5', () => {
  assert.equal(polynomialEval([5], 100), 5);
});

test('at x=0 = 常数项', () => {
  assert.equal(polynomialEval([3, 4, 5], 0), 3);
});

test('at x=1 = 系数和', () => {
  assert.equal(polynomialEval([1, 2, 3, 4], 1), 10);
});

test('负系数', () => {
  assert.equal(polynomialEval([-1, 0, 1], 3), 8); // -1 + 9 = 8
});
