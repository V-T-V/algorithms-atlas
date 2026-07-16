import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ridgeRegression } from '../../src/algorithms/ml/ml-ridge-regression-closed/impl.ts';
test('岭回归 线性数据', () => {
  const r = ridgeRegression([[1], [2], [3], [4]], [2, 4, 6, 8], 0.001);
  assert.ok(Math.abs(r.w[0]! - 2) < 0.1);
});
