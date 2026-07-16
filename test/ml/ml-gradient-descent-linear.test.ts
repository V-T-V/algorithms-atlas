import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gradientDescentLinear } from '../../src/algorithms/ml/ml-gradient-descent-linear/impl.ts';
test('GD 拟合 y=2x', () => {
  const r = gradientDescentLinear([[1], [2], [3], [4]], [2, 4, 6, 8], 0.1, 500);
  assert.ok(Math.abs(r.w[0]! - 2) < 0.2);
});
test('GD loss 递减', () => {
  const r = gradientDescentLinear([[0], [1]], [0, 1], 0.1, 50);
  assert.ok(r.history[r.history.length - 1]! <= r.history[0]!);
});
