import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  gradientBoostRegression,
  predictGB,
} from '../../src/algorithms/ml/ml-gradient-boost-regression/impl.ts';
test('GB 拟合 y=2x', () => {
  const X = [[1], [2], [3], [4]],
    y = [2, 4, 6, 8];
  const m = gradientBoostRegression(X, y, 50, 0.5);
  const p = predictGB(m, [2.5], 0.5);
  assert.ok(p > 3 && p < 7);
});
