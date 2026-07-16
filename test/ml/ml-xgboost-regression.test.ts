import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  xgboostRegression,
  predictXGB,
} from '../../src/algorithms/ml/ml-xgboost-regression/impl.ts';
test('XGBoost 拟合 y=2x', () => {
  const X = [[1], [2], [3], [4]],
    y = [2, 4, 6, 8];
  const m = xgboostRegression(X, y, 50, 0.5);
  const p = predictXGB(m, [2.5], 0.5);
  assert.ok(p > 3 && p < 7);
});
