import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  lassoRegression,
  softThreshold,
  demoData,
} from '../../src/algorithms/ml/lasso-regression/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/ml/lasso-regression/trace.ts';

test('softThreshold 正确', () => {
  assert.equal(softThreshold(5, 1), 4);
  assert.equal(softThreshold(-5, 1), -4);
  assert.equal(softThreshold(0.5, 1), 0);
  assert.equal(softThreshold(0, 1), 0);
});

test('lasso 在相关特征数据上拟合', () => {
  const { X, y } = demoData(); // y = 3·x1 + 2，x2 无关
  const r = lassoRegression(X, y, { lambda: 0.01 });
  assert.ok(Math.abs(r.coefficients[0]! - 3) < 0.3, `w1≈3, got ${r.coefficients[0]}`);
  assert.ok(Math.abs(r.intercept - 2) < 0.5, `intercept≈2, got ${r.intercept}`);
});

test('lasso 大 λ 产生稀疏解（部分系数为 0）', () => {
  const { X, y } = demoData();
  const r = lassoRegression(X, y, { lambda: 50 });
  assert.ok(r.nnz < X[0]!.length, '大 λ 应使部分系数为 0');
});

test('lasso 小 λ 接近最小二乘', () => {
  const { X, y } = demoData();
  const r = lassoRegression(X, y, { lambda: 1e-4 });
  assert.ok(r.mse < 1e-3);
});

test('lasso 边界：空数据', () => {
  const r = lassoRegression([], [], { lambda: 1 });
  assert.deepEqual(r.coefficients, []);
});

test('lasso 钩子被调用', () => {
  let iters = 0;
  let coords = 0;
  const { X, y } = demoData();
  lassoRegression(
    X,
    y,
    { lambda: 1, maxIterations: 10 },
    {
      onIteration: () => iters++,
      onCoordinate: () => coords++,
    },
  );
  assert.ok(iters >= 1);
  assert.ok(coords >= X[0]!.length);
});

test('lasso 系数个数等于特征数', () => {
  const { X, y } = demoData();
  const r = lassoRegression(X, y, { lambda: 1 });
  assert.equal(r.coefficients.length, X[0]!.length);
});

test('buildTrace 生成多帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  const last = frames[frames.length - 1]!;
  assert.ok(last.bars, '末帧应含 bars');
  assert.ok(last.aux, '末帧应含 aux');
});
